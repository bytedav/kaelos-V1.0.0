import React from 'react';
import { SearchBar } from '../SearchBar';
import { navigateTo } from '../../utils/router';
import { 
  ChevronDown, 
  Search, 
  Menu, 
  X,
  Truck,
  Wrench,
  PackagePlus,
  MapPin,
  ShieldCheck,
  FileText,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FavoriteButton } from '../ui/FavoriteButton';

export interface HeaderProps {
  activePage: string;
  isHeaderGlass: boolean;
  showNav?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[];
  hoveredMenu: 'compra' | 'servicios' | null;
  setHoveredMenu: (menu: 'compra' | 'servicios' | null) => void;
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleParentMenuClick: (menu: any, filterInfo?: any, preserveSearch?: boolean) => void;
  getFilterUrl: (updates?: any) => string;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  setSelectedCondition: (cond: 'all' | 'ocasión' | 'nueva') => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  cilindradaDesde: number;
  setCilindradaDesde: (val: number) => void;
  cilindradaHasta: number;
  setCilindradaHasta: (val: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  isHeaderGlass,
  showNav = true,
  searchQuery,
  setSearchQuery,
  favorites,
  hoveredMenu,
  setHoveredMenu,
  isMobileSearchOpen,
  setIsMobileSearchOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleParentMenuClick,
  getFilterUrl,
  selectedCondition,
  setSelectedCondition,
  selectedStyles,
  setSelectedStyles,
  selectedBrand,
  setSelectedBrand,
  cilindradaDesde,
  setCilindradaDesde,
  cilindradaHasta,
  setCilindradaHasta,
}) => {
  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isHeaderGlass ? 'bg-black/10 backdrop-blur-[6px] border-b border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_30px_rgba(0,0,0,0.15)]' : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 relative">
        
        {/* 1. Logo de Kaelos */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => handleParentMenuClick('home')}
            className="flex items-center gap-0.5 select-none transition-opacity hover:opacity-95 text-left focus:outline-none cursor-pointer"
          >
            {/* Styled text logo */}
            <div className="flex items-baseline tracking-tight leading-none select-none font-sans font-black text-2xl sm:text-3xl">
              <span className={`${!isHeaderGlass ? 'text-[#ff0d41]' : 'text-white'} transition-colors duration-300`}>kae</span>
              <span className={`${!isHeaderGlass ? 'text-slate-950' : 'text-white'} transition-colors duration-300`}>los</span>
            </div>
          </button>
        </div>

        {showNav && (
          <>
            {/* 2. Buscador de Motos */}
            {activePage !== 'compra' && activePage !== 'moto' && activePage !== 'blog' && (
              <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md items-center relative pl-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={() => handleParentMenuClick('compra', undefined, true)}
                  placeholder="¿Qué moto estás buscando?"
                  variant={isHeaderGlass ? 'header-glass' : 'header'}
                  className="w-full"
                />
              </div>
            )}

            {/* 3. Menú de Navegación Derecho con HOVER inteligente + CLICK */}
            <nav className={`hidden lg:flex items-center gap-5 xl:gap-7 font-sans h-full transition-colors duration-300
              ${!isHeaderGlass ? 'text-slate-800' : 'text-white'}
            `}>
              
              {/* COMPRA */}
              <div 
                id="menu-compra"
                className="h-full flex items-center"
                onMouseEnter={() => setHoveredMenu('compra')}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <a 
                  href="/motos"
                  onClick={(e) => { e.preventDefault(); handleParentMenuClick('compra'); }}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition py-2 cursor-pointer
                    ${activePage === 'compra' && !(selectedStyles.length === 1 && selectedStyles[0]?.toUpperCase() === 'SCOOTER')
                      ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                      : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                    }
                  `}
                >
                  <span>Compra</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                    ${hoveredMenu === 'compra' ? 'rotate-180' : ''}
                    ${!isHeaderGlass 
                      ? (activePage === 'compra' ? 'text-[#ff0d41]' : 'text-slate-400 group-hover:text-[#ff0d41]') 
                      : (activePage === 'compra' ? 'text-white' : 'text-[#a1d7fb] group-hover:text-white')
                    }
                  `} />
                </a>

                {/* VENTANA FLOTANTE: COMPRA MEGAMENU */}
                <AnimatePresence>
                  {hoveredMenu === 'compra' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-[85%] left-4 right-4 max-w-[840px] mx-auto mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-6 z-50 text-slate-800"
                    >
                      {/* Botones de Pastillas Superiores */}
                      <div className="flex gap-3 mb-5">
                        <a 
                          href={getFilterUrl({ condition: 'ocasión' })}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCondition('ocasión');
                            const targetUrl = getFilterUrl({ condition: 'ocasión' });
                            navigateTo(targetUrl);
                            handleParentMenuClick('compra');
                          }}
                          className={`text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-sm inline-block text-center ${
                            selectedCondition === 'ocasión'
                              ? 'bg-[#ff0d41] text-white ring-2 ring-[#ff0d41] ring-offset-1'
                              : 'bg-[#222222] hover:bg-[#111111] text-white'
                          }`}
                        >
                          Motos ocasión
                        </a>
                        <a 
                          href={getFilterUrl({ condition: 'nueva' })}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCondition('nueva');
                            const targetUrl = getFilterUrl({ condition: 'nueva' });
                            navigateTo(targetUrl);
                            handleParentMenuClick('compra');
                          }}
                          className={`text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-sm inline-block text-center ${
                            selectedCondition === 'nueva'
                              ? 'bg-[#ff0d41] text-white ring-2 ring-[#ff0d41] ring-offset-1'
                              : 'bg-[#222222] hover:bg-[#111111] text-white'
                          }`}
                        >
                          Motos nuevas
                        </a>
                      </div>

                      {/* Separador de Línea Gris Sutil */}
                      <div className="w-full h-px bg-slate-100 mb-5" />

                      {/* Grid de 3 Columnas de Categorías */}
                      <div className="grid grid-cols-3 gap-6">
                        
                        {/* COLUMNA 1: Estilos */}
                        <div className="space-y-2.5">
                          <div className="pb-1 border-b border-slate-100">
                            <h3 className="font-display font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                              Estilos
                            </h3>
                          </div>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[13px] text-slate-600 font-semibold">
                            {['Scooter', 'Naked', 'Deportiva', 'Trail', 'Touring', 'Custom', 'Clásica', 'Off-road', 'Maxi Scooter', 'Supermotard', 'Tres ruedas'].map((style) => {
                              const targetUrl = getFilterUrl({ styleAdded: style.toUpperCase() });
                              const isSelected = selectedStyles.includes(style.toUpperCase());
                              return (
                                <li key={style}>
                                  <a 
                                    href={targetUrl}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedStyles([style.toUpperCase()]);
                                      navigateTo(targetUrl);
                                      handleParentMenuClick('compra');
                                    }}
                                    className={`transition duration-120 block text-left w-full truncate py-0.5 cursor-pointer ${
                                      isSelected ? 'text-[#ff0d41] font-extrabold' : 'hover:text-[#ff0d41] text-slate-600'
                                    }`}
                                  >
                                    {style}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* COLUMNA 2: Marcas Populares */}
                        <div className="space-y-2.5">
                          <div className="pb-1 border-b border-slate-100">
                            <h3 className="font-display font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                              Marcas Populares
                            </h3>
                          </div>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[13px] text-slate-600 font-semibold">
                            {['BMW', 'Honda', 'Harley-Davidson', 'Ducati', 'KTM', 'Yamaha', 'Suzuki', 'Kawasaki', 'Kymco', 'Benelli'].map((brand) => {
                              const targetUrl = getFilterUrl({ brand: brand });
                              const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                              return (
                                <li key={brand}>
                                  <a 
                                    href={targetUrl}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedBrand(brand);
                                      navigateTo(targetUrl);
                                      handleParentMenuClick('compra');
                                    }}
                                    className={`transition duration-120 block text-left w-full truncate py-0.5 cursor-pointer ${
                                      isSelected ? 'text-[#ff0d41] font-extrabold' : 'hover:text-[#ff0d41] text-slate-600'
                                    }`}
                                  >
                                    {brand}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* COLUMNA 3: Cilindrada */}
                        <div className="space-y-2.5">
                          <div className="pb-1 border-b border-slate-100">
                            <h3 className="font-display font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                              Cilindrada
                            </h3>
                          </div>
                          <ul className="space-y-1 text-xs sm:text-[13px] text-slate-600 font-semibold">
                            {[
                              { label: '50 CC', desde: 0, hasta: 50 },
                              { label: '125 CC', desde: 0, hasta: 125 },
                              { label: '250 CC', desde: 126, hasta: 250 },
                              { label: '500 CC', desde: 251, hasta: 500 },
                              { label: 'Más', desde: 501, hasta: 1200 }
                            ].map((item) => {
                              const targetUrl = getFilterUrl({ ccDesde: item.desde, ccHasta: item.hasta });
                              const isSelected = cilindradaDesde === item.desde && cilindradaHasta === item.hasta;
                              return (
                                <li key={item.label}>
                                  <a 
                                    href={targetUrl}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCilindradaDesde(item.desde);
                                      setCilindradaHasta(item.hasta);
                                      navigateTo(targetUrl);
                                      handleParentMenuClick('compra');
                                    }}

                                    className={`transition duration-120 block text-left w-full truncate py-0.5 cursor-pointer ${
                                      isSelected ? 'text-[#ff0d41] font-extrabold' : 'hover:text-[#ff0d41] text-slate-600'
                                    }`}
                                  >
                                    {item.label}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SCOOTERS */}
              <a 
                href="/motos/scooters?condicion=nuevo"
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigateTo('/motos/scooters?condicion=nuevo');
                  handleParentMenuClick('compra', { filterType: 'style', value: 'SCOOTER', condition: 'nueva' }); 
                }}
                className={`text-sm font-semibold transition duration-150 cursor-pointer py-2
                  ${activePage === 'compra' && selectedCondition === 'nueva' && selectedStyles.length === 1 && selectedStyles[0]?.toUpperCase() === 'SCOOTER'
                    ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                    : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                  }
                `}
              >
                Scooters
              </a>

              {/* VENDE */}
              <a 
                href="/vender-mi-moto"
                onClick={(e) => { e.preventDefault(); handleParentMenuClick('vende'); }}
                className={`text-sm font-semibold transition duration-150 cursor-pointer py-2
                  ${activePage === 'vende' 
                    ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                    : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                  }
                `}
              >
                Vende
              </a>

              {/* FINANCIACIÓN */}
              <a 
                href="/financiacion"
                onClick={(e) => { e.preventDefault(); handleParentMenuClick('financiacion'); }}
                className={`text-sm font-semibold transition duration-150 cursor-pointer py-2
                  ${activePage === 'financiacion' 
                    ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                    : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                  }
                `}
              >
                Financiación
              </a>

              {/* SERVICIOS */}
              <div 
                id="menu-servicios"
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredMenu('servicios')}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <a 
                  href="/contacto"
                  onClick={(e) => { e.preventDefault(); handleParentMenuClick('contacto'); }}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition py-2 cursor-pointer
                    ${activePage === 'contacto' 
                      ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                      : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                    }
                  `}
                >
                  <span>Servicios</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                    ${hoveredMenu === 'servicios' ? 'rotate-180' : ''}
                    ${!isHeaderGlass 
                      ? (activePage === 'contacto' ? 'text-[#ff0d41]' : 'text-slate-400 group-hover:text-[#ff0d41]') 
                      : (activePage === 'contacto' ? 'text-white' : 'text-[#a1d7fb] group-hover:text-white')
                    }
                  `} />
                </a>

                {/* VENTANA FLOTANTE: SERVICIOS */}
                <AnimatePresence>
                  {hoveredMenu === 'servicios' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[350px] mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-5 z-50 text-slate-800"
                    >
                      <div className="flex flex-col space-y-1">
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
                            <a 
                              key={item.title}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                setHoveredMenu(null);
                                handleParentMenuClick(item.target as any);
                              }}
                              className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition duration-150 text-slate-700 hover:text-[#ff0d41] hover:bg-slate-50 group cursor-pointer"
                            >
                              <IconComp className="w-5 h-5 text-slate-700 group-hover:text-[#ff0d41] transition-colors shrink-0" strokeWidth={1.8} />
                              <span className="text-[14px] font-semibold text-slate-700 group-hover:text-[#ff0d41] transition-colors whitespace-nowrap">
                                {item.title}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PREGUNTAS FRECUENTES */}
              <a 
                href="/preguntas-frecuentes"
                onClick={(e) => { e.preventDefault(); handleParentMenuClick('preguntas-frecuentes'); }}
                className={`text-sm font-semibold transition duration-150 cursor-pointer py-2
                  ${activePage === 'preguntas-frecuentes' 
                    ? (!isHeaderGlass ? 'text-[#ff0d41] border-b-2 border-[#ff0d41]' : 'text-white border-b-2 border-white') 
                    : (!isHeaderGlass ? 'text-slate-600 hover:text-[#ff0d41]' : 'text-[#d6f0ff] hover:text-white')
                  }
                `}
              >
                Preguntas frecuentes
              </a>

              {/* Separador */}
              <div className={`h-4 w-px transition-colors duration-300 ${!isHeaderGlass ? 'bg-slate-200' : 'bg-[#004b77]'}`} />

              {/* Favoritos */}
              <FavoriteButton
                variant="header"
                favoritesCount={favorites.length}
                onClick={() => handleParentMenuClick('favorites')}
                className={`hover:scale-105 ${!isHeaderGlass ? 'text-slate-700 hover:text-rose-500' : 'text-[#d6f0ff] hover:text-rose-400'}`}
                ariaLabel="Mis Favoritos"
              />

            </nav>

            {/* Botonera Móvil */}
            <div className="flex lg:hidden items-center gap-3">
              {activePage !== 'compra' && activePage !== 'moto' && activePage !== 'blog' && (
                <button 
                  onClick={() => {
                    setIsMobileSearchOpen(!isMobileSearchOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-1 rounded-lg transition transition-colors duration-300 md:hidden cursor-pointer
                    ${!isHeaderGlass ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'}
                  `}
                  aria-label="Buscar"
                >
                  {isMobileSearchOpen ? (
                    <X className="w-5.5 h-5.5" strokeWidth={2.2} />
                  ) : (
                    <Search className="w-5.5 h-5.5" strokeWidth={2.2} />
                  )}
                </button>
              )}

              <FavoriteButton
                variant="header"
                favoritesCount={favorites.length}
                onClick={() => handleParentMenuClick('favorites')}
                className={`!p-1 rounded-lg ${!isHeaderGlass ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
                ariaLabel="Mis Favoritos"
              />

              <button 
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsMobileSearchOpen(false);
                }}
                className={`p-1 rounded-lg transition shrink-0 transition-colors duration-300 cursor-pointer
                  ${!isHeaderGlass ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'}
                `}
                aria-label="Menú móvil"
              >
                {isMobileMenuOpen ? <X className="w-5.5 h-5.5" strokeWidth={2.2} /> : <Menu className="w-5.5 h-5.5" strokeWidth={2.2} />}
              </button>
            </div>
          </>
        )}

      </div>

      {/* BUSCADOR DESPLEGABLE MÓVIL */}
      {isMobileSearchOpen && activePage !== 'blog' && (
        <div className={`absolute top-full left-0 right-0 w-full px-4 pb-4 md:hidden border-t pt-3.5 animate-fade-in transition-all duration-300 shadow-2xl z-50
          ${!isHeaderGlass 
            ? 'bg-white/95 backdrop-blur-md border-slate-200' 
            : 'bg-black/25 backdrop-blur-[12px] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
          }
        `}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={() => {
              handleParentMenuClick('compra', undefined, true);
              setIsMobileSearchOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            placeholder="¿Qué moto estás buscando?"
            variant={isHeaderGlass ? 'header-glass' : 'header'}
            autoFocus
            className="w-full"
          />
        </div>
      )}

    </header>
  );
};
