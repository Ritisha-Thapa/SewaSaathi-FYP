import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // email passed from OTP page

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) navigate('/forgot'); 
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!password || !confirm) {
      setError('Please fill in both fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setInfo('Resetting password...');

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend errors
        let errorMessage = 'Failed to reset password';
        if (Array.isArray(data) && data.length) {
          errorMessage = data[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors?.length) {
          errorMessage = data.non_field_errors[0];
        } else if (data.email?.length) {
          errorMessage = data.email[0];
        } else if (data.new_password?.length) {
          errorMessage = data.new_password[0];
        }
        setError(errorMessage);
        setInfo('');
        return;
      }

      // Success
      setInfo('Password reset successfully');
      setTimeout(() => navigate('/forgot/success'), 1200);
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
      setInfo('');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-[#1B3C53] mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter and confirm your new password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-[#1B3C53]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-[#1B3C53]"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {info && <div className="text-sm text-green-600">{info}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
