import React, { useState } from 'react';
import { 
  MapPin, 
  ArrowRight,
  Smartphone,
  ShieldAlert,
  BatteryCharging,
  Radio,
  ChevronDown
} from 'lucide-react';

interface LocalizadorPageProps {
  onNavigateHome?: () => void;
  onNavigateServicios?: () => void;
}

export default function LocalizadorPage({ onNavigateHome, onNavigateServicios }: LocalizadorPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me interesa información sobre la instalación de localizadores GPS para motos en Perú.");
    window.open(`https://wa.me/51900000000?text=${message}`, '_blank');
  };

  const faqs = [
    {
      q: "¿El localizador GPS consume la batería de la moto?",
      a: "Nuestros dispositivos cuentan con modo inteligente ultra-bajo consumo y batería interna de respaldo. No descargan la batería de tu motocicleta ni afectarán su arranque."
    },
    {
      q: "¿Dónde se realiza la instalación?",
      a: "Nuestros mecánicos especialistas ocultan el dispositivo en puntos estratégicos de la moto dentro de nuestros talleres oficiales para evitar que sea localizado o manipulado por terceros."
    },
    {
      q: "¿Funciona en garajes subterráneos?",
      a: "Integran antenas de alta sensibilidad GPS y triangulación GSM/LBS multi-operador para mantener la cobertura incluso en garajes y sótanos."
    },
    {
      q: "¿Tiene cuota mensual de mantenimiento?",
      a: "Ofrecemos modalidades con tarjeta SIM multirred incluida sin cuotas permanentes o con suscripciones reducidas anuales."
    }
  ];

  return (
    <div className="w-full bg-[#fafbfe] text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-slate-900 min-h-[460px] md:min-h-[600px] flex items-center pt-24 pb-16 md:py-28 -mt-14 sm:-mt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 lg:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 lg:hidden block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 text-left space-y-4 md:space-y-6 text-white drop-shadow-md">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)]">
                  Localizador GPS inteligente antirrobo para tu moto
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed max-w-2xl hidden md:block [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
                  Protege tu motocicleta las 24 horas del día. Recibe alertas en tiempo real en tu móvil ante cualquier movimiento o intento de sabotaje.
                </p>
              </div>

              <div className="space-y-3 pt-2 max-w-lg hidden md:block">
                {[
                  'Ubicación precisa en tiempo real desde la App',
                  'Alertas por movimiento sospechoso o inclinación',
                  'Instalación limpia e invisible en taller'
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow">✓</span>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide [text-shadow:_0_1px_6px_rgba(0,0,0,0.8)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <button
                type="button"
                onClick={onNavigateServicios || handleWhatsAppClick}
                className="w-full bg-[#232426] hover:bg-[#111214] active:scale-[0.98] text-white text-xs sm:text-sm font-black py-4 px-6 rounded-2xl transition duration-150 shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span>Solicitar GPS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-b border-slate-100">
        <h2 className="text-[26px] sm:text-[32px] font-black text-slate-950 tracking-tight mb-8 sm:mb-12">
          ¿Cómo funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">01</div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight">Elige tu dispositivo</h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">Selecciona el modelo GPS ideal según tu moto y hábitos de uso.</p>
          </div>

          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">02</div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight">Instalación Oculta</h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">Nuestros mecánicos ocultan la unidad sin interferir con la electrónica.</p>
          </div>

          <div className="bg-[#f8f9fb]/60 border border-[#eef0f3] rounded-[24px] p-8 text-left space-y-4">
            <div className="text-[24px] sm:text-[26px] font-extrabold text-[#ffaab8] leading-none">03</div>
            <h3 className="text-[18px] sm:text-[20px] font-black text-slate-950 tracking-tight">Control Total en tu App</h3>
            <p className="text-[13px] sm:text-[14px] font-semibold text-slate-500 leading-relaxed">Supervisa posición, rutas e historial desde iOS o Android.</p>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Tecnología de Protección</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Localización 24/7', desc: 'Rastreo permanente en mapa satelital en tiempo real.', icon: MapPin },
            { title: 'Alertas Instantáneas', desc: 'Notificaciones push en caso de movimiento no autorizado o remolque.', icon: ShieldAlert },
            { title: 'Batería Inteligente', desc: 'Batería interna de reserva que avisa ante desconexión.', icon: BatteryCharging },
            { title: 'App Móvil Integrada', desc: 'Consulta rutas, velocidades y zonas de geocerca.', icon: Smartphone }
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

      {/* FAQS */}
      <section className="bg-white border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition">
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
