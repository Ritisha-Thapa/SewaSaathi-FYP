import React from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button component for SewaSaathi
 * Supports loading states, custom styling, and React Router Link
 */
const Button = ({
  children,
  isLoading = false,
  loadingText,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  rounded = 'full', // 'full' or 'xl' or 'lg' etc
  fullWidth = true,
  onClick,
  to,
  ...props
}) => {
  // Base styles
  const baseStyles = "group relative flex justify-center items-center py-3 px-4 text-sm font-medium transition duration-200 active:scale-[0.98]";
  
  const widthStyles = fullWidth ? "w-full" : "";
  const roundedStyles = rounded === 'full' ? 'rounded-full' : `rounded-${rounded}`;

  // Specific color logic
  const getVariantStyles = () => {
    if (isLoading || disabled) return "bg-gray-200 text-gray-500 cursor-not-allowed";
    
    switch (variant) {
      case 'secondary':
        return "bg-white border border-gray-200 text-primary hover:bg-gray-50 shadow-sm";
      case 'outline':
        return "bg-transparent border-2 border-primary text-primary hover:bg-primary/5";
      case 'ghost':
        return "bg-transparent text-primary hover:bg-primary/5";
      default: // primary
        return "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10";
    }
  };

  const variantStyles = getVariantStyles();
  const combinedClasses = `${baseStyles} ${widthStyles} ${roundedStyles} ${variantStyles} ${className}`;

  if (to && !disabled && !isLoading) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
