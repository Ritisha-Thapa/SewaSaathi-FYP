import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message, actionType, loading }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (actionType) {
      case 'accept':
        return {
          icon: <CheckCircle size={48} className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'reject':
        return {
          icon: <AlertCircle size={48} className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          icon: <AlertCircle size={48} className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const { icon, bgColor, borderColor, buttonColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#1B3C53]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className={`flex flex-col items-center p-6 rounded-xl ${bgColor} ${borderColor} border mb-6`}>
          {icon}
          <p className="text-center text-gray-700 mt-4">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Processing...' : title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
