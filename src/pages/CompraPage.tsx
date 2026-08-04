import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, ChevronDown, ChevronUp, ArrowRight, X, Bell, Search } from 'lucide-react';
import { CatalogFilters } from '../components/CatalogFilters';
import { CatalogActiveChips } from '../components/CatalogActiveChips';
import { CatalogGrid } from '../components/CatalogGrid';
import { sortOptions } from '../hooks/useBikeFilters';
import { motorbikesData } from '../data/motorbikesData';
import { SearchBar } from '../components/SearchBar';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';


interface CompraPageProps {
  // Filter states
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  setSelectedCondition: (cond: 'all' | 'ocasión' | 'nueva') => void;
  isKm0: boolean;
  setIsKm0: (val: boolean) => void;
  isOffersOnly: boolean;
  setIsOffersOnly: (val: boolean) => void;
  innerSearchQuery: string;
  setInnerSearchQuery: (q: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (open: boolean) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  cilindradaDesde: number;
  setCilindradaDesde: (v: number) => void;
  cilindradaHasta: number;
  setCilindradaHasta: (v: number) => void;
  precioDesde: number;
  setPrecioDesde: (v: number) => void;
  precioHasta: number;
  setPrecioHasta: (v: number) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  kmsDesde: number;
  setKmsDesde: (v: number) => void;
  kmsHasta: number;
  setKmsHasta: (v: number) => void;
  añoDesde: number;
  setAñoDesde: (v: number) => void;
  añoHasta: number;
  setAñoHasta: (v: number) => void;
  selectedCiudades: string[];
  setSelectedCiudades: (ciudades: string[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Data & helper functions
  sortedBikes: any[];
  isGridLoading: boolean;
  favorites: string[];
  reservedBikeIds?: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  setSelectedDetailedBike: (bike: any) => void;
  setIsRentingDetail: (val: boolean) => void;
  setActivePage: (page: string) => void;
  handleParentMenuClick: (page: string) => void;
  getFilterUrl: (overrides?: any) => string;
  openBottomSheet: (type: string) => void;
  getPageTitle: () => string;
}

export const CompraPage: React.FC<CompraPageProps> = ({
  selectedBrand,
  setSelectedBrand,
  selectedCondition,
  setSelectedCondition,
  isKm0,
  setIsKm0,
  isOffersOnly,
  setIsOffersOnly,
  innerSearchQuery,
  setInnerSearchQuery,
  selectedSort,
  setSelectedSort,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  currentPage,
  setCurrentPage,
  cilindradaDesde,
  setCilindradaDesde,
  cilindradaHasta,
  setCilindradaHasta,
  precioDesde,
  setPrecioDesde,
  precioHasta,
  setPrecioHasta,
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
  hasActiveFilters,
  sortedBikes,
  isGridLoading,
  favorites,
  reservedBikeIds = [],
  toggleFavorite,
  setSelectedDetailedBike,
  setIsRentingDetail,
  setActivePage,
  handleParentMenuClick,
  getFilterUrl,
  openBottomSheet,
  getPageTitle,
}) => {
  // Scroll to top when filters or pagination change to prevent bottom jump
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    selectedBrand,
    selectedCondition,
    isKm0,
    isOffersOnly,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    currentPage,
    selectedStyles.join(','),
    selectedCiudades.join(','),
  ]);

  return (
    <div className="bg-[#fbfbfc] min-h-[calc(100vh-4rem)] relative">
      <WhatsAppButton 
                    variant="floating" 
                    message="Hola, estoy interesado en Comprar una moto con Kaelos."
                    ariaLabel="Consultar financiación por WhatsApp"
                  />
      
      {/* Main content grid: sidebar (left) and grid (right) */}
      <div className="w-full flex flex-col lg:flex-row">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] px-6 py-8 space-y-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar rounded-none border-t-0 border-b-0 border-l-0">
          <CatalogFilters
            isRenting={false}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            isKm0={isKm0}
            setIsKm0={setIsKm0}
            isOffersOnly={isOffersOnly}
            setIsOffersOnly={setIsOffersOnly}
            precioDesde={precioDesde}
            setPrecioDesde={setPrecioDesde}
            precioHasta={precioHasta}
            setPrecioHasta={setPrecioHasta}
            cilindradaDesde={cilindradaDesde}
            setCilindradaDesde={setCilindradaDesde}
            cilindradaHasta={cilindradaHasta}
            setCilindradaHasta={setCilindradaHasta}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
            kmsDesde={kmsDesde}
            setKmsDesde={setKmsDesde}
            kmsHasta={kmsHasta}
            setKmsHasta={setKmsHasta}
            añoDesde={añoDesde}
            setAñoDesde={setAñoDesde}
            añoHasta={añoHasta}
            setAñoHasta={setAñoHasta}
            selectedCiudades={selectedCiudades}
            setSelectedCiudades={setSelectedCiudades}
            clearFilters={clearFilters}
            getFilterUrl={getFilterUrl}
          />
        </aside>

        {/* MAIN CATALOG AREA */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-4 sm:pb-8 space-y-4">
          
          {/* Title (Not sticky) */}
          <h1 className="text-xl sm:text-[22px] font-semibold text-slate-900 font-sans tracking-tight leading-none mt-1">
            {getPageTitle()}
          </h1>

          {/* Sticky Header and Filter controls container */}
          <div className="sticky top-14 sm:top-16 z-30 bg-[#fbfbfc]/95 backdrop-blur-md py-2 sm:py-2.5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200/50 shadow-xs transition-all duration-200">
            {/* Search & Sort Row */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-center justify-between">
              {/* Search input component */}
              <SearchBar
                value={innerSearchQuery}
                onChange={setInnerSearchQuery}
                placeholder="Buscar modelos, estilos, cilindradas..."
                className="w-full sm:max-w-xl md:max-w-2xl"
              />

              {/* Sort selector & Mobile filter trigger */}
              <div className="flex items-center gap-3 justify-between w-full sm:w-auto shrink-0">
                {/* Mobile filters button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  <span>Filtros</span>
                </button>

                {/* Orden: selector */}
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="text-slate-500 font-medium whitespace-nowrap">Orden:</span>
                  <div className="relative z-50">
                    <button
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          openBottomSheet('sort');
                        } else {
                          setIsSortDropdownOpen(!isSortDropdownOpen);
                        }
                      }}
                      className="bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-900 outline-none cursor-pointer shadow-xs hover:border-slate-300 transition flex items-center justify-between gap-2.5 min-w-[155px]"
                    >
                      <span>{sortOptions.find(o => o.id === selectedSort)?.label || 'Recomendadas'}</span>
                      <ChevronDown className={`absolute right-3.5 top-[12px] w-3.5 h-3.5 text-slate-600 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                    </button>

                    {isSortDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40 hidden lg:block" onClick={() => setIsSortDropdownOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-3xl shadow-xl z-50 flex flex-col py-2 animate-fade-in hidden lg:flex">
                          {/* Up Arrow Indicator */}
                          <div className="flex justify-center items-center py-0.5 text-slate-400">
                            <ChevronUp className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                          
                          {/* Scrollable List */}
                          <div className="max-h-[220px] overflow-y-auto custom-sort-scrollbar py-0.5">
                            {sortOptions.map((opt) => {
                              const isSelected = selectedSort === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setSelectedSort(opt.id);
                                    setIsSortDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-5 py-2.5 text-xs transition-colors block cursor-pointer ${
                                    isSelected 
                                      ? 'text-slate-950 font-black bg-slate-50/80' 
                                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50 font-medium'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Down Arrow Indicator */}
                          <div className="flex justify-center items-center py-0.5 text-slate-400">
                            <ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Chips Row */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <CatalogActiveChips
                  isRenting={false}
                  selectedCondition={selectedCondition}
                  setSelectedCondition={setSelectedCondition}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  isKm0={isKm0}
                  setIsKm0={setIsKm0}
                  isOffersOnly={isOffersOnly}
                  setIsOffersOnly={setIsOffersOnly}
                  precioDesde={precioDesde}
                  setPrecioDesde={setPrecioDesde}
                  precioHasta={precioHasta}
                  setPrecioHasta={setPrecioHasta}
                  cilindradaDesde={cilindradaDesde}
                  setCilindradaDesde={setCilindradaDesde}
                  cilindradaHasta={cilindradaHasta}
                  setCilindradaHasta={setCilindradaHasta}
                  selectedStyles={selectedStyles}
                  setSelectedStyles={setSelectedStyles}
                  kmsDesde={kmsDesde}
                  setKmsDesde={setKmsDesde}
                  kmsHasta={kmsHasta}
                  setKmsHasta={setKmsHasta}
                  añoDesde={añoDesde}
                  setAñoDesde={setAñoDesde}
                  añoHasta={añoHasta}
                  setAñoHasta={setAñoHasta}
                  selectedCiudades={selectedCiudades}
                  setSelectedCiudades={setSelectedCiudades}
                  clearFilters={clearFilters}
                  getFilterUrl={getFilterUrl}
                />
              </div>
            )}

            {/* Counts */}
            <div className="text-xs sm:text-sm text-slate-500 font-medium tracking-tight mt-1">
              Mostrando {sortedBikes.length} {sortedBikes.length === 1 ? 'moto' : 'motos'}
            </div>
          </div>

          {/* Grid and pagination using unified CatalogGrid */}
          <CatalogGrid
            bikes={sortedBikes}
            isRenting={false}
            favorites={favorites}
            reservedBikeIds={reservedBikeIds}
            onToggleFavorite={toggleFavorite}
            onSelect={(m) => {
              const found = sortedBikes.find(b => b.id === m.id) || motorbikesData.find(b => b.id === m.id);
              if (found) {
                setSelectedDetailedBike(found);
                setIsRentingDetail(false);
                setActivePage('moto');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
            isGridLoading={isGridLoading}
            clearFilters={clearFilters}
            handleParentMenuClick={handleParentMenuClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

        </main>

      </div>

      {/* Mobile Sidebar Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden flex items-end justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-full bg-white rounded-t-[32px] shadow-2xl flex flex-col z-10 max-h-[85vh] border-t border-slate-100"
            >
              {/* Pull-to-dismiss drag handle indicator */}
              <div className="flex justify-center py-3 shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              {/* Fixed Header */}
              <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-black text-slate-900 tracking-tight">Filtros</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline transition uppercase tracking-wider"
                  >
                    Limpiar todo
                  </button>
                  <button 
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <CatalogFilters
                  isRenting={false}
                  isMobile={true}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  selectedCondition={selectedCondition}
                  setSelectedCondition={setSelectedCondition}
                  isKm0={isKm0}
                  setIsKm0={setIsKm0}
                  isOffersOnly={isOffersOnly}
                  setIsOffersOnly={setIsOffersOnly}
                  precioDesde={precioDesde}
                  setPrecioDesde={setPrecioDesde}
                  precioHasta={precioHasta}
                  setPrecioHasta={setPrecioHasta}
                  cilindradaDesde={cilindradaDesde}
                  setCilindradaDesde={setCilindradaDesde}
                  cilindradaHasta={cilindradaHasta}
                  setCilindradaHasta={setCilindradaHasta}
                  selectedStyles={selectedStyles}
                  setSelectedStyles={setSelectedStyles}
                  kmsDesde={kmsDesde}
                  setKmsDesde={setKmsDesde}
                  kmsHasta={kmsHasta}
                  setKmsHasta={setKmsHasta}
                  añoDesde={añoDesde}
                  setAñoDesde={setAñoDesde}
                  añoHasta={añoHasta}
                  setAñoHasta={setAñoHasta}
                  selectedCiudades={selectedCiudades}
                  setSelectedCiudades={setSelectedCiudades}
                  clearFilters={clearFilters}
                  getFilterUrl={getFilterUrl}
                />
              </div>

              {/* Fixed Bottom Action Footer */}
              <div className="p-4 pb-6 border-t border-slate-100 bg-white shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.03)]">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-[#121214] hover:bg-black text-white text-xs font-black py-3.5 rounded-xl transition shadow-md tracking-wider uppercase"
                >
                  VER {sortedBikes.length} MOTOS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompraPage;
