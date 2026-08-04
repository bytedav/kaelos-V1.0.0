import React, { useState, useEffect } from 'react';
import { submitLeadInDb } from '../utils/storage';
import { CustomSelect } from '../components/CustomSelect';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Phone, 
  Mail, 
  User,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Brand and model dataset for realistic simulation
const BRAND_MODELS: Record<string, string[]> = {
  'Honda': ['PCX 125', 'SH 125i', 'CB650R', 'X-ADV', 'CRF1100L Africa Twin', 'Forza 350', 'CB500X', 'CBR500R'],
  'Yamaha': ['T-Max 560', 'X-Max 125', 'MT-07', 'Tracer 9 GT', 'YZF-R7', 'NMAX 125', 'MT-09', 'Tenere 700'],
  'BMW': ['R 1250 GS', 'F 850 GS', 'C 400 GT', 'S 1000 RR', 'G 310 R', 'R nineT', 'F 900 R', 'R 1250 RT'],
  'Kawasaki': ['Z900', 'Ninja 400', 'Versys 650', 'Vulcan S', 'Z650', 'Ninja ZX-6R', 'Z1000'],
  'Suzuki': ['V-Strom 650', 'GSX-8S', 'Burgman 400', 'GSX-S1000', 'SV650', 'Address 125'],
  'KTM': ['390 Duke', '890 Adventure', '1290 Super Duke R', '790 Duke', 'RC 390', '250 Adventure'],
  'Ducati': ['Monster 937', 'Multistrada V4', 'Scrambler Icon', 'Panigale V4', 'Streetfighter V2', 'DesertX'],
  'Kymco': ['Agility City 125', 'Super Dink 350', 'Xciting VS 400', 'DTX 360', 'People S 125'],
  'SYM': ['Symphony 125', 'Cruisym 300', 'Maxsym TL 508', 'Jet X 125', 'Fiddle 125'],
  'Vespa': ['Primavera 125', 'GTS Super 300', 'Elettrica', 'Sprint 50', 'Sei Giorni']
};

interface VendePageProps {
  onNavigateHome: () => void;
  onNavigateCompra: () => void;
}

export default function VendePage({ onNavigateHome, onNavigateCompra }: VendePageProps) {
  // Accordion Expand State
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Bike data input states
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [version, setVersion] = useState('');
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');

  // Seller contact input states
  const [vendedorName, setVendedorName] = useState('');
  const [vendedorPhone, setVendedorPhone] = useState('');
  const [vendedorEmail, setVendedorEmail] = useState('');

  // Form submission states
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Generate years list (e.g., from 2000 to 2026)
  const years = Array.from({ length: 27 }, (_, i) => String(2026 - i));

  // Handle Brand selection to auto-reset model
  useEffect(() => {
    setSelectedModel('');
  }, [selectedBrand]);

  // Step 1 Validation & Next Handler
  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !year || !kilometers) {
      setValidationError('Por favor, selecciona marca, modelo, año y kilómetros de tu moto.');
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  // Step 2 Back Handler
  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setValidationError('');
    setCurrentStep(1);
  };

  // Form submit logic
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!selectedBrand || !selectedModel || !year || !kilometers) {
        setValidationError('Por favor, selecciona marca, modelo, año y kilómetros de tu moto.');
        return;
      }
      setValidationError('');
      setCurrentStep(2);
      return;
    }

    if (!vendedorName || !vendedorPhone || !vendedorEmail) {
      setValidationError('Por favor, rellena todos tus datos de contacto obligatorios (*).');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    submitLeadInDb({
      type: 'vender_moto',
      name: vendedorName,
      phone: vendedorPhone,
      email: vendedorEmail,
      metadata: {
        brand: selectedBrand,
        model: selectedModel,
        year,
        kilometers,
        version: version || 'Standard',
      },
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

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

        {/* Desktop grid layout. On mobile, the contact form shifts to the top (order-1) */}
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
              <p className="text-xs sm:text-sm text-slate-600 font-bold text-slate-800 leading-relaxed">
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

          {/* RIGHT COLUMN: Premium Seller Lead Form Card */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full">
            <div className="bg-[#002f46] rounded-[24px] sm:rounded-[28px] shadow-xl p-5 sm:p-6 text-white relative overflow-hidden border border-white/5">
              
              {/* Subtle background overlay patterns */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bcd4]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#ff0d41]/5 rounded-full blur-3xl pointer-events-none" />

              {!isSubmitted ? (
                <form onSubmit={handleSubmitForm} className="space-y-4 text-left relative z-10">
                  <div className="space-y-2 pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                        Vende tu moto
                      </h2>
                      <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#00bcd4]/20 text-[#00bcd4] border border-[#00bcd4]/30">
                        Paso {currentStep} de 2
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-[#00bcd4]' : 'bg-white/20'}`} />
                      <div className={`h-full flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-[#00bcd4]' : 'bg-white/20'}`} />
                    </div>

                    <p className="text-[11px] text-sky-200/75 font-semibold pt-0.5">
                      {currentStep === 1 
                        ? 'Paso 1: Indica los datos principales de tu motocicleta' 
                        : 'Paso 2: Completa tus datos para enviarte la valoración'}
                    </p>
                  </div>

                  {validationError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 flex items-start gap-2.5 text-[11px] text-red-200 animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* STEP 1: DATOS DE LA MOTO */}
                  {currentStep === 1 && (
                    <div className="space-y-3 pt-1 animate-fade-in">
                      <div className="text-[10px] font-black text-[#00bcd4] uppercase tracking-wider block">
                        1. Datos de la moto
                      </div>

                      {/* Brand Input select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">
                          Marca *
                        </label>
                        <CustomSelect
                          value={selectedBrand}
                          onChange={(val) => {
                            setSelectedBrand(val);
                            setSelectedModel('');
                          }}
                          options={Object.keys(BRAND_MODELS).map(b => ({ value: b, label: b }))}
                          placeholder="Seleccionar marca"
                          alignText="left"
                          className="bg-[#526a79]/40 border border-white/10 text-white rounded-full px-4 py-2.5 text-xs font-bold"
                        />
                      </div>

                      {/* Model Input select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">
                          Modelo *
                        </label>
                        <CustomSelect
                          value={selectedModel}
                          onChange={(val) => setSelectedModel(val)}
                          disabled={!selectedBrand}
                          options={selectedBrand ? (BRAND_MODELS[selectedBrand]?.map(m => ({ value: m, label: m })) || []) : []}
                          placeholder={selectedBrand ? 'Seleccionar modelo' : 'Elige una marca primero'}
                          alignText="left"
                          className="bg-[#526a79]/40 border border-white/10 text-white rounded-full px-4 py-2.5 text-xs font-bold"
                        />
                      </div>

                      {/* Version Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">
                          Versión <span className="text-sky-300/65 font-normal">(Opcional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: ABS, Standard, Sport..."
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          className="w-full bg-[#526a79]/40 border border-white/10 text-white placeholder-sky-200/40 rounded-full px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4] transition-all"
                        />
                      </div>

                      {/* Two columns: Year & Kms */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Year Select */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">
                            Año *
                          </label>
                          <CustomSelect
                            value={year}
                            onChange={(val) => setYear(val)}
                            options={years.map(y => ({ value: String(y), label: String(y) }))}
                            placeholder="Seleccionar"
                            alignText="left"
                            className="bg-[#526a79]/40 border border-white/10 text-white rounded-full px-4 py-2.5 text-xs font-bold"
                          />
                        </div>

                        {/* Kilometers Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">
                            Kilómetros *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: 12500"
                            value={kilometers}
                            onChange={(e) => {
                              const cleanVal = e.target.value.replace(/\D/g, '');
                              setKilometers(cleanVal ? Number(cleanVal).toLocaleString('es-ES') : '');
                            }}
                            className="w-full bg-[#526a79]/40 border border-white/10 text-white placeholder-sky-200/40 rounded-full px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4] transition-all"
                          />
                        </div>
                      </div>

                      {/* Step 1 Next Button */}
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-[#00bcd4] hover:bg-[#00a8cc] active:scale-[0.98] text-[#001929] text-xs sm:text-sm font-extrabold py-3.5 rounded-full transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                      >
                        <span>Siguiente: Tus Datos de Contacto</span>
                        <ArrowRight className="w-4 h-4 text-[#001929]" strokeWidth={3} />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: DATOS DE CONTACTO */}
                  {currentStep === 2 && (
                    <div className="space-y-3 pt-1 animate-fade-in">
                      <div className="text-[10px] font-black text-[#00bcd4] uppercase tracking-wider block">
                        2. Tus datos de contacto
                      </div>

                      {/* Selected bike summary badge */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-[10px] text-sky-200/60 uppercase font-bold">Moto seleccionada:</p>
                          <p className="font-extrabold text-white text-xs">
                            {selectedBrand} {selectedModel} ({year}) • {kilometers} km
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="text-[10px] text-[#00bcd4] hover:underline font-bold"
                        >
                          Editar
                        </button>
                      </div>

                      {/* Contact Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">Tu Nombre Completo *</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Introduce tu nombre"
                            value={vendedorName}
                            onChange={(e) => setVendedorName(e.target.value)}
                            className="w-full bg-[#526a79]/40 border border-white/10 text-white placeholder-sky-200/40 rounded-full px-4 py-2.5 pl-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4] transition-all"
                          />
                          <User className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-sky-200/50" />
                        </div>
                      </div>

                      {/* Contact Phone input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">Teléfono / WhatsApp *</label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            maxLength={12}
                            placeholder="900 000 000"
                            value={vendedorPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^\d+ ]/g, '');
                              setVendedorPhone(val);
                            }}
                            className="w-full bg-[#526a79]/40 border border-white/10 text-white placeholder-sky-200/40 rounded-full px-4 py-2.5 pl-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4] transition-all"
                          />
                          <Phone className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-sky-200/50" />
                        </div>
                      </div>

                      {/* Contact Email input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">Correo Electrónico *</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="ejemplo@correo.com"
                            value={vendedorEmail}
                            onChange={(e) => setVendedorEmail(e.target.value)}
                            className="w-full bg-[#526a79]/40 border border-white/10 text-white placeholder-sky-200/40 rounded-full px-4 py-2.5 pl-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 focus:border-[#00bcd4] transition-all"
                          />
                          <Mail className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-sky-200/50" />
                        </div>
                      </div>

                      {/* Step 2 Buttons */}
                      <div className="flex items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-4 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Atrás
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[#00bcd4] hover:bg-[#00a8cc] active:scale-[0.98] text-[#001929] text-xs sm:text-sm font-extrabold py-3.5 rounded-full transition-all duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-[#001929]/20 border-t-[#001929] animate-spin" />
                              <span>Enviando información...</span>
                            </div>
                          ) : (
                            <>
                              <span>Enviar datos para contacto</span>
                              <ArrowRight className="w-4 h-4 text-[#001929]" strokeWidth={3} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              ) : (
                /* Success confirmation summary */
                <div className="py-8 text-center space-y-4 animate-fade-in relative z-10">
                  <div className="w-14 h-14 bg-[#00bcd4] text-[#001929] rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg font-black">
                    ✓
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      ¡Solicitud enviada con éxito!
                    </h3>
                    <p className="text-xs text-sky-200/80 leading-relaxed max-w-sm mx-auto font-medium">
                      Gracias <strong className="text-white">{vendedorName}</strong>. Hemos recibido la información de tu <strong className="text-white">{selectedBrand} {selectedModel} ({year})</strong>.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto">
                    <h4 className="text-[10px] font-bold text-sky-100 uppercase tracking-wider">¿Qué sucederá ahora?</h4>
                    <ul className="space-y-2 text-xs text-sky-200/80 font-medium">
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="text-[#00bcd4] font-black select-none">•</span>
                        <span>Revisaremos las especificaciones y estado de tu moto.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="text-[#00bcd4] font-black select-none">•</span>
                        <span>Un asesor especializado te contactará a tus canales registrados de forma privada y segura.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="text-[#00bcd4] font-black select-none">•</span>
                        <span>Te explicaremos la propuesta de compra directa o gestión de venta sin ningún compromiso.</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBrand('');
                      setSelectedModel('');
                      setVersion('');
                      setYear('');
                      setKilometers('');
                      setVendedorName('');
                      setVendedorPhone('');
                      setVendedorEmail('');
                      setIsSubmitted(false);
                    }}
                    className="bg-[#00bcd4] hover:bg-[#00a8cc] active:scale-[0.98] text-[#001929] text-xs font-black py-2.5 px-6 rounded-full transition-all cursor-pointer"
                  >
                    Enviar otra moto
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
