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
          bgColor: 'bg-white',
          borderColor: 'border-green-100',
          accentColor: 'bg-green-500',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-500'
        };
      case 'error':
        return {
          icon: <AlertCircle size={24} className="text-red-500" />,
          bgColor: 'bg-white',
          borderColor: 'border-red-100',
          accentColor: 'bg-red-500',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-500'
        };
      case 'info':
        return {
          icon: <Info size={24} className="text-primary" />,
          bgColor: 'bg-white',
          borderColor: 'border-primary/10',
          accentColor: 'bg-primary',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-500'
        };
      default:
        return {
          icon: <Info size={24} className="text-gray-400" />,
          bgColor: 'bg-white',
          borderColor: 'border-gray-100',
          accentColor: 'bg-gray-400',
          titleColor: 'text-gray-900',
          messageColor: 'text-gray-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right fade-in duration-300">
      <div className={`${styles.bgColor} border ${styles.borderColor} rounded-2xl shadow-2xl shadow-primary/10 p-5 min-w-[350px] max-w-[450px] relative overflow-hidden group`}>
        {/* Progress Bar/Accent Line */}
        <div className={`absolute top-0 left-0 h-1 w-full ${styles.accentColor} opacity-20`}></div>
        <div className={`absolute top-0 left-0 h-1 bg-white/20 animate-progress-shrink`}></div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-0.5">{styles.icon}</div>
            <div>
              <h4 className={`font-black text-sm uppercase tracking-tight ${styles.titleColor}`}>{title}</h4>
              {message && <p className={`text-sm mt-1 leading-relaxed ${styles.messageColor}`}>{message}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-900 transition-all p-1 hover:bg-gray-50 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
