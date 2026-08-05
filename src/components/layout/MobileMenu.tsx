import React, { useState } from 'react';
import { 
  X, 
  ChevronDown,
  Truck,
  Wrench,
  PackagePlus,
  MapPin,
  ShieldCheck,
  FileText,
  Store
} from 'lucide-react';
import { navigateTo } from '../../utils/router';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  handleParentMenuClick: (menu: any, filterInfo?: any) => void;
  selectedStyles?: string[];
  selectedCondition?: 'all' | 'ocasión' | 'nueva';
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activePage,
  handleParentMenuClick,
  selectedStyles = [],
  selectedCondition = 'all',
}) => {
  const [serviciosOpen, setServiciosOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white z-[100] flex flex-col font-sans animate-fade-in text-slate-950 overflow-hidden" 
      style={{ height: '100dvh' }}
    >
      {/* Header del Drawer */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 shrink-0 bg-white z-10">
        {/* Logo de Kaelos con "kae" en rojo y "los" en negro */}
        <button 
          onClick={() => {
            navigateTo('/');
            handleParentMenuClick('home');
          }}
          className="flex items-center gap-0.5 select-none text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-baseline tracking-tight leading-none select-none font-sans font-black text-2xl">
            <span className="text-[#ff0d41]">kae</span>
            <span className="text-slate-950">los</span>
          </div>
        </button>

        <button 
          onClick={onClose}
          className="text-slate-800 p-2 hover:bg-slate-100 rounded-full transition shrink-0 cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-6.5 h-6.5 text-[#121212]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Listado Vertical Exacto de Categorías */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 pb-16 flex flex-col space-y-6">
        
        {/* Compra */}
        <div className="space-y-3">
          <button 
            onClick={() => {
              navigateTo('/motos');
              handleParentMenuClick('compra', { filterType: 'condition', value: 'all', condition: 'all' });
            }}
            className={`w-full text-left text-[16px] font-bold transition cursor-pointer ${
              activePage === 'compra' && !(selectedStyles.length === 1 && selectedStyles[0]?.toUpperCase() === 'SCOOTER') ? 'text-[#ff0d41]' : 'text-slate-900 hover:text-[#ff0d41]'
            }`}
          >
            Compra
          </button>
          <div className="pl-6 flex flex-col space-y-3">
            <button 
              onClick={() => {
                navigateTo('/motos?condicion=ocasion');
                handleParentMenuClick('compra', { filterType: 'condition', value: 'ocasión', condition: 'ocasión' });
              }}
              className={`w-full text-left text-[14.5px] font-medium transition cursor-pointer ${
                activePage === 'compra' && selectedCondition === 'ocasión' ? 'text-[#ff0d41] font-bold' : 'text-slate-600 hover:text-[#ff0d41]'
              }`}
            >
              Motos ocasión
            </button>
            <button 
              onClick={() => {
                navigateTo('/motos?condicion=nuevo');
                handleParentMenuClick('compra', { filterType: 'condition', value: 'nueva', condition: 'nueva' });
              }}
              className={`w-full text-left text-[14.5px] font-medium transition cursor-pointer ${
                activePage === 'compra' && selectedCondition === 'nueva' && !(selectedStyles.length === 1 && selectedStyles[0]?.toUpperCase() === 'SCOOTER') ? 'text-[#ff0d41] font-bold' : 'text-slate-600 hover:text-[#ff0d41]'
              }`}
            >
              Motos nuevas
            </button>
          </div>
        </div>

        {/* Scooters Direct Shortcut */}
        <div>
          <button 
            onClick={() => {
              navigateTo('/motos/scooters?condicion=nuevo');
              handleParentMenuClick('compra', { filterType: 'style', value: 'SCOOTER', condition: 'nueva' });
            }}
            className={`w-full text-left text-[16px] font-bold transition py-1 cursor-pointer
              ${activePage === 'compra' && selectedCondition === 'nueva' && selectedStyles.length === 1 && selectedStyles[0]?.toUpperCase() === 'SCOOTER' ? 'text-[#ff0d41]' : 'text-slate-900 hover:text-[#ff0d41]'}
            `}
          >
            Scooters
          </button>
        </div>

        {/* Vende */}
        <div>
          <button 
            onClick={() => {
              navigateTo('/vender-mi-moto');
              handleParentMenuClick('vende');
            }}
            className={`w-full text-left text-[16px] font-bold transition py-1 cursor-pointer
              ${activePage === 'vende' ? 'text-[#ff0d41]' : 'text-slate-900 hover:text-[#ff0d41]'}
            `}
          >
            Vende
          </button>
        </div>

        {/* Financiación */}
        <div>
          <button 
            onClick={() => {
              navigateTo('/financiacion');
              handleParentMenuClick('financiacion');
            }}
            className={`w-full text-left text-[16px] font-bold transition py-1 cursor-pointer
              ${activePage === 'financiacion' ? 'text-[#ff0d41]' : 'text-slate-900 hover:text-[#ff0d41]'}
            `}
          >
            Financiación
          </button>
        </div>

        {/* Servicios */}
        <div className="space-y-3">
          <button 
            onClick={() => setServiciosOpen(!serviciosOpen)}
            className="w-full flex items-center justify-between text-left text-[16px] font-bold text-slate-900 hover:text-[#ff0d41] transition cursor-pointer py-1"
          >
            <span>Servicios</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${serviciosOpen ? 'rotate-180 text-[#ff0d41]' : 'text-slate-400'}`} />
          </button>
          {serviciosOpen && (
            <div className="pl-4 flex flex-col space-y-3.5 pt-1">
              {[
                { title: 'Transportamos tu moto', icon: Truck, target: 'transporte', href: '/transporte' },
                { title: 'Mantenemos tu moto', icon: Wrench, target: 'mantenimiento', href: '/mantenimiento' },
                { title: 'Maletas y accesorios', icon: PackagePlus, target: 'equipamiento', href: '/equipamiento' },
                { title: 'Localizador GPS', icon: MapPin, target: 'localizador', href: '/localizador' },
                { title: 'Aseguramos tu moto', icon: ShieldCheck, target: 'seguros', href: '/seguros' },
                { title: 'Trámites documentales', icon: FileText, target: 'tramites-documentales', href: '/tramites-documentales' },
                { title: 'Visita nuestras tiendas', icon: Store, target: 'contacto', href: '/contacto' },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => {
                      onClose();
                      if (item.href) {
                        navigateTo(item.href);
                      }
                      handleParentMenuClick(item.target);
                    }}
                    className="flex items-center gap-3.5 text-[14.5px] font-medium text-slate-700 hover:text-[#ff0d41] transition text-left cursor-pointer"
                  >
                    <IconComp className="w-4.5 h-4.5 text-slate-700 shrink-0" strokeWidth={2} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Preguntas frecuentes */}
        <div>
          <button 
            onClick={() => {
              navigateTo('/preguntas-frecuentes');
              handleParentMenuClick('preguntas-frecuentes');
            }}
            className={`w-full text-left text-[16px] font-bold transition py-1 cursor-pointer
              ${activePage === 'preguntas-frecuentes' ? 'text-[#ff0d41]' : 'text-slate-900 hover:text-[#ff0d41]'}
            `}
          >
            Preguntas frecuentes
          </button>
        </div>

      </div>

    </div>
  );
};
