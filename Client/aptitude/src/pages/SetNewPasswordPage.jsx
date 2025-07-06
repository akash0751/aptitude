import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SetNewPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("finalToken");
    if (!token) {
      alert("No reset session found. Please restart the reset process.");
      navigate("/forgotPassword");
    }
  }, [navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("finalToken");
    if (!token) {
      alert("No reset session found. Please restart the reset process.");
      navigate("/forgotPassword");
      return;
    }

    document.cookie = `jwt_new=${token}; path=/;`;

    try {
      const response = await axios.post(
        `${api}/clideal/resetPassword`,
        { password },
        { withCredentials: true }
      );

      alert(response.data.message || "Password updated!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("finalToken");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password.");
      console.error("Set password error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="text-center text-primary fw-bold mb-3">CliDeal</h2>
        <h4 className="text-center mb-3">Set New Password</h4>
        <p className="text-center text-muted mb-4">
          Please enter your new password to continue.
        </p>

        <form onSubmit={handleSetPassword}>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label fw-semibold">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
