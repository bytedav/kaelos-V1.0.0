import { PRICING_CONFIG } from '../config/pricing';
export * from './brands';

export interface WarrantyPackFeature {
  text: string;
  included: boolean;
}

export interface WarrantyPack {
  key: 'basico' | 'economico' | 'premium' | string;
  name: string;
  price: number;
  badge?: string;
  features: WarrantyPackFeature[];
}

export interface BankAccount {
  bankName: string;
  currency: string;
  accountNumber: string;
  cci: string;
  color: string;
}

export interface CompanyPaymentConfig {
  companyName: string;
  ruc: string;
  accounts: BankAccount[];
  yapePlin: {
    phone: string;
    holder: string;
  };
}

export interface StoreLocation {
  id: string;
  name: string;
  badge: string;
  phone: string;
  address: string;
  hoursLine1: string;
  hoursLine2: string;
  mapsUrl: string;
  images: string[];
}

export interface FinanceConfig {
  annualInterestRate: number; // e.g. 0.50 (50% TEA)
  minEntranceRatio: number; // e.g. 0.20 (20% inicial)
  defaultTermMonths: number; // e.g. 24
  availableTerms: number[]; // e.g. [12, 18, 24, 36, 48, 60]
  packs: Record<string, WarrantyPack>;
}

export interface WhatsAppConfig {
  phoneNumber: string; // e.g. "51987654321"
  displayPhone: string; // e.g. "+51 987 654 321"
  defaultMessage: string;
}

export const SITE_CONFIG = {
  finance: {
    annualInterestRate: PRICING_CONFIG.FINANCING.DEFAULT_ANNUAL_RATE,
    minEntranceRatio: PRICING_CONFIG.FINANCING.MIN_ENTRANCE_PERCENT,
    defaultTermMonths: PRICING_CONFIG.FINANCING.DEFAULT_TERM_MONTHS,
    availableTerms: [...PRICING_CONFIG.FINANCING.ALLOWED_TERMS_MONTHS],
    reservationFee: PRICING_CONFIG.RESERVATION_FEE,
    registrationFee: PRICING_CONFIG.REGISTRATION_FEE_DEFAULT,
    packs: {
      basico: {
        key: 'basico',
        name: 'Pack Básico',
        price: 0,
        badge: 'INCLUIDO',
        features: [
          { text: 'Sin moto de sustitución', included: false },
          { text: 'Sin envío nacional incluido', included: false },
          { text: 'Sin recompra **', included: false },
          { text: 'Garantía 12 meses', included: true },
          { text: `TEA de ${(PRICING_CONFIG.FINANCING.DEFAULT_ANNUAL_RATE * 100).toFixed(0)}%`, included: true },
        ],
      },
      economico: {
        key: 'economico',
        name: 'Pack Económico',
        price: 279,
        badge: 'RECOMENDADO',
        features: [
          { text: 'Sin moto de sustitución', included: false },
          { text: 'Envío a nivel nacional incluido', included: true },
          { text: 'Recompra asegurada **', included: true },
          { text: 'Garantía 12 meses', included: true },
          { text: 'TEA preferencial de 8%', included: true },
        ],
      },
      premium: {
        key: 'premium',
        name: 'Pack Premium',
        price: 558,
        badge: 'MEJOR OPCIÓN',
        features: [
          { text: 'Moto de sustitución', included: true },
          { text: 'Envío a nivel nacional incluido', included: true },
          { text: 'Recompra asegurada **', included: true },
          { text: 'Garantía 24 meses', included: true },
          { text: 'TEA preferencial de 8%', included: true },
        ],
      },
    } as Record<string, WarrantyPack>,
  },
  payment: {
    companyName: 'KAELOS MOTOS S.A.C.',
    ruc: '20608912341',
    accounts: [
      {
        bankName: 'BCP Soles',
        currency: 'PEN',
        accountNumber: '193-9821831-0-12',
        cci: '002-19300982183101209',
        color: '#f58220',
      },
      {
        bankName: 'BBVA Soles',
        currency: 'PEN',
        accountNumber: '0011-0182-0100034821',
        cci: '011-182-000100034821-14',
        color: '#004481',
      },
    ] as BankAccount[],
    yapePlin: {
      phone: '+51 987 654 321',
      holder: 'KAELOS MOTOS S.A.C.',
    },
  },
  whatsapp: {
    phoneNumber: '51987654321',
    displayPhone: '+51 987 654 321',
    defaultMessage: '¡Hola! Estoy interesado en consultar sobre una motocicleta de Kaelos Motos.',
  },
  stores: [
    {
      id: 'surco',
      name: 'Lima - Surco',
      badge: 'KAELOS OFICIAL',
      phone: '+51 1 710 3333',
      address: 'Av. Javier Prado Este 4200, Santiago de Surco, Lima',
      hoursLine1: 'Lunes a viernes de 8:30 a 20:00',
      hoursLine2: 'Sábados de 9:00 a 18:00',
      mapsUrl: 'https://maps.google.com/?q=Av.+Javier+Prado+Este+4200,+Santiago+de+Surco,+Lima',
      images: [
        '/src/assets/images/kaelos_center_1784106082831.jpg',
        '/src/assets/images/scooter_red_studio_1784099142309.jpg',
        '/src/assets/images/sport_red_studio_1784099164293.jpg'
      ],
    },
    {
      id: 'los-olivos',
      name: 'Lima - Los Olivos',
      badge: 'EXPOSICIÓN Y TALLER',
      phone: '+51 1 710 3334',
      address: 'Av. Carlos Izaguirre 1250, Los Olivos, Lima',
      hoursLine1: 'Lunes a viernes de 8:30 a 20:00',
      hoursLine2: 'Sábados de 9:00 a 18:00',
      mapsUrl: 'https://maps.google.com/?q=Av.+Carlos+Izaguirre+1250,+Los+Olivos,+Lima',
      images: [
        '/src/assets/images/scooter_red_studio_1784099142309.jpg',
        '/src/assets/images/adventure_red_studio_1784099131268.jpg'
      ],
    },
    {
      id: 'arequipa',
      name: 'Arequipa - Cayma',
      badge: 'CENTRO REGIONAL',
      phone: '+51 54 60 8899',
      address: 'Av. Ejército 710, Cayma, Arequipa',
      hoursLine1: 'Lunes a viernes de 9:00 a 19:30',
      hoursLine2: 'Sábados de 9:00 a 14:00',
      mapsUrl: 'https://maps.google.com/?q=Av.+Ej%C3%A9rcito+710,+Cayma,+Arequipa',
      images: [
        '/src/assets/images/adventure_red_studio_1784099131268.jpg',
        '/src/assets/images/sport_red_studio_1784099164293.jpg'
      ],
    },
  ] as StoreLocation[],
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Comprar, Vender o Financiar tu moto nunca ha sido tan fácil',
      bgColor: '#100103',
      buttons: [
        { text: 'COMPRA', link: 'compra' },
        { text: 'VENDE', link: 'vende' },
        { text: 'FINANCIACIÓN', link: 'financiacion' },
      ],
    },
    {
      id: 'slide-2',
      title: '¡Descubre cuánto vale tu moto en un clic!',
      bgColor: '#001c38',
      buttons: [
        { text: 'TASAR MI MOTO', link: 'vende' },
      ],
    },
    {
      id: 'slide-3',
      title: 'Calcula tu financiación a medida en segundos',
      bgColor: '#091c33',
      buttons: [
        { text: 'CALCULAR FINANCIACIÓN', link: 'financiacion' },
        { text: 'VER SCOOTERS NUEVOS', link: '/motos-segunda-mano-ocasion/scooters?condicion=nuevo' },
      ],
    },
  ],
  benefits: [
    { title: 'Un año de garantía.', description: 'Disfruta de tu moto con total tranquilidad.' },
    { title: 'Revisadas por profesionales.', description: 'Control exhaustivo en más de 100 puntos.' },
    { title: 'Te la llevamos a casa.', description: 'Transporte rápido y seguro.' },
  ],
  styleCategories: [
    {
      title: 'Para aventureros',
      desc: 'Conduce sin límites, explora cada kilómetro de la carretera con estas motos.',
      category: 'trail',
    },
    {
      title: 'Ciudad y comodidad',
      desc: 'Perfecto para tu día a día en la ciudad, elige la practicidad y evita el estrés del tráfico diario.',
      category: 'scooter',
    },
    {
      title: 'Estilo único',
      desc: 'Marca la diferencia con las motos custom, siente la esencia de ser motero.',
      category: 'custom',
    },
    {
      title: 'Adrenalina',
      desc: '¿Buscas emociones fuertes? Aquí encontrarás la adrenalina que necesitas.',
      category: 'naked',
    },
  ],
};
