import React, { useState, useEffect } from "react";
import { fetchSettingsAsync } from "../data/staticContent";
import { resolveImageUrl } from "../utils/cms";
import { GeneralSettingsContent } from "../types/content";
import sellMotoBannerAsset from "../assets/images/sell_moto_banner_1784099881295.jpg";

interface SellMotoBannerProps {
  onAction?: () => void;
}

export const SellMotoBanner: React.FC<SellMotoBannerProps> = ({ onAction }) => {
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await fetchSettingsAsync();
      if (s) setDbSettings(s);
    }
    loadSettings();
  }, []);

  const bannerImg = resolveImageUrl(dbSettings?.banners?.sellMotoBanner) || sellMotoBannerAsset;

  return (
    <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3.5">
      {/* Container with responsive gradient background matching the screenshot */}
      <div 
        className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] bg-gradient-to-b md:bg-gradient-to-r from-[#173753] via-[#214a70] to-[#5096d4] shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/10 flex flex-col md:flex-row md:items-center justify-between min-h-[300px] md:min-h-[170px] md:h-[170px]"
      >
        {/* Left / Top Section: Text and Button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left p-5 sm:p-6 md:pl-10 lg:pl-12 z-10 max-w-full md:max-w-[50%] justify-center space-y-3 md:space-y-3.5">
          <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-black tracking-tight leading-tight max-w-md">
            ¡Vende o intercambia tu moto antigua!
          </h2>
          <button
            onClick={onAction}
            className="bg-white text-[#173753] hover:text-[#ff0d41] font-extrabold text-[10px] sm:text-xs tracking-wider px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl uppercase transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            MÁS INFORMACIÓN
          </button>
        </div>

        {/* Right / Bottom Section: Image of classic blue motorcycle and hand holding Euros */}
        <div className="relative w-full md:w-1/2 h-[180px] md:h-full overflow-hidden flex items-end justify-center md:justify-end">
          <img
            src={bannerImg}
            alt="Vende tu moto antigua"
            referrerPolicy="no-referrer"
            className="absolute bottom-0 right-0 w-full h-full object-cover object-bottom md:object-right-bottom mix-blend-lighten opacity-95 md:opacity-100 scale-100 md:scale-105"
          />
          {/* Subtle gradient overlay to smoothly blend image edge on desktop */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#214a70]/0 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
