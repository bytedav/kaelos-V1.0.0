import React from 'react';
import { ShieldCheck, Building2, Mail, Globe, MapPin, FileText } from 'lucide-react';
import { navigateTo } from '../utils/router';

interface LegalPageProps {
  onNavigate?: (page: any) => void;
}

export const AvisoLegalPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
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
            <span className="text-slate-800">Aviso Legal</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ff0d41] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Aviso Legal
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Información general, titularidad del sitio web y condiciones legales.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: Datos del Titular */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-l-4 border-[#ff0d41] pl-3">
              1. Datos Identificativos
            </h2>
            <p>
              En cumplimiento con los deberes de información y transparencia digital, se hace constar que la plataforma y el dominio web <strong>kaelos.com</strong> (en adelante, el "Sitio Web") son operados bajo la marca <strong>KAELOS</strong>:
            </p>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#ff0d41] flex-shrink-0" />
                <span><strong>Plataforma:</strong> KAELOS</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#ff0d41] flex-shrink-0" />
                <span><strong>Dominio Principal:</strong> https://kaelos.com</span>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <MapPin className="w-4 h-4 text-[#ff0d41] flex-shrink-0" />
                <span><strong>Ubicación:</strong> Trujillo - Perú</span>
              </div>
            </div>
          </section>

          {/* Section 2: Objeto */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              2. Objeto de la Plataforma
            </h2>
            <p>
              KAELOS opera como un marketplace especializado en la comercialización, reserva, tasación, financiación y suscripción (renting) de motocicletas nuevas y de ocasión plenamente revisadas en más de 100 puntos de control técnico.
            </p>
            <p>
              El acceso y la navegación por el Sitio Web atribuyen la condición de Usuario e implican la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.
            </p>
          </section>

          {/* Section 3: Propiedad Intelectual */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              3. Propiedad Intelectual e Industrial
            </h2>
            <p>
              Todos los contenidos del Sitio Web, incluyendo sin limitación textos, marcas, logotipos, imágenes, fotografías, diseños de interfaz, código fuente, iconos e ilustraciones, son propiedad exclusiva de KAELOS o de terceros que han autorizado su inclusión.
            </p>
            <p>
              Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación total o parcial de cualquier elemento de esta web sin la autorización previa y por escrito.
            </p>
          </section>

          {/* Section 4: Exclusión de Responsabilidad */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              4. Exclusión de Responsabilidad
            </h2>
            <p>
              KAELOS no se hace responsable de los daños o perjuicios que pudieran derivarse de interferencias, omisiones, interrupciones, virus informáticos o desconexiones en el funcionamiento operativo de este sistema electrónico motivadas por causas ajenas.
            </p>
            <p>
              Así mismo, KAELOS puede incluir enlaces a sitios web de terceros (como simulaciones financieras o pasarelas de pago). KAELOS no ejerce ningún control sobre dichos sitios ni asume responsabilidad sobre sus contenidos o políticas de privacidad.
            </p>
          </section>

          {/* Section 5: Legislación Aplicable */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              5. Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación peruana vigente, sometiéndose expresamente las partes a la jurisdicción de los Juzgados y Tribunales del Distrito Judicial de Trujillo, Perú.
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
export default AvisoLegalPage;
