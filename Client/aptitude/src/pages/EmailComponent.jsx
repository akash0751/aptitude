import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailComponent = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${api}/clideal/forgotPassword`, { email });
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("resetToken", res.data.token);
      alert(res.data.message);
      navigate("/otpVerify");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "420px" }}>
        <h2 className="text-center text-primary fw-bold mb-3">CliDeal</h2>
        <h4 className="text-center mb-4">Reset Your Password</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label fw-semibold">
              Registered Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Send OTP
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            You'll receive an OTP on your registered email to reset your password.
          </small>
        </div>
      </div>
    </div>
  );
};

export default EmailComponent;
