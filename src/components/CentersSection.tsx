import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Phone, MapPin, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import { loadSettingsFromContent, fetchSettingsAsync } from '../data/staticContent';
import { GeneralSettingsContent } from '../types/content';
import { CarouselArrows } from './ui/CarouselArrows';
import { SITE_CONFIG } from '../data/siteConfig';

interface Center {
  id: string;
  name: string;
  badge?: string;
  phone: string;
  location: string;
  hours: string;
  mapsUrl: string;
  images: string[];
}

const DEFAULT_CENTER_IMAGES = [
  '/src/assets/images/barcelona_center_1784106082831.jpg',
  '/src/assets/images/scooter_red_studio_1784099142309.jpg',
  '/src/assets/images/sport_red_studio_1784099164293.jpg'
];

const CENTERS_DATA: Center[] = SITE_CONFIG.stores.map((s) => ({
  id: s.id,
  name: s.name,
  badge: s.badge || 'KAELOS OFICIAL',
  phone: s.phone,
  location: s.address,
  hours: `${s.hoursLine1}\n${s.hoursLine2}`.trim(),
  mapsUrl: s.mapsUrl,
  images: s.images && s.images.length > 0 ? s.images : DEFAULT_CENTER_IMAGES,
}));


export const CentersSection: React.FC = () => {
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await fetchSettingsAsync();
      if (s) setDbSettings(s);
    }
    loadSettings();
  }, []);

  const settings = dbSettings || loadSettingsFromContent();
  
  const centers = useMemo(() => {
    if (settings?.locations && settings.locations.length > 0) {
      const cmsCenters: Center[] = settings.locations.map((loc) => ({
        id: loc.id,
        name: `${loc.city} - ${loc.address.split(',')[0]}`,
        phone: loc.phone || settings.contactPhone || '+51 1 710 3333',
        location: `${loc.address}, ${loc.city}`,
        hours: loc.schedule || 'Lunes a viernes de 8:30 a 20:00\nSábados de 9:00 a 18:00',
        mapsUrl: loc.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(loc.address)}`,
        images: [
          '/src/assets/images/barcelona_center_1784106082831.jpg',
          '/src/assets/images/scooter_red_studio_1784099142309.jpg',
        ],
      }));
      return [...cmsCenters, ...CENTERS_DATA];
    }
    return CENTERS_DATA;
  }, [settings]);

  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({
    'lima-surco': 0,
    'lima-los-olivos': 0,
    arequipa: 0,
    trujillo: 0,
    chiclayo: 0,
    cusco: 0,
    piura: 0,
  });
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const [centerTouchStart, setCenterTouchStart] = useState<Record<string, { x: number; y: number }>>({});

  const handleTouchStartCenter = (centerId: string, e: React.TouchEvent) => {
    setCenterTouchStart((prev) => ({
      ...prev,
      [centerId]: { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }));
  };

  const handleTouchEndCenter = (centerId: string, totalImages: number, e: React.TouchEvent) => {
    const startPos = centerTouchStart[centerId];
    if (!startPos || totalImages <= 1) return;
    const diffX = startPos.x - e.changedTouches[0].clientX;
    const diffY = startPos.y - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextImage(centerId, totalImages);
      } else {
        handlePrevImage(centerId, totalImages);
      }
    }
  };

  const scrollLeft = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.getBoundingClientRect().width || 320;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  const scrollRight = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.getBoundingClientRect().width || 320;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  };

  const handleNextImage = (centerId: string, totalImages: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImageIndexes((prev) => ({
      ...prev,
      [centerId]: (prev[centerId] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (centerId: string, totalImages: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImageIndexes((prev) => ({
      ...prev,
      [centerId]: (prev[centerId] - 1 + totalImages) % totalImages,
    }));
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [fieldKey]: false }));
      }, 2000);
    });
  };

  return (
    <section id="centers-section" className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="text-left space-y-1.5 max-w-2xl">
          <h2 id="centers-heading" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Encuentra tu centro Kaelos
          </h2>
          <p className="hidden sm:block text-slate-400 font-medium text-xs sm:text-sm">
            Ven a visitarnos y descubre la mayor exposición de motos de ocasión, con asesoramiento personalizado y taller propio.
          </p>
        </div>
        
        {/* Slider Controls */}
        <CarouselArrows
          onPrev={scrollLeft}
          onNext={scrollRight}
          className="hidden sm:flex"
          prevAriaLabel="Anterior centro"
          nextAriaLabel="Siguiente centro"
        />
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {centers.map((center) => {
          const currentImageIndex = activeImageIndexes[center.id] || 0;
          return (
            <div
              key={center.id}
              id={`center-card-${center.id}`}
              className="w-[285px] sm:w-[320px] md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Carousel Area */}
              <div 
                onTouchStart={(e) => handleTouchStartCenter(center.id, e)}
                onTouchEnd={(e) => handleTouchEndCenter(center.id, center.images.length, e)}
                className="relative aspect-[4/3] overflow-hidden bg-slate-100 touch-pan-y"
              >
                <img
                  src={center.images[currentImageIndex]}
                  alt={`${center.name} showroom`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Arrow navigation overlay */}
                <CarouselArrows
                  variant="overlay"
                  size="sm"
                  buttonClassName="opacity-0 group-hover:opacity-100 focus:opacity-100"
                  onPrev={(e) => handlePrevImage(center.id, center.images.length, e)}
                  onNext={(e) => handleNextImage(center.id, center.images.length, e)}
                  prevAriaLabel="Imagen anterior"
                  nextAriaLabel="Siguiente imagen"
                />

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                  {center.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? 'w-4 bg-[#25a175]' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Brand / Logo Badge */}
                <div className="absolute top-4 left-4 bg-slate-900/40 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider">
                  {center.badge || 'Kaelos Oficial'}
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start space-y-3.5">
                <div>
                  <h3 className="text-lg sm:text-[19px] font-black text-slate-900 tracking-tight mb-2.5">
                    {center.name}
                  </h3>

                  <div className="space-y-2.5">
                    {/* Teléfono */}
                    <div className="flex items-start justify-between gap-3 group/field">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 flex-shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono comercial</span>
                          <span className="text-slate-700 font-extrabold text-xs sm:text-[13px]">{center.phone}</span>
                        </div>
                      </div>
                      <button
                        id={`copy-phone-${center.id}`}
                        onClick={() => copyToClipboard(center.phone, `${center.id}-phone`)}
                        className="p-1.5 text-slate-400 hover:text-[#25a175] hover:bg-slate-50 rounded-lg transition-all cursor-pointer flex-shrink-0 relative"
                        title="Copiar teléfono"
                      >
                        {copiedStates[`${center.id}-phone`] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none animate-fade-in">
                              ¡Copiado!
                            </span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Ubicación */}
                    <div className="flex items-start justify-between gap-3 group/field">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ver ubicación</span>
                          <span className="text-slate-700 font-bold text-xs sm:text-[13px] leading-snug">{center.location}</span>
                        </div>
                      </div>
                      <button
                        id={`copy-loc-${center.id}`}
                        onClick={() => copyToClipboard(center.location, `${center.id}-loc`)}
                        className="p-1.5 text-slate-400 hover:text-[#25a175] hover:bg-slate-50 rounded-lg transition-all cursor-pointer flex-shrink-0 relative"
                        title="Copiar ubicación"
                      >
                        {copiedStates[`${center.id}-loc`] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none animate-fade-in">
                              ¡Copiado!
                            </span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Horarios */}
                    <div className="flex items-start justify-between gap-3 group/field">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Horario</span>
                          <span className="text-slate-500 font-semibold text-xs sm:text-[12px] leading-relaxed whitespace-pre-line">{center.hours}</span>
                        </div>
                      </div>
                      <button
                        id={`copy-hours-${center.id}`}
                        onClick={() => copyToClipboard(center.hours, `${center.id}-hours`)}
                        className="p-1.5 text-slate-400 hover:text-[#25a175] hover:bg-slate-50 rounded-lg transition-all cursor-pointer flex-shrink-0 relative"
                        title="Copiar horario"
                      >
                        {copiedStates[`${center.id}-hours`] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none animate-fade-in">
                              ¡Copiado!
                            </span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* External Maps Action */}
                <div className="pt-2 mt-auto">
                  <a
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200/50"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
