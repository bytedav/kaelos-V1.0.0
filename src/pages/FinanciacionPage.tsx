import React, { useState, useEffect } from 'react';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';
import { fetchSettingsAsync } from '../data/staticContent';
import { GeneralSettingsContent } from '../types/content';
import financiacionHeroDesktop from '../assets/images/financiacion_hero_desktop_1784964041050.jpg';
import financiacionHeroMobile from '../assets/images/financiacion_hero_mobile_1784964055762.jpg';

interface FinanciacionPageProps {
  onNavigate: (page: any) => void;
}

export default function FinanciacionPage({ onNavigate }: FinanciacionPageProps) {
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await fetchSettingsAsync();
      if (s) setDbSettings(s);
    }
    loadSettings();
  }, []);

  const heroMobile = dbSettings?.banners?.financiacionHeroMobile || financiacionHeroMobile;
  const heroDesktop = dbSettings?.banners?.financiacionHeroDesktop || financiacionHeroDesktop;

  return (
    <div className="w-full bg-[#f4f4f4] min-h-screen text-slate-900 font-sans select-none relative" id="financiacion-root">
      <WhatsAppButton 
        variant="floating" 
        message="Hola, estoy interesado en financiar una moto con Kaelos."
        ariaLabel="Consultar financiación por WhatsApp"
      />
      
      {/* 1. HERO SECTION (Financia tu moto de forma flexible) */}
      <section 
        className="relative w-full min-h-[480px] bg-[#0c1622] flex items-center pt-24 pb-14 md:py-24 overflow-hidden border-b border-[#1a2533]"
        id="financiacion-hero"
      >
        {/* Mobile Background Image */}
        <div 
          className="md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${heroMobile})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/40" />
        </div>

        {/* Desktop / Laptop Background Image */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${heroDesktop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex justify-center text-center">
          {/* Centered text Container */}
          <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] md:leading-[1.1] drop-shadow-md">
              Financia tu moto <br className="hidden sm:inline" />
              de forma flexible
            </h1>
            
            <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-md drop-shadow">
              ¡Haz clic y aprovecha las ventajas de la financiación!
            </p>

            <div>
              <button
                onClick={() => onNavigate('compra')}
                className="px-8 py-4 rounded-[14px] bg-white hover:bg-slate-100 text-[#111215] font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                id="btn-financiar-hero"
              >
                FINANCIAR AHORA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION (¿Cómo puedo financiar mi moto?) */}
      <section className="bg-white py-14 md:py-20 border-b border-slate-100" id="financiacion-como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111215] tracking-tight">
            ¿Cómo puedo financiar mi moto?
          </h2>

          {/* Grid of steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pt-4">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
              {/* Numeric Indicator */}
              <div className="w-12 h-12 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#111215] tracking-tight">
                  Elige tu moto
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
                  Resérvala en nuestra web o contacta con nuestros comerciales.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#111215] tracking-tight">
                  Calcula tu cuota
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
                  Configura tu compra y selecciona la financiación que prefieras.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#111215] tracking-tight">
                  Envía tus documentos
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
                  Remitiremos la solicitud a la entidad financiera para su estudio y aprobación.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                4
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#111215] tracking-tight">
                  Disfruta de tu moto
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
                  Una vez aprobada, la prepararemos para entregártela dónde nos indiques.
                </p>
              </div>
            </div>

          </div>

          {/* Centered CTA Button */}
          <div className="pt-6">
            <button
              onClick={() => onNavigate('compra')}
              className="px-10 py-4 rounded-[12px] bg-[#222428] hover:bg-black text-white font-bold text-sm tracking-widest uppercase transition-all shadow-md active:scale-[0.98] cursor-pointer"
              id="btn-empezar-como-funciona"
            >
              EMPEZAR AHORA
            </button>
          </div>

        </div>
      </section>



    </div>
  );
}
