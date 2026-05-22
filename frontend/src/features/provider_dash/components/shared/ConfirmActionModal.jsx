import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message, actionType, loading }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (actionType) {
      case 'accept':
        return {
          icon: <CheckCircle size={48} className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          confirmVariant: 'success',
        };
      case 'reject':
        return {
          icon: <AlertCircle size={48} className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          confirmVariant: 'danger',
        };
      default:
        return {
          icon: <AlertCircle size={48} className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          confirmVariant: 'primary',
        };
    }
  };

  const { icon, bgColor, borderColor, confirmVariant } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-[#F9F5F0]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#1B3C53]">{title}</h3>
          <Button
            type="button"
            onClick={onClose}
            variant="icon"
            fullWidth={false}
            disabled={loading}
          >
            <X size={24} />
          </Button>
        </div>

        <div className={`flex flex-col items-center p-6 rounded-xl ${bgColor} ${borderColor} border mb-6`}>
          {icon}
          <p className="text-center text-gray-700 mt-4">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant={confirmVariant}
            size="md"
            isLoading={loading}
            loadingText="Processing..."
            disabled={loading}
            className="flex-1"
          >
            {title}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
