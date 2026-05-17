import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotChange = (e) => {
    setForgotEmail(e.target.value);
    if (forgotError) setForgotError("");
  };

  const handleForgotSubmit = async () => {
    const email = forgotEmail.trim();
    if (!email) {
      setForgotError("Email is required");
      return;
    }

    setForgotError("");
    setSuccessMessage("Sending reset link...");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/accounts/forgot-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: "send" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to send reset link";

        if (Array.isArray(data) && data.length > 0) {
          // Backend returned a list
          errorMessage = data[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors?.length) {
          errorMessage = data.non_field_errors[0];
        } else if (data.email?.length) {
          errorMessage = data.email[0];
        }

        setForgotError(errorMessage);
        setSuccessMessage("");
        return;
      }

      // Success
      setSuccessMessage(data.message || "OTP sent successfully");

      setTimeout(() => {
        navigate("/forgot/otp", { state: { email } });
      }, 1200);
    } catch (err) {
      console.error(err);
      setForgotError("Network error. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
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
        {successMessage && (
          <div className="text-green-700 bg-green-100 border border-green-200 px-4 py-2 rounded-lg text-sm text-center">
            {successMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgotSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-full text-white bg-[#1B3C53]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
