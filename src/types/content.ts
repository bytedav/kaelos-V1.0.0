/**
 * Content Types for Pages CMS and Content Architecture
 */

export interface SeoMetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface MotorbikeImperfection {
  image: string;
  title?: string;
  description?: string;
}

export interface MotorbikeContent {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  category: 'Scrambler' | 'Naked' | 'Scooter' | 'Custom' | 'Trail' | 'Sport' | 'Gran Turismo' | string;
  condition: 'ocasión' | 'nueva';
  price: number;
  currency?: string;
  discountPrice?: number;
  isOffer?: boolean;
  kms?: number;
  badge?: string;
  featured?: boolean;
  featuredImage: string;
  gallery?: string[];
  imperfections?: MotorbikeImperfection[];
  displacement?: number | string;
  power?: string;
  torque?: string;
  transmission?: string;
  cooling?: string;
  fuel?: string;
  city?: string;
  location?: string;
  color?: string;
  originCountry?: string;
  keysCount?: number;
  citvValidity?: string;
  vatType?: string;
  lastRevisionDate?: string;
  revisionCenter?: string;
  revisionDateFormatted?: string;
  revisionKms?: number;
  serviceHistory?: string[];
  componentScores?: Record<string, number | string>;
  reserved?: boolean;
  weight?: number;
  seatHeight?: number;
  tankCapacity?: number;
  description?: string;
  specifications?: Record<string, any>;
  seo?: SeoMetaData;
  published?: boolean;
}

export interface AuthorContent {
  name: string;
  role?: string;
  avatar?: string;
}

export interface BlogPostContent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  cover?: string;
  date?: string;
  readTime?: string;
  category: string;
  author?: AuthorContent;
  tags?: string[];
  published?: boolean;
  seo?: SeoMetaData;
  body: string; // Markdown body
}

export interface FaqItemContent {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface FaqCategoryContent {
  id: string;
  category: string;
  items: FaqItemContent[];
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  seo?: SeoMetaData;
  body: string; // Markdown body
}

export interface StoreLocation {
  id: string;
  city: string;
  address: string;
  phone?: string;
  mapUrl?: string;
  schedule?: string;
}

export interface HeroSlideButton {
  text: string;
  link?: string;
  variant?: 'primary' | 'secondary' | 'outline' | string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  bgMobile?: string;
  bgDesktop?: string;
  bgColor?: string;
  buttons?: HeroSlideButton[];
}

export interface BannersConfig {
  heroSlide1Mobile?: string;
  heroSlide1Desktop?: string;
  heroSlide2Mobile?: string;
  heroSlide2Desktop?: string;
  heroSlide2Title?: string;
  heroSlide2ButtonText?: string;
  heroSlide2ButtonLink?: string;
  heroSlide2Link?: string;
  financiacionHeroMobile?: string;
  financiacionHeroDesktop?: string;
  sellMotoBanner?: string;
  dudasBanner?: string;
}

export interface GeneralSettingsContent {
  siteName: string;
  contactPhone: string;
  whatsappNumber: string;
  email: string;
  locations?: StoreLocation[];
  banners?: BannersConfig;
  heroSlides?: HeroSlide[];
  seoDefault?: SeoMetaData;
}
