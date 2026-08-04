import React from "react";
import { StyleCategoryCard } from "./StyleCategoryCard";
import { SITE_CONFIG } from "../data/siteConfig";

import adventureImg from "../assets/images/adventure_red_studio_1784099131268.jpg";
import scooterImg from "../assets/images/scooter_red_studio_1784099142309.jpg";
import customImg from "../assets/images/custom_red_studio_1784099153044.jpg";
import sportImg from "../assets/images/sport_red_studio_1784099164293.jpg";

interface StyleCategorySectionProps {
  onSelectCategory: (category: string) => void;
}

const DEFAULT_IMAGES: Record<string, string> = {
  trail: adventureImg,
  scooter: scooterImg,
  custom: customImg,
  naked: sportImg,
  deportiva: sportImg,
  touring: adventureImg,
};

export const StyleCategorySection: React.FC<StyleCategorySectionProps> = ({
  onSelectCategory,
}) => {
  const categories = SITE_CONFIG.styleCategories.map((item) => ({
    ...item,
    image: DEFAULT_IMAGES[item.category] || adventureImg,
  }));

  return (
    <section className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-6">
      {/* Heading */}
      <div className="text-left">
        <h2 className="text-[22px] sm:text-[28px] font-black text-slate-900 tracking-tight leading-tight">
          Seas como seas, tenemos tu próxima moto
        </h2>
      </div>

      {/* Cards Container (Horizontal scrolling on mobile/tablet, 4-column grid on desktop) */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x px-4 sm:px-0 -mx-4 sm:mx-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((card, idx) => (
          <StyleCategoryCard
            key={idx}
            title={card.title}
            desc={card.desc}
            image={card.image}
            category={card.category}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
};
