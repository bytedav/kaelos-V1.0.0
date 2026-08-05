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
    const message = encodeURIComponent("Hola, me gustaría solicitar información sobre trámites documentales y gestión de la DGT para mi moto.");
    window.open(`https://wa.me/34600000000?text=${message}`, '_blank');
  };

  const faqs = [
    {
      q: "¿Cuánto tarda el cambio de nombre de una moto?",
      a: "El trámite telemático ante la DGT se procesa de forma inmediata. Te entregaremos un permiso de circulación provisional válido al instante y recibirás el documento definitivo en 24-48 horas."
    },
    {
      q: "¿Qué documentos necesito para transferir una moto de ocasión?",
      a: "Necesitamos el DNI en vigor de comprador y vendedor, el permiso de circulación original, la ficha técnica del vehículo con ITV en vigor (o pasable) y el contrato de compraventa firmado."
    },
    {
      q: "¿Gestionáis bajas temporales o definitivas?",
      a: "Sí, tramitamos bajas temporales por no uso o almacenamiento, así como la gestión de bajas definitivas e informe del estado del vehículo antes de comprar."
    },
    {
      q: "¿Necesito pedir cita previa en la DGT?",
      a: "No. Al realizar la gestión a través de nuestra gestoría especializada, nos encargamos de todo de forma 100% online y presencial sin que tengas que pedir cita ni hacer colas."
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
                  Gestionamos tus trámites de la DGT 100% online
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed max-w-2xl hidden md:block [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
                  Sin citas previas ni esperas: cambios de titularidad, duplicados, informes de tráfico y distintivos ambientales gestionados al instante.
                </p>
              </div>

              {/* Checkmarks list */}
              <div className="space-y-3 pt-2 max-w-lg hidden md:block">
                {[
                  'Transferencias y cambio de nombre sin salir de casa',
                  'Gestión directa telemática con la DGT',
                  'Firma digital y justificante provisional inmediato'
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
            Nuestros servicios de gestoría DGT
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Tramitación transparente, segura y rápida para cualquier tipo de motocicleta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Cambio de titularidad',
              desc: 'Transferencia completa de propiedad para compraventas entre particulares o empresas.',
              icon: UserCheck
            },
            {
              title: 'Informe de cargas DGT',
              desc: 'Comprobación de embargos, reservas de dominio, precintos y datos técnicos antes de comprar.',
              icon: FileText
            },
            {
              title: 'Distintivo Ambiental DGT',
              desc: 'Envío oficial del pegatina ambiental DGT (B, C, ECO, ZERO) para tu moto.',
              icon: ShieldCheck
            },
            {
              title: 'Duplicado de documentación',
              desc: 'Gestión por extravío o deterioro del permiso de circulación o tarjeta ITV.',
              icon: Clock
            },
            {
              title: 'Matriculaciones',
              desc: 'Matriculación de motos nuevas, de importación o cambios de matrícula histórica.',
              icon: Building2
            },
            {
              title: 'Bajas de vehículos',
              desc: 'Baja temporal por no uso o tramitación de baja definitiva por desguace.',
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
