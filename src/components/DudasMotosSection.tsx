import React, { useState, useEffect } from 'react';
import dudasBannerImg from '../assets/images/dudas_motos_banner_1784104855721.jpg';
import { Modal } from './common/Modal';
import { ContactFormSection } from './ContactFormSection';
import { fetchSettingsAsync } from '../data/staticContent';
import { resolveImageUrl } from '../utils/cms';
import { GeneralSettingsContent } from '../types/content';

export const DudasMotosSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await fetchSettingsAsync();
      if (s) setDbSettings(s);
    }
    loadSettings();
  }, []);

  const bannerImg = resolveImageUrl(dbSettings?.banners?.dudasBanner) || dudasBannerImg;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      {/* Banner Card */}
      <div className="w-full bg-brand-red rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* TEXT & CTA HALF: Left on desktop, top on mobile */}
          <div className="w-full md:w-1/2 px-6 py-10 sm:py-14 md:py-16 text-center md:text-left flex flex-col items-center md:items-start justify-center space-y-6 md:pl-12 lg:pl-16">
            <h2 className="text-[22px] sm:text-[30px] md:text-[28px] lg:text-[34px] font-extrabold text-white tracking-tight leading-tight max-w-md">
              ¿Dudas entre tantas motos?
            </h2>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-brand-red hover:bg-slate-50 active:scale-95 font-extrabold text-xs sm:text-[13px] uppercase tracking-wider py-4 px-10 rounded-2xl transition-all duration-200 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.03]"
            >
              Te llamamos
            </button>
          </div>

          {/* IMAGE HALF: Right on desktop, bottom on mobile */}
          <div className="w-full md:w-1/2 relative self-stretch flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[260px] md:min-h-[280px]">
            {/* Dark gradient overlay matching background to blend cleanly */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red-dark via-brand-red to-brand-red-light opacity-95" />
            
            {/* Custom generated thoughtful man & adventure motorcycles image */}
            <div className="relative z-10 w-full h-full min-h-[220px] sm:min-h-[260px] md:min-h-[280px] flex items-center justify-center">
              <img
                src={bannerImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800';
                }}
                alt="Dudas entre motos"
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full min-h-[220px] sm:min-h-[260px] md:min-h-[280px] md:scale-105 transform hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
              />
              {/* Soft overlay gradient to blend with the container edge */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-brand-red/40 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* CONTACT FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        maxWidth="lg"
      >
        <div className="py-2">
          <ContactFormSection noWrapper />
        </div>
      </Modal>
    </section>
  );
};

