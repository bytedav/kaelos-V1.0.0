export interface StyleBike {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  kms: string;
  price: number;
  oldPrice?: number;
  financePrice: number;
  oldFinancePrice?: number;
  images: string[];
  condition?: string;
  isKm0?: boolean;
  isNew?: boolean;
  hasOffer?: boolean;
  badge?: string;
  isReserved?: boolean;
}
