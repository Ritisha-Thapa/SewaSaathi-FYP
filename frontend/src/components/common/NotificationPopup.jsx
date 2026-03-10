import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const NotificationPopup = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={24} className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-800',
          messageColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle size={24} className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-800',
          messageColor: 'text-red-600'
        };
      case 'info':
        return {
          icon: <Info size={24} className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-600'
        };
      default:
        return {
          icon: <Info size={24} className="text-gray-500" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-600'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {styles.icon}
            <div>
              <h4 className={`font-semibold ${styles.titleColor}`}>{title}</h4>
              {message && <p className={`text-sm mt-1 ${styles.messageColor}`}>{message}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
