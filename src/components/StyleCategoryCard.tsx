import React from "react";

interface StyleCategoryCardProps {
  title: string;
  desc: string;
  image: string;
  category: string;
  onSelect: (category: string) => void;
}

export const StyleCategoryCard: React.FC<StyleCategoryCardProps> = ({
  title,
  desc,
  image,
  category,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(category)}
      className="w-[calc((100vw-48px)/2.25)] sm:w-[220px] md:w-[260px] lg:w-auto bg-white rounded-[20px] sm:rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden shrink-0 snap-start cursor-pointer group"
    >
      {/* Image Container with aspect-square on mobile, aspect-[4/3] on desktop */}
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-5 lg:p-6 flex-1 flex flex-col justify-start">
        <h3 className="font-bold text-slate-800 text-[14px] sm:text-[18px] tracking-tight leading-snug group-hover:text-[#ff0d41] transition-colors duration-300">
          {cardTitleTranslation(title)}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed mt-2 hidden sm:block">
          {desc}
        </p>
      </div>
    </div>
  );
};

// Helper helper to handle display name styling if needed, but we keep it identical
const cardTitleTranslation = (title: string) => {
  return title;
};
