import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselArrowsProps {
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  variant?: 'overlay' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

export const CarouselArrows: React.FC<CarouselArrowsProps> = ({
  onPrev,
  onNext,
  disabledPrev = false,
  disabledNext = false,
  className = '',
  buttonClassName = '',
  iconClassName = '',
  variant = 'inline',
  size = 'md',
  prevAriaLabel = 'Anterior',
  nextAriaLabel = 'Siguiente',
}) => {
  const sizeClasses = {
    sm: 'w-7.5 h-7.5',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-9 h-9 sm:w-12 sm:h-12',
  }[size];

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  const baseButtonStyles = `rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-200/80 shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${buttonClassName}`;

  if (variant === 'overlay') {
    return (
      <>
        <button
          type="button"
          onClick={onPrev}
          disabled={disabledPrev}
          className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-10 ${baseButtonStyles}`}
          aria-label={prevAriaLabel}
        >
          <ChevronLeft className={`${iconSizeClasses} ${iconClassName}`} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disabledNext}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-10 ${baseButtonStyles}`}
          aria-label={nextAriaLabel}
        >
          <ChevronRight className={`${iconSizeClasses} ${iconClassName}`} strokeWidth={2} />
        </button>
      </>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onPrev}
        disabled={disabledPrev}
        className={baseButtonStyles}
        aria-label={prevAriaLabel}
      >
        <ChevronLeft className={`${iconSizeClasses} ${iconClassName}`} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabledNext}
        className={baseButtonStyles}
        aria-label={nextAriaLabel}
      >
        <ChevronRight className={`${iconSizeClasses} ${iconClassName}`} strokeWidth={2} />
      </button>
    </div>
  );
};

export default CarouselArrows;
