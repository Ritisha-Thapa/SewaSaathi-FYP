import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const StatusBanner = ({ type = "success", title, message }) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-orange-50 border-orange-200 text-orange-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700"
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all mb-6 ${styles[type]}`}>
      <div className="mt-0.5">{icons[type]}</div>
      <div>
        {title && <h3 className="font-bold text-sm mb-0.5">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default StatusBanner;
