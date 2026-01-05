import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleForgotChange = (e) => {
    setForgotEmail(e.target.value);
    if (forgotError) setForgotError("");
  };

  const handleForgotSubmit = () => {
    const email = forgotEmail.trim();
    if (!email) {
      setForgotError("Email is required");
      return;
    }
    navigate("/forgot/otp");
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[#1B3C53] hover:text-[#1a3248]"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-[#1B3C53]">Reset Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email to receive a reset link.
        </p>
        <div>
          <label
            htmlFor="forgotEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            id="forgotEmail"
            name="forgotEmail"
            type="email"
            required
            value={forgotEmail}
            onChange={handleForgotChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
            placeholder="Enter your email"
          />
          {forgotError && (
            <p className="mt-1 text-sm text-red-600">{forgotError}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgotSubmit}
            className="px-4 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
          >
            Send Reset Link
          </button>
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-[#1B3C53]"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
