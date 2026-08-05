import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  UserCheck,
  Building2,
  ChevronDown
} from 'lucide-react';

interface TramitesDocumentalesPageProps {
  onNavigateHome?: () => void;
  onNavigateServicios?: () => void;
}

export default function TramitesDocumentalesPage({ onNavigateHome, onNavigateServicios }: TramitesDocumentalesPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me gustaría solicitar información sobre trámites documentales y gestión en SUNARP / MTC para mi moto.");
    window.open(`https://wa.me/51900000000?text=${message}`, '_blank');
  };

  const faqs = [
    {
      q: "¿Cuánto tarda la transferencia registral de una moto en SUNARP?",
      a: "El trámite notarial y registral ante SUNARP se ingresa de forma telemática. Generamos la constancia de trámite en minutos y la Tarjeta de Identificación Vehicular Electrónica (TIVE) suele emitirse en 24 a 72 horas."
    },
    {
      q: "¿Qué documentos necesito para transferir una moto en Perú?",
      a: "Requerimos DNI o Carnet de Extranjería vigente de comprador y vendedor, Tarjeta de Propiedad / TIVE original, SOAT vigente y estar al día en impuesto vehicular ante el SAT si aplica."
    },
    {
      q: "¿Gestionáis trámite de placa física y tarjeta de propiedad (TIVE)?",
      a: "Sí, tramitamos la obtención o duplicado de la Tarjeta de Identificación Vehicular Electrónica (TIVE), duplicado de placas de rodaje ante la AAP/SUNARP e inscripción de garantías."
    },
    {
      q: "¿Necesito hacer colas en la notaría o SUNARP?",
      a: "No. En Kaelos nos encargamos de coordinar la firma notarial biométrica rápida y la presentación telemática directa ante SUNARP sin esperas."
    }
  ];

  return (
    <div className="w-full bg-[#fafbfe] text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-slate-900 min-h-[460px] md:min-h-[600px] flex items-center pt-24 pb-16 md:py-28 -mt-14 sm:-mt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1800&q=80')` }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 lg:hidden block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Title & Checkmarks */}
            <div className="lg:col-span-7 text-left space-y-4 md:space-y-6 text-white drop-shadow-md">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)]">
                  Gestionamos tus trámites en SUNARP y MTC 100% online
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed max-w-2xl hidden md:block [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
                  Sin colas ni trámites engorrosos: transferencias notariales, Tarjeta de Propiedad TIVE, duplicados de placa e informes registrales al instante.
                </p>
              </div>

              {/* Checkmarks list */}
              <div className="space-y-3 pt-2 max-w-lg hidden md:block">
                {[
                  'Transferencia registral y notarial sin salir de casa',
                  'Gestión telemática directa con SUNARP y SAT',
                  'Firma notarial biométrica y emisión de TIVE'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow">✓</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide [text-shadow:_0_1px_6px_rgba(0,0,0,0.8)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: CTA Button */}
            <div className="lg:col-span-5 w-full">
              <button
                type="button"
                onClick={onNavigateServicios || handleWhatsAppClick}
                className="w-full bg-[#232426] hover:bg-[#111214] active:scale-[0.98] text-white text-xs sm:text-sm font-black py-4 px-6 rounded-2xl transition duration-150 shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span>Consultar Trámites</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-b border-slate-100">
        <h2 className="text-[26px] sm:text-[32px] font-black text-slate-950 tracking-tight mb-8 sm:mb-12">
          ¿Cómo funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 01 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              01
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight leading-snug">
              Envía la documentación
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Mándanos fotos legibles o escaneados de los DNI y la documentación de la moto.
            </p>
          </div>

          {/* Card 02 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              02
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight leading-snug">
              Firma digital telemática
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Firma el mandato y el contrato de compraventa cómodamente desde tu teléfono móvil.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">
              03
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight leading-snug">
              Recibe tu documentación
            </h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">
              Obtén inmediatamente el permiso provisional para circular y el definitivo en tu casa.
            </p>
          </div>
        </div>
      </section>

      {/* TRÁMITES PRINCIPALES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Nuestros servicios de gestoría SUNARP y vehicular
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Tramitación transparente, segura y rápida para cualquier tipo de motocicleta en Perú.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Transferencia Vehicular SUNARP',
              desc: 'Gestión notarial y registral completa para compraventa de motos usadas.',
              icon: UserCheck
            },
            {
              title: 'Informe Registral de Cargas',
              desc: 'Verificación de gravámenes, papeletas SAT/PNP, embargos o robos antes de comprar.',
              icon: FileText
            },
            {
              title: 'Emisión de SOAT y Certificados',
              desc: 'Emisión inmediata de SOAT físico o digital y revisión de Inspección Técnica Vehicular (CITV).',
              icon: ShieldCheck
            },
            {
              title: 'Duplicado de Tarjeta (TIVE) y Placa',
              desc: 'Trámite por pérdida, robo o deterioro de la Tarjeta de Identificación Vehicular o Placas.',
              icon: Clock
            },
            {
              title: 'Inscripción y Inmatriculación',
              desc: 'Inscripción registral inicial para motos nuevas o de importación con asignación de placa.',
              icon: Building2
            },
            {
              title: 'Levantamiento de Hipotecas / Cargas',
              desc: 'Saneamiento de partidas registrales en SUNARP al cancelar financiamientos.',
              icon: CheckCircle2
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#ff0d41]/10 text-[#ff0d41] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES ACCORDION */}
      <section className="bg-white border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Resolvemos tus dudas sobre la gestión de trámites documentales
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-slate-900 hover:text-[#ff0d41] transition bg-slate-50/50"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-[#ff0d41]' : ''}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
