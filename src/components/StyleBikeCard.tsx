import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { StyleBike } from '../types';
import { formatSoles } from '../utils/format';
import { CarouselArrows } from './ui/CarouselArrows';
import { Badge } from './common/Badge';

interface StyleBikeCardProps {
  moto: StyleBike;
  isSaved: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect?: (moto: StyleBike) => void;
  className?: string;
  isReserved?: boolean;
}

export const StyleBikeCard: React.FC<StyleBikeCardProps> = ({
  moto,
  isSaved,
  onToggleFavorite,
  onSelect,
  className,
  isReserved: propIsReserved
}) => {
  const isReserved = propIsReserved || moto.isReserved;
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const totalImages = moto.images.length;

  useEffect(() => {
    if (isVisible) return;
    const el = imgContainerRef.current;
    if (!el) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '250px 0px',
          threshold: 0.01
        }
      );

      observer.observe(el);
      return () => {
        if (el) observer.unobserve(el);
      };
    } else {
      setIsVisible(true);
    }
  }, [isVisible]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoaded(false);
    setCurrentImgIdx((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoaded(false);
    setCurrentImgIdx((prev) => (prev + 1) % totalImages);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(moto);
    } else {
      alert(`Has seleccionado: ${moto.brand} ${moto.model}. ¡Disponible para entrega inmediata!`);
    }
  };

  const dynamicHref = `/moto/${moto.id}`;

  // Condition badge determination (NUEVA / OCASIÓN)
  const isNewMoto = moto.isNew || (moto.condition && moto.condition.toLowerCase() === 'nueva') || moto.kms === '0' || moto.kms === '0 KM';
  const conditionText = isNewMoto ? 'NUEVA' : (moto.condition ? moto.condition.toUpperCase() : 'OCASIÓN');

  // Offer badge determination (OFERTA -S/. XXX)
  const hasDiscount = moto.hasOffer || (!!moto.oldPrice && moto.oldPrice > moto.price);
  const discountAmount = (moto.oldPrice && moto.oldPrice > moto.price) ? (moto.oldPrice - moto.price) : 0;
  const offerText = discountAmount > 0 
    ? `OFERTA -S/. ${discountAmount.toLocaleString('es-PE')}` 
    : 'OFERTA';

  const formattedKms = (() => {
    const raw: any = moto.kms;
    if (raw === undefined || raw === null) return '0 KM';
    if (typeof raw === 'number') {
      return raw === 0 ? '0 KM' : `${raw.toLocaleString('es-PE')} KM`;
    }
    const str = String(raw).trim();
    if (!str) return '0 KM';
    if (/KM$/i.test(str)) {
      return str.toUpperCase();
    }
    const cleanDigits = str.replace(/[^\d]/g, '');
    if (cleanDigits) {
      const parsed = parseInt(cleanDigits, 10);
      return `${parsed.toLocaleString('es-PE')} KM`;
    }
    return `${str} KM`.toUpperCase();
  })();

  const computedFinancePrice = (() => {
    if (moto.financePrice && moto.financePrice > 0) return moto.financePrice;
    if (moto.rentingPrice && moto.rentingPrice > 0) return moto.rentingPrice;
    if (moto.price && moto.price > 0) {
      return Math.round(moto.price * 0.0214) || Math.round(moto.price * 0.018 + 12);
    }
    return 0;
  })();

  return (
    <a 
      href={dynamicHref}
      onClick={handleCardClick}
      className={className || "w-[85vw] sm:w-[320px] lg:w-[calc((100%-96px)/4.25)] bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-slate-300 lg:hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between overflow-hidden shrink-0 snap-start cursor-pointer block"}
    >
      {/* Area de Imagen & Controles */}
      <div 
        ref={imgContainerRef}
        className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 select-none group/image border-b border-slate-200"
      >
        
        {/* Logo de kaelos posicionado en la esquina superior izquierda */}
        <div className="absolute top-4.5 left-4 z-10 flex items-center gap-0.5 select-none">
          <span className="font-extrabold text-[13px] tracking-tight leading-none text-slate-900">
            <span className="text-[#ff0d41]">kae</span>los
          </span>
        </div>

        {/* Status Badges (NUEVA/OCASIÓN y/o OFERTA) */}
        <div className="absolute top-3.5 right-3.5 z-10 flex flex-col items-end gap-1.5 pointer-events-none select-none">
          {/* Badge Estado (NUEVA u OCASIÓN) */}
          <span className="inline-flex items-center justify-center text-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-xs leading-none">
            {conditionText}
          </span>

          {/* Badge Oferta (OFERTA -S/. XXX) */}
          {hasDiscount && (
            <span className="inline-flex items-center justify-center text-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#ff0d41] text-white shadow-sm font-sans leading-none">
              {offerText}
            </span>
          )}
        </div>

        {/* Skeleton Placeholder while loading */}
        {(!isVisible || !isLoaded) && (
          <div className="absolute inset-0 bg-slate-200/60 animate-pulse pointer-events-none z-0" />
        )}

        {/* Imagen Activa con IntersectionObserver */}
        {isVisible && (
          <img 
            src={moto.images[currentImgIdx]} 
            alt={`${moto.brand} ${moto.model}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Controles de Imagen: Flechas `<` y `>` (visibles siempre en móviles, solo hover en laptops/pantallas grandes) */}
        {totalImages > 1 && (
          <CarouselArrows
            variant="overlay"
            size="sm"
            buttonClassName="opacity-100 lg:opacity-0 lg:group-hover/image:opacity-100"
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
        )}
      </div>

      {/* Detalles de la Moto */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-0.5 text-left">
          <h3 className="font-black text-slate-950 text-[14px] sm:text-[15px] tracking-tight leading-snug uppercase">
            {moto.brand} <span className="font-extrabold text-slate-900">{moto.model}{moto.version && !moto.model.toUpperCase().includes(moto.version.toUpperCase()) ? ` ${moto.version}` : ''}</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
            {moto.year}&nbsp;&nbsp;&nbsp;&nbsp;{formattedKms}
          </p>
        </div>

        {isReserved ? (
          <div className="pt-2">
            <div className="w-[calc(100%+2rem)] -mx-4 sm:-mx-4.5 bg-[#737373] text-white font-extrabold text-center py-3.5 uppercase tracking-widest text-sm sm:text-base">
              RESERVADA
            </div>
          </div>
        ) : (
          <div className="text-left space-y-0.5">
            <p className="font-black text-xl sm:text-2xl text-slate-950 tracking-tight leading-none">
              {formatSoles(moto.price)}
            </p>
            <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium mt-1">
              Financia desde <span className="font-semibold text-slate-800">{formatSoles(computedFinancePrice)}/mes</span>
            </p>
          </div>
        )}
      </div>

      {/* Botones de Footer de la Carta */}
      {isReserved ? (
        <div className="border-t border-slate-200 text-center py-3.5 bg-slate-100/90 hover:bg-slate-100 transition">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(moto.id, e);
            }}
            className="w-full text-slate-700 hover:text-rose-500 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold"
          >
            <Heart 
              className={`w-4.5 h-4.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} 
              strokeWidth={2} 
            />
            <span>{isSaved ? 'Guardada' : 'Guardar'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 border-t border-slate-200 text-center text-xs font-semibold">
          <button 
            onClick={handleCardClick}
            className="py-4 border-r border-slate-200 text-slate-500 hover:text-[#ff0d41] hover:bg-slate-50 transition active:scale-98 text-[12px] cursor-pointer"
          >
            Ver esta moto
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(moto.id, e);
            }}
            className="py-4 text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 active:scale-98 text-[12px] cursor-pointer"
          >
            <Heart 
              className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
              strokeWidth={2} 
            />
            <span>{isSaved ? 'Guardada' : 'Guardar'}</span>
          </button>
        </div>
      )}
    </a>
  );
};
