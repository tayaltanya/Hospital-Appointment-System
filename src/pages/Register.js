import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import{useDispatch}from 'react-redux';
import {showLoading , hideLoading} from "../redux/features/alertSlice";
import axios from "axios";

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

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading())
      const res = await axios.post(
  "http://localhost:8080/api/v1/user/register",
  formData
);
dispatch(hideLoading())


      if (res.data.success) {
        message.success("Register successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      message.error("Something went wrong");
    }
  };
  

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Register Form</h1>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        <Link to="/login" className="m-3">
          Login
        </Link>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
