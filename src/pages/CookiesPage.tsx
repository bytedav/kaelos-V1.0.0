import React from 'react';
import { Cookie, CheckCircle2, Sliders, Shield, Info } from 'lucide-react';
import { navigateTo } from '../utils/router';

interface LegalPageProps {
  onNavigate?: (page: any) => void;
}

export const CookiesPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo('/');
    onNavigate?.('home');
  };

  return (
    <div className="w-full bg-[#fafbfe] text-slate-900 min-h-screen font-sans py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <a href="/" onClick={handleBack} className="hover:text-[#ff0d41] transition-colors">
              Inicio
            </a>
            <span>/</span>
            <span className="text-slate-800">Política de Cookies</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ff0d41] flex items-center justify-center font-bold">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Política de Cookies
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Uso de cookies y tecnologías similares en kaelos.com para ofrecerte una navegación fluida.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Intro */}
          <section className="space-y-3">
            <p>
              En <strong>KAELOS</strong> (kaelos.com), utilizamos cookies y tecnologías de almacenamiento local para garantizar la funcionalidad del sitio web, recordar tus preferencias de filtrado de motocicletas y optimizar tu experiencia de usuario.
            </p>
          </section>

          {/* Section 1: ¿Qué es una cookie? */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-l-4 border-[#ff0d41] pl-3">
              1. ¿Qué es una Cookie?
            </h2>
            <p>
              Una cookie es un pequeño archivo de texto que se descarga en tu navegador al visitar páginas web. Permite a la plataforma recordar tus acciones y preferencias (como filtros de marca, presupuesto seleccionado o favoritas guardadas) durante un periodo de tiempo.
            </p>
          </section>

          {/* Section 2: Tipos de Cookies que utilizamos */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              2. Tipos de Cookies Utilizadas en KAELOS
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Type 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#ff0d41]" />
                  <span>Cookies Estrictamente Necesarias (Técnicas)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Son esenciales para que la web funcione correctamente. Permiten la navegación, el cambio de páginas sin perder estado y el funcionamiento del catálogo de motocicletas.
                </p>
              </div>

              {/* Type 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Sliders className="w-4 h-4 text-[#ff0d41]" />
                  <span>Cookies de Preferencia y Funcionalidad</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Permiten recordar la configuración elegida por el usuario (como tu ciudad o rango de cuota de alquiler/financiación preferida) para que no tengas que configurarlos nuevamente.
                </p>
              </div>

              {/* Type 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Shield className="w-4 h-4 text-[#ff0d41]" />
                  <span>Cookies Analíticas y Rendimiento</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Nos ayudan a comprender de forma anónima cómo interactúan los usuarios con las fichas de motos y secciones para detectar errores y mejorar la velocidad de carga.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Desactivación o Configuración */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              3. ¿Cómo Desactivar o Gestionar las Cookies?
            </h2>
            <p>
              Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador de Internet:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
              <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
              <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.</li>
              <li><strong>Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos guardados.</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Nota: Si bloqueas el uso de cookies en tu navegador, es posible que algunas funciones de personalización o filtrado de motos no funcionen adecuadamente.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              4. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos a través de nuestros canales y formulario oficial de soporte en <strong>kaelos.com</strong>.
            </p>
          </section>

          <div className="pt-4 text-xs text-slate-400 border-t border-slate-100">
            Última actualización: Julio de 2026.
          </div>
        </div>

      </div>
    </div>
  );
};
export default CookiesPage;
