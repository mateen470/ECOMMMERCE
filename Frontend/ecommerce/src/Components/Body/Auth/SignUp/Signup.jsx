import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
const Signup = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signUpFormSubmit = (e) => {
    const { name, value } = e.target;
    setSignUpData((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="signup_root_div">
      <h1>SIGNUP</h1>
      <div className="signup_form_root_div">
        <form>
          <input
            defaultValue={signUpData.name}
            onChange={signUpFormSubmit}
            placeholder="YOUR NAME"
          />
          <input
            defaultValue={signUpData.email}
            onChange={signUpFormSubmit}
            placeholder="YOUR EMAIL"
          />
          <input
            defaultValue={signUpData.password}
            onChange={signUpFormSubmit}
            placeholder="YOUR PASSWORD"
          />
          <input
            defaultValue={signUpData.confirmPassword}
            onChange={signUpFormSubmit}
            placeholder="CONFIRM PASSWORD"
          />
          <div className="signup_button_root_div">
            <button>
              <span>SIGNUP</span>
            </button>
          </div>

          <div className="login_signup_form">
            <span>already have an account?</span>
            <NavLink to={"/"}>LoginIn</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
