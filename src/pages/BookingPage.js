import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import BannerImage from "../assests/background image.jpg";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  // ================= GET DOCTOR DATA =================
  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CHECK AVAILABILITY =================
  const handleAvailability = async () => {
    try {
      if (!date || !time) {
        return message.error("Please select date & time first");
      }

      dispatch(showLoading());

      const res = await axios.post(
        "http://localhost:8080/api/v1/user/booking-availbility",
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // ================= BOOK APPOINTMENT =================


  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);

  // ================= AVERAGE RATING =================
  const averageRating =
    doctor?.reviews && doctor.reviews.length > 0
      ? (
        doctor.reviews.reduce((acc, r) => acc + r.rating, 0) /
        doctor.reviews.length
      ).toFixed(1)
      : "No ratings";

  return (
    <Layout>
      <div
        className="doctors"
        style={{
          backgroundImage: `url(${BannerImage})`,
          minHeight: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="text-center pt-3">Booking Page</h3>

        <div className="container">
          {doctor && (
            <div className="card p-4 shadow">

              {/* DOCTOR INFO */}
              <h3>
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>

              <h5>Fees: ₹{doctor.feesPerCunsaltation}</h5>

              <h4>
                Timings : {doctor.timings && doctor.timings[0]} -{" "}
                {doctor.timings && doctor.timings[1]}{" "}
              </h4>

              {/* ACHIEVEMENTS */}
              <div className="mt-3">
                <h5>🏆 Achievements:</h5>
                {doctor.achievements?.length > 0 ? (
                  <ul>
                    {doctor.achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Gold Medalist. 10+ Years Experience. Best Surgeon Award</p>
                )}
              </div>

              {/* REVIEWS */}
              <div className="mt-3">
                <h5>💬 Patient Reviews:</h5>

                {(doctor.reviews?.length > 0
                  ? doctor.reviews
                  : [
                    {
                      userName: "Rahul Sharma",
                      rating: 5,
                      comment: "Excellent doctor, very polite and helpful.",
                    },
                    
                  ]
                ).map((review, index) => (
                  <div key={index} className="border p-2 mb-2 rounded">
                    <strong>{review.userName}</strong>
                    <p>⭐ {review.rating}/5</p>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
              {/* BOOKING SECTION */}
              <div className="d-flex flex-column w-50 mt-4">

                <DatePicker
                  aria-required={"true"}
                  className="m-2"
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                  }}
                />

                <TimePicker
                  aria-required={"true"}
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setTime(moment(value).format("HH:mm"));
                  }}
                />

                {/* CHECK AVAILABILITY */}
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={handleAvailability}
                >
                  Check Availability
                </button>

                {/* BOOK NOW */}
                <button
                  type="button"
                  className="btn btn-dark mt-2"
                  onClick={handleBooking}
                >
                  Book Now
                </button>

              </div>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;