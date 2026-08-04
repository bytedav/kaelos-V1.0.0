import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  requiredMark?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  prefixText,
  leftIcon,
  rightIcon,
  error,
  helperText,
  requiredMark = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-slate-700 font-bold text-xs uppercase tracking-wider block">
          {label} {requiredMark && <span className="text-brand-red">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {prefixText && (
          <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-700 flex items-center select-none shrink-0">
            {prefixText}
          </span>
        )}

        {leftIcon && !prefixText && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none shrink-0">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red 
            transition-all duration-200 py-3 text-sm
            ${prefixText ? 'rounded-r-xl px-4' : ''}
            ${!prefixText && leftIcon ? 'pl-10 pr-4 rounded-xl' : ''}
            ${!prefixText && !leftIcon ? 'px-4 rounded-xl' : ''}
            ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3.5 text-slate-400 pointer-events-none shrink-0">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400 font-medium">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
