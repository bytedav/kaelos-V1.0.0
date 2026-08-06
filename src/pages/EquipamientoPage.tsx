import React, { useState } from 'react';
import { 
  ShieldCheck,
  Package,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface EquipamientoPageProps {
  onNavigateHome: () => void;
  onNavigateServicios: () => void;
}

export default function EquipamientoPage({ onNavigateHome, onNavigateServicios }: EquipamientoPageProps) {
  // FAQ accordion open index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="w-full bg-[#fafbfe] text-slate-900 min-h-screen">
      {/* HEADER HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-slate-900 min-h-[460px] md:min-h-[640px] flex items-center pt-24 pb-16 md:py-28 -mt-14 sm:-mt-16">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1800&q=80')` }}
        />
        {/* Gradient overlays: crisp readability for text while keeping the motorcycle photo vivid */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 lg:hidden block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Text & Features */}
            <div className="lg:col-span-7 text-left space-y-4 md:space-y-6 text-white drop-shadow-md">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)]">
                  Equipa tu moto con maletas y accesorios profesionales
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed max-w-2xl hidden md:block [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
                  Compra tus accesorios oficiales con instalación profesional directa en nuestros talleres y la máxima garantía de compatibilidad.
                </p>
              </div>

              {/* Checkmarks list */}
              <div className="space-y-3 pt-2 max-w-lg hidden md:block">
                {[
                  'Marcas líderes del sector (Shad, Givi...)',
                  'Compra e instalación profesional homologada',
                  'Garantía oficial y el mejor precio combinado'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow">✓</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide [text-shadow:_0_1px_6px_rgba(0,0,0,0.8)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Clean Button Card */}
            <div className="lg:col-span-5 w-full">
              <button
                    type="button"
                    onClick={onNavigateServicios}
                    className="w-full bg-[#232426] hover:bg-[#111214] active:scale-[0.98] text-white text-xs sm:text-sm font-black py-4 px-6 rounded-2xl transition duration-150 shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                  >
                    <span>Ver Catálogo Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
            </div>

          </div>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-b border-slate-100">
        <h2 className="text-[26px] sm:text-[32px] font-black text-[#000000] tracking-tight mb-8 sm:mb-12">
          ¿Cómo funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 max-w-6xl mx-auto">
          {/* Card 01 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 sm:p-10 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              01
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-[#000000] tracking-tight leading-snug">
              Indícanos tu moto
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Contacta con nosotros e indícanos la marca y modelo de tu moto.
            </p>
          </div>

          {/* Card 02 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 sm:p-10 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              02
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-[#000000] tracking-tight leading-snug">
              Te asesoramos
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Te llamamos para resolver dudas y coordinar la instalación en nuestro taller.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 sm:p-10 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              03
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-[#000000] tracking-tight leading-snug">
              Entrega tu moto
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Una vez tu moto entre en el taller, haremos el montaje y te avisaremos cuando esté lista para recoger.
            </p>
          </div>
        </div>
      </section>

      {/* ACCESORIOS DESTACADOS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl md:text-[28px] font-black text-[#000000] tracking-tight mb-5 sm:mb-7 text-center">
          Amplia gama de accesorios
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {/* Card 1: Baúles traseros */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80" 
                alt="Baúles traseros" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              Baúles traseros
            </span>
          </div>

          {/* Card 2: Maletas laterales */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80" 
                alt="Maletas laterales" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              Maletas laterales
            </span>
          </div>

          {/* Card 3: Bolsas sobredepósito */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=400&q=80" 
                alt="Bolsas sobredepósito" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              Bolsas sobredepósito
            </span>
          </div>

          {/* Card 4: Alforjas */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80" 
                alt="Alforjas" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              Alforjas
            </span>
          </div>

          {/* Card 5: Petates traseros */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=400&q=80" 
                alt="Petates traseros" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              Petates traseros
            </span>
          </div>

          {/* Card 6: ¡Y muchos más! */}
          <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[24px] p-3 sm:p-4 flex flex-col items-center justify-between min-h-[180px] sm:min-h-[220px] hover:shadow-md transition duration-200">
            <div className="w-full aspect-square bg-white rounded-[18px] flex items-center justify-center p-2.5 sm:p-3.5 shadow-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80" 
                alt="¡Y muchos más!" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-cover rounded-[12px]"
              />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#000000] tracking-tight mt-2.5 sm:mt-4 text-center leading-tight">
              ¡Y muchos más!
            </span>
          </div>
        </div>
      </section>

      {/* VENTAJAS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center border-b border-slate-100/60">
        <h2 className="text-2xl sm:text-[32px] font-black text-[#232426] tracking-tight mb-8 sm:mb-12">
          Por qué equipar tu moto con nosotros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {/* Advantage 1 */}
          <div className="bg-white border border-[#eef0f3] rounded-[24px] p-6 sm:p-8 text-left space-y-4 min-h-[160px] shadow-sm">
            <div className="w-10 h-10 rounded-[12px] bg-[#ff0d41]/10 flex items-center justify-center text-[#ff0d41] shrink-0">
              <Package className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[16px] sm:text-[18px] font-black text-[#232426] tracking-tight leading-snug">
                Accesorios 100% Originales
              </h3>
              <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
                Trabajamos de forma directa con distribuidores de Shad y Givi garantizando la autenticidad.
              </p>
            </div>
          </div>

          {/* Advantage 2 */}
          <div className="bg-white border border-[#eef0f3] rounded-[24px] p-6 sm:p-8 text-left space-y-4 min-h-[160px] shadow-sm">
            <div className="w-10 h-10 rounded-[12px] bg-[#ff0d41]/10 flex items-center justify-center text-[#ff0d41] shrink-0">
              <MapPin className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[16px] sm:text-[18px] font-black text-[#232426] tracking-tight leading-snug">
                Instalación profesional certificada
              </h3>
              <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
                Nuestros mecánicos especialistas se encargan de la fijación y prueba dinámica en taller oficial.
              </p>
            </div>
          </div>

          {/* Advantage 3 */}
          <div className="bg-white border border-[#eef0f3] rounded-[24px] p-6 sm:p-8 text-left space-y-4 min-h-[160px] shadow-sm">
            <div className="w-10 h-10 rounded-[12px] bg-[#ff0d41]/10 flex items-center justify-center text-[#ff0d41] shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[16px] sm:text-[18px] font-black text-[#232426] tracking-tight leading-snug">
                Garantía oficial completa
              </h3>
              <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
                Todas las maletas y la instalación disfrutan de garantía contra defectos y desajustes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="bg-white py-12 sm:py-16 text-left">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          <h2 className="text-2xl sm:text-[32px] font-black text-[#000000] tracking-tight leading-tight">
            Preguntas frecuentes sobre equipamiento
          </h2>
 
          <div className="space-y-4">
            {[
              {
                q: "¿Qué incluye la instalación de las maletas?",
                a: "La instalación incluye el herraje específico para tu modelo de moto, la fijación de la maleta trasera (o maletas laterales) y el test de seguridad de anclaje antes de la entrega."
              },
              {
                q: "¿Las maletas traseras vienen con llave de repuesto?",
                a: "Sí, todos los Top Case y maletas laterales del catálogo oficial incluyen bombín con su respectivo juego de llaves duplicado de seguridad."
              },
              {
                q: "¿Es necesario homologar las maletas para la Inspección Técnica Vehicular (CITV)?",
                a: "No. Las maletas y herrajes homologados que instalamos se consideran accesorios desmontables autorizados y no requieren reformas de importancia ni anotación en la tarjeta para la Inspección Técnica (CITV)."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="transition-all duration-200">
                  {isOpen ? (
                    <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-6 sm:p-10 shadow-xs transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(null)}
                        className="w-full text-left flex items-start gap-3.5 cursor-pointer outline-none select-none"
                      >
                        <span className="text-[#ff0d41] font-black text-xl sm:text-2xl shrink-0 leading-none">
                          −
                        </span>
                        <span className="text-[16px] sm:text-[18px] font-black text-[#000000] tracking-tight leading-snug">
                          {faq.q}
                        </span>
                      </button>
                      
                      <div className="pt-4 pl-7 sm:pl-8">
                        <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(index)}
                      className="w-full text-left py-3.5 px-4 sm:px-6 flex items-center gap-3.5 cursor-pointer outline-none select-none hover:bg-slate-50/50 rounded-[16px] transition duration-150"
                    >
                      <span className="text-[#ff0d41] font-black text-xl sm:text-2xl shrink-0 leading-none">
                        +
                      </span>
                      <span className="text-[15px] sm:text-[16px] font-bold text-[#000000] leading-snug">
                        {faq.q}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
 
        </div>
      </section>

      {/* FINAL CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-[#f8f9fb] border border-[#eef0f3] rounded-[32px] p-8 sm:p-12 md:p-14 text-center space-y-4 sm:space-y-5 max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-[28px] font-black text-[#232426] tracking-tight leading-tight">
            ¿Quieres equipar tu moto?
          </h2>
          <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed max-w-xl mx-auto">
            Ponte en contacto con nuestro taller y te daremos las mejores opciones de accesorios compatibles para tu modelo de moto.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateServicios}
              className="inline-flex items-center justify-center bg-[#232426] hover:bg-[#1a1b1d] text-white font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase py-3.5 px-8 sm:px-12 rounded-[14px] transition duration-150 cursor-pointer active:scale-98"
            >
              Contactar con taller
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

