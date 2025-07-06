import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";

const OtpVerificationPage = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const api = import.meta.env.VITE_API_URL;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const tempToken = localStorage.getItem("tempToken");

    if (!tempToken) {
      alert("Temporary token not found.");
      return;
    }

    try {
      const res = await axios.post(
        `${api}/clideal/verifyUser`,
        { otp: Number(otp), token: tempToken },
        { withCredentials: true }
      );

      const token = res.data.token;
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", decoded.exp * 1000);
      localStorage.removeItem("tempToken");

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify OTP.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(`${api}/clideal/resendOtp`, { email });
      if (res.status === 200) {
        alert("A new OTP has been sent to your email.");
      }
    } catch (err) {
      alert("Resend failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">CliDeal</h2>
        <h4 className="text-center mb-3">Verify Your Email</h4>

        <p className="text-center text-muted mb-4">
          We’ve sent a 6-digit OTP to your email <br />
          <strong>{email || "your registered email"}</strong>
        </p>

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control text-center"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Verify & Continue
          </button>
        </form>

        <div className="text-center mt-3">
          Didn’t get the code?{" "}
          <button className="btn btn-link p-0" onClick={handleResendOtp}>
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
