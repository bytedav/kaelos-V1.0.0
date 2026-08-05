import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VendePageProps {
  onNavigateHome: () => void;
  onNavigateCompra: () => void;
}

export default function VendePage({ onNavigateHome, onNavigateCompra }: VendePageProps) {
  // Accordion Expand State
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // URL del formulario externo especializado
  const externalFormUrl = 'https://forms.google.com';

  // Accordion Items content list
  const accordions = [
    {
      title: "Seguridad y confiabilidad",
      content: "Vender tu moto a un profesional como Kaelos te garantiza recibir el pago de forma inmediata y 100% segura. Evitas fraudes, impagos y todos los riesgos de seguridad y confidencialidad que conlleva tratar con particulares."
    },
    {
      title: "Evita quedar con desconocidos",
      content: "Olvídate de publicar tu teléfono privado en portales públicos, responder chats a deshoras o citarte en gasolineras con personas desconocidas para que prueben tu vehículo. En Kaelos gestionamos la compra de forma 100% digital y transparente."
    },
    {
      title: "Tranquilidad",
      content: "Cuando vendes una moto a un particular, eres legalmente responsable de los vicios ocultos y averías mecánicas durante los siguientes 6 meses. Al venderla a Kaelos, nosotros asumimos toda la garantía y la responsabilidad acaba en la entrega."
    },
    {
      title: "¡Fuera papeleo!",
      content: "Nos encargamos de toda la burocracia registral sin coste alguno para ti. Cambio de titularidad ante SUNARP y trámites notariales para que no te preocupes de nada."
    },
    {
      title: "¿Qué documentación es necesaria para poder vender mi moto?",
      content: "Para cerrar la operación con éxito solo necesitamos: 1) Tarjeta de Identificación Vehicular (TIV) original, 2) Certificado de Inspección Técnica Vehicular (CITV / Revisión Técnica), 3) Impuesto Vehicular (SAT) si corresponde y 4) DNI o Carnet de Extranjería (CE) de los titulares en vigor."
    }
  ];

  return (
    <div className="w-full bg-[#f8fafd] text-slate-900 min-h-screen font-sans pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Title and Subtitle - High Impact display typography */}
        <div className="max-w-4xl mb-6 sm:mb-8 space-y-1.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001929] tracking-tight leading-[1.05] text-left">
            Vende tu moto <span className="text-[#00bcd4]">online</span>
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-500 leading-relaxed text-left">
            ¿Qué opciones tengo para vender mi moto?
          </p>
        </div>

        {/* Desktop grid layout. On mobile, the CTA card shifts to the top (order-1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Advantages text card & FAQ accordions */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
            
            {/* Primary Advantages Paragraphs Card */}
            <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 sm:p-6 space-y-3 shadow-xs text-left">
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Vender una moto de segunda mano a un profesional en lugar de a un particular puede ofrecer una serie de ventajas significativas.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Estas ventajas benefician tanto al vendedor como al comprador, ya que proporcionan tranquilidad y hacen que el proceso sea más fluido y seguro.
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                Aquí hay algunas razones por las cuales elegir a un profesional podría ser la mejor opción:
              </p>
            </div>

            {/* Accordion FAQ collapse block */}
            <div className="space-y-2">
              {accordions.map((acc, index) => {
                const isOpen = openAccordion === index;
                return (
                  <div 
                    key={index} 
                    className={`bg-white border transition-all duration-200 shadow-xs text-left overflow-hidden ${
                      isOpen ? 'border-[#00bcd4]/30 rounded-[18px]' : 'border-slate-200/70 hover:border-slate-300 rounded-[14px]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : index)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-slate-850 font-bold text-xs sm:text-sm transition select-none outline-none"
                    >
                      <span className={`tracking-tight ${isOpen ? 'text-[#001929] font-black' : 'text-slate-800'}`}>
                        {acc.title}
                      </span>
                      {isOpen ? (
                        <div className="p-1 rounded-full bg-slate-50 text-[#00bcd4]">
                          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-slate-50 text-slate-400">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-3.5 pt-0.5 text-slate-550 text-[11px] sm:text-xs font-medium leading-relaxed border-t border-slate-50">
                            {acc.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Button card for specialized external form */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full">
            <div className="bg-[#002f46] rounded-[24px] sm:rounded-[28px] shadow-xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/5 space-y-6 text-left">
              
              {/* Subtle background overlay patterns */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bcd4]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#ff0d41]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-[#00bcd4]/20 text-[#00bcd4] border border-[#00bcd4]/30 inline-block">
                  Tasación en línea
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Vende tu moto con Kaelos
                </h2>
                <p className="text-xs sm:text-sm text-sky-200/80 font-medium leading-relaxed">
                  Completa la información de tu motocicleta en nuestro formulario especializado para obtener una tasación precisa, rápida y sin compromiso.
                </p>
              </div>

              {/* Botón directo al formulario externo */}
              <div className="relative z-10 pt-1">
                <a
                  href={externalFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#00bcd4] hover:bg-[#00a8cc] active:scale-[0.98] text-[#001929] text-xs sm:text-sm font-black py-4 px-6 rounded-full transition-all duration-150 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider text-center"
                >
                  <span>IR AL FORMULARIO DE TASACIÓN</span>
                  <ExternalLink className="w-4 h-4 text-[#001929] shrink-0" strokeWidth={2.5} />
                </a>
              </div>

              {/* Beneficios del formulario externo */}
              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2.5">
                <p className="text-[11px] font-bold text-sky-100 uppercase tracking-wider">¿Qué obtendrás en el formulario?</p>
                <ul className="space-y-2 text-xs text-sky-200/80 font-medium">
                  <li className="flex items-center gap-2.5 text-[12px]">
                    <Zap className="w-4 h-4 text-[#00bcd4] shrink-0" />
                    <span>Proceso 100% guiado paso a paso</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[12px]">
                    <ShieldCheck className="w-4 h-4 text-[#00bcd4] shrink-0" />
                    <span>Sube fotos e información detallada de tu moto</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[12px]">
                    <Clock className="w-4 h-4 text-[#00bcd4] shrink-0" />
                    <span>Respuesta y valoración en menos de 24 horas</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
