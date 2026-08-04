import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { loadSettingsFromContent, fetchSettingsAsync } from '../../data/staticContent';
import { SITE_CONFIG } from '../../data/siteConfig';

export interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  phone?: string;
  variant?: 'button' | 'outline' | 'floating' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  iconClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
}

export const DEFAULT_WHATSAPP_NUMBER = SITE_CONFIG.whatsapp.phoneNumber; // Perú +51 for Kaelos

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = SITE_CONFIG.whatsapp.defaultMessage,
  label = 'Hablar por WhatsApp',
  phone,
  variant = 'button',
  size = 'md',
  fullWidth = false,
  className = '',
  iconClassName = '',
  onClick,
  ariaLabel = 'Contactar por WhatsApp',
}) => {

  const [dbPhone, setDbPhone] = useState<string | null>(null);

  useEffect(() => {
    async function loadPhone() {
      const s = await fetchSettingsAsync();
      if (s?.whatsappNumber) setDbPhone(s.whatsappNumber);
    }
    loadPhone();
  }, []);

  // Get phone from props, or central DB settings content, or fallback to Peru default
  const settings = loadSettingsFromContent();
  const rawPhone = phone || dbPhone || settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'text-xs py-2 px-3 gap-1.5',
    md: 'text-sm py-2.5 px-4 gap-2',
    lg: 'text-base py-3.5 px-6 gap-2.5 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2 cursor-pointer transition ${className}`}
        aria-label={ariaLabel}
      >
        <MessageCircle className={`${iconSizes} ${iconClassName}`} />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-xs ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
        aria-label={ariaLabel}
      >
        <MessageCircle className={`${iconSizes} ${iconClassName}`} />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'button'
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shadow-md hover:shadow-lg ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={ariaLabel}
    >
      <MessageCircle className={`${iconSizes} ${iconClassName}`} />
      <span>{label}</span>
    </button>
  );
};

export default WhatsAppButton;
