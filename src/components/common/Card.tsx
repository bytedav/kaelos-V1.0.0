import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  const variantStyles = {
    default: 'bg-white rounded-[24px] sm:rounded-[32px] border border-slate-150 shadow-sm',
    flat: 'bg-slate-50 rounded-[20px] sm:rounded-[24px] border border-slate-200/80',
    outline: 'bg-transparent rounded-[24px] border border-slate-200',
    interactive: 'bg-white rounded-[24px] border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer',
  };

  return (
    <div
      onClick={onClick}
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
