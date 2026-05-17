import React from 'react';

const ProfileCard = ({ title, children, actions, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default ProfileCard;
