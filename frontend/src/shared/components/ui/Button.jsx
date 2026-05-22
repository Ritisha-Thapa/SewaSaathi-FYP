import React from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Shared action button for SewaSaathi.
 * All variants use a consistent capsule shape (rounded-full).
 */
const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10',
  secondary:
    'bg-white border border-gray-200 text-[#1B3C53] hover:bg-gray-50 shadow-sm',
  outline:
    'bg-transparent border-2 border-[#1B3C53] text-[#1B3C53] hover:bg-gray-50',
  ghost:
    'bg-transparent text-[#1B3C53] hover:bg-primary/5',
  pay:
    'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/15',
  khalti:
    'bg-[#5C2D91] text-white hover:bg-[#4d257a] shadow-md shadow-[#5C2D91]/20',
  insurance:
    'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/15',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-md',
  'danger-outline':
    'bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm',
  success:
    'bg-green-600 text-white hover:bg-green-700 shadow-md',
  icon:
    'bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 !p-2 !w-auto rounded-full',
};

const SIZES = {
  sm: 'py-2 px-5 text-sm gap-2',
  md: 'py-3 px-6 text-sm gap-2',
  lg: 'py-4 px-8 text-base gap-2.5',
};

const Button = ({
  children,
  isLoading = false,
  loadingText,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  onClick,
  to,
  ...props
}) => {
  const baseStyles =
    'group relative inline-flex justify-center items-center font-semibold rounded-full transition duration-200 active:scale-[0.98]';

  const isDisabled = isLoading || disabled;
  const widthStyles =
    variant === 'icon' ? '' : fullWidth ? 'w-full' : '';
  const sizeStyles = variant === 'icon' ? '' : SIZES[size] ?? SIZES.md;

  const variantStyles =
    isDisabled && variant !== 'icon'
      ? 'bg-gray-200 text-gray-500 shadow-none border-transparent cursor-not-allowed hover:bg-gray-200'
      : VARIANTS[variant] ?? VARIANTS.primary;

  const combinedClasses = [
    baseStyles,
    widthStyles,
    sizeStyles,
    variantStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = isLoading ? (
    <>
      <Loader2 className="animate-spin h-5 w-5 shrink-0" />
      <span>{loadingText || children}</span>
    </>
  ) : (
    children
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
