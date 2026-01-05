import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PasswordResetSuccess = () => {
  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#1B3C53] mb-2">Password updated successfully</h1>
        <p className="text-sm text-gray-600 mb-6">You can now log in with your new password.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
