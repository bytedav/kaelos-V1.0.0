import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { submitLeadInDb } from '../utils/storage';

interface ContactFormProps {
  noWrapper?: boolean;
  isRentingForm?: boolean;
}

export const ContactFormSection: React.FC<ContactFormProps> = ({ 
  noWrapper = false,
  isRentingForm = false
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    marketing: false,
    privacy: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [companyStatus, setCompanyStatus] = useState<'no' | 'autonomo' | 'empresa'>('autonomo');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const getCompanyLabel = (status: 'no' | 'autonomo' | 'empresa') => {
    if (status === 'no') return 'No';
    if (status === 'autonomo') return 'Soy autónomo';
    if (status === 'empresa') return 'Soy una empresa';
    return 'Soy autónomo';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.privacy) {
      alert('Por favor, rellena todos los campos obligatorios y acepta la política de privacidad.');
      return;
    }

    submitLeadInDb({
      type: isRentingForm ? 'financiacion' : 'contact',
      name: formData.nombre,
      phone: formData.telefono,
      email: formData.email,
      metadata: {
        companyStatus,
        marketing: formData.marketing,
        isRentingForm,
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        marketing: false,
        privacy: false
      });
    }, 4000);
  };

  const formCard = (
    <div className={`w-full text-left ${noWrapper ? 'bg-white rounded-[20px] sm:rounded-[24px] p-4.5 sm:p-6' : 'bg-[#fafafb]/90 border border-slate-100 rounded-[24px] sm:rounded-[32px] p-4.5 sm:p-7 md:p-8 shadow-sm'}`}>
      {/* Header */}
      <div className="space-y-1 mb-3.5 sm:mb-5 text-left">
        <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
          {isRentingForm ? 'Empieza tu renting' : '¿Tienes preguntas? Estamos aquí para ayudarte'}
        </h2>
        <p className="text-slate-400 font-medium text-xs sm:text-sm">
          {isRentingForm ? 'Indica tus datos para continuar.' : 'Te responderemos en menos de 24 horas'}
        </p>
      </div>

      {/* Success Alert */}
      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl font-bold mb-4 text-xs flex items-center space-x-2 animate-fade-in">
          <span>✨</span>
          <span>
            {isRentingForm 
              ? '¡Solicitud de renting enviada con éxito! Nos pondremos en contacto contigo muy pronto.'
              : '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo muy pronto.'
            }
          </span>
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="block text-slate-800 font-bold text-xs sm:text-sm">
            Nombre
          </label>
          <input
            type="text"
            required
            placeholder="Tu nombre completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#25a175]/20 focus:border-[#25a175] transition-all"
          />
        </div>

        {/* Teléfono & Email Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Teléfono with Flag Selector */}
          <div className="space-y-1.5">
            <label className="block text-slate-800 font-bold text-xs sm:text-sm">
              Número de teléfono
            </label>
            <div className="flex gap-2 w-full">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-800 select-none">
                <span>🇵🇪 PE +51</span>
              </div>
              <input
                type="tel"
                required
                maxLength={9}
                placeholder="987 654 321"
                value={formData.telefono}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // only allow digits
                  setFormData({ ...formData, telefono: val });
                }}
                className="flex-1 bg-white border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#25a175]/20 focus:border-[#25a175] transition-all min-w-0"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-slate-800 font-bold text-xs sm:text-sm">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#25a175]/20 focus:border-[#25a175] transition-all"
            />
          </div>
        </div>

        {/* Custom Extra Dropdown (¿Eres una empresa o autónomo?) for Renting Form */}
        {isRentingForm && (
          <div className="space-y-1.5 relative">
            <label className="block text-slate-800 font-bold text-xs sm:text-sm text-left">
              ¿Eres una empresa o autónomo?
            </label>
            <button
              type="button"
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 flex items-center justify-between outline-none cursor-pointer hover:border-slate-300 transition"
            >
              <span>{getCompanyLabel(companyStatus)}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            
            {isCompanyDropdownOpen && (
              <>
                {/* Backdrop for clickout */}
                <div 
                  className="fixed inset-0 z-140" 
                  onClick={() => setIsCompanyDropdownOpen(false)} 
                />
                {/* Dropdown list */}
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200/85 rounded-2xl shadow-xl z-150 overflow-hidden animate-fade-in divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                  {(['no', 'autonomo', 'empresa'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setCompanyStatus(status);
                        setIsCompanyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between cursor-pointer
                        ${companyStatus === status
                          ? 'bg-slate-50 text-slate-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      <span>{getCompanyLabel(status)}</span>
                      {companyStatus === status && (
                        <Check className="w-4 h-4 text-slate-900" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Checkboxes */}
        <div className="space-y-3 pt-1">
          {/* Promo option */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.marketing}
              onChange={(e) => setFormData({ ...formData, marketing: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-[#25a175] focus:ring-[#25a175]/30 w-4 h-4 cursor-pointer accent-[#25a175]"
            />
            <span className="text-slate-500 font-medium text-xs sm:text-[13px] leading-relaxed">
              Acepto las comunicaciones comerciales y de ofertas
            </span>
          </label>

          {/* Terms and Privacy Policy */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.privacy}
              onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-[#25a175] focus:ring-[#25a175]/30 w-4 h-4 cursor-pointer accent-[#25a175]"
            />
            <span className="text-slate-500 font-medium text-xs sm:text-[13px] leading-relaxed">
              Acepto los <a href="/terminos-y-condiciones" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terminos-y-condiciones'); window.dispatchEvent(new Event('popstate')); }} className="text-slate-500 underline hover:text-[#25a175] transition-colors">términos y condiciones</a> y la <a href="/politica-privacidad" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/politica-privacidad'); window.dispatchEvent(new Event('popstate')); }} className="text-slate-500 underline hover:text-[#25a175] transition-colors">política de privacidad</a> de Kaelos.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <Button
            type="submit"
            variant="dark"
            size="lg"
            fullWidth
          >
            {isRentingForm ? 'CONTINUAR' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );

  if (noWrapper) {
    return formCard;
  }

  return (
    <section className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
      {formCard}
    </section>
  );
};
