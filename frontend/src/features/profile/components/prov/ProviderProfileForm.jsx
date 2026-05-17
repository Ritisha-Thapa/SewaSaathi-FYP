import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import FormField from '../shared/FormField';

const ProviderProfileForm = ({ formData, isEditing, isLoading, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={User}
        />
        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={User}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={Phone}
        />
        <FormField
          label="Email Address"
          value={formData.email}
          readOnly
          isLoading={isLoading}
          icon={Mail}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="City"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={MapPin}
        />
        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          isEditing={isEditing}
          isLoading={isLoading}
          icon={MapPin}
        />
      </div>

      <FormField
        label="Bio"
        name="bio"
        type="textarea"
        value={formData.bio}
        onChange={onInputChange}
        isEditing={isEditing}
        isLoading={isLoading}
        placeholder="Tell customers a bit about yourself..."
        rows={4}
      />
    </div>
  );
};

export default ProviderProfileForm;
