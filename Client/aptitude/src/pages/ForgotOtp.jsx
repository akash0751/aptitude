import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotOTP = ({ email }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const api = import.meta.env.VITE_API_URL;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("resetToken");

    if (!token) {
      alert("Temporary token not found.");
      return;
    }

    document.cookie = `jwt_otp=${token}; path=/;`;

    try {
      const response = await axios.post(
        `${api}/clideal/verifyOtp`,
        { otp: Number(otp) },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("OTP Verified Successfully!");
        localStorage.setItem("finalToken", response.data.token);
        navigate("/SetNewPasswordPage");
      }
    } catch {
      alert("Invalid or expired OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${api}/clideal/verifyUser`);
      if (response.status === 200) {
        alert("A new OTP has been sent!");
      }
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-4 w-100"
        style={{ maxWidth: "420px", borderRadius: "16px" }}
      >
        <h2 className="text-center text-primary fw-bold mb-3">CliDeal</h2>
        <h4 className="text-center mb-3">OTP Verification</h4>
        <p className="text-center text-muted mb-2">
          We've sent a 6-digit OTP to your registered email.
        </p>
        {email && (
          <p className="text-center text-dark fw-semibold mb-3">
            📧 {email}
          </p>
        )}

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-3">
            <label htmlFor="otpInput" className="form-label fw-semibold">
              Enter OTP
            </label>
            <input
              type="text"
              id="otpInput"
              className="form-control"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Verify OTP
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={handleResendOtp}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotOTP;
