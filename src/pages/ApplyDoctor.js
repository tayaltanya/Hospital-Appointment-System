import React from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= HANDLE FORM =================
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const formData = new FormData();

      //  text fields
      Object.keys(values).forEach((key) => {
        if (
          key !== "timings" &&
          key !== "aadhar" &&
          key !== "degree" &&
          key !== "photo" &&
          key !== "license"
        ) {
          formData.append(key, values[key]);
        }
      });

      //  timings
      formData.append(
        "timings",
        JSON.stringify([
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ])
      );

      //  files
      formData.append("aadhar", values.aadhar);
      formData.append("degree", values.degree);
      formData.append("photo", values.photo);
      formData.append("license", values.license); // NEW

      formData.append("userId", user._id);

      const res = await axios.post(
        "http://localhost:8080/api/v1/user/apply-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>

      <Form layout="vertical" onFinish={handleFinish} className="m-3">

        {/* ================= PERSONAL ================= */}
        <h4>Personal Details :</h4>
        <Row gutter={20}>
          <Col xs={24} lg={8}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input type="email" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* ================= PROFESSIONAL ================= */}
        <h4>Professional Details :</h4>
        <Row gutter={20}>
          <Col xs={24} lg={8}>
            <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="experience" label="Experience" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="feesPerCunsaltation" label="Fees" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="timings" label="Timings" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>

          {/*  NEW VERIFICATION FIELDS */}

          <Col xs={24} lg={8}>
            <Form.Item name="registrationNumber" label="Medical Registration No" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="hospital" label="Hospital / Clinic" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="referenceDoctor" label="Reference Doctor" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item name="referenceContact" label="Reference Contact" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              name="referenceNumber"
              label="Reference Number / ID"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter reference ID or code" />
            </Form.Item>
          </Col>

          {/* ================= FILE UPLOAD ================= */}

          <Col xs={24} lg={8}>
            <Form.Item
              name="aadhar"
              label="Aadhar Card"
              getValueFromEvent={(e) => e.target.files[0]}
              rules={[{ required: true }]}
            >
              <Input type="file" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item
              name="degree"
              label="Degree Certificate"
              getValueFromEvent={(e) => e.target.files[0]}
              rules={[{ required: true }]}
            >
              <Input type="file" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <Form.Item
              name="photo"
              label="Photo (Max 1MB)"
              getValueFromEvent={(e) => e.target.files[0]}
              rules={[{ required: true }]}
            >
              <Input type="file" />
            </Form.Item>
          </Col>

          {/*  NEW LICENSE UPLOAD */}

          <Col xs={24} lg={8}>
            <Form.Item
              name="license"
              label="Medical License (PDF)"
              getValueFromEvent={(e) => e.target.files[0]}
              rules={[{ required: true }]}
            >
              <Input type="file" accept="application/pdf" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;