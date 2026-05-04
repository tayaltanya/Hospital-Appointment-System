import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import "../styles/LoginStyles.css";

// 👉 import your image (add in assets folder)
import loginImage from  "../assests/login.png";
;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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
        "http://localhost:8080/api/v1/user/login",
        formData
      );
      window.location.reload();
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Login successful");

        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="login-container">
      
      {/* LEFT SIDE */}
      <div className="login-left">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login to your account</p>

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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          <Link to="/register">New user? Register</Link>
        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img src={loginImage} alt="login visual" />
      </div>

    </div>
  );
};

export default Login;