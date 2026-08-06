import React, { useState } from 'react';
import { 
  Bike, Sparkles, Tag, ChevronDown, ChevronUp, Database, Compass, Gauge, Calendar, Building2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomSelect } from './CustomSelect';
import { getBrandFilterOptions } from '../data/brands';
import { getTopFilterCities } from '../data/cities';

export interface CatalogFiltersProps {
  isRenting?: boolean;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  setSelectedCondition: (val: 'all' | 'ocasión' | 'nueva') => void;
  isKm0: boolean;
  setIsKm0: (val: boolean) => void;
  isOffersOnly: boolean;
  setIsOffersOnly: (val: boolean) => void;
  
  // Standard purchase pricing
  precioDesde?: number;
  setPrecioDesde?: (val: number) => void;
  precioHasta?: number;
  setPrecioHasta?: (val: number) => void;
  
  // Standard purchase displacement (Cilindrada)
  cilindradaDesde?: number;
  setCilindradaDesde?: (val: number) => void;
  cilindradaHasta?: number;
  setCilindradaHasta?: (val: number) => void;
  
  // Common filters
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
  isMobile?: boolean;
  openBottomSheet?: (type: string) => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  isRenting = false,
  selectedBrand,
  setSelectedBrand,
  selectedCondition,
  setSelectedCondition,
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
  getFilterUrl = (_updates?: any) => '#',
  isMobile = false,
  openBottomSheet
}) => {
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    Cilindrada: false,
    Precio: false,
    Estilo: false,
    Kilometraje: false,
    Año: false,
    Ciudad: false
  });

  const selectClassName = "w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-center text-xs font-black text-slate-800 appearance-none outline-none focus:border-[#ff0d41]/50 cursor-pointer transition shadow-xs";

  const accordionConfig = [];

  // 1. Cilindrada Filter
  if (setCilindradaDesde && setCilindradaHasta) {
    accordionConfig.push({
      name: 'Cilindrada',
      icon: <Database className="w-4 h-4 text-slate-800" strokeWidth={2.5} />,
      content: (
        <div className="pt-1 pb-2 text-left space-y-3">
          <div className="grid grid-cols-2 gap-2.5 min-w-0 w-full items-start">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Desde</span>
              {isMobile && openBottomSheet ? (
                <button
                  onClick={() => openBottomSheet('cilindradaDesde')}
                  className={selectClassName}
                >
                  {cilindradaDesde} CC
                </button>
              ) : (
                <CustomSelect
                  value={cilindradaDesde}
                  onChange={(val) => setCilindradaDesde(Number(val))}
                  getOptionUrl={(val) => getFilterUrl({ ccDesde: Number(val) })}
                  options={[
                    { value: 0, label: '0 CC' },
                    { value: 50, label: '50 CC' },
                    { value: 125, label: '125 CC' },
                    { value: 250, label: '250 CC' },
                    { value: 500, label: '500 CC' },
                    { value: 750, label: '750 CC' },
                    { value: 900, label: '900 CC' }
                  ]}
                />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Hasta</span>
              {isMobile && openBottomSheet ? (
                <button
                  onClick={() => openBottomSheet('cilindradaHasta')}
                  className={selectClassName}
                >
                  {cilindradaHasta === 1200 ? '+900 CC' : `${cilindradaHasta} CC`}
                </button>
              ) : (
                <CustomSelect
                  value={cilindradaHasta}
                  onChange={(val) => setCilindradaHasta(Number(val))}
                  getOptionUrl={(val) => getFilterUrl({ ccHasta: Number(val) })}
                  options={[
                    { value: 125, label: '125 CC' },
                    { value: 250, label: '250 CC' },
                    { value: 500, label: '500 CC' },
                    { value: 750, label: '750 CC' },
                    { value: 900, label: '900 CC' },
                    { value: 1200, label: 'Más de 900 CC' }
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )
    });
  }

  // 2. Precio Filter
  if (setPrecioDesde && setPrecioHasta) {
    accordionConfig.push({
      name: 'Precio',
      icon: <span className="font-extrabold text-[12px] text-slate-800 leading-none">S/.</span>,
      content: (
        <div className="pt-1 pb-2 text-left space-y-3">
          <div className="grid grid-cols-2 gap-2.5 min-w-0 w-full items-start">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Desde</span>
              {isMobile && openBottomSheet ? (
                <button
                  onClick={() => openBottomSheet('precioDesde')}
                  className={selectClassName}
                >
                  S/. {precioDesde.toLocaleString('es-PE')}
                </button>
              ) : (
                <CustomSelect
                  value={precioDesde}
                  onChange={(val) => setPrecioDesde(Number(val))}
                  getOptionUrl={(val) => getFilterUrl({ priceDesde: Number(val) })}
                  options={[
                    { value: 0, label: 'S/. 0.00' },
                    { value: 1000, label: 'S/. 1,000.00' },
                    { value: 2000, label: 'S/. 2,000.00' },
                    { value: 3000, label: 'S/. 3,000.00' },
                    { value: 5000, label: 'S/. 5,000.00' },
                    { value: 8000, label: 'S/. 8,000.00' },
                    { value: 10000, label: 'S/. 10,000.00' },
                    { value: 12000, label: 'S/. 12,000.00' },
                    { value: 15000, label: 'S/. 15,000.00' },
                    { value: 18000, label: 'S/. 18,000.00' }
                  ]}
                />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Hasta</span>
              {isMobile && openBottomSheet ? (
                <button
                  onClick={() => openBottomSheet('precioHasta')}
                  className={selectClassName}
                >
                  {precioHasta === 25000 ? '+S/. 18,000' : `S/. ${precioHasta.toLocaleString('es-PE')}`}
                </button>
              ) : (
                <CustomSelect
                  value={precioHasta}
                  onChange={(val) => setPrecioHasta(Number(val))}
                  getOptionUrl={(val) => getFilterUrl({ priceHasta: Number(val) })}
                  options={[
                    { value: 2000, label: 'S/. 2,000.00' },
                    { value: 3000, label: 'S/. 3,000.00' },
                    { value: 5000, label: 'S/. 5,000.00' },
                    { value: 8000, label: 'S/. 8,000.00' },
                    { value: 10000, label: 'S/. 10,000.00' },
                    { value: 12000, label: 'S/. 12,000.00' },
                    { value: 15000, label: 'S/. 15,000.00' },
                    { value: 18000, label: 'S/. 18,000.00' },
                    { value: 25000, label: 'Más de S/. 18,000.00' }
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )
    });
  }

  // 4. Estilo Filter
  accordionConfig.push({
    name: 'Estilo',
    icon: <Compass className="w-4 h-4 text-slate-800" strokeWidth={2.5} />,
    content: (
      <div className="space-y-2 pt-1 pb-2 text-left">
        <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
          {['TRAIL', 'SCOOTER', 'NAKED', 'DEPORTIVA', 'SUPERMOTARD', 'CUSTOM', 'TOURING', 'TRES RUEDAS', 'MAXI SCOOTER', 'CLÁSICA', 'OFF-ROAD'].map((style) => {
            const isChecked = selectedStyles.includes(style);
            const targetUrl = getFilterUrl({ styleToggle: style });
            return (
              <div key={style} className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      setSelectedStyles(selectedStyles.filter(s => s !== style));
                    } else {
                      setSelectedStyles([...selectedStyles, style]);
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-[#ff0d41] focus:ring-[#ff0d41] accent-[#ff0d41] cursor-pointer"
                />
                <a
                  href={targetUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isChecked) {
                      setSelectedStyles(selectedStyles.filter(s => s !== style));
                    } else {
                      setSelectedStyles([...selectedStyles, style]);
                    }
                  }}
                  className="text-[11px] font-bold text-slate-700 tracking-wide uppercase hover:text-[#ff0d41] transition cursor-pointer select-none flex-1 text-left"
                >
                  {style}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    )
  });

  // 5. Kilometraje Filter
  accordionConfig.push({
    name: 'Kilometraje',
    icon: <Gauge className="w-4 h-4 text-slate-800" strokeWidth={2.5} />,
    content: (
      <div className="pt-1 pb-2 text-left space-y-3">
        <div className="grid grid-cols-2 gap-2.5 min-w-0 w-full items-start">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Desde</span>
            {isMobile && openBottomSheet ? (
              <button
                onClick={() => openBottomSheet('kmsDesde')}
                className={selectClassName}
              >
                {kmsDesde.toLocaleString('es-PE')} KM
              </button>
            ) : (
              <CustomSelect
                value={kmsDesde}
                onChange={(val) => setKmsDesde(Number(val))}
                getOptionUrl={(val) => getFilterUrl({ kmsDesde: Number(val) })}
                options={[
                  { value: 0, label: '0 KM' },
                  { value: 1000, label: '1,000 KM' },
                  { value: 5000, label: '5,000 KM' },
                  { value: 10000, label: '10,000 KM' },
                  { value: 20000, label: '20,000 KM' },
                  { value: 30000, label: '30,000 KM' },
                  { value: 40000, label: '40,000 KM' }
                ]}
              />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Hasta</span>
            {isMobile && openBottomSheet ? (
              <button
                onClick={() => openBottomSheet('kmsHasta')}
                className={selectClassName}
              >
                {kmsHasta === 100000 ? '+40,000 KM' : `${kmsHasta.toLocaleString('es-PE')} KM`}
              </button>
            ) : (
              <CustomSelect
                value={kmsHasta}
                onChange={(val) => setKmsHasta(Number(val))}
                getOptionUrl={(val) => getFilterUrl({ kmsHasta: Number(val) })}
                options={[
                  { value: 5000, label: '5,000 KM' },
                  { value: 10000, label: '10,000 KM' },
                  { value: 20000, label: '20,000 KM' },
                  { value: 30000, label: '30,000 KM' },
                  { value: 40000, label: '40,000 KM' },
                  { value: 100000, label: 'Más de 40,000 KM' }
                ]}
              />
            )}
          </div>
        </div>
      </div>
    )
  });

  // 7. Año Filter
  accordionConfig.push({
    name: 'Año',
    icon: <Calendar className="w-4 h-4 text-slate-800" strokeWidth={2.5} />,
    content: (
      <div className="pt-1 pb-2 text-left space-y-3">
        <div className="grid grid-cols-2 gap-2.5 min-w-0 w-full items-start">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Desde</span>
            {isMobile && openBottomSheet ? (
              <button
                onClick={() => openBottomSheet('añoDesde')}
                className={selectClassName}
              >
                {añoDesde}
              </button>
            ) : (
              <CustomSelect
                value={añoDesde}
                onChange={(val) => setAñoDesde(Number(val))}
                getOptionUrl={(val) => getFilterUrl({ añoDesde: Number(val) })}
                options={[
                  { value: 1995, label: '1995' },
                  { value: 2000, label: '2000' },
                  { value: 2005, label: '2005' },
                  { value: 2010, label: '2010' },
                  { value: 2015, label: '2015' },
                  { value: 2018, label: '2018' },
                  { value: 2020, label: '2020' },
                  { value: 2022, label: '2022' },
                  { value: 2024, label: '2024' }
                ]}
              />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider truncate">Hasta</span>
            {isMobile && openBottomSheet ? (
              <button
                onClick={() => openBottomSheet('añoHasta')}
                className={selectClassName}
              >
                {añoHasta}
              </button>
            ) : (
              <CustomSelect
                value={añoHasta}
                onChange={(val) => setAñoHasta(Number(val))}
                getOptionUrl={(val) => getFilterUrl({ añoHasta: Number(val) })}
                options={[
                  { value: 2000, label: '2000' },
                  { value: 2005, label: '2005' },
                  { value: 2010, label: '2010' },
                  { value: 2015, label: '2015' },
                  { value: 2018, label: '2018' },
                  { value: 2020, label: '2020' },
                  { value: 2022, label: '2022' },
                  { value: 2024, label: '2024' },
                  { value: 2026, label: '2026' }
                ]}
              />
            )}
          </div>
        </div>
      </div>
    )
  });

  // 8. Ciudad Filter
  accordionConfig.push({
    name: 'Ciudad',
    icon: <Building2 className="w-4 h-4 text-slate-800" strokeWidth={2.5} />,
    content: (
      <div className="space-y-2 pt-1 pb-2 text-left">
        <div className="space-y-2">
          {getTopFilterCities(7).map((city) => {
            const isChecked = selectedCiudades.includes(city);
            const targetUrl = getFilterUrl({ cityToggle: city });
            return (
              <div key={city} className="flex items-center gap-3 py-1.5 hover:bg-slate-50/50 rounded px-1 transition">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      setSelectedCiudades(selectedCiudades.filter(c => c !== city));
                    } else {
                      setSelectedCiudades([...selectedCiudades, city]);
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-[#ff0d41] focus:ring-[#ff0d41] accent-[#ff0d41] cursor-pointer"
                />
                <a
                  href={targetUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isChecked) {
                      setSelectedCiudades(selectedCiudades.filter(c => c !== city));
                    } else {
                      setSelectedCiudades([...selectedCiudades, city]);
                    }
                  }}
                  className="text-[11px] font-bold text-slate-700 tracking-wide hover:text-[#ff0d41] transition cursor-pointer select-none flex-1 text-left"
                >
                  {city}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    )
  });

  return (
    <div className="space-y-5">
      {/* Title & Clear Filters button on top */}
      {!isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-[17px] font-black text-slate-900 tracking-tight">Filtros</span>
          <button 
            onClick={clearFilters}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-850 hover:underline transition cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Marca Section */}
      <div className="space-y-2.5 text-left">
        <div className="flex items-center gap-2">
          <Bike className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Marca</span>
        </div>
        <div className="relative">
          {isMobile && openBottomSheet ? (
            <button
              onClick={() => openBottomSheet('brand')}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-left text-xs font-bold text-slate-800 outline-none flex items-center justify-between shadow-xs cursor-pointer"
            >
              <span>{selectedBrand === 'all' ? 'Todas las marcas' : selectedBrand.toUpperCase()}</span>
              <ChevronDown className="w-4 h-4 text-slate-550" />
            </button>
          ) : (
            <CustomSelect
              value={selectedBrand}
              onChange={(val) => setSelectedBrand(val)}
              alignText="left"
              className="rounded-xl px-4 py-3 font-bold"
              showSearch={true}
              searchPlaceholder="Filtra..."
              options={getBrandFilterOptions()}
            />
          )}
        </div>
      </div>

      {/* Condición Section */}
      <div className="space-y-2.5 pt-1 text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Condición</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedCondition(selectedCondition === 'ocasión' ? 'all' : 'ocasión')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition border text-center cursor-pointer ${
              selectedCondition === 'ocasión'
                ? 'bg-[#121214] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            Ocasión
          </button>
          <button
            onClick={() => setSelectedCondition(selectedCondition === 'nueva' ? 'all' : 'nueva')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition border text-center cursor-pointer ${
              selectedCondition === 'nueva'
                ? 'bg-[#121214] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            Nueva
          </button>
        </div>
      </div>

      {/* Km 0 Toggle */}
      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Km 0</span>
        </div>
        <button
          onClick={() => setIsKm0(!isKm0)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none ${isKm0 ? 'bg-[#ff0d41]' : 'bg-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform duration-200 ${isKm0 ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Ofertas Toggle */}
      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Ofertas</span>
        </div>
        <button
          onClick={() => setIsOffersOnly(!isOffersOnly)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none ${isOffersOnly ? 'bg-[#ff0d41]' : 'bg-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform duration-200 ${isOffersOnly ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Accordions */}
      {accordionConfig.map((item) => {
        const isExpanded = expandedFilters[item.name];
        return (
          <div key={item.name} className="border-t border-slate-100">
            <button
              onClick={() => setExpandedFilters(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
              className="w-full py-3.5 flex items-center justify-between text-slate-800 select-none cursor-pointer hover:text-black transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-4 h-4 text-slate-800">
                  {item.icon}
                </div>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{item.name}</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#ff0d41]" strokeWidth={2.5} />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-450" strokeWidth={2.5} />
              )}
            </button>
            
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-slate-800">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
