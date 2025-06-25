import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // Store OTP from user input
  const [showOtpInput, setShowOtpInput] = useState(false); // Show OTP input
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Flag to track OTP status
  const [countdown, setCountdown] = useState(0); // Countdown for OTP resend

  // Timer for OTP resend functionality
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [otpSent, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password
      });

      const result = await response.json();

      if (result.success) {
        alert("Login successful! Please enter the OTP sent to your email.");
        setShowOtpInput(true); // Show OTP input
        setOtpSent(true); // Mark OTP as sent
        setCountdown(30); // Set countdown for OTP resend
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Error connecting to server");
    }

    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userOtp: otp }), // Send both email and OTP
      });

      const result = await response.json();

      if (result.success) {
        alert("OTP verified! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Error verifying OTP");
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password again to resend OTP
      });

      const result = await response.json();

      if (result.success) {
        alert("OTP resent successfully. Please check your email.");
        setCountdown(30); // Reset countdown to 30 seconds
      } else {
        setError(result.message || "Error resending OTP");
      }
    } catch (err) {
      setError("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>

          {!showOtpInput ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
              {countdown === 0 && (
                <button type="button" onClick={handleResendOtp} className="btn">
                  Resend OTP
                </button>
              )}
              {countdown > 0 && <p>Resend OTP in {countdown} seconds</p>}
            </form>
          )}
          
          <div className="home-link">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
