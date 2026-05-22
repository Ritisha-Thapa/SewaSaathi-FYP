import React from 'react';
import { Lock } from 'lucide-react';

import Button from '../../../../shared/components/ui/Button';

const ProfileHeader = ({ title, subtitle, onPasswordClick, showPasswordButton = true }) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {showPasswordButton && (
        <Button
          onClick={onPasswordClick}
          variant="secondary"
          fullWidth={false}
          className="bg-white border border-gray-200 !text-primary hover:bg-gray-50 transition font-bold shadow-sm"
        >
          <Lock size={18} className="text-primary" />
          Change Password
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
