const User = require("../MODEL/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendActivationEmail = require("../EMAIL/send_email");

const ControllerFunctions = {
  SignUp: async (req, res, next) => {
    try {
      const { name, email, password } = await req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: "PLEASE FILL THE FORM COMPLETELY!!",
        });
      }

      if (!validateEmail(email)) {
        res.status(400).json({ success: false, message: "INVALID EMAIL!!" });
      }

      const alreadyExist = await User.findOne({ email });

      if (alreadyExist) {
        await res
          .status(400)
          .json({ success: false, message: "USER ALREADY EXISTS!!" });
      } else if (password.length <= 8) {
        await res.status(400).json({
          success: false,
          message: "PASSWORD SHOULD NOT BE LESS THAN 8 CHARACTERS!!",
        });
      } else {
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        userData = {
          name,
          email,
          password: hashedPassword,
        };

        const activationToken = createActivationToken(userData);

        const linkToActivate = `${process.env.CLIENT_URL}shoe-cosmos/activation/${activationToken}`;

        const message = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ✮SHOE COSMOS✮</h2>
        <p>Congratulations! You're almost set to start using ✮SHOE COSMOS✮
            Just click the button below to validate your email address.
        </p>
        
        <a href=${linkToActivate} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">VERIFY EMAIL!</a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${linkToActivate}</div>
        </div>
    `;

        sendActivationEmail({
          to: userData.email,
          subject: "EMAIL VERIFICATION",
          text: message,
        });
        await res.status(201).json({
          success: true,
          message: "SIGNUP PROCESS SUCCESSFUL!!!",
        });
      }
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  Activation: async (req, res, next) => {
    try {
      const { activationToken } = await req.body;
      const verifiedUser = jwt.verify(
        activationToken,
        process.env.ACTIVATION_TOKEN_SECRET_KEY
      );

      const { name, email, password } = verifiedUser;
      newUser = await new User({
        name,
        email,
        password,
      });
      await newUser.save();
      await res
        .status(200)
        .json({ success: true, message: "VERIFICATION DONE!!" });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  LogIn: async (req, res, next) => {
    try {
      const { email, password } = await req.body;

      if (!email || !password) {
        await res.status(400).json({
          success: false,
          message: "PLEASE FILL THE FORM COMPLETELY!!",
        });
      }

      const userExist = await User.findOne({ email });
      if (!userExist) {
        await res
          .status(400)
          .json({ success: false, message: "INVALID EMAIL!" });
      }
      comparePassword = await bcrypt.compare(password, userExist.password);
      if (!comparePassword) {
        await res
          .status(400)
          .json({ success: false, message: "INCORRECT PASSWORD!!" });
      }
      const refreshToken = createRefreshToken({ id: userExist._id });

      await res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/shoe-cosmos/refreshToken",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await res
        .status(200)
        .json({ success: true, message: "LOGIN PROCESS SUCCESSFUL!!" });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  GetAccessToken: async (req, res, next) => {
    try {
      const refresh_token = await req.cookies.refreshtoken;

      if (!refresh_token) {
        await res
          .status(400)
          .json({ success: false, message: "LOGIN TO GET THE TOKEN!!" });
      }
      const verifyRefreshToken = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        async (error, user) => {
          if (error) {
            await res
              .status(400)
              .json({ success: false, message: "LOGIN TO GET THE TOKEN!!" });
          }

          const accessToken = createAccessToken({ id: user._id });
          await res.status(200).json({
            success: true,
            message: "ACCESS GRANTED!!",
            data: accessToken,
          });
        }
      );
    } catch (error) {
      console.log(error);
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  ForgotPassword: async (req, res, next) => {
    try {
      const { email } = await req.body;

      if (!validateEmail(email)) {
        await res
          .status(400)
          .json({ success: false, message: "INVALID EMAIL!!" });
      }
      const checkEmail = await User.findOne({ email });
      if (!checkEmail) {
        await res
          .status(400)
          .json({ success: false, message: "EMAIL DOES NOT EXISTS!!" });
      }

      const accessTokenForgotPassword = createAccessToken({
        id: checkEmail._id,
      });
      const url = `${process.env.CLIENT_URL}shoe-cosmos/resetPassword/${accessTokenForgotPassword}`;
      const message = ` <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ✮SHOE COSMOS✮</h2>
      <p>
          Just click the button below to reset your password.
      </p>
      
      <a href=${url} style="background: blue; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">RESET PASSWORD!</a>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  
      <div>${url}</div>
      </div>`;

      sendActivationEmail({
        to: checkEmail.email,
        subject: "PASSWORD RESET REQUEST",
        text: message,
      });

      await res.status(200).json({
        success: true,
        message: "RESET PASSWORD LINK SENT TO THE PROVIDED EMAIL!!",
      });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  ResetPassword: async (req, res, next) => {
    try {
      const { password } = await req.body;

      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: "PASSWORD SHOULD BE MORE THAN 8 CHARACTERS!!",
        });
      }
      const salt = await bcrypt.genSalt(15);

      const newHashedPassword = await bcrypt.hash(password, salt);

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: newHashedPassword,
        }
      );
      await res.status(200).json({
        success: true,
        message: "PASSWORD HAS BEEN SUCCESSFULLY UPDATED!!",
      });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  GetSingleUser: async (req, res, next) => {
    try {
      const singleUser = await User.findById(req.user.id).select("-password");
      if (!singleUser) {
        await res
          .status(400)
          .json({ success: false, message: "CANNOT FIND USER!!" });
      }
      await res.status(200).json({
        success: true,
        message: "SUCCESS IN GETTING SINGLE USER DATA!!",
        user: singleUser,
      });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  GetAllUsers: async (req, res, next) => {
    try {
      const allUsers = await User.find().select("-password");

      if (!allUsers) {
        await res
          .status(400)
          .json({ success: false, message: "DATABASE IS EMPTY!!" });
      }

      await res.status(200).json({
        success: true,
        message: "SUCCESS IN FETCHING ALL THE USERS!!",
        user: allUsers,
      });
    } catch (error) {
      await res.status(500).json({ success: false, message: error.message });
    }
  },
  LogOut: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: "/shoe-cosmos/refreshToken" });

      res.status(200).json({ success: true, message: "LOGOUT SUCCESSFUL!!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  UpdateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        }
      );

      res
        .status(200)
        .json({ success: true, message: "SUCCESSFULLY UPDATED!!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  UpdateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;

      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res
        .status(200)
        .json({ success: true, message: "UPDATE SUCCESS IN ROLE!!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  RemoveUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);

      res
        .status(200)
        .json({ success: true, message: "DELETED SUCCESSFULLY!!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const createActivationToken = (newUser) => {
  return jwt.sign(newUser, process.env.ACTIVATION_TOKEN_SECRET_KEY, {
    expiresIn: "10m",
  });
};
const createAccessToken = (newUser) => {
  return jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (newUser) => {
  return jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "3d",
  });
};

module.exports = ControllerFunctions;
