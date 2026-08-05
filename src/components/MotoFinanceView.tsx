import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatSoles } from '../utils/format';
import { MotorbikeExtended } from './MotorbikeCard';
import { calculateCuota, clampEntranceFee, getMinEntrance, FINANCE_TERMS, DEFAULT_TERM, PACK_PRICES, PACK_NAMES } from '../utils/finance';
import { PRICING_CONFIG } from '../config/pricing';
import { saveOrder } from '../utils/storage';
import { SITE_CONFIG } from '../data/siteConfig';

interface MotoFinanceViewProps {
  bike: MotorbikeExtended | null;
  onBack: () => void;
}

export default function MotoFinanceView({ bike, onBack }: MotoFinanceViewProps) {
  if (!bike) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-slate-500 font-bold">No se ha seleccionado ninguna moto para financiar.</p>
        <button onClick={onBack} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold">
          Volver
        </button>
      </div>
    );
  }

  // State
  const [activeTab, setActiveTab] = useState<'finance' | 'packs'>(() => {
    if (window.location.pathname.endsWith('/pack')) {
      return 'packs';
    }
    return 'finance';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.endsWith('/pack')) {
        setActiveTab('packs');
      } else {
        setActiveTab('finance');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: 'finance' | 'packs') => {
    setActiveTab(tab);
    const slug = bike.id;
    const newPath = `/moto/${slug}/${tab === 'packs' ? 'pack' : 'finance'}`;
    window.history.pushState(null, '', newPath);
  };

  const [paymentMethod, setPaymentMethod] = useState<'contado' | 'financiado'>('financiado');
  const [entranceFee, setEntranceFee] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const entrance = params.get('entrance');
    if (entrance) {
      const parsed = parseInt(entrance, 10);
      if (!isNaN(parsed)) {
        return clampEntranceFee(bike.price, parsed);
      }
    }
    return getMinEntrance(bike.price);
  });
  const [termMonths, setTermMonths] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get('term');
    if (term) {
      const parsed = parseInt(term, 10);
      if ((FINANCE_TERMS as readonly number[]).includes(parsed as any)) {
        return parsed;
      }
    }
    return DEFAULT_TERM;
  });
  const [tradeIn, setTradeIn] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [selectedPack, setSelectedPack] = useState<'basico' | 'economico' | 'premium'>('economico');

  // Modal Reservation Form States
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [promoAccepted, setPromoAccepted] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Prices
  const basePrice = bike.price;
  const registrationFee = PRICING_CONFIG.REGISTRATION_FEE_DEFAULT; // Cambio de nombre y preparación
  const totalContado = basePrice + registrationFee;

  // Packs specifications & prices
  const packPrices = PACK_PRICES;
  const packNames = PACK_NAMES;

  const getPackCuota = (packKey: 'basico' | 'economico' | 'premium') => {
    const packPrice = packPrices[packKey];
    return calculateCuota(totalContado + packPrice, entranceFee, termMonths);
  };

  const currentCuota = activeTab === 'packs' ? getPackCuota(selectedPack) : calculateCuota(totalContado, entranceFee, termMonths);

  const handleNextStep = async () => {
    if (activeTab === 'finance') {
      handleTabChange('packs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const bikeId = bike?.id || 'bmw-r-1250-gs';
      const mode = paymentMethod === 'financiado' ? 'financed' : 'cash';
      const currentParams = new URLSearchParams(window.location.search);
      const existingOrder = currentParams.get('order') || currentParams.get('pedido') || currentParams.get('ref') || currentParams.get('id');
      const rawOrder = existingOrder || `${Math.floor(10000000 + Math.random() * 90000000)}`;
      const orderId = rawOrder.replace(/^[#?kK-]+/i, '');

      // Persist order configuration in database store
      await saveOrder({
        id: orderId,
        order_id: orderId,
        bike_id: bikeId,
        bike_title: bike ? `${bike.brand} ${bike.model}` : '',
        payment_mode: mode,
        selected_pack: selectedPack,
        selected_term: termMonths,
        down_payment: entranceFee,
        total_price: totalContado,
        use_old_bike: tradeIn,
      });

      // Construct professional WhatsApp reservation message
      const cleanPhone = (SITE_CONFIG?.whatsapp?.phoneNumber || '51987654321').replace(/[^0-9]/g, '');
      const bikeSlugOrId = bike?.slug || bikeId;
      const bikeUrl = `${window.location.origin}/moto/${bikeSlugOrId}`;
      const targetUrl = `/checkout-sale?order=${orderId}&bike=${bikeId}&pago=${mode}&pack=${selectedPack}`;
      const trackingUrl = `${window.location.origin}${targetUrl}`;
      const packLabel = packNames[selectedPack] || selectedPack;

      let waMsg = `🏍️ *SOLICITUD DE RESERVA - KAELOS*\n\n`;
      waMsg += `📌 *Código de Pedido:* #${orderId}\n`;
      waMsg += `🛵 *Motocicleta:* ${bike.brand} ${bike.model}\n`;
      waMsg += `🔗 *Ver Ficha:* ${bikeUrl}\n\n`;

      if (paymentMethod === 'financiado') {
        waMsg += `💳 *Modalidad:* Financiación Flexible\n`;
        waMsg += `💰 *Entrada Inicial:* ${formatSoles(entranceFee)}\n`;
        waMsg += `📅 *Plazo Elegido:* ${termMonths} meses\n`;
        waMsg += `📦 *Pack de Servicio:* ${packLabel}\n`;
        waMsg += `📊 *Cuota Estimada:* ${formatSoles(currentCuota)}/mes*\n\n`;
      } else {
        waMsg += `💳 *Modalidad:* Pago al Contado\n`;
        waMsg += `📦 *Pack de Servicio:* ${packLabel}\n`;
        waMsg += `💵 *Monto de Reserva:* ${formatSoles(registrationFee)}\n\n`;
      }

      waMsg += `📋 *Seguimiento de Estado:* ${trackingUrl}\n\n`;
      waMsg += `_Hola, quiero realizar el pago de la reserva (S/. ${registrationFee}) para asegurar mi motocicleta y continuar con el trámite._`;

      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Navigate browser to checkout order tracking screen
      window.history.pushState(null, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const packs = [
    {
      key: 'basico' as const,
      name: 'Básico',
      badge: null,
      tin: '50%',
      garantia: '12 meses',
      isRecompra: false,
      isEnvio: false,
      isSustitucion: false,
      price: PACK_PRICES.basico
    },
    {
      key: 'economico' as const,
      name: 'Económico',
      badge: 'Recomendado',
      tin: '50%',
      garantia: '12 meses',
      isRecompra: true,
      isEnvio: true,
      isSustitucion: false,
      price: PACK_PRICES.economico
    },
    {
      key: 'premium' as const,
      name: 'Premium',
      badge: 'Mejor opción',
      tin: '50%',
      garantia: '24 meses',
      isRecompra: true,
      isEnvio: true,
      isSustitucion: true,
      price: PACK_PRICES.premium
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans pb-28 lg:pb-16">
      
      {/* Sub-Header Tabs Row matching screenshots */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10 h-14">
            <button
              onClick={() => handleTabChange('finance')}
              className={`font-extrabold text-[15px] h-full relative px-2 flex items-center transition-all cursor-pointer border-b-[3px]
                ${activeTab === 'finance' 
                  ? 'text-slate-950 border-slate-900 font-black' 
                  : 'text-slate-400 hover:text-slate-600 border-transparent'
                }
              `}
            >
              Financiación
            </button>
            <button
              onClick={() => handleTabChange('packs')}
              className={`font-extrabold text-[15px] h-full relative px-2 flex items-center transition-all cursor-pointer border-b-[3px]
                ${activeTab === 'packs' 
                  ? 'text-slate-950 border-slate-900 font-black' 
                  : 'text-slate-400 hover:text-slate-600 border-transparent'
                }
              `}
            >
              Packs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Back Button */}
        <a
          href={`/moto/${bike.id}`}
          onClick={(e) => {
            e.preventDefault();
            const targetPath = `/moto/${bike.id}`;
            window.history.pushState(null, '', targetPath);
            onBack();
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-450 hover:text-slate-800 transition cursor-pointer mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la moto</span>
        </a>

        {formSubmitted ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-[24px] p-8 md:p-12 text-center space-y-6 shadow-sm animate-fade-in mt-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">¡Solicitud de reserva enviada!</h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                Hemos bloqueado temporalmente esta <span className="font-extrabold text-slate-800">{bike.brand} {bike.model}</span> para ti. Un especialista de Kaelos se pondrá en contacto contigo en menos de 15 minutos para formalizar los detalles de pago y entrega.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 text-left space-y-3.5 max-w-md mx-auto">
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold border-b border-slate-200 pb-2.5">
                <span>RESUMEN DE RESERVA</span>
                <span className="text-[#ff0d41] uppercase font-black">Pre-reserva activa</span>
              </div>
              <div className="flex items-center gap-3">
                <img src={bike.image} alt={bike.model} className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-[13px] leading-tight">{bike.brand} {bike.model}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">{bike.year} • {bike.kms.toLocaleString('es-ES')} km • {bike.power}</p>
                </div>
              </div>
              <div className="w-full h-px bg-slate-200/60" />
              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Modo de pago:</span>
                  <span className="text-slate-900 font-extrabold capitalize">{paymentMethod}</span>
                </div>
                {paymentMethod === 'financiado' ? (
                  <>
                    {activeTab === 'packs' && (
                      <div className="flex justify-between">
                        <span>Pack contratado:</span>
                        <span className="text-slate-900 font-extrabold">{packNames[selectedPack]} ({formatSoles(packPrices[selectedPack])})</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Entrada inicial:</span>
                      <span className="text-slate-900 font-extrabold">{formatSoles(entranceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazo:</span>
                      <span className="text-slate-900 font-extrabold">{termMonths} meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cuota mensual:</span>
                      <span className="text-[#ff0d41] font-black text-sm">{formatSoles(currentCuota)}/mes</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Total de la compra:</span>
                    <span className="text-slate-900 font-extrabold">{formatSoles(totalContado)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200/60 pt-2 text-slate-900 font-bold">
                  <span>Reserva a pagar ahora:</span>
                  <span className="font-black text-[13px]">{formatSoles(registrationFee)}</span>
                </div>
                {fullName && (
                  <div className="border-t border-slate-100 pt-2 mt-1.5 space-y-1 text-[11px] text-slate-500 font-semibold">
                    <div className="flex justify-between">
                      <span>Cliente:</span>
                      <span className="text-slate-800 font-bold">{fullName}</span>
                    </div>
                    {phone && (
                      <div className="flex justify-between">
                        <span>Teléfono:</span>
                        <span className="text-slate-800 font-bold">+51 {phone}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-slate-800 font-bold">{email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  onBack();
                }}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold py-3.5 px-8 rounded-xl transition cursor-pointer active:scale-95 shadow-sm"
              >
                Volver al catálogo
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Form matching layout from mockup exactly */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">
              
              {activeTab === 'finance' ? (
                <>
                  {/* Main Title Header */}
                  <div className="text-left animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
                      ¿Cómo prefieres pagar?
                    </h1>
                  </div>

                  {/* Payment Methods Grid - Side-by-side on desktop, Stacked on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    
                    {/* Option 1: Al contado */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('contado')}
                      className={`rounded-[20px] p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[130px] sm:min-h-[145px] cursor-pointer
                        ${paymentMethod === 'contado'
                          ? 'bg-[#f4f7f9] border-[1.5px] border-slate-950 shadow-xs'
                          : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <div>
                        <span className="font-extrabold text-slate-950 text-base sm:text-lg block mb-2">Al contado</span>
                        <div className="space-y-1.5">
                          <div className="flex items-center text-xs sm:text-[13px] text-slate-600 font-medium">
                            <span className="text-[#00b074] font-black mr-2">✓</span>
                            <span>Pago único</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-[13px] text-slate-600 font-medium">
                            <span className="text-[#00b074] font-black mr-2">✓</span>
                            <span>Garantía premium opcional</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Financiado */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('financiado')}
                      className={`rounded-[20px] p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[130px] sm:min-h-[145px] cursor-pointer
                        ${paymentMethod === 'financiado'
                          ? 'bg-[#f4f7f9] border-[1.5px] border-slate-950 shadow-xs'
                          : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }
                      `}
                    >
                      <div>
                        <span className="font-extrabold text-slate-950 text-base sm:text-lg block mb-2">Financiado</span>
                        <div className="space-y-1.5">
                          <div className="flex items-center text-xs sm:text-[13px] text-slate-600 font-medium">
                            <span className="text-[#00b074] font-black mr-2">✓</span>
                            <span>Opciones flexibles de financiación</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-[13px] text-slate-600 font-medium">
                            <span className="text-[#00b074] font-black mr-2">✓</span>
                            <span>Garantía premium opcional</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-[13px] text-slate-600 font-medium">
                            <span className="text-[#00b074] font-black mr-2">✓</span>
                            <span>Elige los plazos a tu gusto</span>
                          </div>
                        </div>
                      </div>
                    </button>

                  </div>



                  {/* Trade-in Motorcycle Toggle */}
                  <div className="text-left animate-fade-in">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tradeIn}
                        onChange={(e) => setTradeIn(e.target.checked)}
                        className="w-5 h-5 rounded border border-slate-300 text-slate-950 focus:ring-slate-900 shrink-0 cursor-pointer"
                      />
                      <span className="font-extrabold text-slate-950 text-xs sm:text-[13px] leading-snug">
                        ¿Quieres usar tu moto antigua como parte del pago?
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                /* Packs View matching the screenshots exactly */
                <div className="space-y-5 sm:space-y-6 animate-fade-in">
                  
                  {/* Dynamic inputs for Financiado only (Entrada & Plazo side by side on laptop, stacked on mobile) */}
                  {paymentMethod === 'financiado' ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                      
                      {/* Entrada inicial section */}
                      <div className="md:col-span-5 space-y-2 text-left w-full">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide font-sans block">Entrada inicial</span>
                        <div className="relative">
                          <input
                            type="text"
                            value={entranceFee === 0 ? "S/. 0" : `S/. ${entranceFee.toLocaleString('en-US')}`}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              const num = val ? parseInt(val, 10) : 0;
                              setEntranceFee(num);
                            }}
                            onBlur={() => {
                              setEntranceFee(clampEntranceFee(bike.price, entranceFee));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-slate-400 outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Plazo meses list section */}
                      <div className="md:col-span-7 space-y-2 text-left w-full">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide font-sans block">Plazo (meses)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {FINANCE_TERMS.map((months) => (
                            <button
                              key={months}
                              type="button"
                              onClick={() => setTermMonths(months)}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-xs sm:text-[13px] font-black transition-all cursor-pointer flex items-center justify-center border
                                ${termMonths === months
                                  ? 'bg-white text-slate-950 border-slate-950 ring-[1.5px] ring-slate-950'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                                }
                              `}
                            >
                              {months}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Title for Al contado packs screen */
                    <div className="text-left">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                        Mejora las condiciones de tu compra
                      </h1>
                    </div>
                  )}

                  {/* Cuota / Packs Section with 3 Pack cards */}
                  <div className="space-y-3.5 text-left">
                    {paymentMethod === 'financiado' && (
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide font-sans block">Cuota</span>
                    )}
                    
                    {/* Grid of cards: 3 columns on desktop, stacked on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                      {packs.map((pack) => {
                        const isSelected = selectedPack === pack.key;
                        const priceDisplay = paymentMethod === 'contado'
                          ? (packPrices[pack.key] === 0 ? "Incluido" : formatSoles(packPrices[pack.key]))
                          : `${formatSoles(getPackCuota(pack.key))}/mes`;
                        
                        return (
                          <button
                            key={pack.key}
                            type="button"
                            onClick={() => setSelectedPack(pack.key)}
                            className={`w-full text-left rounded-[20px] transition-all cursor-pointer relative border flex flex-col justify-between pt-6 pb-4 px-4 sm:px-5 hover:shadow-xs
                              ${isSelected
                                ? 'bg-[#eef4f8] border-[2px] border-slate-950 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                              }
                              lg:space-y-3 space-y-3
                            `}
                          >
                            {/* Badges */}
                            {pack.badge && (
                              <span className={`absolute -top-2.5 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                ${pack.key === 'economico'
                                  ? 'bg-[#475b68] text-white'
                                  : 'bg-white text-slate-500 border border-slate-200 shadow-3xs'
                                }
                              `}>
                                {pack.badge}
                              </span>
                            )}

                            {/* Top section: Name & Price */}
                            <div className="border-b border-slate-150/50 pb-2 w-full">
                              <h4 className="font-black text-slate-950 text-base sm:text-lg leading-tight mb-1">{pack.name}</h4>
                              <div className="flex items-baseline">
                                <span className="font-black text-[#111111] text-sm sm:text-base">
                                  {priceDisplay}
                                </span>
                                {paymentMethod === 'financiado' && (
                                  <span className="text-slate-400 text-xs font-bold ml-1">*</span>
                                )}
                              </div>
                            </div>

                            {/* Bullet points checklist */}
                            <ul className="space-y-1.5 text-left w-full text-[11px] sm:text-xs font-semibold text-slate-500 leading-relaxed">
                              <li className="flex items-center gap-2">
                                {pack.isSustitucion ? (
                                  <>
                                    <span className="text-emerald-500 font-extrabold">✓</span>
                                    <span>Moto de sustitución</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-rose-500 font-extrabold">✕</span>
                                    <span>Sin moto de sustitución</span>
                                  </>
                                )}
                              </li>
                              <li className="flex items-center gap-2">
                                {pack.isEnvio ? (
                                  <>
                                    <span className="text-emerald-500 font-extrabold">✓</span>
                                    <span>Envío peninsular incluido</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-rose-500 font-extrabold">✕</span>
                                    <span>Sin envío peninsular incluido</span>
                                  </>
                                )}
                              </li>
                              <li className="flex items-center gap-2">
                                {pack.isRecompra ? (
                                  <>
                                    <span className="text-emerald-500 font-extrabold">✓</span>
                                    <span>Recompra asegurada **</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-rose-500 font-extrabold">✕</span>
                                    <span>Sin recompra **</span>
                                  </>
                                )}
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-extrabold">✓</span>
                                <span>Garantía {pack.garantia}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-extrabold">✓</span>
                                <span>TIN {pack.key === 'basico' ? 'de' : 'exclusivo de'} {pack.tin}</span>
                              </li>
                            </ul>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-400 font-semibold text-left">
                    Podrás cambiar todas estas options más adelante.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="text-left pt-2 animate-fade-in">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-[280px] bg-brand-dark hover:bg-brand-dark-hover text-white py-4 rounded-xl text-xs sm:text-[13px] font-black tracking-widest uppercase transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{activeTab === 'finance' ? 'SIGUIENTE' : 'RESERVAR AHORA'}</span>
                  <span className="text-sm font-black">→</span>
                </button>
              </div>

              {/* Explanatory terms bottom notes */}
              <div className="space-y-4 pt-6 text-left animate-fade-in">
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  Si en 4 días cambias de opinión o no abonas el importe final de la moto, <span className="font-black text-slate-700">te devolvemos el dinero</span>. Garantizamos al 100% tu privacidad, no compartiremos tus datos con nadie.
                </p>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  * Importe aproximado no vinculante.
                </p>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  ** ¿Qué es la recompra asegurada? Durante el primer año te recompramos tu moto por el 70% de lo que pagaste, sí: (i) la moto está en el mismo estado (excepto por el desgaste normal) y (ii) no superaste los 10.000 km en el primer año o 20.000 km en el segundo. Si no cumples estos requisitos, te ofreceremos otras condiciones.
                </p>
              </div>

            </div>

            {/* Right Column: Dynamic Order Summary Card matching mockup layout precisely */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col">
                
                {/* Logo & Product visual banner */}
                <div className="p-4 pb-1 text-left">
                  <div className="flex items-center">
                    <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900">
                      <span className="text-[#ff0d41]">kae</span>los
                    </span>
                  </div>
                </div>

                {/* Bike Image Container */}
                <div className="px-4 pb-2">
                  <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-200/80 flex items-center justify-center group">
                    <img
                       src={bike.image}
                       alt={`${bike.brand} ${bike.model}`}
                       className="w-full h-full object-cover select-none transition-transform duration-300 transform group-hover:scale-[1.03]"
                       referrerPolicy="no-referrer"
                       loading="lazy"
                    />
                  </div>
                </div>

                {/* Table details */}
                <div className="flex flex-col text-xs sm:text-[13px] font-medium text-[#111111]">
                  
                  {/* Row 1: Bike Brand/Model & Price */}
                  <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center font-extrabold text-slate-950">
                    <span className="uppercase">{bike.brand} {bike.model}</span>
                    <span className="text-right whitespace-nowrap">{formatSoles(basePrice)}</span>
                  </div>

                  {/* Row 2: Changing Name/Setup (Light Gray Bg) */}
                  <div className="bg-[#f4f6f8] px-4 py-2.5 border-y border-slate-100 flex justify-between items-center text-slate-700">
                    <span className="text-left font-semibold">Cambio de nombre y preparación de la moto</span>
                    <span className="text-right whitespace-nowrap font-bold text-slate-900">{formatSoles(registrationFee)}</span>
                  </div>

                  {/* Row 3: Pack Name if active tab is packs */}
                  {activeTab === 'packs' && (
                    <div className="bg-[#f4f6f8]/75 px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-slate-700">
                      <span className="text-left font-semibold">{packNames[selectedPack]}</span>
                      <span className="text-right whitespace-nowrap font-bold text-slate-900">
                        {packPrices[selectedPack] === 0 ? "Incluido" : formatSoles(packPrices[selectedPack])}
                      </span>
                    </div>
                  )}

                  {/* Optional Row 4, 5, 6 for Financiado */}
                  {paymentMethod === 'financiado' && (
                    <>
                      {/* Row 4: Entrada */}
                      <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-slate-700">
                        <span className="font-semibold text-slate-500">Entrada inicial</span>
                        <span className="text-slate-900 font-bold whitespace-nowrap">{formatSoles(entranceFee)}</span>
                      </div>

                      {/* Row 5: Plazo */}
                      <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-slate-700">
                        <span className="font-semibold text-slate-500">Plazo (meses)</span>
                        <span className="text-slate-900 font-bold whitespace-nowrap">{termMonths} meses</span>
                      </div>

                      {/* Row 6: Cuota */}
                      <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-slate-700">
                        <span className="font-semibold text-slate-500">Cuota mensual *</span>
                        <span className="text-slate-900 font-bold whitespace-nowrap">{formatSoles(currentCuota)}/mes</span>
                      </div>
                    </>
                  )}

                  {/* Total a pagar Row for Al Contado */}
                  {paymentMethod === 'contado' && (
                    <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-slate-700">
                      <span className="font-semibold text-slate-500">Total a pagar</span>
                      <span className="text-slate-900 font-bold whitespace-nowrap">{formatSoles(basePrice + registrationFee + (activeTab === 'packs' ? packPrices[selectedPack] : 0))}</span>
                    </div>
                  )}

                  {/* Row 7: Reserva */}
                  <div className="px-4 py-3 flex justify-between items-center font-extrabold text-slate-950 text-sm sm:text-base border-b border-slate-100">
                    <span>Reserva a pagar ahora</span>
                    <span className="text-right whitespace-nowrap font-black">{formatSoles(registrationFee)}</span>
                  </div>

                  {/* Row 8: Explanatory text */}
                  <div className="px-4 pt-2.5 pb-1 text-[11px] text-slate-400 font-semibold leading-relaxed text-left">
                    Te lo descontaremos del precio final y si en 4 días cambias de opinión, te devolvemos el dinero.
                  </div>

                  {/* Row 9: Fineprint */}
                  <div className="px-4 pb-4 text-[10px] text-slate-400 font-medium text-left">
                    * Importe aproximado no vinculante.
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Summary Bar (< lg) */}
      {!formSubmitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-lg transition-all animate-fade-in">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {bike.brand} {bike.model}
              </span>
              <span className="text-sm sm:text-base font-black text-slate-950 truncate">
                {paymentMethod === 'financiado' ? `${formatSoles(currentCuota)}/mes` : formatSoles(totalContado)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="shrink-0 bg-brand-dark active:bg-black text-white px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{activeTab === 'finance' ? 'SIGUIENTE' : 'RESERVAR'}</span>
              <span className="font-black text-sm">→</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
