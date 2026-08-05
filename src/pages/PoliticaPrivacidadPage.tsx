import React from 'react';
import { Lock, UserCheck, Shield, Database, Eye, CheckCircle2 } from 'lucide-react';
import { navigateTo } from '../utils/router';

interface LegalPageProps {
  onNavigate?: (page: any) => void;
}

export const PoliticaPrivacidadPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
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
            <span className="text-slate-800">Política de Privacidad</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ff0d41] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Política de Privacidad
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Tratamiento seguro de tus datos personales conforme a la Ley de Protección de Datos Personales.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Introduction */}
          <section className="space-y-3">
            <p>
              En <strong>KAELOS</strong>, respetamos tu privacidad y estamos firmemente comprometidos con la protección de tus datos personales. La presente Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal que nos proporcionas al navegar en <strong>kaelos.com</strong> o al solicitar nuestros servicios.
            </p>
          </section>

          {/* Section 1: Responsable del Tratamiento */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-l-4 border-[#ff0d41] pl-3">
              1. Responsable del Tratamiento de Datos
            </h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm font-medium space-y-1">
              <p><strong>Titular:</strong> KAELOS</p>
              <p><strong>Ubicación:</strong> Trujillo - Perú</p>
              <p><strong>Plataforma Digital:</strong> https://kaelos.com</p>
            </div>
          </section>

          {/* Section 2: Datos Recopilados */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              2. Datos Personales que Recopilamos
            </h2>
            <p>Recopilamos información personal únicamente cuando interactúas de forma voluntaria con nuestros formularios o canales:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Datos de Identificación y Contacto:</strong> Nombre, apellidos, DNI/CE, número de teléfono, dirección de correo electrónico y ciudad de residencia.</li>
              <li><strong>Datos de Tasación de Motocicletas:</strong> Marca, modelo, año, kilometraje, fotos del vehículo e información del propietario al solicitar vender o cambiar tu moto.</li>
              <li><strong>Datos para Financiación:</strong> Información laboral básica, ingresos aproximados y preferencias de cuota elegidas en nuestros simuladores.</li>
              <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador e interacción con el sitio recopilados mediante cookies técnicas y analíticas.</li>
            </ul>
          </section>

          {/* Section 3: Finalidades */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              3. Finalidad del Tratamiento de Datos
            </h2>
            <p>Tus datos son tratados exclusivamente para los siguientes propósitos legítimos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff0d41] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Gestionar la compra, venta, entrega o reserva de motocicletas.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff0d41] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Procesar solicitudes de tasación instantánea de vehículos.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff0d41] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Evaluar pre-aprobaciones financieras con entidades asociadas.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#ff0d41] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Atender consultas y soporte vía WhatsApp o correo electrónico.</span>
              </div>
            </div>
          </section>

          {/* Section 4: Transferencia a Terceros */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              4. Transferencia y Compartición de Datos
            </h2>
            <p>
              KAELOS no vende ni alquila tus datos a terceros. Únicamente se podrán compartir datos personales con:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Entidades financieras y aseguradoras reguladas para formalizar contratos de crédito vehicular o pólizas solicitadas.</li>
              <li>Proveedores tecnológicos de almacenamiento en la nube y mensajería transaccional bajo estrictos contratos de confidencialidad.</li>
              <li>Autoridades legales u organismos públicos cuando sea requerido por mandato legal vigente.</li>
            </ul>
          </section>

          {/* Section 5: Derechos ARCO */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              5. Tus Derechos (Derechos ARCO)
            </h2>
            <p>
              Conforme a la Ley N° 29733 (Ley de Protección de Datos Personales en Perú), tienes derecho a ejercitar de forma gratuita tus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>.
            </p>
            <p>
              Para ejercer cualquiera de estos derechos, puedes enviar una solicitud formal indicando tu nombre, DNI y requerimiento a través de la sección de soporte o el formulario oficial de contacto en la plataforma.
            </p>
          </section>

          {/* Section 6: Seguridad */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#ff0d41] pl-3">
              6. Seguridad de la Información
            </h2>
            <p>
              Implementamos medidas de seguridad administrativas, técnicas y organizativas para prevenir el acceso no autorizado, alteración o pérdida de tus datos personales, utilizando cifrado SSL/TLS de alta graduación en todas las comunicaciones digitales.
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
export default PoliticaPrivacidadPage;
