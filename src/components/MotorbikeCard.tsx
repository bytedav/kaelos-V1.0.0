export interface MotorbikeExtended {
  id: string;
  brand: string;
  model: string;
  version?: string;
  slug?: string;
  displacement?: number;
  year: number;
  kms: number;
  power: string;
  price: number;
  oldPrice?: number;
  rentingPrice: number;
  category: 'Scooter' | 'Naked' | 'Deportiva' | 'Trail' | 'Touring' | 'Custom' | string;
  image: string;
  images?: string[];
  featuredImage?: string;
  gallery?: string[];
  imperfections?: { image: string; title?: string; description?: string }[];
  badge?: string;
  badgeType?: 'red' | 'dark' | 'white'; // red for offer, dark for kaelos, white for new
  fuel: string;
  isKm0?: boolean;
  hasOffer?: boolean;
  isCovered?: boolean;
  condition?: string;
  description?: string;
  currency?: string;
  location?: string;
  reserved?: boolean;
  isReserved?: boolean;
}
