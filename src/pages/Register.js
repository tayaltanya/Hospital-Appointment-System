import React, { useState } from "react";
import "../styles/LoginStyles.css";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useEffect } from "react";

// 👉 add your image
import registerImage from "../assests/login.png";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form (UNCHANGED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        formData
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Register successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  const handleGoogleResponse = async (response) => {
  try {
    const userData = JSON.parse(atob(response.credential.split(".")[1]));

    dispatch(showLoading());

    const res = await axios.post(
      "http://localhost:8080/api/v1/user/google-login",
      {
        name: userData.name,
        email: userData.email,
        googleId: userData.sub,
      }
    );

    dispatch(hideLoading());

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      message.success("Google Sign Up Successful");
      navigate("/");
    } else {
      message.error(res.data.message);
    }
  } catch (error) {
    dispatch(hideLoading());
    console.log(error);
    message.error("Google Sign Up Failed");
  }
};
useEffect(() => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: "709996803469-b0cj5qlvvcjp79ambd1peiiiroadbedl.apps.googleusercontent.com"
,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignUp"),
      {
        theme: "outline",
        size: "large",
        width: 250,
      }
    );
  }
}, []);

  return (
    <div className="login-container">
      
      {/* LEFT SIDE */}
      <div className="login-left">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Create Account ✨</h2>
          <p className="subtitle">Register to get started</p>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
          <div id="googleSignUp" style={{ marginTop: "15px", textAlign: "center" }}></div>

          <Link to="/login">Already have an account? Login</Link>
        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img src={registerImage} alt="register visual" />
      </div>

    </div>
  );
};

export default Register;