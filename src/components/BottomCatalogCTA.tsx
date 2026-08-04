import React from 'react';

interface BottomCatalogCTAProps {
  onNavigate: (page: string) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  targetPage?: string;
  className?: string;
}

export const BottomCatalogCTA: React.FC<BottomCatalogCTAProps> = ({
  onNavigate,
  title = '¿Quieres dar el salto sobre dos ruedas?',
  description = 'Echa un vistazo a nuestra selección de más de 2.000 motos de ocasión certificadas y encuentra la que mejor se adapte a ti.',
  buttonText = 'VER CATÁLOGO',
  targetPage = 'compra',
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-r from-slate-900 to-[#1e2024] p-8 rounded-3xl text-white relative overflow-hidden flex flex-col sm:flex-row gap-6 justify-between items-center mt-12 shadow-md ${className}`}>
      <div className="text-left space-y-2">
        <h4 className="text-lg font-black tracking-tight leading-tight">
          {title}
        </h4>
        <p className="text-xs text-slate-300 font-medium max-w-md leading-relaxed">
          {description}
        </p>
      </div>
      <button
        onClick={() => onNavigate(targetPage)}
        className="px-6 py-3.5 rounded-xl bg-white text-[#111215] hover:bg-slate-50 font-bold text-xs tracking-widest uppercase transition-all shadow-md shrink-0 cursor-pointer"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BottomCatalogCTA;
