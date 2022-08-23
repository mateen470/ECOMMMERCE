const jwt = require("jsonwebtoken");

const authenticationTokenChecking = async (req, res, next) => {
  try {
    const accessToken = await req.header("Authorization");

    if (!accessToken) {
      res.status(400).json({ success: false, message: "INVALID USER!!" });
    }

    const verifyAccessToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      (error, user) => {
        if (error) {
          res.status(400).json({ success: false, message: "INVALID USER!!" });
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = authenticationTokenChecking;
