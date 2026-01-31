import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

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

  // submit form
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

        // save token
        localStorage.setItem("token", res.data.token);

        // optional: set token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        // redirect
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
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Login Form</h1>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Link to="/register" className="m-3">
          New user? Register
        </Link>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
