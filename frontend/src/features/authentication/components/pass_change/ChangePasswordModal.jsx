import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';
import { api } from '../../../../utils/api';
import { toast } from '../../../../shared/components/layout/ToastProvider';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.new_password !== formData.confirm_password) {
      setErrors({ confirm_password: ["New passwords do not match."] });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/accounts/change-password/', {
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });
      toast.success("Password updated successfully!");
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
      onClose();
    } catch (err) {
      console.error("Change password failed", err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <Button
          type="button"
          onClick={onClose}
          variant="icon"
          fullWidth={false}
          className="!absolute top-4 right-4 z-10"
        >
          <X size={24} />
        </Button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-[#1B3C53] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-2">Change Password</h2>
            <p className="text-gray-500 text-sm">Update your account password to keep it secure.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1B3C53] uppercase tracking-wider">Old Password</label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.old_password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition text-sm bg-gray-50`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B3C53] transition"
                >
                  {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.old_password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.old_password[0]}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1B3C53] uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.new_password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition text-sm bg-gray-50`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B3C53] transition"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.new_password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.new_password[0]}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1B3C53] uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  placeholder="Repeat new password"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition text-sm bg-gray-50`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B3C53] transition"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.confirm_password[0]}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Updating..."
              className="mt-4"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
