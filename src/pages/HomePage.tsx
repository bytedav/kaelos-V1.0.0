import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { StyleBike } from '../types';
import { MotorbikeExtended } from '../components/MotorbikeCard';
import { StyleBikeCarousel } from '../components/StyleBikeCarousel';
import { StyleCategorySection } from '../components/StyleCategorySection';
import { SellMotoBanner } from '../components/SellMotoBanner';
import { BudgetMatchSection } from '../components/BudgetMatchSection';
import { ContactFormSection } from '../components/ContactFormSection';
import { DudasMotosSection } from '../components/DudasMotosSection';
import { CentersSection } from '../components/CentersSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';
import { fetchSettingsAsync } from '../data/staticContent';
import { resolveImageUrl } from '../utils/cms';
import { HeroSlide, HeroSlideButton, GeneralSettingsContent } from '../types/content';
import { SITE_CONFIG } from '../data/siteConfig';

import heroMobileCovered from '../assets/images/hero_mobile_covered_1784962962925.jpg';
import heroDesktopRedBike from '../assets/images/hero_desktop_red_bike_1784962972521.jpg';
import heroMobileFinanceScooter from '../assets/images/hero_mobile_finance_scooter_1784963164900.jpg';
import heroDesktopFinanceScooter from '../assets/images/hero_desktop_finance_scooter_1784963151819.jpg';
import financiacionHeroMobile from '../assets/images/financiacion_hero_mobile_1784964055762.jpg';
import financiacionHeroDesktop from '../assets/images/financiacion_hero_desktop_1784964041050.jpg';

export interface HomePageProps {
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  activeStyleCategory: string;
  setActiveStyleCategory: (category: string) => void;
  styleCategoryIcons: Record<string, (isActive: boolean) => React.ReactNode>;
  styleBikesData: Record<string, StyleBike[]>;
  isStyleLoading: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  handleSelectStyleBike: (bike: StyleBike) => void;
  getFilterUrl: (overrides: Record<string, any>) => string;
  setSelectedStyles: React.Dispatch<React.SetStateAction<string[]>>;
  handleParentMenuClick: (
    page: any,
    filterInfo?: { filterType: 'brand' | 'style' | 'city' | 'cc' | 'search' | 'condition'; value: string; condition?: 'all' | 'ocasión' | 'nueva' },
    preserveSearch?: boolean
  ) => void;
  setActivePage: React.Dispatch<React.SetStateAction<any>>;
  motorbikesList?: MotorbikeExtended[];
}

export const HomePage: React.FC<HomePageProps> = ({
  currentSlide,
  setCurrentSlide,
  activeStyleCategory,
  setActiveStyleCategory,
  styleCategoryIcons,
  styleBikesData,
  isStyleLoading,
  favorites,
  toggleFavorite,
  handleSelectStyleBike,
  getFilterUrl,
  setSelectedStyles,
  handleParentMenuClick,
  setActivePage,
  motorbikesList,
}) => {
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      const s = await fetchSettingsAsync();
      if (s) setDbSettings(s);
    }
    loadSettings();
  }, []);

  const slide1Mobile = resolveImageUrl(dbSettings?.banners?.heroSlide1Mobile) || heroMobileCovered;
  const slide1Desktop = resolveImageUrl(dbSettings?.banners?.heroSlide1Desktop) || heroDesktopRedBike;
  const slide2Mobile = resolveImageUrl(dbSettings?.banners?.heroSlide2Mobile) || heroMobileFinanceScooter;
  const slide2Desktop = resolveImageUrl(dbSettings?.banners?.heroSlide2Desktop) || heroDesktopFinanceScooter;
  const slide3Mobile = resolveImageUrl(dbSettings?.banners?.financiacionHeroMobile) || financiacionHeroMobile;
  const slide3Desktop = resolveImageUrl(dbSettings?.banners?.financiacionHeroDesktop) || financiacionHeroDesktop;

  const slide2Title = dbSettings?.banners?.heroSlide2Title || '¡Descubre cuánto vale tu moto en un clic!';
  const slide2ButtonText = dbSettings?.banners?.heroSlide2ButtonText || 'TASAR MI MOTO';
  const slide2ButtonLink = dbSettings?.banners?.heroSlide2ButtonLink || dbSettings?.banners?.heroSlide2Link || 'vende';

  // Dynamic slides list
  const slides: HeroSlide[] = (dbSettings?.heroSlides && dbSettings.heroSlides.length > 0)
    ? dbSettings.heroSlides.map((s, idx) => ({
        ...s,
        id: s.id || `slide-${idx + 1}`,
        bgMobile: resolveImageUrl(s.bgMobile),
        bgDesktop: resolveImageUrl(s.bgDesktop),
      }))
    : SITE_CONFIG.heroSlides.map((s, idx) => ({
        ...s,
        bgMobile: idx === 0 ? slide1Mobile : idx === 1 ? slide2Mobile : slide3Mobile,
        bgDesktop: idx === 0 ? slide1Desktop : idx === 1 ? slide2Desktop : slide3Desktop,
      }));

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  // Auto transition timer for dynamic slides count
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? '100%' : dir > 0 ? '-100%' : 0,
      opacity: 1,
    }),
  };

  const handleSlideButtonClick = (button: HeroSlideButton) => {
    const link = (button.link || '').trim();
    if (!link) {
      handleParentMenuClick('home');
      return;
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }
    if (link.startsWith('/')) {
      if (link.includes('scooters')) {
        window.history.pushState(null, '', link);
        const isNueva = link.includes('condicion=nuevo');
        handleParentMenuClick('compra', { 
          filterType: 'style', 
          value: 'SCOOTER', 
          condition: isNueva ? 'nueva' : 'all' 
        });
        return;
      }
      window.history.pushState(null, '', link);
      const pageKey = link.replace('/', '').split('?')[0];
      handleParentMenuClick(pageKey || 'compra');
      return;
    }
    handleParentMenuClick(link);
  };

  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <div className="animate-fade-in">
      <WhatsAppButton 
              variant="floating" 
              message="Hola, estoy interesado en comprar una moto con Kaelos."
              ariaLabel="Consultar financiación por WhatsApp"
            />
      {/* SLIDER HERO INTERACTIVO DE ALTA FIDELIDAD CON SLIDES DINÁMICOS */}
      <section className="relative w-full overflow-hidden bg-[#0a1420] -mt-14 sm:-mt-16 pt-14 sm:pt-16 h-[560px] xs:h-[600px] sm:h-[640px] lg:h-[620px] flex items-center shadow-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(event: any, info: any) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                paginate(1);
              } else if (info.offset.x > swipeThreshold) {
                paginate(-1);
              }
            }}
          >
            {currentSlideData && (
              <div key={currentSlideData.id || currentSlide} className="w-full h-full flex items-end lg:items-center relative overflow-hidden" style={{ backgroundColor: currentSlideData.bgColor || '#0a1420' }}>
                {/* Background Image for Mobile */}
                {currentSlideData.bgMobile && (
                  <div 
                    className="lg:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${currentSlideData.bgMobile})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent" />
                  </div>
                )}

                {/* Background Image for Desktop / Laptop */}
                {currentSlideData.bgDesktop && (
                  <div 
                    className="hidden lg:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${currentSlideData.bgDesktop})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-end lg:justify-between pt-24 xs:pt-28 lg:pt-0 pb-10 sm:pb-12 lg:pb-0 relative z-10">
                  
                  {/* Space reservation for motorcycle graphic in desktop view */}
                  <div className="hidden lg:block w-1/2 order-2 pointer-events-none" />

                  {/* Text and CTAs */}
                  <div className="w-full lg:w-1/2 space-y-3.5 sm:space-y-6 text-left max-w-2xl order-2 lg:order-1 mt-auto lg:my-auto pb-2 lg:pb-0">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-tight drop-shadow-lg text-left">
                      {currentSlideData.title}
                    </h1>
                    
                    {/* Dynamic Buttons Layout derived from Slide 1 */}
                    {currentSlideData.buttons && currentSlideData.buttons.length > 0 && (
                      <div className="pt-2 w-full max-w-md">
                        <div className={`gap-2.5 sm:gap-3 ${
                          currentSlideData.buttons.length === 1 
                            ? 'flex flex-col' 
                            : currentSlideData.buttons.length === 4
                              ? 'grid grid-cols-2'
                              : 'grid grid-cols-2 lg:flex lg:flex-row'
                        }`}>
                          {currentSlideData.buttons.map((btn, bIdx) => {
                            const total = currentSlideData.buttons!.length;
                            const isFirstInThree = total === 3 && bIdx === 0;
                            return (
                              <button 
                                key={bIdx}
                                onClick={() => handleSlideButtonClick(btn)}
                                className={`${
                                  total === 1 
                                    ? 'w-full lg:w-auto lg:min-w-[220px] px-8 py-3.5 sm:py-4' 
                                    : total === 4
                                      ? 'col-span-1 py-3.5 sm:py-4 px-3 sm:px-5'
                                      : isFirstInThree 
                                        ? 'col-span-2 lg:col-span-1 lg:flex-1 py-3.5 sm:py-4 px-4 sm:px-6' 
                                        : 'col-span-1 lg:flex-1 py-3.5 sm:py-4 px-4 sm:px-6'
                                } bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl transition duration-150 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider text-center`}
                              >
                                {btn.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicadores de Puntos en el Slider */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx 
                  ? 'w-8 h-2 bg-[#ff0d41]' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STRIP DE VALORES Y BENEFICIOS CLAVE */}
      <div className="w-full bg-[#1c222b] border-y border-slate-800/80 py-4 sm:py-5 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Version */}
          <div className="hidden md:grid grid-cols-3 gap-6 divide-x divide-slate-800">
            {SITE_CONFIG.benefits.map((b, idx) => {
              const Icon = idx === 0 ? ShieldCheck : idx === 1 ? Search : Truck;
              return (
                <div key={idx} className={`flex items-center gap-3.5 ${idx === 0 ? 'pl-2' : 'pl-6'}`}>
                  <div className="text-white shrink-0">
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[14px] text-white leading-tight">{b.title}</p>
                    <p className="text-[12px] text-gray-400 leading-normal mt-0.5">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Version */}
          <div className="flex md:hidden flex-col gap-4 py-2 px-1">
            {SITE_CONFIG.benefits.map((b, idx) => {
              const Icon = idx === 0 ? ShieldCheck : idx === 1 ? Search : Truck;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center text-white/90 shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <span className="font-semibold text-[13px] text-white/95">{b.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN: ¿BUSCAS UN ESTILO ESPECÍFICO? (CAROUSEL DE ALTA FIDELIDAD) */}
      <section className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3.5 space-y-3.5">
        <div className="text-left">
          <h2 className="text-[20px] sm:text-[26px] font-black text-slate-900 tracking-tight">
            ¿Buscas un estilo específico?
          </h2>
        </div>

        <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'scooter', label: 'SCOOTER' },
            { id: 'naked', label: 'NAKED' },
            { id: 'deportiva', label: 'DEPORTIVA' },
            { id: 'trail', label: 'TRAIL' },
            { id: 'touring', label: 'TOURING' },
            { id: 'custom', label: 'CUSTOM' },
            { id: 'clasica', label: 'CLÁSICA' },
            { id: 'off-road', label: 'OFF-ROAD' }
          ].map((style) => {
            const isActive = activeStyleCategory === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setActiveStyleCategory(style.id)}
                className={`group flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all duration-300 w-[84px] sm:w-[98px] shrink-0 select-none ${
                  isActive
                    ? 'bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] scale-[1.02]'
                    : 'bg-transparent border border-transparent hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-center h-7 w-full">
                  {styleCategoryIcons[style.id] ? styleCategoryIcons[style.id](isActive) : null}
                </div>
                <span className={`text-[10px] font-bold tracking-wider mt-1.5 transition-colors duration-300 ${
                  isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>

        <StyleBikeCarousel 
          bikes={styleBikesData[activeStyleCategory] || []}
          isStyleLoading={isStyleLoading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelect={handleSelectStyleBike}
        />

        <div className="text-center -mt-1 sm:-mt-2 px-4 sm:px-0">
          <button
            onClick={() => {
              handleParentMenuClick('compra', { filterType: 'style', value: activeStyleCategory.toUpperCase() });
            }}
            className="bg-brand-dark text-white w-full max-w-xs sm:max-w-md py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-hover transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          >
            VER TODAS LAS {activeStyleCategory.toUpperCase()}
          </button>
        </div>
      </section>

      {/* SECCIÓN: SEAS COMO SEAS, TENEMOS TU PRÓXIMA MOTO */}
      <StyleCategorySection
        onSelectCategory={(category) => {
          handleParentMenuClick('compra', { filterType: 'style', value: category.toUpperCase() });
        }}
      />

      {/* RETRO PROMO BANNER: VENDE O INTERCAMBIA TU MOTO ANTIGUA */}
      <SellMotoBanner onAction={() => handleParentMenuClick('vende')} />

      {/* NUEVA SECCIÓN: ¿HACEMOS MATCH CON TU PRESUPUESTO? */}
      <BudgetMatchSection
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onExploreCategory={() => {
          handleParentMenuClick('compra');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onSelect={handleSelectStyleBike}
        motorbikesList={motorbikesList}
        isLoading={isStyleLoading}
      />

      {/* NUEVA SECCIÓN DE FORMULARIO DE PREGUNTAS / CONTACTO */}
      <ContactFormSection />

      {/* NUEVA SECCIÓN: DUDA ENTRE MOTOS - TE LLAMAMOS */}
      <DudasMotosSection />

      {/* NUEVA SECCIÓN: CENTROS KAELOS */}
      <CentersSection />
      {/* NUEVA SECCIÓN: NEWSLETTER BANNER (EMPIEZA TU AVENTURA AHORRANDO) */}
      <NewsletterSection />
    </div>
  );
};
