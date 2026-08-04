/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

import { StyleBike } from './types';
import { getStyleBikesData } from './data/styleBikesData';
import { FooterSection } from './components/FooterSection';
import { MotorbikeExtended } from './components/MotorbikeCard';
import { motorbikesData } from './data/motorbikesData';
import MotoDetailView from './components/MotoDetailView';
import MotoImagesView from './components/MotoImagesView';
import MotoFinanceView from './components/MotoFinanceView';
import CheckoutSaleView from './components/CheckoutSaleView';
import VendePage from './pages/VendePage';
import { AcercaDePage } from './pages/AcercaDePage';
import FinanciacionPage from './pages/FinanciacionPage';
import PreguntasFrecuentesPage from './pages/PreguntasFrecuentesPage';
import BlogPage from './pages/BlogPage';
import FavoritesPage from './pages/FavoritesPage';
import { AvisoLegalPage } from './pages/AvisoLegalPage';
import { PoliticaPrivacidadPage } from './pages/PoliticaPrivacidadPage';
import { TerminosCondicionesPage } from './pages/TerminosCondicionesPage';
import { CookiesPage } from './pages/CookiesPage';
import { Header } from './components/layout/Header';
import { MobileMenu } from './components/layout/MobileMenu';
import { BottomSheetModal } from './components/layout/BottomSheetModal';
import { HomePage } from './pages/HomePage';
import { CompraPage } from './pages/CompraPage';
import { ContactoPage } from './pages/ContactoPage';
import { getReservedBikeIds, reserveBikeInDb, getMotorbikesFromDb, MotorbikeData } from './utils/storage';

import scooterIcon from './assets/images/svg/scooter.svg';
import nakedIcon from './assets/images/svg/naked.svg';
import sportIcon from './assets/images/svg/sport.svg';
import trailIcon from './assets/images/svg/trail.svg';
import touringIcon from './assets/images/svg/touring.svg';
import customIcon from './assets/images/svg/custom.svg';
import classicIcon from './assets/images/svg/classic.svg';
import offroadIcon from './assets/images/svg/offroad.svg';

const renderCategoryIcon = (iconUrl: string) => (isActive: boolean) => (
  <div 
    className={`w-12 h-7 transition-colors duration-300 ${
      isActive ? 'bg-[#0f172a]' : 'bg-[#94a3b8] group-hover:bg-[#64748b]'
    }`}
    style={{
      maskImage: `url(${iconUrl})`,
      WebkitMaskImage: `url(${iconUrl})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
    }}
  />
);

const styleCategoryIcons: Record<string, (isActive: boolean) => React.ReactNode> = {
  scooter: renderCategoryIcon(scooterIcon),
  naked: renderCategoryIcon(nakedIcon),
  deportiva: renderCategoryIcon(sportIcon),
  trail: renderCategoryIcon(trailIcon),
  touring: renderCategoryIcon(touringIcon),
  custom: renderCategoryIcon(customIcon),
  clasica: renderCategoryIcon(classicIcon),
  'off-road': renderCategoryIcon(offroadIcon),
};

import { 
  useUrlSync, 
  parseUrlToState,
  PATH_MAP, 
  REVERSE_PATH_MAP, 
  toSlug, 
  slugToCity, 
  cityToSlug, 
  STYLE_MAP_TO_SLUG, 
  SLUG_MAP_TO_STYLE 
} from './hooks/useUrlSync';
import { useSeoMeta } from './hooks/useSeoMeta';
import { useBikeFilters } from './hooks/useBikeFilters';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useReservedBikesStore } from './store/useReservedBikesStore';
import { useUIStore } from './store/useUIStore';

export {
  toSlug, 
  slugToCity, 
  cityToSlug, 
  STYLE_MAP_TO_SLUG, 
  SLUG_MAP_TO_STYLE
};

const getInitialUrlState = () => {
  if (typeof window === 'undefined') {
    return parseUrlToState('/', '', motorbikesData);
  }
  return parseUrlToState(window.location.pathname, window.location.search, motorbikesData);
};

export default function App() {
  const initialUrlState = getInitialUrlState();

  // Zustand store hooks
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { reservedBikeIds, setReservedBikeIds, reserveBike: reserveBikeInStore } = useReservedBikesStore();
  const {
    isScrolled,
    setIsScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    hoveredMenu,
    setHoveredMenu,
    activeBottomSheet,
    setActiveBottomSheet,
    bottomSheetSearch,
    setBottomSheetSearch,
  } = useUIStore();

  const [searchQuery, setSearchQuery] = useState(initialUrlState.searchQuery || '');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Scroll listener to toggle header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  // Navigation active page
  const [activePage, setActivePage] = useState<'home' | 'compra' | 'moto' | 'moto-images' | 'moto-finance' | 'checkout-sale' | 'acerca-de' | 'financiacion' | 'preguntas-frecuentes' | 'blog' | 'favorites' | 'vende' | 'contacto' | 'aviso-legal' | 'politica-privacidad' | 'terminos-y-condiciones' | 'cookies'>(initialUrlState.activePage);
  const [selectedDetailedBike, setSelectedDetailedBike] = useState<MotorbikeExtended | null>(initialUrlState.selectedDetailedBike);
  const [isRentingDetail, setIsRentingDetail] = useState(initialUrlState.isRentingDetail);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(initialUrlState.selectedBlogPostId);

  // Always scroll to top when activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  // Motorbikes catalog state synced with persistent storage
  const [motorbikesList, setMotorbikesList] = useState<MotorbikeExtended[]>(motorbikesData);

  // Load motorbikes and reserved bikes from database on mount
  useEffect(() => {
    async function loadPersistentData() {
      const dbMotos = await getMotorbikesFromDb(motorbikesData as MotorbikeData[]);
      if (dbMotos && dbMotos.length > 0) {
        setMotorbikesList(dbMotos as MotorbikeExtended[]);
        const reParsed = parseUrlToState(window.location.pathname, window.location.search, dbMotos as MotorbikeExtended[]);
        if (reParsed.selectedDetailedBike) {
          setSelectedDetailedBike(reParsed.selectedDetailedBike);
        }
      }
      const reserved = await getReservedBikeIds();
      if (reserved && reserved.length > 0) {
        setReservedBikeIds(reserved);
      }
    }
    loadPersistentData();
  }, [setReservedBikeIds]);

  const handleReserveSuccess = (bikeId: string) => {
    reserveBikeInStore(bikeId);
  };

  // High-fidelity bike filter states & logic
  const bikeFilters = useBikeFilters({
    searchQuery,
    setSearchQuery,
    setActiveBottomSheet,
    bikesList: motorbikesList,
    initialFilters: initialUrlState,
  });

  const {
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
    expandedFilters,
    setExpandedFilters,
    cuotaDesde,
    setCuotaDesde,
    cuotaHasta,
    setCuotaHasta,
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
    filteredBikes,
    sortedBikes,
    openBottomSheet,
    getBikeDisplacement,
    getBikeCity,
  } = bikeFilters;

  // Hook for URL synchronization & history API
  const { getFilterUrl } = useUrlSync({
    motorbikesList,
    activePage,
    setActivePage,
    selectedDetailedBike,
    setSelectedDetailedBike,
    isRentingDetail,
    setIsRentingDetail,
    selectedBlogPostId,
    setSelectedBlogPostId,
    selectedBrand,
    setSelectedBrand,
    selectedCondition,
    setSelectedCondition,
    isKm0,
    setIsKm0,
    isOffersOnly,
    setIsOffersOnly,
    cuotaDesde,
    setCuotaDesde,
    cuotaHasta,
    setCuotaHasta,
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
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
  });

  // Hook for SEO & Document Meta handling
  const { getPageTitle } = useSeoMeta({
    activePage,
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
    selectedBrand,
    selectedCiudades,
    selectedStyles,
    currentPage,
    selectedDetailedBike,
    isRentingDetail,
    selectedBlogPostId,
  });
  
  const [activeStyleCategory, setActiveStyleCategory] = useState<string>('scooter');
  const [isStyleLoading, setIsStyleLoading] = useState<boolean>(false);

  // Lock body scroll when mobile menu, filters, or bottom sheets are open
  useEffect(() => {
    if (isMobileMenuOpen || isMobileFiltersOpen || activeBottomSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobileFiltersOpen, !!activeBottomSheet]);

  useEffect(() => {
    setIsStyleLoading(true);
    const timer = setTimeout(() => {
      setIsStyleLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeStyleCategory]);

  const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => {
      setIsGridLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [
    selectedBrand,
    selectedCondition,
    isKm0,
    isOffersOnly,
    innerSearchQuery,
    searchQuery,
    selectedSort,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    selectedStyles.join(','),
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    selectedCiudades.join(','),
    currentPage
  ]);

  // Reset pagination to page 1 when filters or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedBrand,
    selectedCondition,
    isKm0,
    isOffersOnly,
    innerSearchQuery,
    selectedSort,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    selectedStyles.length,
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    selectedCiudades.length
  ]);

  // Handler for clicking parent links to navigate
  const handleParentMenuClick = (
    menu: 'home' | 'compra' | 'moto' | 'transporte' | 'mantenimiento' | 'tramites-documentales' | 'acerca-de' | 'financiacion' | 'preguntas-frecuentes' | 'blog' | 'favorites' | 'vende' | 'contacto',
    filterInfo?: { filterType: 'brand' | 'style' | 'city' | 'cc' | 'search' | 'condition'; value: string; condition?: 'all' | 'ocasión' | 'nueva' },
    preserveSearch?: boolean
  ) => {
    const queryToKeep = filterInfo?.filterType === 'search' ? filterInfo.value : searchQuery;
    const shouldKeepSearch = preserveSearch || filterInfo?.filterType === 'search';

    // Reset all applied filter badges when changing pages or selecting new menu
    clearFilters();

    if (shouldKeepSearch && queryToKeep) {
      setSearchQuery(queryToKeep);
      setInnerSearchQuery(queryToKeep);
    }

    if (filterInfo && filterInfo.filterType !== 'search') {
      const { filterType, value, condition } = filterInfo;
      if (condition) {
        setSelectedCondition(condition);
      }
      if (filterType === 'brand') {
        setSelectedBrand(value);
      } else if (filterType === 'style') {
        setSelectedStyles([value.toUpperCase()]);
      } else if (filterType === 'city') {
        setSelectedCiudades([value]);
      } else if (filterType === 'cc') {
        const ccVal = parseInt(value.replace(/[^0-9]/g, '')) || 125;
        setCilindradaDesde(Math.max(0, ccVal - 25));
        setCilindradaHasta(ccVal + 25);
      } else if (filterType === 'condition') {
        if (value === 'nueva' || value === 'nuevo') {
          setSelectedCondition('nueva');
        } else if (value === 'ocasión' || value === 'ocasion') {
          setSelectedCondition('ocasión');
        }
      }
    }

    setActivePage(menu as any);
    setHoveredMenu(null);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    // Scroll to top to give natural page change feel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStyleBike = (styleBike: any) => {
    const found = motorbikesList.find(b => b.id === styleBike.id);
    if (found) {
      setSelectedDetailedBike(found);
    } else {
      const cleanKms = parseInt((styleBike.kms || '').toString().replace(/[^0-9]/g, '')) || 0;
      const mapped: MotorbikeExtended = {
        id: styleBike.id,
        brand: styleBike.brand,
        model: styleBike.model,
        year: styleBike.year,
        kms: cleanKms,
        power: '94 CV',
        price: styleBike.price,
        rentingPrice: styleBike.financePrice || Math.round(styleBike.price * 0.0214),
        category: 'Custom',
        image: styleBike.images ? styleBike.images[0] : '',
        images: styleBike.images || [],
        fuel: 'Gasolina'
      };
      setSelectedDetailedBike(mapped);
    }
    setActivePage('moto');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isHeaderGlass = (activePage === 'home') && !isScrolled;

  return (
    <div className="min-h-screen bg-[#001929]/5 flex flex-col font-sans selection:bg-[#ff0d41]/10 selection:text-[#ff0d41]">
      
      {/* HEADER PRINCIPAL */}
      {activePage !== 'checkout-sale' && (
        <Header
          activePage={activePage}
          isHeaderGlass={isHeaderGlass}
          showNav={activePage !== 'moto-finance'}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          favorites={favorites}
          hoveredMenu={hoveredMenu}
          setHoveredMenu={setHoveredMenu}
          isMobileSearchOpen={isMobileSearchOpen}
          setIsMobileSearchOpen={setIsMobileSearchOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleParentMenuClick={handleParentMenuClick}
          getFilterUrl={getFilterUrl}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          selectedStyles={selectedStyles}
          setSelectedStyles={setSelectedStyles}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          cilindradaDesde={cilindradaDesde}
          setCilindradaDesde={setCilindradaDesde}
          cilindradaHasta={cilindradaHasta}
          setCilindradaHasta={setCilindradaHasta}
        />
      )}

      {/* Menú Móvil Desplegable */}
      {activePage !== 'checkout-sale' && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePage={activePage}
          handleParentMenuClick={handleParentMenuClick}
          selectedStyles={selectedStyles}
          selectedCondition={selectedCondition}
        />
      )}

      {/* CUERPO PRINCIPAL DINÁMICO SEGÚN "ACTIVE PAGE" */}
      <div className="flex-1">

        {/* 1. HOME / LANDING PAGE */}
        {activePage === 'home' && (
          <HomePage
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            activeStyleCategory={activeStyleCategory}
            setActiveStyleCategory={setActiveStyleCategory}
            styleCategoryIcons={styleCategoryIcons}
            styleBikesData={getStyleBikesData(motorbikesList)}
            motorbikesList={motorbikesList}
            isStyleLoading={isStyleLoading}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            handleSelectStyleBike={handleSelectStyleBike}
            getFilterUrl={getFilterUrl}
            setSelectedStyles={setSelectedStyles}
            handleParentMenuClick={handleParentMenuClick}
            setActivePage={setActivePage}
          />
        )}

        {/* 2. COMPRA PAGE (CATÁLOGO ALTA FIDELIDAD) */}
        {activePage === 'compra' && (
          <CompraPage
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            isKm0={isKm0}
            setIsKm0={setIsKm0}
            isOffersOnly={isOffersOnly}
            setIsOffersOnly={setIsOffersOnly}
            innerSearchQuery={innerSearchQuery}
            setInnerSearchQuery={setInnerSearchQuery}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            isSortDropdownOpen={isSortDropdownOpen}
            setIsSortDropdownOpen={setIsSortDropdownOpen}
            isMobileFiltersOpen={isMobileFiltersOpen}
            setIsMobileFiltersOpen={setIsMobileFiltersOpen}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cilindradaDesde={cilindradaDesde}
            setCilindradaDesde={setCilindradaDesde}
            cilindradaHasta={cilindradaHasta}
            setCilindradaHasta={setCilindradaHasta}
            precioDesde={precioDesde}
            setPrecioDesde={setPrecioDesde}
            precioHasta={precioHasta}
            setPrecioHasta={setPrecioHasta}
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
            hasActiveFilters={hasActiveFilters}
            sortedBikes={sortedBikes}
            isGridLoading={isGridLoading}
            favorites={favorites}
            reservedBikeIds={reservedBikeIds}
            toggleFavorite={toggleFavorite}
            setSelectedDetailedBike={setSelectedDetailedBike}
            setIsRentingDetail={setIsRentingDetail}
            setActivePage={(p: any) => setActivePage(p)}
            handleParentMenuClick={handleParentMenuClick}
            getFilterUrl={getFilterUrl}
            openBottomSheet={openBottomSheet}
            getPageTitle={getPageTitle}
          />
        )}

        {/* 5. MOTORBIKE DETAIL PAGE */}
        {activePage === 'moto' && (
          <div className="animate-fade-in">
            <MotoDetailView 
              bike={selectedDetailedBike}
              favorites={favorites}
              reservedBikeIds={reservedBikeIds}
              onToggleFavorite={toggleFavorite}
              onNavigateToCompra={(filterInfo) => handleParentMenuClick('compra', filterInfo)}
              onSelectBike={(bike) => {
                setSelectedDetailedBike(bike);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              allBikes={motorbikesList}
              isRentingDetail={false}
              getFilterUrl={getFilterUrl}
            />
          </div>
        )}

        {/* 5.5 MOTORBIKE FINANCE PAGE */}
        {activePage === 'moto-finance' && (
          <div className="animate-fade-in">
            <MotoFinanceView 
              bike={selectedDetailedBike}
              onBack={() => {
                setActivePage('moto');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          </div>
        )}

        {/* 6. MOTORBIKE FULLSCREEN IMAGES / IMPERFECTION GALLERY */}
        {activePage === 'moto-images' && (
          <div className="animate-fade-in">
            <MotoImagesView 
              bike={selectedDetailedBike}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onClose={() => {
                setActivePage('moto');
              }}
            />
          </div>
        )}

        {/* 7. MOTORBIKE CHECKOUT SALE PAGE */}
        {activePage === 'checkout-sale' && (
          <div className="animate-fade-in">
            <CheckoutSaleView 
              bike={selectedDetailedBike}
              onReserveSuccess={handleReserveSuccess}
              onBack={() => {
                setActivePage('compra');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              motorbikesList={motorbikesList}
            />
          </div>
        )}

        {/* 14.5 VENDE PAGE (VENDER MI MOTO) */}
        {activePage === 'vende' && (
          <div className="animate-fade-in">
            <VendePage 
              onNavigateHome={() => handleParentMenuClick('home')}
              onNavigateCompra={() => handleParentMenuClick('compra')}
            />
          </div>
        )}

        {/* 15. ACERCA DE PAGE */}
        {activePage === 'acerca-de' && (
          <div className="animate-fade-in">
            <AcercaDePage 
              onNavigate={(page) => handleParentMenuClick(page)}
            />
          </div>
        )}

        {/* 16. FINANCIACION PAGE */}
        {activePage === 'financiacion' && (
          <div className="animate-fade-in">
            <FinanciacionPage 
              onNavigate={(page) => handleParentMenuClick(page)}
            />
          </div>
        )}

        {/* 17. PREGUNTAS FRECUENTES PAGE */}
        {activePage === 'preguntas-frecuentes' && (
          <div className="animate-fade-in">
            <PreguntasFrecuentesPage 
              onNavigate={(page) => handleParentMenuClick(page)}
            />
          </div>
        )}

        {/* 18. BLOG PAGE */}
        {activePage === 'blog' && (
          <div className="animate-fade-in">
            <BlogPage 
              selectedPostId={selectedBlogPostId}
              onSelectPostId={setSelectedBlogPostId}
              onNavigate={(page) => handleParentMenuClick(page)}
            />
          </div>
        )}

        {/* 18.5 CONTACTO PAGE */}
        {activePage === 'contacto' && (
          <ContactoPage />
        )}

        {/* 18.6 AVISO LEGAL PAGE */}
        {activePage === 'aviso-legal' && (
          <div className="animate-fade-in">
            <AvisoLegalPage onNavigate={(page) => handleParentMenuClick(page)} />
          </div>
        )}

        {/* 18.7 POLÍTICA DE PRIVACIDAD PAGE */}
        {activePage === 'politica-privacidad' && (
          <div className="animate-fade-in">
            <PoliticaPrivacidadPage onNavigate={(page) => handleParentMenuClick(page)} />
          </div>
        )}

        {/* 18.8 TÉRMINOS Y CONDICIONES PAGE */}
        {activePage === 'terminos-y-condiciones' && (
          <div className="animate-fade-in">
            <TerminosCondicionesPage onNavigate={(page) => handleParentMenuClick(page)} />
          </div>
        )}

        {/* 18.9 POLÍTICA DE COOKIES PAGE */}
        {activePage === 'cookies' && (
          <div className="animate-fade-in">
            <CookiesPage onNavigate={(page) => handleParentMenuClick(page)} />
          </div>
        )}

        {/* 19. FAVORITES PAGE */}
        {activePage === 'favorites' && (
          <div className="animate-fade-in">
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNavigate={(page) => handleParentMenuClick(page)}
              onSelectDetailedBike={setSelectedDetailedBike}
              motorbikesList={motorbikesList}
            />
          </div>
        )}

      </div>

      {/* Dynamic Bottom Sheet for Mobile Select options */}
      <BottomSheetModal
        activeBottomSheet={activeBottomSheet}
        setActiveBottomSheet={setActiveBottomSheet}
        bottomSheetSearch={bottomSheetSearch}
        setBottomSheetSearch={setBottomSheetSearch}
      />

      {/* FOOTER POLISHED EXACTLY MATCHING LAPTOP & MOBILE */}
      {activePage !== 'moto-finance' && activePage !== 'checkout-sale' && <FooterSection onNavigate={handleParentMenuClick} />}

    </div>
  );
}
