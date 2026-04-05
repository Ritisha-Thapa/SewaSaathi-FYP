import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import Logo from "../assets/sewasathi_logo.png";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // Auto-hide success message (No longer needed since we use toast, but kept apiError)

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

    setIsLoading(true);
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

      const responseData = await loginResponse.json();
      console.log("Login response:", responseData);

      if (!loginResponse.ok) {
        setApiError(
          responseData.detail ||
          responseData.non_field_errors?.[0] ||
          responseData.error ||
          "Invalid phone or password"
        );
        setIsLoading(false);
        return;
      }

      const { data } = responseData;
      login(data);

      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "provider") {
          navigate("/provider/dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          {/* <Link to="/">
            <img src={Logo} alt="SewaSaathi" className="h-20 w-auto mb-1" />
          </Link> */}

          <div className="flex items-center gap-4 cursor-pointer">
            <img src={Logo} alt="logo" className="h-14 w-auto" />
            <span className="text-3xl font-semibold text-[#1B3C53] tracking-wide">
              SewaSaathi
            </span>
          </div>
          <h2 className="text-center text-3xl font-bold text-[#1B3C53] mt-12">
            Login to Your Account
          </h2>
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
                className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? "border-red-300" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-lg ${errors.password ? "border-red-300" : "border-gray-300"
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
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
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
          {/* Removed inline successMessage in favor of toast */}

          {apiError && (
            <div className="mb-4 text-red-700 bg-red-100 px-4 py-2 rounded-lg border border-red-200 text-center">
              {apiError}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full text-white transition flex justify-center items-center ${isLoading ? "bg-[#1B3C53]/70 cursor-not-allowed" : "bg-[#1B3C53] hover:bg-[#1a3248]"
              }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            ) : null}
            {isLoading ? "Logging in..." : "Login"}
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
