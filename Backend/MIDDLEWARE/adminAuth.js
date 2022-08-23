const User = require("../MODEL/schema");

const checkAdmin = async (req, res, next) => {
  try {
    const isAdmin = await User.findOne({ _id: req.user.id }).select(
      "-password"
    );

    if (isAdmin.role !== 1) {
      return await res
        .status(400)
        .json({ success: false, message: "ADMIN RESOURCES ACCESS FAILED!!" });
    }
    await next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = checkAdmin;
