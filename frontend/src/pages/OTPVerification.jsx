import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleChange = (index, value) => {
    const digit = value.replace(/\D+/g, '').slice(0, 1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D+/g, '').slice(0, 6);
    if (!text) return;
    const next = text.split('');
    while (next.length < 6) next.push('');
    setOtp(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const resendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setInfo('OTP resent');
    setTimeout(() => setInfo(''), 2000);
    inputsRef.current[0]?.focus();
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    navigate('/forgot/reset');
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#1B3C53] hover:text-[#1a3248]">
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-[#1B3C53] mb-2">OTP Verification</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the 6-digit code sent to your email or phone.</p>
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
          <button onClick={resendOtp} className="text-sm text-[#1B3C53] hover:text-[#1a3248]">Resend OTP</button>
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
