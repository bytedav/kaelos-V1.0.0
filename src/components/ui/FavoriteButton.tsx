import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export interface FavoriteButtonProps {
  bikeId?: string;
  isFavorite?: boolean;
  onToggle?: (id: string, e: React.MouseEvent) => void;
  favoritesCount?: number;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  savedText?: string;
  unsavedText?: string;
  className?: string;
  iconClassName?: string;
  variant?: 'icon' | 'badge' | 'button' | 'header';
  ariaLabel?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  bikeId = '',
  isFavorite = false,
  onToggle,
  favoritesCount,
  onClick,
  size = 'md',
  showText = false,
  savedText = 'Guardado',
  unsavedText = 'Guardar',
  className = '',
  iconClassName = '',
  variant = 'icon',
  ariaLabel,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (onClick) {
      onClick(e);
    } else if (onToggle && bikeId) {
      onToggle(bikeId, e);
    }
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }[size];

  // If variant is 'header' or if favoritesCount is provided
  if (variant === 'header' || typeof favoritesCount === 'number') {
    const count = favoritesCount || 0;
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`relative flex items-center justify-center p-2 rounded-full transition-all hover:bg-slate-100/80 cursor-pointer text-slate-700 active:scale-95 ${className}`}
        aria-label={ariaLabel || `Ver favoritos (${count})`}
      >
        <Heart className={`${iconSizes} ${count > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-700'} ${iconClassName}`} strokeWidth={2} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#ff0d41] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
            {count}
          </span>
        )}
      </button>
    );
  }

  const heartFill = isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-rose-500';
  const animClass = isAnimating ? 'scale-125' : 'scale-100';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-90 ${className}`}
      aria-label={ariaLabel || (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos')}
    >
      <Heart
        className={`${iconSizes} ${heartFill} transition-transform duration-200 ${animClass} ${iconClassName}`}
        strokeWidth={2}
      />
      {showText && (
        <span className="text-xs font-semibold">
          {isFavorite ? savedText : unsavedText}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
