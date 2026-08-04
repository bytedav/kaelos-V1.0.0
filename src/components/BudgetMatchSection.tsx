import React, { useRef, useState } from 'react';
import { getBudgetBikesData, budgetBikesData } from '../data/budgetBikesData';
import { StyleBikeCard } from './StyleBikeCard';
import { StyleBike } from '../types';
import { MotorbikeExtended } from './MotorbikeCard';
import { BikeCardSkeleton } from './ui/Skeleton';

interface BudgetMatchSectionProps {
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onExploreCategory?: (categoryLabel: string) => void;
  onSelect?: (moto: StyleBike) => void;
  motorbikesList?: MotorbikeExtended[];
  isLoading?: boolean;
}

export const BudgetMatchSection: React.FC<BudgetMatchSectionProps> = ({
  favorites,
  onToggleFavorite,
  onExploreCategory,
  onSelect,
  motorbikesList,
  isLoading = false
}) => {
  const categories = [
    { id: 'menos_de_2k', label: 'MENOS DE S/. 2K', btnLabel: 'MENOS DE S/. 2K' },
    { id: '2k_4k', label: 'S/. 2K-4K', btnLabel: 'S/. 2K-4K' },
    { id: '4k_6k', label: 'S/. 4K-6K', btnLabel: 'S/. 4K-6K' },
    { id: '6k_8k', label: 'S/. 6K-8K', btnLabel: 'S/. 6K-8K' },
    { id: '8k_12k', label: 'S/. 8K-12K', btnLabel: 'S/. 8K-12K' },
    { id: '12k_18k', label: 'S/. 12K-18K', btnLabel: 'S/. 12K-18K' },
    { id: 'mas_de_18k', label: 'MÁS DE S/. 18K', btnLabel: 'MÁS DE S/. 18K' }
  ];

  const activeBudgetData = motorbikesList && motorbikesList.length > 0 
    ? getBudgetBikesData(motorbikesList) 
    : budgetBikesData;

  const [activeBudget, setActiveBudget] = useState('menos_de_2k');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleSelectTab = (budgetCategory: string) => {
    if (budgetCategory === activeBudget) return;
    setIsTabLoading(true);
    setActiveBudget(budgetCategory);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 300);
  };


  // Drag to scroll logic for desktop mouse users
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

  const selectedCategory = categories.find(c => c.id === activeBudget);
  const currentBikes = activeBudgetData[activeBudget] || [];

  return (
    <section className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 space-y-3">
      {/* Title */}
      <div className="text-left">
        <h2 className="text-[20px] sm:text-[26px] font-black text-slate-900 tracking-tight">
          ¿Hacemos match con tu presupuesto?
        </h2>
      </div>

      {/* Budget tabs/pills navigation */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1.5 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = activeBudget === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSelectTab(category.id);
              }}
              className={`py-2 px-4.5 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer select-none ${
                isActive
                  ? 'bg-white border border-slate-200 text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-[1.01]'
                  : 'text-slate-400 hover:text-slate-600 bg-transparent border border-transparent'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Carousel Wrapper */}
      <div className="relative group">
        {/* Horizontal scroll container */}
        <div
          ref={carouselRef}
          className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-2 px-4 sm:px-0 -mx-4 sm:mx-0 cursor-grab active:cursor-grabbing select-none snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? '' : 'scroll-smooth'
          }`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {isLoading || isTabLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <BikeCardSkeleton 
                key={`budget-skeleton-${idx}`} 
                className="w-[85vw] sm:w-[320px] lg:w-[calc((100%-96px)/4.25)] shrink-0 snap-start"
              />
            ))
          ) : (
            currentBikes.map((moto) => (
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

      {/* Action Button: VER TODAS LAS MOTOS DE... */}
      <div className="text-center pt-0 px-4 sm:px-0">
        <button
          onClick={() => {
            if (onExploreCategory) {
              onExploreCategory(selectedCategory?.btnLabel || '');
            }
          }}
          className="bg-brand-dark text-white w-full max-w-xs sm:max-w-md py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-dark-hover transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
        >
          VER TODAS LAS MOTOS DE {selectedCategory?.btnLabel}
        </button>
      </div>
    </section>
  );
};
