import React, { useState, useEffect } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  AlertTriangle, 
  Bell, 
  Heart
} from 'lucide-react';
import { MotorbikeExtended } from './MotorbikeCard';
import { getCategoryFallbackGallery } from '../utils/images';
import { CarouselArrows } from './ui/CarouselArrows';
import { FavoriteButton } from './ui/FavoriteButton';

interface MotoImagesViewProps {
  bike: MotorbikeExtended | null;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

// High quality mock images of specific bike parts for imperfections
const IMPERFECTION_MOCKS = [
  {
    title: 'Roce leve en escape',
    desc: 'Pequeño rasguño estético superficial en el protector térmico del silencioso. No afecta al rendimiento ni al sonido del escape.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Desgaste menor en puño izquierdo',
    desc: 'Desgaste habitual por uso en la goma del puño del manillar izquierdo. Tacto correcto y sin holguras.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Pequeña marca en llanta delantera',
    desc: 'Leve marca de gravilla en el perfil exterior de la llanta de aleación delantera. Neumático revisado con profundidad óptima.',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'
  }
];

const DEFAULT_HARLEY: MotorbikeExtended = {
  id: 'harley-heritage-classic',
  brand: 'Harley Davidson',
  model: 'Heritage Classic',
  year: 2024,
  kms: 7615,
  power: '94 CV',
  price: 22999,
  category: 'Custom',
  image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
  images: [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'
  ],
  fuel: 'Gasolina'
};

export default function MotoImagesView({ 
  bike, 
  favorites, 
  onToggleFavorite, 
  onClose 
}: MotoImagesViewProps) {
  const currentBike = bike || DEFAULT_HARLEY;
  const isFav = favorites.includes(currentBike.id);

  const bikeCond = (currentBike.condition || (currentBike.kms === 0 ? 'nueva' : 'ocasión')).toLowerCase();
  const isOcasion = bikeCond.includes('ocasion') || bikeCond.includes('ocasión');
  const imperfectionsList = currentBike.imperfections || [];
  const hasImperfections = isOcasion && imperfectionsList.length > 0;

  // Tabs: 'galeria' | 'imperfecciones'
  const [activeTab, setActiveTab] = useState<'galeria' | 'imperfecciones'>(() => {
    if (!hasImperfections) return 'galeria';
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const slides = params.get('slides');
    return (slides && slides.toUpperCase() === 'DAMAGES') ? 'imperfecciones' : 'galeria';
  });
  const [activeIdx, setActiveIdx] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const imgStr = params.get('img');
    if (imgStr) {
      const num = parseInt(imgStr, 10);
      if (!isNaN(num) && num > 0) {
        return num - 1; // 1-based index to 0-based
      }
    }
    return 0;
  });

  // Sync state back to URL query parameters when they change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentSlides = activeTab === 'imperfecciones' ? 'DAMAGES' : 'GALLERY';
    const currentImg = (activeIdx + 1).toString();
    
    let changed = false;
    if (params.get('slides') !== currentSlides) {
      params.set('slides', currentSlides);
      changed = true;
    }
    if (params.get('img') !== currentImg) {
      params.set('img', currentImg);
      changed = true;
    }
    if (!params.get('flow')) {
      params.set('flow', 'SALE');
      changed = true;
    }
    
    if (changed) {
      const newSearch = params.toString();
      const newPath = `${window.location.pathname}?${newSearch}`;
      window.history.replaceState(null, '', newPath);
    }
  }, [activeTab, activeIdx]);

  // Synchronize state from URL query parameters (e.g. if back/forward navigation occurs)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const slides = params.get('slides');
      const targetTab = (hasImperfections && slides && slides.toUpperCase() === 'DAMAGES') ? 'imperfecciones' : 'galeria';
      if (targetTab !== activeTab) {
        setActiveTab(targetTab);
      }
      const imgStr = params.get('img');
      if (imgStr) {
        const num = parseInt(imgStr, 10);
        if (!isNaN(num) && num > 0) {
          const targetIdx = num - 1;
          if (targetIdx !== activeIdx) {
            setActiveIdx(targetIdx);
          }
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [activeTab, activeIdx, hasImperfections]);

  // Lock scrolling when fullscreen gallery is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const galleryImages = currentBike.images && currentBike.images.length > 0 
    ? currentBike.images 
    : getCategoryFallbackGallery(currentBike.category, currentBike.image);

  const currentImages = activeTab === 'galeria' 
    ? galleryImages 
    : imperfectionsList.map(m => m.image);

  const totalCount = currentImages.length;

  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIdx((prev) => (prev === 0 ? totalCount - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIdx((prev) => (prev === totalCount - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalCount <= 1) return;
    setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos || totalCount <= 1) return;
    const diffX = touchStartPos.x - e.changedTouches[0].clientX;
    const diffY = touchStartPos.y - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartPos(null);
  };

  return (
    <div className="fixed inset-0 bg-white sm:bg-slate-50 z-[150] flex flex-col justify-between font-sans overflow-hidden">
      
      {/* 1. Header (Desktop only) / Top safe area */}
      <div className="relative w-full shrink-0 bg-white border-b border-slate-100/80 px-6 py-4 flex items-center justify-between z-20">
        
        {/* Empty left block on desktop to balance */}
        <div className="hidden sm:block w-10"></div>

        {/* Segmented Control Switcher in the top-center (Desktop Only) - Only for Ocasión with imperfections */}
        {hasImperfections ? (
          <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/50 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('galeria');
                setActiveIdx(0);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer
                ${activeTab === 'galeria' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }
              `}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galería</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('imperfecciones');
                setActiveIdx(0);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer
                ${activeTab === 'imperfecciones' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
                }
              `}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Imperfecciones</span>
            </button>
          </div>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {/* Close Button on far right */}
        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-black rounded-full transition-all active:scale-95 cursor-pointer shadow-xs ml-auto sm:ml-0"
          aria-label="Cerrar vista de imágenes"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. Main content area: Interactive viewer */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-4 overflow-hidden relative">
        
        {/* Main interactive media block */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] bg-white border border-slate-200/60 sm:border-slate-100 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm sm:shadow-lg relative group/viewer flex items-center justify-center touch-pan-y"
        >
          
          <img
            src={currentImages[activeIdx]}
            alt={`${currentBike.brand} ${currentBike.model} - ${activeTab}`}
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Action pills overlay (Top Right) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-10">
            <FavoriteButton
              bikeId={currentBike.id}
              isFavorite={isFav}
              onToggle={onToggleFavorite}
              size="md"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-slate-100"
            />
          </div>

          {/* Arrow Navigation Buttons */}
          <CarouselArrows
            variant="overlay"
            size="lg"
            buttonClassName="!left-3 sm:!left-6 !right-3 sm:!right-6 shadow-lg"
            onPrev={handlePrev}
            onNext={handleNext}
            prevAriaLabel="Imagen anterior"
            nextAriaLabel="Imagen siguiente"
          />

          {/* Counter pill (Bottom Right) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <span className="bg-white/95 text-slate-900 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-md select-none border border-slate-100/80">
              {activeIdx + 1} / {totalCount}
            </span>
          </div>

          {/* Imperfections info overlay label removed as per user delete request */}

        </div>

        {/* 3. Horizontal Scrollable Thumbnail strip (Directly below the main image) */}
        <div className="w-full max-w-4xl mt-4 sm:mt-6 overflow-hidden">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1 custom-scrollbar scroll-smooth">
            {currentImages.map((img, index) => {
              const isActive = index === activeIdx;
              return (
                <button
                  key={`thumb-${index}`}
                  onClick={() => setActiveIdx(index)}
                  className={`relative shrink-0 w-[72px] sm:w-[92px] aspect-[4/3] rounded-xl overflow-hidden transition-all duration-150 cursor-pointer focus:outline-none
                    ${isActive 
                      ? 'border-2 border-[#ff0d41] ring-2 ring-[#ff0d41]/15 scale-95 shadow-sm' 
                      : 'border border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }
                  `}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeTab === 'imperfecciones' && (
                    <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 py-0.5 rounded-md flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>



      {/* 5. Mobile Switcher pinned to the bottom (Mobile only) - Only for Ocasión with imperfections */}
      {hasImperfections && (
        <div className="sm:hidden w-full bg-white border-t border-slate-100 p-3 pb-6 shrink-0 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200/50 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('galeria');
                setActiveIdx(0);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-200 cursor-pointer
                ${activeTab === 'galeria' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-500'
                }
              `}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galería</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('imperfecciones');
                setActiveIdx(0);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-200 cursor-pointer
                ${activeTab === 'imperfecciones' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-500'
                }
              `}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Imperfecciones</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
