import React, { useState, useEffect, useRef } from 'react';
import { formatSoles } from '../utils/format';
import { CarouselArrows } from './ui/CarouselArrows';
import { WhatsAppButton } from './ui/WhatsAppButton';
import { Badge } from './common/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Check, 
  X, 
  ArrowRight,
  Truck,
  Lock,
  UploadCloud,
  CreditCard,
  Building2,
  Sparkles,
  FileSignature,
  Landmark,
  QrCode,
  Plus,
  AlertTriangle,
  MessageCircle,
  FileText,
  Printer,
  RefreshCw,
  Share2,
  User,
  Copy,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MotorbikeExtended } from './MotorbikeCard';
import { motorbikesData } from '../data/motorbikesData';
import { calculateCuota, clampEntranceFee, getMinEntrance, FINANCE_TERMS, DEFAULT_TERM, getPackPrice, PACK_PRICES, PACK_NAMES } from '../utils/finance';
import { PRICING_CONFIG } from '../config/pricing';
import { sanitizeCustomerName } from '../utils/privacy';
import { CustomSelect } from './CustomSelect';
import { compressFileToDataUrl } from '../utils/fileStorage';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutReceiptView } from './checkout/CheckoutReceiptView';
import { CheckoutPersonalDataModal } from './checkout/CheckoutPersonalDataModal';
import { CheckoutFinancialModal } from './checkout/CheckoutFinancialModal';
import { getOrderById, saveOrder } from '../utils/storage';
import { SITE_CONFIG } from '../data/siteConfig';


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
  const [promoAccepted, setPromoAccepted] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Step 2 (Entrega) States
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'pickup'>('home');
  const [address, setAddress] = useState('Av. Javier Prado Este 4200');
  const [city, setCity] = useState('Lima');
  const [zipCode, setZipCode] = useState('15023');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('morning');

  // Step 3 (Documentación) States
  const [dniAnverso, setDniAnverso] = useState<File | null>(null);
  const [dniReverso, setDniReverso] = useState<File | null>(null);
  const [dniAnversoName, setDniAnversoName] = useState('');
  const [dniReversoName, setDniReversoName] = useState('');
  const [reciboServicio, setReciboServicio] = useState<File | null>(null);
  const [reciboServicioName, setReciboServicioName] = useState('');

  // Step 4 (Validación Financiera) States
  const [employmentType, setEmploymentType] = useState('Dependiente');
  const [monthlyIncome, setMonthlyIncome] = useState('1850');
  const [antiquity, setAntiquity] = useState('2');
  const [isFinancingProcessing, setIsFinancingProcessing] = useState(false);
  const [financingApproved, setFinancingApproved] = useState(false);
  const [financingRejected, setFinancingRejected] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('BCP');

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
  const [reciboServicioUrl, setReciboServicioUrl] = useState<string>('');
  const [modelo100, setModelo100] = useState<File | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [completedFinModalSteps, setCompletedFinModalSteps] = useState<Record<number, boolean>>({});
  const [financeStatus, setFinanceStatus] = useState<'aprobada' | 'no_aprobada' | 'en_evaluacion'>('aprobada');

  // Step 5 (Pago) States
  const [paymentMethodType, setPaymentMethodType] = useState<'transfer' | 'yape'>('transfer');
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [paymentReceiptName, setPaymentReceiptName] = useState<string>('');
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Check if payment (reservation or initial entry) is confirmed
  const isPaymentDone = completedSteps[3] === true || completedSteps[4] === true || paymentConfirmed;
  const isAllPreviousStepsCompleted = Boolean(completedSteps[1] && completedSteps[2] && (completedSteps[3] || paymentConfirmed));

  // Step 6 (Firma de contrato) States
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  // Step 1: Submit Reservation & Delivery
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setCompletedSteps(prev => ({ ...prev, 1: true }));
    setActiveStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 2: Submit Documentation
  const handleDocumentationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinancialModalOpen(true);
  };

  const handleFinishFinancialModal = () => {
    setIsFinancialModalOpen(false);
    setCompletedSteps(prev => ({ ...prev, 2: true }));
    setActiveStep(3);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Step 3: Submit Finance (Financed only)
  const handleFinanceSubmit = (e: React.FormEvent, forceStatus?: 'approve' | 'reject') => {
    e.preventDefault();
    setIsFinancingProcessing(true);
    setFinancingRejected(false);
    setTimeout(() => {
      setIsFinancingProcessing(false);
      if (forceStatus === 'reject') {
        setFinancingRejected(true);
        setFinancingApproved(false);
      } else {
        setFinancingApproved(true);
        setFinancingRejected(false);
        setCompletedSteps(prev => ({ ...prev, 3: true }));
        setActiveStep(4);
        window.scrollTo({ top: 260, behavior: 'smooth' });
      }
    }, 1200);
  };

  // Step 4: Submit Payment (Cash Reserve or Financed Initial Entry)
  const handleCashPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasVoucher = Boolean(paymentReceipt || paymentReceiptName || paymentReceiptUrl);
    if (!hasVoucher) {
      setPaymentError('Por favor adjunta la foto o voucher de tu comprobante de pago para confirmar la reserva.');
      return;
    }
    setPaymentError(null);
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentConfirmed(true);
      setCompletedSteps(prev => ({ ...prev, 3: true, 4: true }));
      setActiveStep(4);
      if (bike?.id) {
        onReserveSuccess?.(bike.id);
      } else {
        onReserveSuccess?.('honda-pcx-125');
      }
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 1500);
  };

  // Step 6: Finalize signature
  const handleFinalSignSubmit = () => {
    if (!isSigned) return;
    setCompletedSteps(prev => ({ ...prev, 6: true }));
    setCheckoutComplete(true);
    if (bike?.id) {
      onReserveSuccess?.(bike.id);
    } else {
      onReserveSuccess?.('honda-pcx-125');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-[36px] font-black text-slate-950 tracking-tight mb-2">
                  ¡Hola, {fullName}!
                </h1>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  {isAllPreviousStepsCompleted ? 'Seguimiento de tu compra' : 'Completa tu compra en solo 4 pasos'}
                </h2>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: INTERACTIVE TIMELINE STEP ENGINE */}
              <div className="lg:col-span-7 space-y-6 relative">
                
                {!isAllPreviousStepsCompleted && (
                  <>
                    {/* 1. DATOS PERSONALES */}
                <div className="relative flex gap-2.5 sm:gap-4 text-left">
                  {/* Connector vertical line */}
                  <div className="absolute left-4 sm:left-6 top-10 sm:top-12 bottom-[-24px] w-[2px] sm:w-[2.5px] bg-slate-200 z-0" />
                  
                  {/* Circle badge */}
                  <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shrink-0 font-bold transition duration-300 text-xs sm:text-base ${
                    completedSteps[1] 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                      : activeStep === 1 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {completedSteps[1] ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" /> : '1'}
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 min-w-0 bg-white border rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 transition duration-300 ${
                    activeStep === 1 || completedSteps[1]
                      ? 'border-slate-300 shadow-sm' 
                      : 'border-slate-100 bg-[#f5f5f7]/40 opacity-40 select-none'
                  }`}>
                    {completedSteps[1] ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Datos personales</h3>
                          <div className="text-xs text-slate-600 font-semibold mt-1 space-y-0.5">
                            <p><strong className="text-slate-900">Nombre:</strong> {sanitizeCustomerName(fullName)}</p>
                            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                              <span>Datos de contacto privados y verificados</span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setModalOpen(true);
                          }}
                          className="text-[11px] font-extrabold text-[#ff0d41] hover:underline uppercase tracking-wider shrink-0 cursor-pointer"
                        >
                          Modificar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Datos personales</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Completa tus nombres, teléfono y correo en el formulario.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setModalOpen(true);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-black px-5 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <span>LLENAR DATOS</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. DOCUMENTACIÓN */}
                <div className="relative flex gap-2.5 sm:gap-4 text-left">
                  {/* Connector vertical line */}
                  <div className="absolute left-4 sm:left-6 top-10 sm:top-12 bottom-[-24px] w-[2px] sm:w-[2.5px] bg-slate-200 z-0" />
                  
                  {/* Circle badge */}
                  <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shrink-0 font-bold transition duration-300 text-xs sm:text-base ${
                    completedSteps[2] 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                      : activeStep === 2 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {completedSteps[2] ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" /> : '2'}
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 min-w-0 bg-white border rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 transition duration-300 ${
                    activeStep === 2 || completedSteps[2]
                      ? 'border-slate-300 shadow-sm' 
                      : 'border-slate-100 bg-[#f5f5f7]/40 opacity-40 select-none'
                  }`}>
                    {completedSteps[2] && activeStep !== 2 ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Documentación</h3>
                          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> ¡Documentación registrada y adjuntada!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStep(2);
                          }}
                          className="text-[11px] font-extrabold text-[#ff0d41] hover:underline uppercase tracking-wider shrink-0 cursor-pointer"
                        >
                          Modificar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Documentación</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Documentos de identidad requeridos para la gestión de trámite.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStep(2);
                            setIsFinancialModalOpen(true);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-black px-5 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <span>SUBIR DOCUMENTACIÓN</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. MÉTODOS DE PAGO */}
                <div className="relative flex gap-2.5 sm:gap-4 text-left">
                  {/* Connector vertical line */}
                  {isAllPreviousStepsCompleted && (
                    <div className="absolute left-4 sm:left-6 top-10 sm:top-12 bottom-[-24px] w-[2px] sm:w-[2.5px] bg-slate-200 z-0" />
                  )}
                  
                  {/* Circle badge */}
                  <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shrink-0 font-bold transition duration-300 text-xs sm:text-base ${
                    completedSteps[3] 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                      : activeStep === 3 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {completedSteps[3] ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" /> : '3'}
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 min-w-0 bg-white border rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 transition duration-300 ${
                    activeStep === 3 || completedSteps[3]
                      ? 'border-slate-300 shadow-sm' 
                      : 'border-slate-100 bg-[#f5f5f7]/40 opacity-40 select-none'
                  }`}>
                    {completedSteps[3] && activeStep !== 3 ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Método de pago de reserva</h3>
                          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> ¡Pago de reserva confirmado con comprobante!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStep(3);
                          }}
                          className="text-[11px] font-extrabold text-[#ff0d41] hover:underline uppercase tracking-wider shrink-0 cursor-pointer"
                        >
                          Modificar
                        </button>
                      </div>
                    ) : activeStep === 3 ? (
                      <form onSubmit={handleCashPaymentSubmit} className="space-y-3.5 sm:space-y-5 animate-fade-in text-left">
                        <div className="border-b border-slate-100 pb-2 sm:pb-3">
                          <h3 className="font-extrabold text-slate-950 text-sm sm:text-lg">
                            Método de pago de reserva
                          </h3>
                          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                            Reserva tu moto con <strong className="font-extrabold text-slate-950">{formatSoles(PRICING_CONFIG.RESERVATION_FEE)}</strong> para congelar tu precio. Se descuenta del costo final.
                          </p>
                        </div>

                        {/* Amount Banner - Compact Light Theme */}
                        <div className="bg-rose-50/80 border border-rose-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center justify-between gap-1.5 shadow-2xs">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="inline-block text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#ff0d41] uppercase bg-white px-1.5 py-0.5 rounded-md border border-rose-200/80 shadow-2xs">
                                Reserva
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium hidden sm:inline">100% acreditable</span>
                            </div>
                            <div className="text-sm sm:text-xl font-black text-slate-950 tracking-tight pt-0.5">
                              {formatSoles(PRICING_CONFIG.RESERVATION_FEE)}
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-extrabold text-emerald-800 bg-emerald-50/90 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-emerald-200/80 shadow-2xs">
                              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 stroke-[2.5]" />
                              Reembolsable
                            </span>
                          </div>
                        </div>

                        {/* Payment Method Selector Grid */}
                        <div className="space-y-2.5">
                          <label className="block text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                            1. Selecciona Forma de Pago
                          </label>
                          
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => setPaymentMethodType('transfer')}
                              className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left flex flex-col justify-between gap-1 sm:gap-2 transition cursor-pointer ${
                                paymentMethodType === 'transfer'
                                  ? 'border-slate-950 bg-slate-100/90 text-slate-950 shadow-xs ring-2 ring-slate-950/15'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                                {paymentMethodType === 'transfer' && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="block text-[10px] sm:text-xs font-extrabold leading-tight text-slate-950">Transferencia</span>
                                <span className="block text-[8.5px] sm:text-[10px] font-semibold text-slate-500">BCP / BBVA</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentMethodType('yape')}
                              className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left flex flex-col justify-between gap-1 sm:gap-2 transition cursor-pointer ${
                                paymentMethodType === 'yape'
                                  ? 'border-slate-950 bg-slate-100/90 text-slate-950 shadow-xs ring-2 ring-slate-950/15'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                                {paymentMethodType === 'yape' && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="block text-[10px] sm:text-xs font-extrabold leading-tight text-slate-950">Yape / Plin</span>
                                <span className="block text-[8.5px] sm:text-[10px] font-semibold text-slate-500">Pago móvil</span>
                              </div>
                            </button>
                          </div>

                          {/* Detail for Transferencia */}
                          {paymentMethodType === 'transfer' && (
                            <div className="bg-[#f8f9fa] border border-slate-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-2 sm:space-y-2.5 text-xs animate-fade-in">
                              <div className="flex items-center justify-between">
                                <p className="font-extrabold text-slate-950 text-[10px] sm:text-xs">
                                  Cuentas {SITE_CONFIG.payment.companyName}
                                </p>
                                <span className="text-[8.5px] sm:text-[10px] text-slate-500 font-semibold">RUC: {SITE_CONFIG.payment.ruc}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                                {SITE_CONFIG.payment.accounts.map((acc, idx) => (
                                  <div key={idx} className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200/90 shadow-2xs space-y-1 relative">
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-slate-950 text-[10px] sm:text-xs flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color }}></span> {acc.bankName}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyText(acc.accountNumber)}
                                        className="text-[9px] sm:text-[10px] font-bold text-slate-600 hover:text-black bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedText === acc.accountNumber ? (
                                          <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3 stroke-[3]" /> Copiado</span>
                                        ) : (
                                          <><Copy className="w-3 h-3" /> Copiar</>
                                        )}
                                      </button>
                                    </div>
                                    <div className="text-[9.5px] sm:text-[11px] font-semibold text-slate-600 space-y-0.5 break-all">
                                      <div>CTA: <strong className="font-bold text-slate-900">{acc.accountNumber}</strong></div>
                                      <div className="text-[8.5px] sm:text-[10px]">CCI: <span className="font-medium text-slate-500">{acc.cci}</span></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detail for Yape */}
                          {paymentMethodType === 'yape' && (
                            <div className="bg-[#f8f9fa] border border-slate-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-2 text-xs animate-fade-in">
                              <div className="bg-white p-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-200/90 flex items-center justify-between shadow-2xs gap-2">
                                <div className="space-y-0.5 min-w-0">
                                  <span className="font-extrabold text-slate-950 block text-[10px] sm:text-xs truncate">Número Yape / Plin</span>
                                  <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                                    {SITE_CONFIG.payment.yapePlin.phone}
                                  </span>
                                  <span className="text-[8.5px] sm:text-[10px] text-slate-500 block font-medium truncate">Titular: {SITE_CONFIG.payment.yapePlin.holder}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-900 rounded-md sm:rounded-lg font-black text-[9px] sm:text-[11px] tracking-wider">
                                    YAPE / PLIN
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(SITE_CONFIG.payment.yapePlin.phone.replace(/\D/g, ''))}
                                    className="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedText === SITE_CONFIG.payment.yapePlin.phone.replace(/\D/g, '') ? (
                                      <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3 stroke-[3]" /> Copiado</span>
                                    ) : (
                                      <><Copy className="w-3 h-3" /> Copiar</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}


                          {/* Upload Voucher Area */}
                          <div className="space-y-1 pt-1">
                            <label className="block text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-wider">
                              2. Adjuntar Comprobante de Pago *
                            </label>
                            <label className="border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50/70 hover:bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                required={!paymentReceiptName && !paymentReceiptUrl}
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    setPaymentReceipt(file);
                                    setPaymentReceiptName(file.name);
                                    setPaymentError(null);
                                    try {
                                      const info = await compressFileToDataUrl(file);
                                      setPaymentReceiptUrl(info.url);
                                    } catch (err) {
                                      console.error('Error compressing voucher file', err);
                                    }
                                  }
                                }}
                              />
                              {paymentReceiptName || paymentReceiptUrl ? (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[10px] sm:text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg sm:rounded-xl w-full justify-between min-w-0">
                                  <div className="flex items-center gap-1.5 truncate min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                                    <span className="truncate">{paymentReceiptName || 'Comprobante Adjuntado'}</span>
                                  </div>
                                  <span className="text-[9px] sm:text-[10px] text-slate-500 hover:text-black underline shrink-0 font-bold">Cambiar</span>
                                </div>
                              ) : (
                                <div className="space-y-1 py-0.5">
                                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-rose-50 text-[#ff0d41] flex items-center justify-center mx-auto group-hover:scale-110 transition">
                                    <UploadCloud className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                  </div>
                                  <span className="block text-[10px] sm:text-xs font-bold text-slate-900 leading-tight">
                                    Adjuntar voucher o foto
                                  </span>
                                  <span className="block text-[8.5px] sm:text-[10px] text-slate-400 font-semibold">
                                    PNG, JPG, PDF (Máx. 10MB)
                                  </span>
                                </div>
                              )}
                            </label>

                            {paymentError && (
                              <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2 text-rose-900 text-xs font-semibold animate-fade-in mt-2">
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.2]" />
                                <span>{paymentError}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                          <span className="text-[9.5px] sm:text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 stroke-[2.5]" /> Transacción 100% segura
                          </span>
                          <button
                            type="submit"
                            disabled={paymentProcessing}
                            className="w-full sm:w-auto bg-brand-dark hover:bg-brand-dark-hover text-white text-[10.5px] sm:text-xs font-black px-4 py-2.5 sm:px-7 sm:py-3 rounded-xl transition uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                          >
                            {paymentProcessing ? (
                              <span>PROCESANDO RESERVA...</span>
                            ) : (
                              <span>CONFIRMAR RESERVA Y PAGO →</span>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-extrabold text-slate-950 text-base sm:text-lg">Método de pago de reserva</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Pago de reserva ({formatSoles(PRICING_CONFIG.RESERVATION_FEE)}) y envío de comprobante.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStep(3);
                          }}
                          className="bg-black hover:bg-neutral-800 text-white text-xs font-black px-5 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <span>PAGAR RESERVA</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

                {/* 4. SEGUIMIENTO DEL PROCESO */}
                {isAllPreviousStepsCompleted && (
                  <div className="relative flex gap-2.5 sm:gap-4 text-left animate-fade-in">
                    {/* Circle badge */}
                    <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shrink-0 font-bold transition duration-300 text-xs sm:text-base ${
                      completedSteps[4] 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                        : activeStep === 4 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {completedSteps[4] ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" /> : '4'}
                    </div>

                    {/* Card Content */}
                    <div className={`flex-1 min-w-0 bg-white border rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-5 transition duration-300 ${
                      activeStep === 4 || completedSteps[4]
                        ? 'border-slate-300 shadow-sm' 
                        : 'border-slate-100 bg-[#f5f5f7]/40 opacity-40 select-none'
                    }`}>
                      <div>
                        <div className="border-b border-slate-100 pb-2.5 sm:pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-extrabold text-slate-950 text-sm sm:text-lg">
                              Seguimiento del proceso
                            </h3>
                            <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                              Seguimiento en tiempo real del estado en que se encuentra tu moto.
                            </p>
                          </div>

                          {/* Financed status selector tab */}
                          {paymentMode === 'financed' && (
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-extrabold text-slate-700 self-start sm:self-auto">
                              <span className="px-1 text-slate-500 hidden sm:inline">Simular Estado:</span>
                              <button
                                type="button"
                                onClick={() => setFinanceStatus('aprobada')}
                                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                  financeStatus === 'aprobada' 
                                    ? 'bg-emerald-600 text-white shadow-2xs' 
                                    : 'hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                Aprobada
                              </button>
                              <button
                                type="button"
                                onClick={() => setFinanceStatus('no_aprobada')}
                                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                  financeStatus === 'no_aprobada' 
                                    ? 'bg-rose-600 text-white shadow-2xs' 
                                    : 'hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                No Aprobada
                              </button>
                              <button
                                type="button"
                                onClick={() => setFinanceStatus('en_evaluacion')}
                                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                                  financeStatus === 'en_evaluacion' 
                                    ? 'bg-amber-600 text-white shadow-2xs' 
                                    : 'hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                En Evaluación
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Visual Circle Process Timeline */}
                        <div className="py-4 sm:py-6 space-y-5">
                          <div className="relative flex items-center justify-between max-w-xl mx-auto px-1 sm:px-2 overflow-x-auto custom-scrollbar pb-2">
                            {/* Connecting Line behind circles */}
                            <div className="absolute left-6 right-6 sm:left-8 sm:right-8 top-1/3 -translate-y-1/2 h-0.5 sm:h-1 bg-slate-200 z-0" />
                            <div className="absolute left-6 right-1/2 sm:left-8 top-1/3 -translate-y-1/2 h-0.5 sm:h-1 bg-emerald-500 z-0" />

                            {/* Step 1: En proceso */}
                            <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-emerald-500 border-2 sm:border-3 border-white text-white font-extrabold flex items-center justify-center shadow-md">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                              </div>
                              <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight text-center">
                                1. En proceso
                              </span>
                              <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
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
                                  {financeStatus === 'aprobada' ? 'Aprobada' : financeStatus === 'no_aprobada' ? 'No Aprobada' : 'En Evaluación'}
                                </span>
                              </div>
                            )}

                            {/* Step 3 (or 2 if cash): Importe Final */}
                            <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900 border-2 sm:border-3 border-white text-white font-extrabold flex items-center justify-center shadow-md">
                                <CreditCard className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                              </div>
                              <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight text-center">
                                {paymentMode === 'financed' ? '3. Importe Final' : '2. Importe Final'}
                              </span>
                              <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-extrabold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 text-center truncate max-w-[90px]">
                                {paymentMode === 'financed' ? 'Inicial - Reserva' : 'Saldo - Reserva'}
                              </span>
                            </div>

                            {/* Step 4 (or 3 if cash): Documentación */}
                            <div className="relative z-10 flex flex-col items-center group shrink-0 px-1">
                              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 border-2 sm:border-3 border-white text-slate-500 font-extrabold flex items-center justify-center shadow-xs">
                                <FileText className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                              </div>
                              <span className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-tight text-center">
                                {paymentMode === 'financed' ? '4. Documentación' : '3. Documentación'}
                              </span>
                              <span className="hidden sm:inline-block text-[8px] sm:text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                                En Trámite
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
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px]">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-slate-900 block">1. En proceso (Reserva)</span>
                                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium">Reserva pagada ({formatSoles(PRICING_CONFIG.RESERVATION_FEE)})</span>
                                </div>
                              </div>
                              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">Completado</span>
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
                                      2. Financiación {financeStatus === 'aprobada' ? 'Aprobada' : financeStatus === 'no_aprobada' ? 'No Aprobada' : 'En Evaluación'}
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
                                  {financeStatus === 'aprobada' ? 'Aprobada' : financeStatus === 'no_aprobada' ? 'No Aprobada' : 'En Evaluación'}
                                </span>
                              </div>
                            )}

                            {/* Step 3 (or 2 if cash): Importe Final */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
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
                              <span className="bg-slate-200 text-slate-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">Pendiente</span>
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
                              <span className="bg-slate-200 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">En Trámite</span>
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
                              <span className="bg-slate-200 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">Pendiente</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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

      {/* PERSONAL DATA FLOATING MODAL */}
      <CheckoutPersonalDataModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fullName={fullName}
        setFullName={setFullName}
        phone={phone}
        setPhone={setPhone}
        email={email}
        setEmail={setEmail}
        city={city}
        setCity={setCity}
        onSubmit={(e) => {
          e.preventDefault();
          setCompletedSteps(prev => ({ ...prev, 1: true }));
          setModalOpen(false);
          setActiveStep(2);
        }}
      />

      {/* FINANCIAL VALIDATION FLOATING MODAL */}
      <CheckoutFinancialModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        isFinanced={paymentMode === 'financed'}
        finModalStep={finModalStep}
        setFinModalStep={setFinModalStep}
        dniFrontal={dniFrontal}
        setDniFrontal={setDniFrontal}
        dniFrontalName={dniFrontalName}
        dniFrontalUrl={dniFrontalUrl}
        setDniFrontalUrl={(url, name) => {
          setDniFrontalUrl(url);
          if (name) setDniFrontalName(name);
        }}
        dniTrasera={dniTrasera}
        setDniTrasera={setDniTrasera}
        dniTraseraName={dniTraseraName}
        dniTraseraUrl={dniTraseraUrl}
        setDniTraseraUrl={(url, name) => {
          setDniTraseraUrl(url);
          if (name) setDniTraseraName(name);
        }}
        codigoPostal={codigoPostal}
        setCodigoPostal={setCodigoPostal}
        carnetFrontal={carnetFrontal}
        setCarnetFrontal={setCarnetFrontal}
        carnetTrasera={carnetTrasera}
        setCarnetTrasera={setCarnetTrasera}
        rentaUltimoAno={rentaUltimoAno}
        setRentaUltimoAno={setRentaUltimoAno}
        reciboServicioName={reciboServicioName}
        reciboServicioUrl={reciboServicioUrl}
        setReciboServicioUrl={(url, name) => {
          setReciboServicioUrl(url);
          if (name) setReciboServicioName(name);
        }}
        modelo100={modelo100}
        setModelo100={setModelo100}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        completedFinModalSteps={completedFinModalSteps}
        setCompletedFinModalSteps={setCompletedFinModalSteps}
        onFinish={handleFinishFinancialModal}
      />
    </div>
  );
}
