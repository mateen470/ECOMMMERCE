import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Auth/Login/Login";
import SignUp from "./Auth/SignUp/Signup";
import ForgotPassword from "./Auth/ForgotPassword/Forgot";
import ResetPassword from "./Auth/ResetPassword/Reset";

const Body = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default Body;
