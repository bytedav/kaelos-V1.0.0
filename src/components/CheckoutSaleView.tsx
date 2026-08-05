import React, { useState, useEffect } from 'react';
import { formatSoles } from '../utils/format';
import { CarouselArrows } from './ui/CarouselArrows';
import { WhatsAppButton } from './ui/WhatsAppButton';
import { Badge } from './common/Badge';
import { 
  Check, 
  X, 
  Truck,
  CreditCard,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MotorbikeExtended } from './MotorbikeCard';
import { motorbikesData } from '../data/motorbikesData';
import { calculateCuota, clampEntranceFee, getMinEntrance, DEFAULT_TERM, getPackPrice } from '../utils/finance';
import { PRICING_CONFIG } from '../config/pricing';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutReceiptView } from './checkout/CheckoutReceiptView';
import { getOrderById, saveOrder } from '../utils/storage';


interface CheckoutSaleViewProps {
  bike: MotorbikeExtended | null;
  onBack: () => void;
  onReserveSuccess?: (bikeId: string) => void;
  motorbikesList?: MotorbikeExtended[];
}

export default function CheckoutSaleView({ bike, onBack, onReserveSuccess, motorbikesList }: CheckoutSaleViewProps) {
  // Read params from current search URL
  const queryParams = new URLSearchParams(window.location.search);
  const urlName = queryParams.get('name') || '';
  const urlEmail = queryParams.get('email') || '';
  const urlPhone = queryParams.get('phone') || '';
  const urlModeRaw = queryParams.get('mode') || queryParams.get('pago') || queryParams.get('tipo');
  const urlMode = (urlModeRaw === 'cash' || urlModeRaw === 'contado' || urlModeRaw === 'al_contado') 
    ? 'cash' 
    : (urlModeRaw === 'financed' || urlModeRaw === 'financiado' ? 'financed' : null);
  const urlBikeId = queryParams.get('bike') || '';
  const urlPackParam = queryParams.get('pack');
  const urlPack = (urlPackParam === 'basico' || urlPackParam === 'economico' || urlPackParam === 'premium') ? urlPackParam : null;
  const urlTermParam = queryParams.get('term');
  const urlTerm = urlTermParam ? parseInt(urlTermParam, 10) : null;

  const bikesSource = (motorbikesList && motorbikesList.length > 0) ? motorbikesList : motorbikesData;
  const initialBike = bike || bikesSource.find(b => b.id === urlBikeId || b.slug === urlBikeId) || bikesSource.find(b => b.id === 'bmw-r-1250-gs') || bikesSource[0];
  const [currentBike, setCurrentBike] = useState<MotorbikeExtended>(initialBike);

  useEffect(() => {
    if (bike) {
      setCurrentBike(bike);
    } else if (urlBikeId) {
      const match = bikesSource.find(b => b.id === urlBikeId || b.slug === urlBikeId);
      if (match) setCurrentBike(match);
    }
  }, [bike, urlBikeId]);

  const resolvedBike = currentBike;

  // Helper to extract dynamic order reference from URL path, query params, or hash (#16116605, ?#16116605, /checkout-sale/16116605, etc.)
  const getOrderReference = (): string => {
    // 1. Check path parameter: /checkout-sale/16116605
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const lastPath = pathParts[pathParts.length - 1];
    if (lastPath && lastPath !== 'checkout-sale' && lastPath !== 'checkout' && !lastPath.startsWith('index')) {
      const cleanPath = lastPath.replace(/^[#?kK-]+/i, '').trim();
      if (cleanPath) return cleanPath;
    }

    // 2. Check explicit query search params e.g. ?order=16116605 or ?pedido=16116605 or ?ref=16116605 or ?id=16116605
    const searchParams = new URLSearchParams(window.location.search);
    const explicitRef = searchParams.get('order') || searchParams.get('pedido') || searchParams.get('ref') || searchParams.get('id');
    if (explicitRef) {
      return explicitRef.replace(/^[#?kK-]+/i, '').trim();
    }

    // 3. Check hash fragment e.g. #16116605 or ?#16116605
    const hash = window.location.hash.replace(/^[#?kK-]+/i, '').trim();
    if (hash) {
      return hash;
    }

    // 4. Check raw search string e.g. /checkout-sale?16116605
    const rawSearch = window.location.search.replace(/^\?/, '').trim();
    if (rawSearch) {
      const cleaned = rawSearch.replace(/^[#?kK-]+/i, '').trim();
      if (cleaned && !cleaned.includes('=')) {
        return cleaned;
      }
      const firstPart = cleaned.split('&')[0];
      if (firstPart && !firstPart.includes('=')) {
        return firstPart.replace(/^[#?kK-]+/i, '').trim();
      }
    }

    return "16116605";
  };

  const [orderReference, setOrderReference] = useState<string>(getOrderReference);

  useEffect(() => {
    const handleUrlChange = () => {
      setOrderReference(getOrderReference());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Checkout Mode: 'financed' or 'cash'
  const [paymentMode, setPaymentMode] = useState<'financed' | 'cash'>(urlMode || 'financed');
  const [selectedPack, setSelectedPack] = useState<'basico' | 'economico' | 'premium'>(urlPack || 'economico');
  const [selectedTerm, setSelectedTerm] = useState<number>(urlTerm && !isNaN(urlTerm) ? urlTerm : DEFAULT_TERM);
  const [useOldBike, setUseOldBike] = useState<boolean>(false);
  const [savedEntranceFee, setSavedEntranceFee] = useState<number | null>(null);


  // Customer State
  const [fullName, setFullName] = useState(urlName || '');
  const [phone, setPhone] = useState(urlPhone || '');
  const [email, setEmail] = useState(urlEmail || '');

  // Steps interactive progress state
  // Steps: 1 (Reserva), 2 (Entrega), 3 (Documentación), 4 (Finanzas o Pago), 6 (Firma)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: urlName ? true : false, // Pre-completed if arrived via custom link
  });
  const [activeStep, setActiveStep] = useState<number>(urlName ? 2 : 1);

  // Reservation Modal / Form States
  const [modalOpen, setModalOpen] = useState(false);

  // Delivery City
  const [city, setCity] = useState('Lima');

  // Financial Validation Floating Modal States
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [finModalStep, setFinModalStep] = useState<number>(1);
  const [dniFrontal, setDniFrontal] = useState<File | null>(null);
  const [dniFrontalName, setDniFrontalName] = useState<string>('');
  const [dniFrontalUrl, setDniFrontalUrl] = useState<string>('');
  const [dniTrasera, setDniTrasera] = useState<File | null>(null);
  const [dniTraseraName, setDniTraseraName] = useState<string>('');
  const [dniTraseraUrl, setDniTraseraUrl] = useState<string>('');
  const [codigoPostal, setCodigoPostal] = useState<string>('');
  const [carnetFrontal, setCarnetFrontal] = useState<File | null>(null);
  const [carnetTrasera, setCarnetTrasera] = useState<File | null>(null);
  const [rentaUltimoAno, setRentaUltimoAno] = useState<File | null>(null);
  const [reciboServicioName, setReciboServicioName] = useState('');
  const [reciboServicioUrl, setReciboServicioUrl] = useState<string>('');
  const [modelo100, setModelo100] = useState<File | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [completedFinModalSteps, setCompletedFinModalSteps] = useState<Record<number, boolean>>({});
  const [financeStatus, setFinanceStatus] = useState<'aprobada' | 'no_aprobada' | 'en_evaluacion'>('en_evaluacion');

  // Payment Receipt States
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [paymentReceiptName, setPaymentReceiptName] = useState<string>('');
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState<string>('');

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Carousel State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Financial calculations based on COMMITTED states
  const motoPrice = resolvedBike.price;
  const registrationFee = PRICING_CONFIG.REGISTRATION_FEE_DEFAULT;
  
  const packPrice = getPackPrice(selectedPack);
  const reservationFee = -PRICING_CONFIG.RESERVATION_FEE;
  const totalCash = motoPrice + registrationFee + packPrice + reservationFee;

  // Entry amount based on committed term/mode (or saved down payment)
  const entryAmount = paymentMode === 'cash' 
    ? PRICING_CONFIG.RESERVATION_FEE 
    : (savedEntranceFee ?? clampEntranceFee(motoPrice, getMinEntrance(motoPrice)));

  // Helper for dynamic installment calculations
  const getMonthlyInstallmentVal = (term: number, packType: 'basico' | 'economico' | 'premium') => {
    const packCost = getPackPrice(packType);
    return calculateCuota(motoPrice + registrationFee + packCost, entryAmount, term);
  };

  const monthlyInstallment = getMonthlyInstallmentVal(selectedTerm, selectedPack);

  // Track if saved order has completed loading from database store
  const [isOrderLoaded, setIsOrderLoaded] = useState<boolean>(false);

  // Sync state if URL changes
  useEffect(() => {
    if (urlName) {
      setFullName(urlName);
      setCompletedSteps(prev => ({ ...prev, 1: true }));
      setActiveStep(2);
    }
    if (urlEmail) setEmail(urlEmail);
    if (urlPhone) setPhone(urlPhone);
    if (urlMode) {
      setPaymentMode(urlMode);
    }
    if (urlPack) {
      setSelectedPack(urlPack);
    }
    if (urlTerm && !isNaN(urlTerm)) {
      setSelectedTerm(urlTerm);
    }
  }, [urlName, urlEmail, urlPhone, urlMode, urlPack, urlTerm]);

  // Load persistent Order data from database store on mount or when orderReference changes
  useEffect(() => {
    let isMounted = true;
    async function loadSavedOrder() {
      if (!orderReference) {
        if (isMounted) setIsOrderLoaded(true);
        return;
      }
      const order = await getOrderById(orderReference);
      if (order && isMounted) {
        if (order.bike_id) {
          const matched = bikesSource.find(b => b.id === order.bike_id || b.slug === order.bike_id || `${b.brand} ${b.model}`.toLowerCase() === String(order.bike_id).toLowerCase());
          if (matched) setCurrentBike(matched);
        }
        if (!urlMode && order.payment_mode) {
          const normMode = (order.payment_mode === 'cash' || order.payment_mode === 'contado' || order.payment_mode === 'al_contado') 
            ? 'cash' 
            : 'financed';
          setPaymentMode(normMode);
          if (normMode === 'cash' && !urlPack && (!order.selected_pack || order.selected_pack === 'economico')) {
            setSelectedPack('basico');
          }
        } else if (urlMode === 'cash' && !urlPack && !order?.selected_pack) {
          setSelectedPack('basico');
        }
        if (!urlPack && order.selected_pack) setSelectedPack(order.selected_pack);
        if (!urlTerm && order.selected_term) setSelectedTerm(order.selected_term);
        if (order.down_payment) setSavedEntranceFee(order.down_payment);
        if (typeof order.use_old_bike === 'boolean') setUseOldBike(order.use_old_bike);
        if (!urlName && order.customer_name) setFullName(order.customer_name);
        if (!urlEmail && order.customer_email) setEmail(order.customer_email);
        if (!urlPhone && order.customer_phone) setPhone(order.customer_phone);
        if (order.finance_status) setFinanceStatus(order.finance_status);

        // Persistent Document URLs & Names
        if (order.dni_frontal_url) {
          setDniFrontalUrl(order.dni_frontal_url);
          if (order.dni_frontal_name) setDniFrontalName(order.dni_frontal_name);
        }
        if (order.dni_trasera_url) {
          setDniTraseraUrl(order.dni_trasera_url);
          if (order.dni_trasera_name) setDniTraseraName(order.dni_trasera_name);
        }
        if (order.recibo_servicio_url) {
          setReciboServicioUrl(order.recibo_servicio_url);
          if (order.recibo_servicio_name) setReciboServicioName(order.recibo_servicio_name);
        }
        if (order.payment_receipt_url) {
          setPaymentReceiptUrl(order.payment_receipt_url);
          if (order.payment_receipt_name) setPaymentReceiptName(order.payment_receipt_name);
        }
        if (order.completed_steps) {
          setCompletedSteps(order.completed_steps);
        }
        if (order.completed_fin_modal_steps) {
          setCompletedFinModalSteps(order.completed_fin_modal_steps);
        }
        if (order.user_location) {
          setUserLocation(order.user_location);
        }
      }
      if (isMounted) setIsOrderLoaded(true);
    }
    loadSavedOrder();
    return () => {
      isMounted = false;
    };
  }, [orderReference, urlMode, urlPack, urlTerm, urlName, urlEmail, urlPhone]);

  // Save changes to database store ONLY AFTER order has finished loading
  useEffect(() => {
    if (!isOrderLoaded || !orderReference || !currentBike) return;
    saveOrder({
      id: orderReference,
      order_id: orderReference,
      bike_id: currentBike.id,
      bike_title: `${currentBike.brand} ${currentBike.model}`,
      payment_mode: paymentMode,
      selected_pack: selectedPack,
      selected_term: selectedTerm,
      down_payment: entryAmount,
      use_old_bike: useOldBike,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      finance_status: financeStatus,
      // Persistent Files & Steps
      dni_frontal_name: dniFrontalName || dniFrontal?.name || '',
      dni_frontal_url: dniFrontalUrl,
      dni_trasera_name: dniTraseraName || dniTrasera?.name || '',
      dni_trasera_url: dniTraseraUrl,
      recibo_servicio_name: reciboServicioName || rentaUltimoAno?.name || '',
      recibo_servicio_url: reciboServicioUrl,
      payment_receipt_name: paymentReceiptName || paymentReceipt?.name || '',
      payment_receipt_url: paymentReceiptUrl,
      user_location: userLocation,
      completed_steps: completedSteps,
      completed_fin_modal_steps: completedFinModalSteps,
    });
  }, [
    isOrderLoaded, orderReference, currentBike, paymentMode, selectedPack, 
    selectedTerm, entryAmount, useOldBike, fullName, email, phone, financeStatus,
    dniFrontalName, dniFrontalUrl, dniFrontal, dniTraseraName, dniTraseraUrl, dniTrasera,
    reciboServicioName, reciboServicioUrl, rentaUltimoAno, paymentReceiptName, paymentReceiptUrl, paymentReceipt,
    userLocation, completedSteps, completedFinModalSteps
  ]);

  const handleFinishFinancialModal = () => {
    setIsFinancialModalOpen(false);
    setCompletedSteps(prev => ({ ...prev, 2: true }));
    setActiveStep(3);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-slate-900 pb-20 relative">
      
      {/* Top Header Logo Component */}
      <CheckoutHeader onBack={onBack} orderReference={orderReference} />

      {/* MAIN SCREEN AREA */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden">
        
        {/* If checkout is completely finished, render clean official receipt layout */}
        {checkoutComplete ? (
          <CheckoutReceiptView
            fullName={fullName}
            orderReference={orderReference}
            resolvedBike={resolvedBike}
            paymentMode={paymentMode}
            motoPrice={motoPrice}
            registrationFee={registrationFee}
            selectedPack={selectedPack}
            packPrice={packPrice}
            entryAmount={entryAmount}
            totalCash={totalCash}
            onBack={onBack}
          />
        ) : (
          /* Normal checkout screen */
          <div>
            {/* Title Greeting Section */}
            <div className="mb-6 text-left">
              <div className="max-w-3xl space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-[34px] font-black text-slate-950 tracking-tight">
                    {fullName && fullName.trim() ? `¡Hola, ${fullName.trim()}!` : '¡Hola!'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-[#ff0d41] text-white text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-2xs">
                    <span>🏍️ ¡Futuro Motero!</span>
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-600 flex items-center gap-2">
                  <span>Seguimiento de tu compra</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h2>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: ORDER TRACKING TIMELINE */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* SEGUIMIENTO DEL PROCESO CARD */}
                <div className="bg-white border border-slate-200/90 rounded-[22px] p-4 sm:p-6 shadow-sm text-left animate-fade-in space-y-5">
                  <div className="border-b border-slate-100 pb-2.5 sm:pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">
                        Seguimiento del proceso
                      </h3>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                        Seguimiento en tiempo real del estado en que se encuentra tu moto.
                      </p>
                    </div>
                  </div>

                  {/* Visual Circle Process Timeline */}
                  <div className="py-2 sm:py-4 space-y-5">
                    <div className="relative flex items-center justify-between max-w-xl mx-auto px-1 sm:px-2 overflow-x-auto custom-scrollbar pb-2">
                      {/* Connecting Line behind circles */}
                      <div className="absolute left-6 right-6 sm:left-8 sm:right-8 top-1/3 -translate-y-1/2 h-0.5 sm:h-1 bg-slate-200 z-0" />
                      <div className="absolute left-6 right-1/2 sm:left-8 top-1/3 -translate-y-1/2 h-0.5 sm:h-1 bg-amber-500 z-0" />

                      {/* Step 1: En proceso */}
                      <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-500 border-2 sm:border-3 border-white text-white font-extrabold flex items-center justify-center shadow-md animate-pulse">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        </div>
                        <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight text-center">
                          1. En proceso
                        </span>
                        <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                          Reserva
                        </span>
                      </div>

                      {/* Step 2 (Financed only): Financiación */}
                      {paymentMode === 'financed' && (
                        <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                          <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 sm:border-3 border-white font-extrabold flex items-center justify-center shadow-md ${
                            financeStatus === 'aprobada' 
                              ? 'bg-emerald-500 text-white'
                              : financeStatus === 'no_aprobada'
                                ? 'bg-rose-500 text-white'
                                : 'bg-amber-500 text-white animate-pulse'
                          }`}>
                            {financeStatus === 'aprobada' ? (
                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                            ) : financeStatus === 'no_aprobada' ? (
                              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                            ) : (
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                            )}
                          </div>
                          <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight text-center">
                            2. Financiación
                          </span>
                          <span className={`hidden sm:inline-block text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-0.5 ${
                            financeStatus === 'aprobada'
                              ? 'text-emerald-700 bg-emerald-50'
                              : financeStatus === 'no_aprobada'
                                ? 'text-rose-700 bg-rose-50'
                                : 'text-amber-700 bg-amber-50'
                          }`}>
                            {financeStatus === 'aprobada' ? 'COMPLETADO' : financeStatus === 'no_aprobada' ? 'RECHAZADO' : 'EN PROCESO'}
                          </span>
                        </div>
                      )}

                      {/* Step 3 (or 2 if cash): Importe Final */}
                      <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 border-2 sm:border-3 border-white text-slate-400 font-extrabold flex items-center justify-center shadow-xs">
                          <CreditCard className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                        </div>
                        <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-tight text-center">
                          {paymentMode === 'financed' ? '3. Importe Final' : '2. Importe Final'}
                        </span>
                        <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 text-center truncate max-w-[90px]">
                          {paymentMode === 'financed' ? 'Inicial - Reserva' : 'Saldo - Reserva'}
                        </span>
                      </div>

                      {/* Step 4 (or 3 if cash): Documentación */}
                      <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 border-2 sm:border-3 border-white text-slate-400 font-extrabold flex items-center justify-center shadow-xs">
                          <FileText className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-tight text-center">
                          {paymentMode === 'financed' ? '4. Documentación' : '3. Documentación'}
                        </span>
                        <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                          Pendiente
                        </span>
                      </div>

                      {/* Step 5 (or 4 if cash): Para entrega */}
                      <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 border-2 sm:border-3 border-white text-slate-400 font-extrabold flex items-center justify-center shadow-xs">
                          <Truck className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-tight text-center">
                          {paymentMode === 'financed' ? '5. Para entrega' : '4. Para entrega'}
                        </span>
                        <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                          Pendiente
                        </span>
                      </div>
                    </div>

                    {/* Alert Message for Financiación No Aprobada */}
                    {paymentMode === 'financed' && financeStatus === 'no_aprobada' && (
                      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in text-left">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 stroke-[2.2]" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wider">
                            Financiación No Aprobada
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-rose-900 leading-snug">
                            Nos contactaremos contigo para el reembolso de tu reserva en caso sea Financiación no aprobada.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Detailed step description cards */}
                    <div className="grid grid-cols-1 gap-2.5 pt-2 text-left">
                      {/* Step 1 detail */}
                      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">1. En proceso (Reserva Solicitada)</span>
                            <span className="hidden sm:block text-[11px] text-slate-600 font-medium">Reserva registrada ({formatSoles(PRICING_CONFIG.RESERVATION_FEE)}). Pendiente de verificación de pago.</span>
                          </div>
                        </div>
                        <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">EN PROCESO</span>
                      </div>

                      {/* Step 2 detail (if financed) */}
                      {paymentMode === 'financed' && (
                        <div className={`border rounded-2xl p-3.5 flex items-center justify-between text-xs ${
                          financeStatus === 'no_aprobada' 
                            ? 'bg-rose-50/50 border-rose-200' 
                            : financeStatus === 'aprobada'
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-amber-50/50 border-amber-200'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[11px] ${
                              financeStatus === 'no_aprobada' ? 'bg-rose-600' : financeStatus === 'aprobada' ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}>
                              2
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 block">
                                2. Financiación {financeStatus === 'aprobada' ? 'COMPLETADO' : financeStatus === 'no_aprobada' ? 'RECHAZADO' : 'EN PROCESO'}
                              </span>
                              <span className="hidden sm:block text-[11px] text-slate-600 font-medium">
                                {financeStatus === 'no_aprobada' 
                                  ? 'Nos contactaremos contigo para el reembolso de tu reserva en caso sea Financiación no aprobada.'
                                  : financeStatus === 'aprobada'
                                    ? 'Crédito pre-aprobado. Procede con el pago de inicial.'
                                    : 'Validando documentación enviada.'}
                              </span>
                            </div>
                          </div>
                          <span className={`font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase ${
                            financeStatus === 'no_aprobada' 
                              ? 'bg-rose-100 text-rose-800' 
                              : financeStatus === 'aprobada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {financeStatus === 'aprobada' ? 'COMPLETADO' : financeStatus === 'no_aprobada' ? 'RECHAZADO' : 'EN PROCESO'}
                          </span>
                        </div>
                      )}

                      {/* Step 3 (or 2 if cash): Importe Final */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                            {paymentMode === 'financed' ? '3' : '2'}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">
                              {paymentMode === 'financed' ? '3. Importe Final' : '2. Importe Final'}
                            </span>
                            <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
                              {paymentMode === 'financed' 
                                ? `Pago de inicial descontando la reserva de ${formatSoles(PRICING_CONFIG.RESERVATION_FEE)}.` 
                                : `Descontando la reserva de ${formatSoles(PRICING_CONFIG.RESERVATION_FEE)}.`}
                            </span>
                          </div>
                        </div>
                        <span className="bg-slate-200 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">PENDIENTE</span>
                      </div>

                      {/* Step 4 (or 3 if cash): Documentación */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                            {paymentMode === 'financed' ? '4' : '3'}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">
                              {paymentMode === 'financed' ? '4. Documentación' : '3. Documentación'}
                            </span>
                            <span className="hidden sm:block text-[11px] text-slate-500 font-medium">Trámite de tarjeta de propiedad y placa.</span>
                          </div>
                        </div>
                        <span className="bg-slate-200 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">PENDIENTE</span>
                      </div>

                      {/* Step 5 (or 4 if cash): Para entrega */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                            {paymentMode === 'financed' ? '5' : '4'}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">
                              {paymentMode === 'financed' ? '5. Para entrega' : '4. Para entrega'}
                            </span>
                            <span className="hidden sm:block text-[11px] text-slate-500 font-medium">Despacho a domicilio o recojo en tienda.</span>
                          </div>
                        </div>
                        <span className="bg-slate-200 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">PENDIENTE</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: RESERVATION SUMMARY CARD */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. Image Carousel Card */}
                <div className="bg-white rounded-[22px] border border-slate-200/90 overflow-hidden shadow-sm relative group flex flex-col text-left p-3.5 sm:p-4 space-y-3">
                  {/* Top Branding & Stock Badge */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
                    <div className="flex items-center gap-1 font-black text-[#ff0d41] text-sm sm:text-base tracking-tighter uppercase select-none">
                      <span>kae</span><span className="text-slate-900">los</span>
                    </div>
                    <Badge variant="emerald" size="sm" dot dotPulse>
                      En Stock
                    </Badge>
                  </div>

                  {/* Image Carousel Display Container with elegant rounded corners */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-200/80 flex items-center justify-center">
                    <img 
                      src={
                        resolvedBike.images && resolvedBike.images.length > 0 
                          ? resolvedBike.images[currentImgIndex] 
                          : resolvedBike.image
                      } 
                      alt={resolvedBike.model} 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover select-none transition-transform duration-300 transform group-hover:scale-[1.03]" 
                    />
                    
                    {/* Navigation arrows */}
                    {resolvedBike.images && resolvedBike.images.length > 1 && (
                      <CarouselArrows
                        variant="overlay"
                        size="sm"
                        onPrev={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const total = resolvedBike.images ? resolvedBike.images.length : 1;
                          setCurrentImgIndex((prev) => (prev - 1 + total) % total);
                        }}
                        onNext={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const total = resolvedBike.images ? resolvedBike.images.length : 1;
                          setCurrentImgIndex((prev) => (prev + 1) % total);
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* 2. Bike Details & Price Breakdown Card */}
                <div className="bg-white rounded-[22px] border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4 text-left">
                  <h3 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                    {resolvedBike.brand} {resolvedBike.model}
                  </h3>

                  {/* Cost Breakdown */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-semibold border-b border-slate-100 pb-4">
                    <div className="flex justify-between items-center">
                      <span>Moto</span>
                      <span className="text-slate-950 font-bold">{formatSoles(motoPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cambio de nombre y preparación</span>
                      <span className="text-slate-950 font-bold">{formatSoles(registrationFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{selectedPack === 'basico' ? 'Pack Básico' : selectedPack === 'economico' ? 'Pack Económico' : 'Pack Premium'}</span>
                      <span className="text-slate-950 font-bold">{formatSoles(packPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Reserva</span>
                      <span className="text-[#ff0d41] font-black">{formatSoles(reservationFee)}</span>
                    </div>
                  </div>

                  {/* Dynamic total / monthly display */}
                  {paymentMode === 'financed' ? (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-950">
                        Cuota mensual *
                      </span>
                      <span className="text-lg sm:text-xl font-black text-slate-950">
                        {formatSoles(monthlyInstallment)}/mes
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-950">
                        Total
                      </span>
                      <span className="text-lg sm:text-xl font-black text-slate-950">
                        {formatSoles(totalCash)}
                      </span>
                    </div>
                  )}

                  {/* Mode Toggle Banner */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 text-slate-500 font-bold leading-normal text-left">
                      {paymentMode === 'financed' ? (
                        <span>
                          Financiado a {selectedTerm} meses con {entryAmount > 0 ? `una entrada de ${formatSoles(entryAmount)}` : 'entrada de S/. 0.00'}.
                        </span>
                      ) : (
                        <span>A pagar al contado.</span>
                      )}
                    </div>
                  </div>

                  {paymentMode === 'financed' && (
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">
                      * Importe aproximado no vinculante de carácter orientativo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* WhatsApp Support Box */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-[22px] p-5 text-left space-y-2">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">¿Necesitas ayuda con tu compra?</h4>
          <p className="text-xs text-slate-600 font-medium">Asistencia personal por WhatsApp en todo el proceso.</p>
          <WhatsAppButton
            label="Asistencia por WhatsApp"
            message={`Hola, necesito ayuda con la reserva de la moto ${resolvedBike.brand} ${resolvedBike.model}.`}
            size="sm"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
