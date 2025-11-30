// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     if (!formData.emailOrPhone.trim()) {
//       newErrors.emailOrPhone = 'Email or phone is required';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const loginResponse = await fetch("http://127.0.0.1:8000/accounts/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: formData.emailOrPhone,
//           password: formData.password,
//         }),
//       });

//       const data = await loginResponse.json();
//       console.log("Login response data:", data);

//       if (!loginResponse.ok) {
//         // Log the full error response for debugging
//         console.error("Backend error response:", data);
//         alert(data.detail || data.error || JSON.stringify(data) || "Login failed");
//         return;
//       }

//       // Save JWT tokens
//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);

//       alert("Login successful!");

//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Network error. Please try again.");
//     }

//     console.log('Login data:', formData);
//   };

//   return (
//     <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="flex justify-start">
//           <Link 
//             to="/" 
//             className="inline-flex items-center text-sm text-[#1B3C53] hover:text-[#1a3248] transition"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back
//           </Link>
//         </div>
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-bold text-[#1B3C53]">
//             Login to Your Account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Sign in as a customer
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            
//             <div>
//               <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email or Phone *
//               </label>
//               <input
//                 id="emailOrPhone"
//                 name="emailOrPhone"
//                 type="text"
//                 required
//                 value={formData.emailOrPhone}
//                 onChange={handleChange}
//                 className={`appearance-none relative block w-full px-3 py-2 border ${
//                   errors.emailOrPhone ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
//                 placeholder="Email or phone number"
//               />
//               {errors.emailOrPhone && (
//                 <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password *
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`appearance-none relative block w-full px-3 py-2 border ${
//                   errors.password ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
//                 placeholder="Password"
//               />
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248] transition"
//             >
//               Login
//             </button>
//           </div>

//           <div className="text-center space-y-2">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link to="/signup/customer" className="font-medium text-[#1B3C53] hover:text-[#1a3248]">
//                 Sign up as Customer
//               </Link>
//             </p>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // <-- added
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // <-- added
  const [showForgot, setShowForgot] = useState(false);     // <-- added
  const [forgotPhone, setForgotPhone] = useState('');      // <-- added
  const [forgotError, setForgotError] = useState('');      // <-- added

  // Input change handling
  const handleChange = (e) => {
    const { name, value } = e.target;

    const nextValue = name === "emailOrPhone"
      ? value.replace(/\D+/g, "")        // allow only numbers like first code
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Forgot password modal input 
  const handleForgotChange = (e) => {
    const digits = e.target.value.replace(/\D+/g, '');
    setForgotPhone(digits);
    if (forgotError) setForgotError('');
  };

  // Forgot password submit
  const handleForgotSubmit = () => {
    const phone = forgotPhone.trim();

    if (!phone) {
      setForgotError("Phone is required");
      return;
    }

    console.log("Forgot password phone:", phone);
    setShowForgot(false);
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Phone is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const loginResponse = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await loginResponse.json();
      console.log("Login response:", data);

      if (!loginResponse.ok) {
        alert(data.detail || data.error || "Login failed");
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      alert("Login successful!");

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
          <Link to="/" className="inline-flex items-center text-sm text-[#1B3C53] hover:text-[#1a3248] transition">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone *
              </label>
              <input
                name="emailOrPhone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.emailOrPhone ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Phone number"
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-600">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Password Field with Eye Icon */}
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
                
                {/* Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}

              {/* Forgot Password Link */}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#1B3C53] hover:text-[#1a3248]"
                >
                  Forgot password?
                </button>
              </div>
            </div>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#1B3C53] text-white hover:bg-[#1a3248] transition"
          >
            Login
          </button>

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup/customer" className="font-medium text-[#1B3C53] hover:text-[#1a3248]">
              Sign up
            </Link>
          </div>
        </form>

        {/* ---------- Forgot Password Modal ---------- */}
        {showForgot && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold text-[#1B3C53]">Reset Password</h3>
              <p className="text-sm text-gray-600">Enter your phone number to get a reset code.</p>

              <input
                type="tel"
                value={forgotPhone}
                onChange={handleForgotChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  forgotError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Phone number"
              />

              {forgotError && (
                <p className="text-sm text-red-600">{forgotError}</p>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={handleForgotSubmit}
                  className="px-4 py-2 rounded-full bg-[#1B3C53] text-white"
                >
                  Send Reset Code
                </button>
                <button
                  onClick={() => setShowForgot(false)}
                  className="text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;

