import React, { useRef, useState } from 'react';
import { StyleBike } from '../types';
import { StyleBikeCard } from './StyleBikeCard';
import { BikeCardSkeleton } from './ui/Skeleton';

interface StyleBikeCarouselProps {
  bikes: StyleBike[];
  isStyleLoading: boolean;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect?: (moto: StyleBike) => void;
}

export const StyleBikeCarousel: React.FC<StyleBikeCarouselProps> = ({
  bikes,
  isStyleLoading,
  favorites,
  onToggleFavorite,
  onSelect
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = carouselRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative group">
      <div 
        ref={carouselRef}
        id="bike-style-carousel"
        className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-1.5 px-4 sm:px-0 -mx-4 sm:mx-0 cursor-grab active:cursor-grabbing select-none snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? '' : 'scroll-smooth'
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {isStyleLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <BikeCardSkeleton 
              key={`skeleton-${idx}`} 
              className="w-[85vw] sm:w-[320px] lg:w-[calc((100%-96px)/4.25)] shrink-0 snap-start"
            />
          ))
        ) : (
          bikes.map((moto) => (
            <StyleBikeCard 
              key={moto.id}
              moto={moto}
              isSaved={favorites.includes(moto.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};
