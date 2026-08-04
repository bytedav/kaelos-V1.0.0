import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface CheckoutHeaderProps {
  onBack: () => void;
  orderReference: string;
  className?: string;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  onBack,
  orderReference,
  className = '',
}) => {
  return (
    <header className={`bg-white border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
  
        <div className="text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          Pedido: <span className="font-bold text-slate-800">#{orderReference ? orderReference.replace(/^[#kK-]+/i, '') : ''}</span>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
