import React from 'react';
import Skeleton from '../../../../shared/components/layout/Skeleton';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  isEditing = false, 
  isLoading = false, 
  icon: Icon, 
  placeholder = "",
  rows = 3,
  disabled = false,
  readOnly = false
}) => {
  const isDisabled = disabled || (!isEditing && !readOnly) || (readOnly && isEditing);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {label} {readOnly && <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider ml-1">(Read-only)</span>}
      </label>
      
      {isLoading ? (
        <Skeleton className={`w-full ${type === "textarea" ? "h-24" : "h-12"} rounded-xl`} />
      ) : (
        isEditing && !readOnly ? (
          type === "textarea" ? (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              rows={rows}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition resize-none bg-white"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition bg-white"
            />
          )
        ) : (
          <div className={`px-4 py-3 rounded-xl border border-transparent min-h-[48px] flex items-center ${readOnly ? "bg-gray-100 text-gray-500 italic" : "bg-gray-50 text-gray-800"}`}>
            {value || <span className="text-gray-400 italic">Not provided</span>}
          </div>
        )
      )}
    </div>
  );
};

export default FormField;
