import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { submitLeadInDb } from '../utils/storage';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (!accepted) {
      setStatus('error');
      setErrorMessage('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    
    try {
      await submitLeadInDb({
        type: 'general',
        email: email,
        metadata: {
          source: 'newsletter_section',
          acceptedTerms: true,
        },
      });
    } catch (err) {
      console.warn('Newsletter lead submission error:', err);
    }

    setStatus('success');
    setErrorMessage('');
  };

  return (
    <section id="newsletter-section" className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
      <div className="bg-white border border-slate-100 rounded-[28px] p-5 sm:p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Description */}
          <div className="lg:col-span-7 space-y-2 sm:space-y-4">
            <h2 className="text-xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight leading-tight">
              Empieza tu aventura ahorrando
            </h2>
            <p className="hidden sm:block text-slate-500 font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl">
              Traemos novedades todas las semanas. ¿Quieres estar al día? Suscríbete y te avisaremos cuando lancemos las próximas ofertas y descuentos.
            </p>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-5 w-full">
            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm shadow-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">¡Te has suscrito con éxito!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pronto recibirás nuestras mejores ofertas de motos directamente en <span className="font-semibold text-slate-700">{email}</span>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setEmail('');
                    setAccepted(false);
                  }}
                  className="text-xs font-bold text-[#ff0d41] hover:underline"
                >
                  Volver a suscribirse
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input Field */}
                <div className="space-y-1.5">
                  <label htmlFor="newsletter-email" className="block text-xs font-bold text-slate-700 tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-slate-800 focus:ring-0 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Terms Acceptance */}
                <div className="flex items-start gap-2.5">
                  <input
                    id="newsletter-terms"
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="newsletter-terms" className="text-xs text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                    Acepto los{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-slate-900 transition">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="underline hover:text-slate-900 transition">
                      política de privacidad
                    </a>{' '}
                    de Kaelos.
                  </label>
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-xs font-semibold animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all active:scale-98 shadow-sm hover:shadow cursor-pointer"
                  >
                    RECIBIR OFERTAS
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
