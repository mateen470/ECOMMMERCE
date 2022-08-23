import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./login.css";
const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const loginFormSubmit = (e) => {
    const { name, value } = e.target;
    setLoginData((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="login_root_div">
      <h1>LOGIN</h1>
      <div className="login_form_root_div">
        <form>
          <input
            defaultValue={loginData.email}
            onChange={loginFormSubmit}
            placeholder="enter your email!"
          />
          <input
            defaultValue={loginData.password}
            onChange={loginFormSubmit}
            placeholder="enter your password!"
          />
          <div className="forgotpassword_login_form_root_div">
            <span>dont remember your password?</span>
            <NavLink to={"/forgot"}>forgot password</NavLink>
          </div>
          <div className="login_button_root_div">
            <button>
              <span>LogIn</span>
            </button>
          </div>
          <div className="signup_login_form">
            <span>don't have an account?</span>
            <NavLink to={"/signup"}>Register</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
