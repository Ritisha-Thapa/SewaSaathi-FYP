import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import FormField from '../shared/FormField';

const CustomerProfileForm = ({ formData, profile, isEditing, isLoading, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField
          label="First Name"
          name="first_name"
          value={isEditing ? formData.first_name : profile?.first_name}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={User}
        />
        <FormField
          label="Last Name"
          name="last_name"
          value={isEditing ? formData.last_name : profile?.last_name}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={User}
        />
        <FormField
          label="Email Address"
          value={profile?.email}
          readOnly
          isLoading={isLoading}
          icon={Mail}
        />
      </div>

      <div className="space-y-6">
        <FormField
          label="Phone Number"
          value={profile?.phone}
          readOnly
          isLoading={isLoading}
          icon={Phone}
        />
        <FormField
          label="City"
          name="city"
          value={isEditing ? formData.city : profile?.city}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={MapPin}
        />
        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={isEditing ? formData.address : profile?.address}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={MapPin}
          rows={2}
        />
      </div>
    </div>
  );
};

export default CustomerProfileForm;
