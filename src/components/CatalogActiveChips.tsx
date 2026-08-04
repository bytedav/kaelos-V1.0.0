import React from 'react';

export interface CatalogActiveChipsProps {
  isRenting: boolean;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  setSelectedCondition: (val: 'all' | 'ocasión' | 'nueva') => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  isKm0: boolean;
  setIsKm0: (val: boolean) => void;
  isOffersOnly: boolean;
  setIsOffersOnly: (val: boolean) => void;
  
  // Purchase only
  precioDesde?: number;
  setPrecioDesde?: (val: number) => void;
  precioHasta?: number;
  setPrecioHasta?: (val: number) => void;
  cilindradaDesde?: number;
  setCilindradaDesde?: (val: number) => void;
  cilindradaHasta?: number;
  setCilindradaHasta?: (val: number) => void;

  // Renting only
  cuotaDesde?: number;
  setCuotaDesde?: (val: number) => void;
  cuotaHasta?: number;
  setCuotaHasta?: (val: number) => void;

  // Common
  selectedStyles: string[];
  setSelectedStyles: (val: string[]) => void;
  kmsDesde: number;
  setKmsDesde: (val: number) => void;
  kmsHasta: number;
  setKmsHasta: (val: number) => void;
  añoDesde: number;
  setAñoDesde: (val: number) => void;
  añoHasta: number;
  setAñoHasta: (val: number) => void;
  selectedCiudades: string[];
  setSelectedCiudades: (val: string[]) => void;
  
  clearFilters: () => void;
  getFilterUrl?: (updates: any) => string;
}

export const CatalogActiveChips: React.FC<CatalogActiveChipsProps> = ({
  isRenting,
  selectedCondition,
  setSelectedCondition,
  selectedBrand,
  setSelectedBrand,
  isKm0,
  setIsKm0,
  isOffersOnly,
  setIsOffersOnly,
  precioDesde = 0,
  setPrecioDesde,
  precioHasta = 25000,
  setPrecioHasta,
  cilindradaDesde = 0,
  setCilindradaDesde,
  cilindradaHasta = 1200,
  setCilindradaHasta,
  cuotaDesde = 0,
  setCuotaDesde,
  cuotaHasta = 300,
  setCuotaHasta,
  selectedStyles,
  setSelectedStyles,
  kmsDesde,
  setKmsDesde,
  kmsHasta,
  setKmsHasta,
  añoDesde,
  setAñoDesde,
  añoHasta,
  setAñoHasta,
  selectedCiudades,
  setSelectedCiudades,
  clearFilters,
  getFilterUrl = (_updates?: any) => '#'
}) => {
  const hasActiveFilters = 
    selectedCondition !== 'all' ||
    selectedBrand !== 'all' ||
    isKm0 ||
    isOffersOnly ||
    (!isRenting && (precioDesde > 0 || precioHasta < 25000)) ||
    (!isRenting && (cilindradaDesde > 0 || cilindradaHasta < 1200)) ||
    (isRenting && (cuotaDesde > 0 || cuotaHasta < 300)) ||
    selectedStyles.length > 0 ||
    kmsDesde > 0 || kmsHasta < 100000 ||
    añoDesde > 1995 || añoHasta < 2026 ||
    selectedCiudades.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {selectedCondition !== 'all' && (
        <a 
          href={getFilterUrl({ condition: 'all' })}
          onClick={(e) => {
            e.preventDefault();
            setSelectedCondition('all');
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>{(selectedCondition as string) === 'segunda-mano' || (selectedCondition as string) === 'ocasion' ? 'Ocasión' : selectedCondition === 'nueva' ? 'Nuevas' : selectedCondition}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}
      
      {selectedBrand !== 'all' && (
        <a 
          href={getFilterUrl({ brand: 'all' })}
          onClick={(e) => {
            e.preventDefault();
            setSelectedBrand('all');
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>{selectedBrand}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {isKm0 && (
        <a 
          href={getFilterUrl({ km0: false })}
          onClick={(e) => {
            e.preventDefault();
            setIsKm0(false);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Km 0</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {isOffersOnly && (
        <a 
          href={getFilterUrl({ offersOnly: false })}
          onClick={(e) => {
            e.preventDefault();
            setIsOffersOnly(false);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Con Oferta</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {!isRenting && setCilindradaDesde && setCilindradaHasta && (cilindradaDesde > 0 || cilindradaHasta < 1200) && (
        <a 
          href={getFilterUrl({ ccDesde: 0, ccHasta: 1200 })}
          onClick={(e) => {
            e.preventDefault();
            setCilindradaDesde(0); 
            setCilindradaHasta(1200);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Cilindrada: {cilindradaDesde} - {cilindradaHasta === 1200 ? '+900' : cilindradaHasta} CC</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {!isRenting && setPrecioDesde && setPrecioHasta && (precioDesde > 0 || precioHasta < 25000) && (
        <a 
          href={getFilterUrl({ priceDesde: 0, priceHasta: 25000 })}
          onClick={(e) => {
            e.preventDefault();
            setPrecioDesde(0); 
            setPrecioHasta(25000);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Precio: S/. {precioDesde.toLocaleString('en-US', { minimumFractionDigits: 2 })} - {precioHasta === 25000 ? '+S/. 18,000.00' : `S/. ${precioHasta.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {isRenting && setCuotaDesde && setCuotaHasta && (cuotaDesde > 0 || cuotaHasta < 300) && (
        <a 
          href={getFilterUrl({ cuotaDesde: 0, cuotaHasta: 300 })}
          onClick={(e) => {
            e.preventDefault();
            setCuotaDesde(0); 
            setCuotaHasta(300);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Cuota: S/. {cuotaDesde.toLocaleString('en-US', { minimumFractionDigits: 2 })} - {cuotaHasta === 300 ? '+S/. 250.00' : `S/. ${cuotaHasta.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}/mes</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {selectedStyles.map(style => (
        <a 
          key={style}
          href={getFilterUrl({ styleRemoved: style })}
          onClick={(e) => {
            e.preventDefault();
            setSelectedStyles(selectedStyles.filter(s => s !== style));
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>{style}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      ))}

      {(kmsDesde > 0 || kmsHasta < 100000) && (
        <a 
          href={getFilterUrl({ kmsDesde: 0, kmsHasta: 100000 })}
          onClick={(e) => {
            e.preventDefault();
            setKmsDesde(0); 
            setKmsHasta(100000);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>KM: {kmsDesde.toLocaleString('es-ES')} - {kmsHasta === 100000 ? '+40.000' : kmsHasta.toLocaleString('es-ES')}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {(añoDesde > 1995 || añoHasta < 2026) && (
        <a 
          href={getFilterUrl({ añoDesde: 1995, añoHasta: 2026 })}
          onClick={(e) => {
            e.preventDefault();
            setAñoDesde(1995); 
            setAñoHasta(2026);
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>Año: {añoDesde} - {añoHasta}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      )}

      {selectedCiudades.map(city => (
        <a 
          key={city}
          href={getFilterUrl({ cityRemoved: city })}
          onClick={(e) => {
            e.preventDefault();
            setSelectedCiudades(selectedCiudades.filter(c => c !== city));
          }}
          className="bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-xs transition select-none hover:bg-slate-200/50 hover:border-slate-300"
        >
          <span>{city}</span>
          <span className="w-4 h-4 rounded-full bg-slate-900 hover:bg-black text-white text-[9px] font-black flex items-center justify-center transition shrink-0">
            ×
          </span>
        </a>
      ))}

      {hasActiveFilters && (
        <a 
          href={getFilterUrl({
            condition: 'all',
            brand: 'all',
            km0: false,
            offersOnly: false,
            ccDesde: 0,
            ccHasta: 1200,
            priceDesde: 0,
            priceHasta: 25000,
            cuotaDesde: 0,
            cuotaHasta: 300,
            kmsDesde: 0,
            kmsHasta: 100000,
            añoDesde: 1995,
            añoHasta: 2026
          })}
          onClick={(e) => {
            e.preventDefault();
            clearFilters();
          }}
          className="text-xs font-bold text-[#ff0d41] hover:underline cursor-pointer px-1.5 py-1"
        >
          Borrar todos
        </a>
      )}
    </div>
  );
};
