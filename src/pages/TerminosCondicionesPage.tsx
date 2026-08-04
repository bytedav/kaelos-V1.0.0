import React from 'react';
import { Scale, CheckCircle2, ShieldCheck, AlertCircle, Wrench } from 'lucide-react';
import { navigateTo } from '../utils/router';

interface LegalPageProps {
  onNavigate?: (page: any) => void;
}

export const TerminosCondicionesPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
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
            <span className="text-slate-800">Términos y Condiciones</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ff0d41] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Términos y Condiciones
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Reglas y condiciones aplicables a la compra, venta, renting y financiación de motocicletas en KAELOS.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: Aspectos Generales */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-l-4 border-[#ff0d41] pl-3">
              1. Aspectos Generales
            </h2>
            <p>
              Los presentes Términos y Condiciones regulan la prestación de servicios a través de la plataforma <strong>kaelos.com</strong>, operada bajo la marca <strong>KAELOS</strong>.
            </p>
            <p>
              Al hacer uso de nuestros servicios, realizar reservas de motocicletas o solicitar tasaciones, el Usuario acepta íntegramente los presentes términos.
            </p>
          </section>

          {/* Section 2: Inspección de 100 Puntos y Garantía */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              2. Calidad de Vehículos y Garantía KAELOS
            </h2>
            <p>
              Todas las motocicletas de ocasión puestas a la venta en KAELOS cuentan con una <strong>certificación técnica rigurosa de más de 100 puntos de inspección</strong> en taller especializado, abarcando motor, chasís, sistema eléctrico, frenos y transmisión.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm font-medium">
              <div className="flex items-center gap-2 text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#ff0d41] flex-shrink-0" />
                <span><strong>Garantía de hasta 12 meses:</strong> Cubre averías mecánicas graves del grupo motopropulsor.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Wrench className="w-4 h-4 text-[#ff0d41] flex-shrink-0" />
                <span><strong>Acondicionamiento Técnico:</strong> Ningún vehículo se entrega sin revisión y cambio de fluidos requeridos.</span>
              </div>
            </div>
          </section>

          {/* Section 3: Proceso de Compra y Reserva */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              3. Proceso de Compra, Pago y Reserva
            </h2>
            <p>
              El usuario puede reservar una motocicleta pagando un depósito reembolsable o iniciando el flujo de compra digital directa.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Los precios exhibidos incluyen los impuestos de ley (IGV) salvo indicación expresa en contrario.</li>
              <li>La transferencia registral del vehículo se inicia únicamente tras la conformidad total del pago.</li>
              <li>La entrega a domicilio está disponible en Lima Metropolitana y envíos coordinados a nivel nacional.</li>
            </ul>
          </section>

          {/* Section 4: Venta de Moto / Tasación */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              4. Servicio de Tasación y Compra de Vehículos
            </h2>
            <p>
              Las ofertas de tasación online generadas por KAELOS son estimaciones sujetas a inspección presencial o revisión detallada del estado técnico del vehículo. KAELOS se reserva el derecho de ajustar la oferta si se identifican fallas no declaradas durante la tasación previa.
            </p>
          </section>

          {/* Section 5: Financiación y Renting */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              5. Financiación y Suscripción (Renting)
            </h2>
            <p>
              Las cuotas mensuales mostradas en la plataforma corresponden a simulaciones referenciales. La aprobación final de crédito está sujeta al perfil crediticio evaluado por las entidades financieras o de leasing aliadas de KAELOS.
            </p>
          </section>

          {/* Section 6: Devolución y Cambios */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              6. Garantía de Prueba y Cambios
            </h2>
            <p>
              En modelos seleccionados de ocasión, KAELOS ofrece un periodo de prueba de satisfacción. En caso de disconformidad justificada por problemas mecánicos no identificados, el cliente podrá solicitar el cambio por otra unidad de valor equivalente cumpliendo las condiciones de kilometraje máximo.
            </p>
          </section>

          {/* Section 7: Modificaciones */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              7. Modificación de los Términos
            </h2>
            <p>
              KAELOS se reserva el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento. Los cambios surtirán efecto desde su publicación en <strong>kaelos.com</strong>.
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
export default TerminosCondicionesPage;
