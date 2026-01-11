import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 1200);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Input change handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    // allow user to type email or phone freely now
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const loginResponse = await fetch(
        "http://127.0.0.1:8000/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await loginResponse.json();
      console.log("Login response:", data);

      if (!loginResponse.ok) {
        setApiError(
          data.detail ||
            data.non_field_errors?.[0] ||
            data.error ||
            "Invalid phone or password"
        );
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/customer-dashboard");
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[#1B3C53] hover:text-[#1a3248] transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>

        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1B3C53]">
            Login to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in as a customer
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {/* Email or Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter phone"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Password"
                />

                {/* Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              {/* Forgot Password */}
              <Link
                to="/forgot"
                className="text-sm text-[#1B3C53] hover:text-[#1a3248]"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-4 text-green-700 bg-green-100 px-4 py-2 rounded-lg border border-green-200 text-center">
              {successMessage}
            </div>
          )}

          {apiError && (
            <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded-lg border border-red-200 text-center">
              {apiError}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#1B3C53] text-white hover:bg-[#1a3248] transition"
          >
            Login
          </button>

          {/* Signup */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup/customer"
              className="font-medium text-[#1B3C53] hover:text-[#1a3248]"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
