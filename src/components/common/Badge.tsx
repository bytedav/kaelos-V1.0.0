import React from 'react';

export type BadgeVariant =
  | 'red'
  | 'brand'
  | 'dark'
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'purple'
  | 'gray'
  | 'glass';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  dot?: boolean;
  dotPulse?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'red',
  size = 'sm',
  pill = false,
  dot = false,
  dotPulse = false,
  icon,
  className = '',
}) => {
  const sizeStyles: Record<BadgeSize, string> = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1 tracking-wider uppercase',
    md: 'px-2.5 py-1 text-xs gap-1.5 tracking-wider uppercase',
    lg: 'px-3 py-1.5 text-xs sm:text-sm gap-2 tracking-wider uppercase',
  };

  const roundedStyle = pill
    ? 'rounded-full'
    : size === 'xs'
    ? 'rounded'
    : size === 'lg'
    ? 'rounded-xl'
    : 'rounded-md';

  const variantStyles: Record<BadgeVariant, string> = {
    red: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-extrabold shadow-2xs',
    brand: 'bg-[#ff0d41]/10 text-[#ff0d41] border border-[#ff0d41]/20 font-black shadow-2xs',
    dark: 'bg-slate-950 text-white border border-slate-900 font-extrabold shadow-2xs',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-extrabold shadow-2xs',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-extrabold shadow-2xs',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200/80 font-extrabold shadow-2xs',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200/80 font-extrabold shadow-2xs',
    gray: 'bg-slate-100/90 text-slate-700 border border-slate-200 font-bold shadow-2xs',
    glass: 'bg-white/90 backdrop-blur-md text-slate-900 border border-white/80 font-black shadow-xs',
  };

  const dotColorStyles: Record<BadgeVariant, string> = {
    red: 'bg-rose-500',
    brand: 'bg-[#ff0d41]',
    dark: 'bg-emerald-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-sky-500',
    purple: 'bg-purple-500',
    gray: 'bg-slate-400',
    glass: 'bg-rose-500',
  };

  return (
    <span
      className={`inline-flex items-center font-sans select-none whitespace-nowrap leading-none transition-all ${roundedStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {dotPulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorStyles[variant]}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColorStyles[variant]}`} />
        </span>
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="inline-block">{children}</span>
    </span>
  );
};

export default Badge;
