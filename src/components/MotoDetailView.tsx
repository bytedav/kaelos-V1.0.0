import React, { useState, useEffect } from 'react';
import { formatSoles } from '../utils/format';
import { getMotorcycleProductSchema, updateHeadTags } from '../utils/seo';
import { 
  ChevronRight, 
  ChevronLeft, 
  Share, 
  Heart, 
  Maximize2, 
  Check, 
  Truck, 
  Calendar, 
  CreditCard, 
  Gauge, 
  MapPin, 
  Phone, 
  Clock, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  X,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Fuel,
  Zap
} from 'lucide-react';
import { MotorbikeExtended } from './MotorbikeCard';
import { ContactFormSection } from './ContactFormSection';
import { StyleBikeCard } from './StyleBikeCard';
import { StyleBikeCarousel } from './StyleBikeCarousel';
import { CarouselArrows } from './ui/CarouselArrows';
import { FavoriteButton } from './ui/FavoriteButton';
import { FinanceSimulator } from './FinanceSimulator';
import { StyleBike } from '../types';
import { getCategoryFallbackGallery } from '../utils/images';
import { calculateCuota, clampEntranceFee, getMinEntrance, FINANCE_TERMS, DEFAULT_TERM } from '../utils/finance';
import { MotoDetailSkeleton } from './ui/Skeleton';

interface MotoDetailViewProps {
  bike: MotorbikeExtended | null;
  favorites: string[];
  reservedBikeIds?: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateToCompra: (filterInfo?: { filterType: 'brand' | 'style' | 'city' | 'cc' | 'search'; value: string }) => void;
  onSelectBike: (bike: MotorbikeExtended) => void;
  allBikes: MotorbikeExtended[];
  isRentingDetail?: boolean;
  getFilterUrl?: (updates?: any) => string;
  isLoading?: boolean;
}

// Highly detailed mock for Harley Davidson Heritage Classic matching screenshots
const BRAND_MODEL_DICTIONARY: Record<string, string[]> = {
  yamaha: ['MT-07', 'MT-09', 'MT-03', 'T-MAX 560', 'XMAX 125', 'XMAX 300', 'TRACER 7', 'TRACER 9 GT', 'TENERE 700', 'YZF-R1', 'YZF-R7', 'YZF-R125', 'NMAX 125', 'FAZER 600', 'SUPER TÉNÉRÉ'],
  honda: ['PCX 125', 'FORZA 125', 'FORZA 350', 'FORZA 750', 'SH125I', 'CB650R', 'CBR650R', 'CB500X', 'AFRICA TWIN 1100', 'X-ADV 750', 'TRANSALP 750', 'REBEL 500', 'NC750X', 'HORNET 750'],
  bmw: ['R 1250 GS', 'R 1300 GS', 'S 1000 RR', 'F 900 R', 'F 900 XR', 'F 850 GS', 'CE 04', 'C 400 GT', 'R 1250 RT', 'R NINET', 'M 1000 RR', 'S 1000 XR'],
  kawasaki: ['Z900', 'Z650', 'Z400', 'NINJA 400', 'NINJA 650', 'NINJA 1000SX', 'VERSYS 650', 'VERSYS 1000', 'VULCAN S', 'ZX-6R', 'ZX-10R', 'ELIMINATOR 500'],
  'harley davidson': ['DYNA FAT BOB', 'DYNA LOW RIDER', 'HERITAGE CLASSIC', 'NIGHTSTER 975', 'PAN AMERICA 1250', 'ROAD GLIDE SPECIAL', 'ROADSTER 1200', 'SOFTAIL FAT BOB', 'SOFTAIL LOW RIDER ST', 'SPORTSTER FORTY-EIGHT', 'IRON 883', 'STREET ROD 750'],
  'harley-davidson': ['DYNA FAT BOB', 'DYNA LOW RIDER', 'HERITAGE CLASSIC', 'NIGHTSTER 975', 'PAN AMERICA 1250', 'ROAD GLIDE SPECIAL', 'ROADSTER 1200', 'SOFTAIL FAT BOB', 'SOFTAIL LOW RIDER ST', 'SPORTSTER FORTY-EIGHT', 'IRON 883', 'STREET ROD 750'],
  harley: ['DYNA FAT BOB', 'DYNA LOW RIDER', 'HERITAGE CLASSIC', 'NIGHTSTER 975', 'PAN AMERICA 1250', 'ROAD GLIDE SPECIAL', 'ROADSTER 1200', 'SOFTAIL FAT BOB', 'SOFTAIL LOW RIDER ST', 'SPORTSTER FORTY-EIGHT', 'IRON 883', 'STREET ROD 750'],
  ducati: ['MONSTER 937', 'PANIGALE V4', 'PANIGALE V2', 'MULTISTRADA V4', 'SCRAMBLER 800', 'STREETFIGHTER V4', 'HYPERMOTARD 950', 'DIAVEL V4', 'DESERTX'],
  ktm: ['DUKE 125', 'DUKE 390', 'DUKE 790', 'DUKE 890 R', 'DUKE 1290 SUPER DUKE R', '890 ADVENTURE', '1290 SUPER ADVENTURE S', 'RC 390', '390 ADVENTURE'],
  suzuki: ['GSX-S750', 'GSX-8S', 'V-STROM 650', 'V-STROM 800DE', 'V-STROM 1050', 'HAYABUSA', 'BURGMAN 125', 'BURGMAN 400', 'SV650', 'KATANA'],
  kymco: ['AGILITY CITY 125', 'AK 550', 'DTX 125', 'X-TOWN 300', 'LIKE 125', 'SUPER DINK 300'],
  sym: ['SYMPHONY 125', 'CRUISYM 300', 'MAXSYM TL 508', 'JET 14 125', 'FIDDLE 125'],
  vespa: ['PRIMAVERA 125', 'GTS 300', 'SPRINT 125', 'ELETTRICA', 'GTV 300'],
  piaggio: ['BEVERLY 400', 'MEDLEY 125', 'MP3 300', 'MP3 530 HPE', 'LIBERTY 125'],
  aprilia: ['RS 660', 'TUONO 660', 'TUAREG 660', 'RSV4', 'SR GT 125', 'TUONO V4'],
  'royal enfield': ['METEOR 350', 'CLASSIC 350', 'HUNTER 350', 'HIMALAYAN 450', 'INTERCEPTOR 650', 'CONTINENTAL GT 650', 'SUPER METEOR 650'],
  triumph: ['STREET TRIPLE 765', 'SPEED TRIPLE 1200', 'TIGER 900', 'TIGER 1200', 'BONNEVILLE T120', 'TRIDENT 660', 'SCRAMBLER 900', 'SPEED TWIN 900']
};

const DEFAULT_HARLEY: MotorbikeExtended = {
  id: 'harley-heritage-classic',
  brand: 'Harley Davidson',
  model: 'Heritage Classic',
  year: 2024,
  kms: 7615,
  power: '94 CV',
  price: 22999,
  rentingPrice: 123, // calculated financed is 492/month
  category: 'Custom',
  image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
  images: [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'
  ],
  fuel: 'Gasolina'
};

const getDisplacement = (b: MotorbikeExtended): string => {
  if (b.displacement && b.displacement > 0) return `${b.displacement} cc`;
  const fullText = `${b.brand} ${b.model} ${b.version || ''}`.toUpperCase();
  
  if (fullText.includes('TRACER 9') || fullText.includes('MT-09')) return '890 cc';
  if (fullText.includes('MT-07') || fullText.includes('YZF-R7')) return '689 cc';
  if (fullText.includes('Z900')) return '948 cc';
  if (fullText.includes('Z650') || fullText.includes('NINJA 650')) return '649 cc';
  if (fullText.includes('SPORTSTER S') || fullText.includes('1250 S') || fullText.includes('1250')) return '1252 cc';
  if (fullText.includes('SPORTSTER 883') || fullText.includes('883')) return '883 cc';
  if (fullText.includes('HERITAGE') || fullText.includes('114')) return '1868 cc';
  if (fullText.includes('1250 GS') || fullText.includes('R 1250')) return '1254 cc';
  if (fullText.includes('PCX') || fullText.includes('NMAX') || fullText.includes('AGILITY') || fullText.includes('SH125') || fullText.includes('125')) return '125 cc';
  if (fullText.includes('X-MAX 300') || fullText.includes('FORZA 350')) return '292 cc';
  
  const matches = fullText.match(/\b(\d{3,4})\b/g);
  if (matches) {
    for (const m of matches) {
      const num = parseInt(m, 10);
      if (num >= 50 && num <= 2500 && num !== b.year) {
        return `${num} cc`;
      }
    }
  }
  
  if (b.power) {
    const p = parseInt(b.power, 10);
    if (p > 0) {
      if (p <= 15) return '125 cc';
      if (p <= 35) return '300 cc';
      if (p <= 55) return '500 cc';
      if (p <= 80) return '650 cc';
      if (p <= 110) return '900 cc';
      return '1000 cc';
    }
  }
  return '125 cc';
};

const getBikeConditionScores = (b: MotorbikeExtended) => {
  const isNew = b.kms === 0 || b.isKm0;
  if (isNew) {
    return {
      neumaticoDelantero: '100%',
      neumaticoTrasero: '100%',
      distribucion: '100%',
      kitTransmision: '100%',
      bateria: '100%',
      bujias: '100%',
      filtroAire: '100%',
      discoTrasero: '100%',
      discoDelantero: '100%',
      pastillasTraseras: '100%',
      pastillasDelanteras: '100%'
    };
  }

  const kms = b.kms || 4000;
  const hash = Math.abs((kms * 31 + b.year * 17) % 100);
  
  const neumaticoDel = Math.max(65, Math.min(98, 90 - Math.floor(kms / 2000) + (hash % 6)));
  const neumaticoTras = Math.max(60, Math.min(98, 85 - Math.floor(kms / 1800) + (hash % 5)));
  const distribucion = Math.max(70, Math.min(98, 92 - Math.floor(kms / 3000) + (hash % 4)));
  const kitTrans = Math.max(65, Math.min(98, 88 - Math.floor(kms / 2500) + (hash % 6)));
  const bateria = Math.max(70, Math.min(100, 95 - Math.floor(kms / 4000) + (hash % 5)));
  const bujias = Math.max(80, Math.min(100, 100 - Math.floor((kms % 5000) / 1000) * 5));
  const filtroAire = Math.max(80, Math.min(100, 100 - Math.floor((kms % 4000) / 1000) * 5));
  const discoTras = Math.max(75, Math.min(98, 90 - Math.floor(kms / 3500) + (hash % 5)));
  const discoDel = Math.max(75, Math.min(98, 92 - Math.floor(kms / 3500) + (hash % 4)));
  const pastillasTras = Math.max(65, Math.min(95, 85 - Math.floor((kms % 6000) / 800) * 5));
  const pastillasDel = Math.max(65, Math.min(95, 88 - Math.floor((kms % 6000) / 800) * 5));

  return {
    neumaticoDelantero: `${neumaticoDel}%`,
    neumaticoTrasero: `${neumaticoTras}%`,
    distribucion: `${distribucion}%`,
    kitTransmision: `${kitTrans}%`,
    bateria: `${bateria}%`,
    bujias: `${bujias}%`,
    filtroAire: `${filtroAire}%`,
    discoTrasero: `${discoTras}%`,
    discoDelantero: `${discoDel}%`,
    pastillasTraseras: `${pastillasTras}%`,
    pastillasDelanteras: `${pastillasDel}%`
  };
};

export default function MotoDetailView({ 
  bike, 
  favorites, 
  reservedBikeIds = [],
  onToggleFavorite, 
  onNavigateToCompra,
  onSelectBike,
  allBikes,
  isRentingDetail = false,
  getFilterUrl,
  isLoading = false
}: MotoDetailViewProps) {
  if (isLoading) {
    return <MotoDetailSkeleton />;
  }

  const currentBike = bike || DEFAULT_HARLEY;
  const isFav = favorites.includes(currentBike.id);
  const isBikeReserved = Boolean(currentBike.reserved || currentBike.isReserved || reservedBikeIds.includes(currentBike.id));

  const bikeCondition = (currentBike.condition || (currentBike.kms === 0 ? 'nueva' : 'ocasión')).toLowerCase();
  const isOcasion = (currentBike.kms || 0) > 0 && !bikeCondition.includes('nueva') && !currentBike.isKm0;
  const hasImperfections = isOcasion && Boolean(currentBike.imperfections && currentBike.imperfections.length > 0);

  // Dynamic specs and maintenance history calculations per bike
  const scores = getBikeConditionScores(currentBike);
  const displacementText = getDisplacement(currentBike);
  const formattedRevisionKms = currentBike.kms > 0 ? `${currentBike.kms.toLocaleString('es-PE')} km` : '0 km';
  const citvYear = Math.max(2027, currentBike.year + 4);
  const keyCount = currentBike.kms > 35000 ? 1 : 2;

  // States
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isCopiedLoc, setIsCopiedLoc] = useState(false);
  
  // Collapsible states
  const [isDetallesOpen, setIsDetallesOpen] = useState(true);
  const [isEspecificacionesOpen, setIsEspecificacionesOpen] = useState(false);
  const [isRevisionesOpen, setIsRevisionesOpen] = useState(false);
  const [isProcesoOpen, setIsProcesoOpen] = useState(false);

  // Form states
  const [formNombre, setFormNombre] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formComercial, setFormComercial] = useState(true);
  const [formTerminos, setFormTerminos] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [countryCode, setCountryCode] = useState('+51');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Success reservation state
  const [isReserved, setIsReserved] = useState(false);
  const [isContactRequested, setIsContactRequested] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<'contact' | 'renting'>('contact');

  // Dynamic Finance Simulator States
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [entranceFee, setEntranceFee] = useState<number>(getMinEntrance((bike || DEFAULT_HARLEY).price));
  const [termMonths, setTermMonths] = useState<number>(DEFAULT_TERM);

  // Renting specific states
  const [rentingMonths, setRentingMonths] = useState<number>(24);
  const [rentingMileage, setRentingMileage] = useState<string>('500 km/mes');
  const [rentingInsuranceOption, setRentingInsuranceOption] = useState<boolean>(false);

  // Related bikes (exclude current bike, get Custom/Touring category first, match same brand or style)
  const [relatedBikes, setRelatedBikes] = useState<MotorbikeExtended[]>([]);

  useEffect(() => {
    // Scroll to top when bike changes
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveImgIdx(0);
    setIsFormSubmitted(false);
    setIsReserved(false);
    setIsContactRequested(false);
    
    // Reset simulator states on bike change
    setIsSimulatorOpen(false);
    setEntranceFee(getMinEntrance(currentBike.price));
    setTermMonths(DEFAULT_TERM);

    // Inject Product Schema JSON-LD for rich snippets (Search + AI Answer Engines)
    const bikeSlug = currentBike.slug || currentBike.id || 'moto';
    const bikeUrl = `/moto/${bikeSlug}`;
    const productSchema = getMotorcycleProductSchema({
      id: currentBike.id,
      brand: currentBike.brand,
      model: currentBike.model,
      version: currentBike.version || '',
      year: currentBike.year,
      kms: currentBike.kms,
      price: currentBike.price,
      currency: 'PEN',
      condition: currentBike.condition || (currentBike.kms === 0 ? 'nueva' : 'ocasión'),
      category: currentBike.category,
      power: currentBike.power,
      displacement: currentBike.displacement || 500,
      fuel: currentBike.fuel || 'Gasolina',
      featuredImage: currentBike.image,
      gallery: currentBike.images || [currentBike.image],
      description: `${currentBike.brand} ${currentBike.model} de reestreno. Año ${currentBike.year} con ${currentBike.kms.toLocaleString()} km. Totalmente revisada en 100 puntos y con 12 meses de garantía.`,
      url: bikeUrl,
    });

    updateHeadTags(
      {
        title: `${currentBike.brand} ${currentBike.model} ${currentBike.year} | KAELOS`,
        description: `Comprar ${currentBike.brand} ${currentBike.model} (${currentBike.year}) con ${currentBike.kms.toLocaleString()} km por S/. ${currentBike.price.toLocaleString()}. Garantía total de 12 meses y envío a domicilio por KAELOS.`,
        canonical: bikeUrl,
        ogImage: currentBike.image,
        ogImageAlt: `${currentBike.brand} ${currentBike.model}`,
        type: 'product',
        twitterCard: 'summary_large_image',
        robots: 'index, follow, max-image-preview:large',
        keywords: [currentBike.brand.toLowerCase(), currentBike.model.toLowerCase(), 'moto ocasion', 'comprar moto', 'kaelos'],
      },
      [
        { name: 'Inicio', url: '/' },
        { name: 'Comprar Moto', url: '/motos' },
        { name: `${currentBike.brand} ${currentBike.model}`, url: bikeUrl }
      ],
      [productSchema]
    );
  }, [currentBike.id]);

  useEffect(() => {
    // Filter related bikes
    const filtered = allBikes
      .filter(b => b.id !== currentBike.id)
      .slice(0, 5);
    
    // Fallbacks if list empty
    if (filtered.length === 0) {
      setRelatedBikes([
        {
          id: 'related-harley-sportster',
          brand: 'Harley Davidson',
          model: 'Sportster 883 XL',
          year: 2007,
          kms: 43587,
          power: '53 CV',
          price: 5799,
          rentingPrice: 32, // financed 127/month
          category: 'Custom',
          image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=500',
          fuel: 'Gasolina'
        },
        {
          id: 'related-harley-street',
          brand: 'Harley Davidson',
          model: 'Street 750 ABS',
          year: 2019,
          kms: 7599,
          power: '58 CV',
          price: 5999,
          rentingPrice: 35, // financed 131/month
          category: 'Custom',
          image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=500',
          fuel: 'Gasolina'
        },
        {
          id: 'related-harley-sportster-1250',
          brand: 'Harley Davidson',
          model: 'Sportster 1250 S',
          year: 2021,
          kms: 6391,
          power: '122 CV',
          price: 12999,
          rentingPrice: 60, // financed 239/month
          category: 'Custom',
          image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=500',
          fuel: 'Gasolina'
        }
      ]);
    } else {
      setRelatedBikes(filtered);
    }
  }, [allBikes, currentBike]);

  // Gallery handler
  const imagesList = currentBike.images && currentBike.images.length > 0 
    ? currentBike.images 
    : getCategoryFallbackGallery(currentBike.category, currentBike.image);

  const [detailTouchStart, setDetailTouchStart] = useState<{ x: number; y: number } | null>(null);

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImgIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImgIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const handleDetailTouchStart = (e: React.TouchEvent) => {
    if (imagesList.length <= 1) return;
    setDetailTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleDetailTouchEnd = (e: React.TouchEvent) => {
    if (!detailTouchStart || imagesList.length <= 1) return;
    const diffX = detailTouchStart.x - e.changedTouches[0].clientX;
    const diffY = detailTouchStart.y - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setDetailTouchStart(null);
  };

  const openImagesGallery = (tab: 'galeria' | 'imperfecciones' = 'galeria', index: number = 0) => {
    const slides = tab === 'imperfecciones' ? 'DAMAGES' : 'GALLERY';
    const imgParam = index + 1;
    const flow = 'SALE';
    window.history.pushState(null, '', `/moto/${currentBike.id}/images?slides=${slides}&img=${imgParam}&flow=${flow}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Copy details helper
  const copyText = (text: string, type: 'phone' | 'loc') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setIsCopiedPhone(true);
      setTimeout(() => setIsCopiedPhone(false), 2000);
    } else {
      setIsCopiedLoc(true);
      setTimeout(() => setIsCopiedLoc(false), 2000);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formTelefono || !formEmail) {
      alert('Por favor complete los campos Nombre, Teléfono y Email.');
      return;
    }
    setIsFormSubmitted(true);
  };

  const handleShare = () => {
    const bikeSlug = currentBike.slug || currentBike.id;
    const shareUrl = `${window.location.origin}/moto/${bikeSlug}`;
    const shareTitle = `${currentBike.brand} ${currentBike.model} (${currentBike.year}) | KAELOS`;
    const shareText = `Mira esta ${currentBike.brand} ${currentBike.model} en Kaelos con 12 meses de garantía:`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareUrl);
          alert('¡Enlace copiado al portapapeles!');
        }
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  // Calculated values
  const cashPrice = currentBike.price;
  const isOffer = Boolean(currentBike.hasOffer || (currentBike.oldPrice && currentBike.oldPrice > cashPrice));
  const oldPrice = isOffer ? (currentBike.oldPrice || Math.round(cashPrice * 1.10)) : undefined;
  const discount = oldPrice ? oldPrice - cashPrice : 0;

  const brandKey = (currentBike.brand || '').trim().toLowerCase();

  // Dynamically extract matching models from full catalog
  const catalogModels = (allBikes || [])
    .filter((b) => b.brand && b.brand.trim().toLowerCase() === brandKey)
    .map((b) => {
      let modelName = (b.model || b.id || '').trim();
      const brandName = currentBike.brand.trim();
      if (modelName.toLowerCase().startsWith(brandName.toLowerCase())) {
        modelName = modelName.slice(brandName.length).trim();
      }
      if (b.version) {
        const ver = b.version.trim();
        if (!modelName.toLowerCase().includes(ver.toLowerCase())) {
          modelName = `${modelName} ${ver}`;
        }
      }
      return modelName.toUpperCase();
    })
    .filter(Boolean);

  const fallbackModels = BRAND_MODEL_DICTIONARY[brandKey] || [
    `${currentBike.brand.toUpperCase()} 125`,
    `${currentBike.brand.toUpperCase()} 300`,
    `${currentBike.brand.toUpperCase()} 500`,
    `${currentBike.brand.toUpperCase()} 750`,
    `${currentBike.brand.toUpperCase()} SCOOTER`,
    `${currentBike.brand.toUpperCase()} SPORT`,
    `${currentBike.brand.toUpperCase()} TRAIL`
  ];

  const brandTags = Array.from(new Set([...catalogModels, ...fallbackModels])).slice(0, 20);
  
  const renderPriceCard = (isSidebar: boolean) => {
    const minEntrance = 0;
    const currentFinancedPrice = calculateCuota(cashPrice, entranceFee, termMonths);
    const displayEntrance = entranceFee;



    if (isSidebar) {
      return (
        <div 
          id="desktop-price-card" 
          className="bg-white border border-slate-200 rounded-[24px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 hidden lg:block"
        >
          {/* Top block */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Cash & Financed inline row */}
            <div className="flex flex-1 items-start gap-4 sm:gap-5">
              {/* Al contado */}
              <div className="shrink-0">
                <span className="text-[12px] sm:text-[13px] text-slate-500 font-medium block leading-none mb-1">
                  Al contado
                </span>
                <span className={`text-xl sm:text-[24px] font-bold tracking-tight block leading-none pt-1 ${isOffer ? 'text-[#ff0d41]' : 'text-slate-950'}`}>
                  {formatSoles(cashPrice)}
                </span>
                {isOffer && oldPrice && (
                  <span className="text-[11px] text-slate-400 line-through block mt-1.5">
                    {formatSoles(oldPrice)}
                  </span>
                )}
              </div>

              {/* Vertical Line Divider */}
              <div className="w-[1px] bg-slate-200/90 shrink-0 self-stretch my-0.5 min-h-[52px]"></div>

              {/* Financed */}
              <div className="flex-1">
                <span className="text-[12px] sm:text-[13px] text-slate-500 font-medium block leading-none mb-1">
                  Financiado *
                </span>
                <span className="text-xl sm:text-[24px] font-bold text-slate-950 tracking-tight block leading-none pt-1">
                  {formatSoles(currentFinancedPrice)}/mes
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block leading-tight pt-1.5">
                  A {termMonths} meses con entrada de {formatSoles(displayEntrance)}
                </span>
                <span className="text-[9px] text-slate-400 font-medium block leading-none pt-0.5">
                  * Importe aproximado no vinculante.
                </span>
              </div>
            </div>

            {/* Calculates button */}
            <div className="shrink-0 w-full sm:w-auto mt-0.5 sm:mt-0 flex sm:block items-center justify-end">
              <button 
                onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-2 flex items-center justify-center gap-1.5 text-slate-950 hover:text-black transition font-bold text-xs shadow-xs cursor-pointer active:scale-95"
              >
                <Calculator className="w-4 h-4 text-slate-800" strokeWidth={2} />
                <span>Calcula tu cuota</span>
              </button>
            </div>

          </div>

          {/* Expanded Dynamic Simulator Panel */}
          {isSimulatorOpen && (
            <div className="pt-2">
              <FinanceSimulator
                price={cashPrice}
                entranceFee={entranceFee}
                setEntranceFee={setEntranceFee}
                termMonths={termMonths}
                setTermMonths={setTermMonths}
                showToggleHeader={false}
              />
            </div>
          )}

          {/* Bottom row: Reservar & Contactar */}
          <div className="flex gap-3 pt-0.5">
            {(isBikeReserved || isReserved) ? (
              <button 
                disabled
                className="flex-[2.2] py-3.5 rounded-[14px] font-extrabold text-sm tracking-widest uppercase flex items-center justify-center bg-[#737373] text-white cursor-not-allowed opacity-95 shadow-xs"
              >
                <span>RESERVADA</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  const targetBike = bike || currentBike;
                  if (targetBike) {
                    window.history.pushState(null, '', `/moto/${targetBike.id}/finance?entrance=${entranceFee}&term=${termMonths}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }
                }}
                className="flex-[2.2] py-3.5 rounded-[14px] font-bold text-sm tracking-normal transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 bg-brand-dark hover:bg-brand-dark-hover text-white"
              >
                <span>Reservar</span>
              </button>
            )}

            <button 
              onClick={() => {
                setContactModalType('contact');
                setIsContactModalOpen(true);
              }}
              className={`flex-1 py-3.5 rounded-[14px] font-bold text-sm tracking-normal border transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5
                ${isContactRequested
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300 bg-white text-slate-800 hover:text-black hover:border-black'
                }
              `}
            >
              <span>{isContactRequested ? '✓ Enviado' : 'Contactar'}</span>
            </button>
          </div>
        </div>
      );
    }

    // High-fidelity sticky fixed bottom bar for mobile/tablets matching images
    return (
      <div 
        id="mobile-price-card" 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] block lg:hidden"
      >
        <div className="flex items-start justify-between gap-3 w-full">
          {/* Inline info block */}
          <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
            {/* Al contado column */}
            <div className="shrink-0">
              <span className="text-[11px] sm:text-[12px] text-slate-500 font-bold block leading-none mb-0.5">
                Al contado
              </span>
              <span className={`text-[20px] sm:text-[23px] font-black block leading-none pt-0.5 select-all ${isOffer ? 'text-[#ff0d41]' : 'text-slate-900'}`}>
                {formatSoles(cashPrice)}
              </span>
              {isOffer && oldPrice && (
                <span className="text-[11px] sm:text-[12px] text-slate-400 line-through block leading-none mt-1">
                  {formatSoles(oldPrice)}
                </span>
              )}
            </div>

            {/* Vertical Line Divider */}
            <div className="w-[1.5px] bg-slate-200 self-stretch min-h-[50px] shrink-0 my-0.5"></div>

            {/* Financed column */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-[12px] text-slate-500 font-bold block leading-none mb-0.5">
                Financiado *
              </span>
              <span className="text-[20px] sm:text-[23px] font-black text-slate-900 block leading-none pt-0.5 select-all">
                {formatSoles(currentFinancedPrice)}/mes
              </span>
              <span className="text-[10px] sm:text-[12px] text-slate-500 block leading-tight mt-1 truncate">
                A {termMonths} meses con entrada de {formatSoles(displayEntrance)}
              </span>
              <span className="text-[9px] text-slate-400 block leading-none mt-0.5 whitespace-nowrap">
                * Importe aproximado no vinculante.
              </span>
            </div>
          </div>

          {/* Calculator button */}
          <div className="shrink-0 self-start mt-0.5">
            <button 
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1.2 text-slate-900 transition font-black text-[12px] shadow-xs cursor-pointer active:scale-95"
            >
              {isSimulatorOpen ? (
                <>
                  <X className="w-3.5 h-3.5 text-slate-800" strokeWidth={3} />
                  <span>Cerrar</span>
                </>
              ) : (
                <>
                  <Calculator className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
                  <span>Calcular</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile expanded simulator inputs */}
        {isSimulatorOpen && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mt-4 mb-2 space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-[14px] font-black text-slate-900 tracking-tight">Simulador de financiación</span>
              <span className="text-[10px] sm:text-xs bg-[#ff0d41]/10 text-[#ff0d41] font-black px-2 py-0.5 rounded-md">
                50% TIN / Interés fijo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Entrada input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] sm:text-[13px] font-black text-slate-800">
                    Entrada inicial (Mín. 20%)
                  </label>
                  <span className="text-[11px] text-slate-500 font-bold">
                    Mínimo: {formatSoles(getMinEntrance(cashPrice))}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="number"
                    value={entranceFee === 0 ? '' : entranceFee}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setEntranceFee(isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => {
                      setEntranceFee(clampEntranceFee(cashPrice, entranceFee));
                    }}
                    min={getMinEntrance(cashPrice)}
                    placeholder={`${getMinEntrance(cashPrice)}`}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-black focus:outline-hidden focus:border-slate-500 text-slate-900 pr-8"
                  />
                  <span className="absolute right-3.5 font-bold text-sm pointer-events-none text-slate-400">S/.</span>
                </div>
              </div>

              {/* Term/Months selections */}
              <div className="space-y-1.5">
                <label className="text-[12px] sm:text-[13px] font-black text-slate-800 block">
                  Plazo de pago (meses)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {FINANCE_TERMS.map((term) => {
                    const isSelected = termMonths === term;
                    return (
                      <button
                        key={term}
                        onClick={() => setTermMonths(term)}
                        className={`h-11 w-11 flex items-center justify-center rounded-xl text-xs transition-all cursor-pointer active:scale-95
                          ${isSelected 
                            ? 'bg-slate-950 border border-slate-950 text-white font-black shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-800 font-black'
                          }
                        `}
                      >
                        {term} m
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons row */}
        <div className="flex gap-2.5 mt-3.5">
          {(isBikeReserved || isReserved) ? (
            <button 
              disabled
              className="flex-[2.2] py-3.5 rounded-xl font-extrabold text-sm tracking-widest uppercase flex items-center justify-center bg-[#737373] text-white cursor-not-allowed opacity-95 shadow-xs"
            >
              <span>RESERVADA</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                if (bike) {
                  window.history.pushState(null, '', `/moto/${bike.id}/finance?entrance=${entranceFee}&term=${termMonths}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }
              }}
              className="flex-[2.2] py-3.5 rounded-xl font-bold text-sm tracking-normal transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 bg-brand-dark hover:bg-brand-dark-hover text-white"
            >
              <span>Reservar</span>
            </button>
          )}

          <button 
            onClick={() => {
              setContactModalType('contact');
              setIsContactModalOpen(true);
            }}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-normal border transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5
              ${isContactRequested
                ? 'border-emerald-500 text-emerald-500 bg-emerald-50/30'
                : 'border-slate-300 bg-white text-slate-800 hover:text-black hover:border-black'
              }
            `}
          >
            <span>{isContactRequested ? '✓ Enviado' : 'Contactar'}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderQueIncluyeRentingCard = (isSidebar: boolean) => {
    return (
      <div className={`bg-[#f8f9fa] border border-slate-200/80 rounded-[20px] p-5 shadow-xs ${isSidebar ? 'hidden lg:block' : 'block lg:hidden'}`}>
        <div className="flex items-center gap-2.5 mb-4 text-left">
          <div className="w-6.5 h-6.5 rounded-full bg-[#ff0d41] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-[12px]">
            M
          </div>
          <h3 className="text-[14px] sm:text-[15px] font-black text-slate-900 tracking-tight">
            Qué incluye el renting
          </h3>
        </div>

        <div className="space-y-3.5 text-left">
          <div className="flex gap-3 items-center">
            <ShieldCheck className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Seguro con asistencia 24h</span>
          </div>

          <div className="flex gap-3 items-center">
            <Check className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={2} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Mantenimiento incluido</span>
          </div>

          <div className="flex gap-3 items-center">
            <Truck className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Entrega a domicilio bajo condiciones</span>
          </div>

          <div className="flex gap-3 items-center">
            <CreditCard className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Impuestos incluidos</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCertificadoCard = (isSidebar: boolean) => {
    return (
      <div className={`bg-white border border-slate-100 rounded-[20px] p-5 sm:p-5.5 shadow-sm ${isSidebar ? 'hidden lg:block' : 'block lg:hidden'}`}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6.5 h-6.5 rounded-full bg-[#ff0d41] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-[12px]">
            K
          </div>
          <h3 className="text-[14px] sm:text-[15px] font-black text-slate-900 tracking-tight">
            Certificado de calidad Kaelos
          </h3>
        </div>

        <div className="space-y-3.5">
          <div className="flex gap-3 items-center">
            <ShieldCheck className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Un año de garantía incluido</span>
          </div>

          <div className="flex gap-3 items-center">
            <Check className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={2} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Motos reacondicionadas, revisadas y con Revisión Técnica (CITV) en vigor</span>
          </div>

          <div className="flex gap-3 items-center">
            <Truck className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Envío a domicilio a todo el Perú</span>
          </div>

          <div className="flex gap-3 items-center">
            <HeartHandshake className="w-5 h-5 text-slate-600 shrink-0" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">Entrega tu moto como parte de pago</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fbfbfc] min-h-screen pb-44 lg:pb-16 font-sans relative">
      
      {/* 1. Breadcrumbs */}
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          <a 
            href="/motos" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateToCompra();
            }} 
            className="hover:text-slate-600 transition"
          >
            {isRentingDetail ? 'Renting' : 'Compra'}
          </a>
          <span className="text-slate-300 font-light font-sans">›</span>
          <a
            href={getFilterUrl ? getFilterUrl({ brand: currentBike.brand }) : `/motos?marca=${encodeURIComponent(currentBike.brand.toLowerCase())}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToCompra({ filterType: 'brand', value: currentBike.brand });
            }}
            className="text-slate-500 hover:text-slate-800 transition font-bold cursor-pointer"
          >
            {currentBike.brand}
          </a>
          <span className="text-slate-300 font-light font-sans">›</span>
          <span className="text-slate-800 font-black">{currentBike.model}</span>
        </nav>
      </div>

      {/* 2. Main Title Section - Shown only on Mobile/Tablet */}
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 py-3 flex lg:hidden justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3.5xl lg:text-4xl font-black text-slate-900 tracking-tight font-display leading-tight">
            {currentBike.brand} {currentBike.model}
          </h1>
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#ff0d41] transition bg-transparent cursor-pointer active:scale-95 shrink-0"
        >
          <Share className="w-4 h-4 text-slate-400" />
          <span>Compartir</span>
        </button>
      </div>

      {/* 3. Main Grid layout: Two Columns (Left Media/Details, Right Price/Calculators Sticky) */}
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Media Viewer, Quick Details, Quality Certificates, Collapsibles, Forms, Location */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          
          {/* A. Premium Image Gallery Component */}
          <div 
            onTouchStart={handleDetailTouchStart}
            onTouchEnd={handleDetailTouchEnd}
            className="relative bg-white border border-slate-100 rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10.5] shadow-xs group/gallery touch-pan-y"
          >
            
            {/* Main Active Photo */}
            <img 
              src={imagesList[activeImgIdx]} 
              alt={`${currentBike.brand} ${currentBike.model}`}
              className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
              onClick={() => openImagesGallery('galeria')}
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* 2. Action buttons overlay top-right */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <FavoriteButton
                bikeId={currentBike.id}
                isFavorite={isFav}
                onToggle={onToggleFavorite}
                size="md"
                className="w-10 h-10 rounded-full bg-white/95 shadow-md hover:bg-white"
              />
              <button 
                onClick={() => openImagesGallery('galeria')}
                className="w-10 h-10 rounded-full bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-white flex items-center justify-center shadow-md cursor-pointer transition active:scale-90"
                aria-label="Expandir"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* 3. Bottom left: Galerías indicators */}
            <div className="absolute bottom-5 left-5">
              <button 
                onClick={() => openImagesGallery('galeria')}
                className="bg-white/95 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Galería</span>
              </button>
            </div>

            {/* 4. Bottom right: Arrow counters */}
            <div className="absolute bottom-5 right-5">
              <div className="bg-white/95 text-slate-900 font-extrabold text-xs sm:text-sm py-1.5 px-3 rounded-xl shadow-md flex items-center gap-3 select-none">
                <CarouselArrows
                  onPrev={prevImage}
                  onNext={nextImage}
                  size="sm"
                  buttonClassName="!w-6 !h-6 border-0 !bg-transparent shadow-none hover:text-[#ff0d41]"
                />
                <span>{activeImgIdx + 1} / {imagesList.length}</span>
              </div>
            </div>

          </div>

          {/* B. Imperfects and Quick Location Cards */}
          <div className={`grid ${hasImperfections ? 'grid-cols-2' : 'grid-cols-1'} gap-3 sm:gap-4`}>
            
            {/* Imperfections card - Only for Ocasión with imperfections */}
            {hasImperfections && (
              <div 
                onClick={() => openImagesGallery('imperfecciones')}
                className="relative overflow-hidden h-[115px] sm:h-[135px] rounded-[20px] border border-slate-200/60 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer select-none group"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                  style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600')" 
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/5"></div>
                
                {/* Badge overlay bottom left */}
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4">
                  <div className="bg-white/95 backdrop-blur-xs border border-white/25 rounded-[12px] px-2.5 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-1.5 shadow-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.2} />
                    <span className="text-[10px] sm:text-[13px] font-black text-slate-800 tracking-tight">Imperfecciones</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Map card (Calle Límite 16, Torrejón de Ardoz) */}
            <div 
              onClick={() => {
                const element = document.getElementById('location-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative overflow-hidden h-[115px] sm:h-[135px] rounded-[20px] border border-slate-200/50 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer select-none flex flex-col bg-white"
            >
              {/* Top header part */}
              <div className="bg-white py-2 px-3 sm:py-3 sm:px-4 shrink-0 flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-slate-900 font-extrabold text-[12px] sm:text-[14px] tracking-tight">Calle Límite 16,</span>
                  <span className="text-slate-700 font-bold text-[11px] sm:text-[13px] tracking-tight">Torrejón de Ardoz</span>
                </div>
              </div>

              {/* Bottom map part - Render beautiful inline custom vector map */}
              <div className="flex-1 relative overflow-hidden bg-[#eae9e4] min-h-0 border-t border-slate-100">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Green park/area */}
                  <path d="M 0 0 L 150 0 L 120 40 L 0 50 Z" fill="#d5edd5" />
                  <path d="M 320 60 L 400 50 L 400 100 L 300 100 Z" fill="#d5edd5" />
                  
                  {/* Underlay for road borders (slate/gray color) */}
                  <path d="M -10 75 L 410 75" stroke="#ccd2d7" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 120 -10 L 220 110" stroke="#ccd2d7" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 300 -10 L 300 110" stroke="#ccd2d7" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 50 25 C 150 5, 250 45, 350 15" stroke="#ccd2d7" strokeWidth="10" strokeLinecap="round" />

                  {/* Inner white road fills */}
                  <path d="M -10 75 L 410 75" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 120 -10 L 220 110" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 300 -10 L 300 110" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 50 25 C 150 5, 250 45, 350 15" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

                  {/* Red Pin Marker in the center (around x=200, y=10) */}
                  <g transform="translate(200, 30)">
                    {/* Shadow */}
                    <ellipse cx="0" cy="8" rx="2.5" ry="0.8" fill="#000000" fillOpacity="0.15" />
                    {/* Pin shape */}
                    <path d="M 0 0 C -3 -3, -5 -5.5, -5 -8.5 C -5 -11.5, -2.75 -13.5, 0 -13.5 C 2.75 -13.5, 5 -11.5, 5 -8.5 C 5 -5.5, 3 -3, 0 0 Z" fill="#ea4335" />
                  </g>
                </svg>
              </div>
            </div>

          </div>

          {/* C. Certificado de calidad Kaelos Panel / Renting panel */}
          {isRentingDetail ? renderQueIncluyeRentingCard(false) : renderCertificadoCard(false)}

          {/* D & E. Collapsible sections with divider lines */}
          <div className="divide-y divide-slate-200/60 my-4 border-t border-b border-slate-200/60">
            
            {/* Detalles de la moto (Collapsible Grid) */}
            <div className="pb-3 md:pb-5 pt-2.5 md:pt-3">
              
              {/* Header trigger */}
              <button 
                onClick={() => setIsDetallesOpen(!isDetallesOpen)}
                className="w-full flex items-center justify-between py-1 text-left cursor-pointer group focus:outline-none"
                id="btn-detalles-header"
              >
              <h3 className="text-[15px] sm:text-[18px] md:text-[20px] font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                Detalles de la moto
              </h3>
              <div 
                className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-slate-200/80 group-hover:bg-slate-100 flex items-center justify-center transition text-slate-800 shadow-xs shrink-0"
              >
                {isDetallesOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
              </div>
            </button>

            {/* Inner Grid content - High Fidelity 2x2 Mobile / 4-col Desktop Cards matching design */}
            {isDetallesOpen && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-3 animate-fade-in">
                
                {/* 1. Primera matriculacion */}
                <div className="bg-[#f8fafd] border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2 min-h-[96px] sm:min-h-[110px] hover:border-slate-300 transition-colors">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 stroke-[1.8] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10.5px] sm:text-xs text-slate-400 font-medium leading-snug">Primera matriculación</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight mt-0.5">{currentBike.year}</span>
                  </div>
                </div>

                {/* 2. Carburante */}
                <div className="bg-[#f8fafd] border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2 min-h-[96px] sm:min-h-[110px] hover:border-slate-300 transition-colors">
                  <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 stroke-[1.8] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10.5px] sm:text-xs text-slate-400 font-medium leading-snug">Carburante</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight mt-0.5">{currentBike.fuel || 'Gasolina'}</span>
                  </div>
                </div>

                {/* 3. Cilindrada */}
                <div className="bg-[#f8fafd] border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2 min-h-[96px] sm:min-h-[110px] hover:border-slate-300 transition-colors">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 stroke-[1.8] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10.5px] sm:text-xs text-slate-400 font-medium leading-snug">Cilindrada</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight mt-0.5">
                      {currentBike.displacement ? `${currentBike.displacement} cc` : '500 cc'}
                    </span>
                  </div>
                </div>

                {/* 4. Kilometraje */}
                <div className="bg-[#f8fafd] border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-2 min-h-[96px] sm:min-h-[110px] hover:border-slate-300 transition-colors">
                  <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 stroke-[1.8] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10.5px] sm:text-xs text-slate-400 font-medium leading-snug">Kilometraje</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-950 leading-tight mt-0.5">
                      {currentBike.kms.toLocaleString('es-ES')} km
                    </span>
                  </div>
                </div>

              </div>
            )}

            </div>

            {/* Especificaciones técnicas de la moto */}
            <div className="py-3 md:py-5">
              
              {/* Header trigger */}
              <button 
                onClick={() => setIsEspecificacionesOpen(!isEspecificacionesOpen)}
                className="w-full flex items-center justify-between py-1 text-left cursor-pointer group focus:outline-none"
                id="btn-especificaciones-header"
              >
                <h3 className="text-[15px] sm:text-[18px] md:text-[20px] font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                  Especificaciones técnicas de la moto
                </h3>
                <div 
                  className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-slate-200/80 group-hover:bg-slate-100 flex items-center justify-center transition text-slate-800 shadow-xs shrink-0"
                >
                  {isEspecificacionesOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                </div>
              </button>

              {/* Inner Grid content */}
              {isEspecificacionesOpen && (
                <div className="space-y-4 md:space-y-6 pt-1 animate-fade-in">
                  
                  {/* Exterior */}
                  <div className="space-y-2">
                    <h4 className="text-[14px] sm:text-[17px] font-bold text-slate-900 tracking-tight">Exterior</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 md:gap-y-3 gap-x-3 md:gap-x-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Estilo de la moto</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{currentBike.category || 'Naked'}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Neumático delantero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.neumaticoDelantero}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Neumático trasero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.neumaticoTrasero}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Número de plazas</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Motor y Consumo */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-[14px] sm:text-[17px] font-bold text-slate-900 tracking-tight">Motor y Consumo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 md:gap-y-3 gap-x-3 md:gap-x-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Cilindrada</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{displacementText}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Distribución</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.distribucion}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Kit de transmisión</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.kitTransmision}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Batería eléctrica</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.bateria}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Bujías</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.bujias}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Filtro de aire</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.filtroAire}</span>
                      </div>
                    </div>
                  </div>

                  {/* Frenos */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-[14px] sm:text-[17px] font-bold text-slate-900 tracking-tight">Frenos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 md:gap-y-3 gap-x-3 md:gap-x-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Disco de freno trasero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.discoTrasero}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Disco de freno delantero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.discoDelantero}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Pastillas de freno trasero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.pastillasTraseras}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-slate-400 font-semibold leading-tight">Pastillas de freno delantero</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug mt-0.5">{scores.pastillasDelanteras}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Historial de revisiones de la moto (Solo para motos de ocasión / reestreno con kilometraje) */}
            {isOcasion && (
              <div className="py-3 md:py-5">
                
                {/* Header trigger */}
                <button 
                  onClick={() => setIsRevisionesOpen(!isRevisionesOpen)}
                  className="w-full flex items-center justify-between py-1 text-left cursor-pointer group focus:outline-none"
                  id="btn-revisiones-header"
                >
                  <h3 className="text-[15px] sm:text-[18px] md:text-[20px] font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                    Historial de revisiones de la moto
                  </h3>
                  <div 
                    className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-slate-200/80 group-hover:bg-slate-100 flex items-center justify-center transition text-slate-800 shadow-xs shrink-0"
                  >
                    {isRevisionesOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                </button>

                {/* Inner content */}
                {isRevisionesOpen && (
                  <div className="space-y-4 md:space-y-6 pt-1 animate-fade-in">
                    
                    {/* Grid fields */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Col 1 */}
                      <div className="flex flex-col min-w-0 space-y-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold leading-tight">País de origen</span>
                          <span className="text-xs sm:text-[15px] font-bold text-brand-dark leading-snug mt-0.5">Perú</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold leading-tight">Revisión Técnica (CITV)</span>
                          <span className="text-xs sm:text-[15px] font-bold text-brand-dark leading-snug mt-0.5">Válida hasta {citvYear}</span>
                        </div>
                      </div>

                      {/* Col 2 */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold leading-tight">Número de llaves</span>
                        <span className="text-xs sm:text-[15px] font-bold text-brand-dark leading-snug mt-0.5">{keyCount}</span>
                      </div>

                      {/* Col 3 */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold leading-tight">Última revisión</span>
                        <span className="text-xs sm:text-[15px] font-bold text-brand-dark leading-snug mt-0.5">17 de julio de 2026</span>
                      </div>

                      {/* Col 4 */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold leading-tight">Tipo de IVA</span>
                        <span className="text-xs sm:text-[15px] font-bold text-brand-dark leading-snug mt-0.5">IVA no deducible</span>
                      </div>
                    </div>

                    {/* Revision details container box */}
                    <div className="bg-[#f8f9fa] border border-[#e5e5ea]/80 rounded-2xl sm:rounded-[24px] p-4 sm:p-7 space-y-3.5 shadow-2xs">
                      <div className="space-y-1 pb-3 border-b border-[#e5e5ea]/60">
                        <span className="text-[10px] sm:text-[12px] text-[#8e8e93] font-semibold uppercase tracking-wider block">Jul 2026</span>
                        <span className="text-sm sm:text-[17px] font-black text-slate-900">Kaelos - {formattedRevisionKms}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2.5 sm:gap-y-3.5 gap-x-6">
                        {/* Column 1 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Inspección general</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Revisión del cable de embrague</span>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Cambio de aceite</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Cambio de bujías</span>
                          </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Cambio del filtro de aceite</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#8e8e93] font-semibold text-xs sm:text-[14px]">
                            <span className="text-[#a1a1aa] text-base leading-none shrink-0">•</span>
                            <span>Cambio de filtro de aire</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* El proceso de compra de Kaelos */}
            <div className="pt-3 md:pt-5 pb-2 md:pb-3">
              
              {/* Header trigger */}
              <button 
                onClick={() => setIsProcesoOpen(!isProcesoOpen)}
                className="w-full flex items-center justify-between py-1 text-left cursor-pointer group focus:outline-none"
                id="btn-proceso-header"
              >
                <h3 className="text-[15px] sm:text-[18px] md:text-[20px] font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                  El proceso de compra de Kaelos
                </h3>
                <div 
                  className="w-8 h-8 rounded-full bg-[#f8f9fa] border border-slate-200/80 group-hover:bg-slate-100 flex items-center justify-center transition text-slate-800 shadow-xs shrink-0"
                >
                  {isProcesoOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                </div>
              </button>

              {/* Inner content */}
              {isProcesoOpen && (
                <div className="space-y-3.5 sm:space-y-5 pt-1 text-[#3a3a3c] text-xs sm:text-[15px] leading-relaxed animate-fade-in">
                  <p className="font-bold text-slate-900 text-sm sm:text-[17px]">
                    Te acompañamos paso a paso en la compra de tu nueva moto:
                  </p>
                  
                  <div className="space-y-3 font-semibold">
                    <p>
                      <strong className="text-slate-900 font-bold">1. Configura tu moto:</strong> Con los packs puedes mejorar las condiciones de tu compra. Elige entre Básico, Económico o Premium y disfruta de un TIN de financiación mejorado, garantía extendida, recompra asegurada o moto de sustitución.
                    </p>

                    <p>
                      <strong className="text-slate-900 font-bold">2. Reserva tu moto:</strong> Una vez has reservado tu moto, te la guardamos durante los próximos 4 días. Si finalmente decides cancelar la reserva durante este periodo, te devolvemos el importe íntegro de la reserva, sin complicaciones.
                    </p>

                    <div className="space-y-1">
                      <p>
                        <strong className="text-slate-900 font-bold">3. Financiación a medida:</strong> Solo necesitamos algunos documentos para gestionar tu compra financiada. En caso de no aprobarse la operación, recibirás el reembolso de tu reserva.
                      </p>
                      <p className="text-[#8e8e93] text-[11px] sm:text-[13px] font-medium">
                        *La reserva no se considerará como entrada en la financiación.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong className="text-slate-900 font-bold">4. Documentación y pago:</strong> Una vez completado el pago, procedemos a la preparación, firma del contrato de compraventa y gestionamos el cambio de nombre. Tu asesor comercial te informará del estado de tu moto en todo momento.
                      </p>
                      <p className="text-[#8e8e93] text-[11px] sm:text-[13px] font-medium">
                        *El importe de la reserva se descuenta del precio final de tu compra.
                      </p>
                    </div>

                    <p>
                      <strong className="text-slate-900 font-bold">5. Entrega de la moto:</strong> ¡Te la enviamos a casa! O si lo prefieres, puedes recogerla en cualquiera de nuestras tiendas.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p>
                      La documentación final de la moto (ficha técnica y permiso de circulación) la mandaremos a tu casa por correo unos días más tarde. Te haremos llegar la documentación provisional para que puedas disfrutar de la moto desde el primer día.
                    </p>
                    <p>
                      Más de 40.000 moteros confían en Kaelos. ¡Empieza ya tu nueva aventura! GASSS.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* F. Contact Form: ¿Tienes alguna duda? */}
          <ContactFormSection noWrapper={true} />



        </div>

        {/* RIGHT COLUMN: Price cards and actions (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          
          {/* Desktop Title & Share Row */}
          <div className="hidden lg:flex justify-between items-start gap-4 pb-2">
            <h1 className="text-2xl lg:text-[28px] xl:text-[32px] font-extrabold text-slate-900 tracking-tight font-display leading-tight">
              {currentBike.brand} {currentBike.model}
            </h1>
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#ff0d41] transition bg-transparent cursor-pointer active:scale-95 shrink-0 pt-2"
            >
              <Share className="w-4 h-4 text-slate-400" />
              <span>Compartir</span>
            </button>
          </div>

          {/* Main Price Card */}
          {renderPriceCard(true)}

          {/* Quality Certificate Panel (Visible on Desktop only) / Renting Panel */}
          {isRentingDetail ? renderQueIncluyeRentingCard(true) : renderCertificadoCard(true)}



        </div>

      </div>

      {/* 4. Full Width: Related products carousel */}
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 mt-12 space-y-6">
        
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
          Productos relacionados
        </h3>

        <StyleBikeCarousel 
          bikes={relatedBikes.map((relBike) => {
            const relFinanced = calculateCuota(relBike.price, 0, DEFAULT_TERM);
            return {
              id: relBike.id,
              brand: relBike.brand,
              model: relBike.model,
              year: relBike.year,
              kms: `${relBike.kms.toLocaleString('es-ES')} km`,
              price: relBike.price,
              financePrice: relFinanced,
              images: relBike.images && relBike.images.length > 0 ? relBike.images : [relBike.image]
            };
          })}
          isStyleLoading={false}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelect={(moto) => {
            const found = allBikes.find(b => b.id === moto.id);
            if (found) onSelectBike(found);
          }}
        />

        {/* Center Back button to Compra search */}
        <div className="text-center pt-4">
          <button 
            onClick={() => onNavigateToCompra()}
            className="bg-brand-dark hover:bg-brand-dark-hover text-white text-xs font-black tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
          >
            PRODUCTOS RELACIONADOS
          </button>
        </div>

      </div>

      {/* 6. Brand Link Badges */}
      <div className="max-w-[1400px] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 mt-16 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">
            Motos {currentBike.brand.toUpperCase()}:
          </h4>
          <button
            onClick={() => onNavigateToCompra({ filterType: 'brand', value: currentBike.brand })}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Ver todas las {currentBike.brand} →
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {brandTags.map((tag) => {
            const searchValue = tag.toUpperCase().includes(currentBike.brand.toUpperCase())
              ? tag
              : `${currentBike.brand} ${tag}`;
            return (
              <button 
                key={tag}
                onClick={() => {
                  onNavigateToCompra({ filterType: 'search', value: searchValue });
                }}
                className="bg-white border border-slate-200/75 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-bold text-slate-700 tracking-tight px-4 py-2.5 rounded-xl transition cursor-pointer select-none shadow-xs active:scale-95"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>



      {/* 7.5 Floating Contact Form Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setIsContactModalOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col z-10 text-left transform transition-all duration-300 scale-100">
            {/* Close button inside modal card header */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-1 sm:p-2">
              <ContactFormSection noWrapper={true} isRentingForm={contactModalType === 'renting'} />
            </div>
          </div>
        </div>
      )}

      {/* 8. Sticky Fixed Mobile Price Card (Z-50) */}
      {renderPriceCard(false)}

    </div>
  );
}
