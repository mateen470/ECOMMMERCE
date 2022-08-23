const express = require("express");
const router = express.Router();

const API_Function = require("../CONTROLLER/main_controller");
const authenticationTokenChecking = require("../MIDDLEWARE/authenticationTokenChecking.js");
const adminCheck = require("../MIDDLEWARE/adminAuth.js");

router.post("/signup", API_Function.SignUp);
router.post("/activation", API_Function.Activation);
router.post("/login", API_Function.LogIn);
router.post("/refreshToken", API_Function.GetAccessToken);
router.post("/forgotPassword", API_Function.ForgotPassword);
router.post(
  "/resetPassword",
  authenticationTokenChecking,
  API_Function.ResetPassword
);
router.get(
  "/singleUserInfo",
  authenticationTokenChecking,
  API_Function.GetSingleUser
);
router.get(
  "/allUserInfo",
  authenticationTokenChecking,
  adminCheck,
  API_Function.GetAllUsers
);
router.get("/LogOut", API_Function.LogOut);
router.patch("/update", authenticationTokenChecking, API_Function.UpdateUser);

router.patch(
  "/update_role/:id",
  authenticationTokenChecking,
  adminCheck,
  API_Function.UpdateUsersRole
);

router.delete(
  "/delete/:id",
  authenticationTokenChecking,
  adminCheck,
  API_Function.RemoveUser
);

module.exports = router;
