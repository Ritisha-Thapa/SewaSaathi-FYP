import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const location = useLocation();
  const [loading, setLoading] = useState(false); // for resend button

  const email = location.state?.email; // email passed from previous page

  // Optional: redirect if email not available
  useEffect(() => {
    if (!email) {
      navigate("/forgot"); // go back to forgot-password page
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D+/g, "").slice(0, 1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\D+/g, "")
      .slice(0, 6);
    if (!text) return;
    const next = text.split("");
    while (next.length < 6) next.push("");
    setOtp(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const resendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setInfo("Resending OTP...");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/accounts/forgot-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "resend" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to resend OTP";

        // Handle both array and object error formats from backend
        if (Array.isArray(data) && data.length) {
          errorMessage = data[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors?.length) {
          errorMessage = data.non_field_errors[0];
        } else if (data.email?.length) {
          errorMessage = data.email[0];
        }

        setError(errorMessage);
        setInfo("");
        return;
      }

      // Success
      setInfo(data.message || "OTP resent successfully");
      setTimeout(() => setInfo(""), 2000);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setInfo("");
    } finally {
      setLoading(false);
    }

    inputsRef.current[0]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/accounts/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.non_field_errors?.[0] || "Invalid OTP");
        return;
      }

      // Success → navigate to reset password page
      navigate("/forgot/reset", { state: { email } });
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[#1B3C53] hover:text-[#1a3248]"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-[#1B3C53] mb-2">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the 6-digit code sent to your email or phone.
        </p>
        <div className="flex items-center justify-between gap-2 mb-4">
          {otp.map((value, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
            />
          ))}
        </div>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        {info && <div className="text-sm text-green-600 mb-3">{info}</div>}
        <div className="flex items-center justify-between">
          <button
            onClick={resendOtp}
            className="text-sm text-[#1B3C53] hover:text-[#1a3248]"
          >
            Resend OTP
          </button>
          <button
            onClick={verifyOtp}
            className="px-4 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
