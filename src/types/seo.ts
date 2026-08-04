export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  robots?: string; // e.g. "index, follow"
  keywords?: string[];
  author?: string;
  publisher?: string;
  language?: string; // e.g. "es-PE", "es"
  type?: 'website' | 'article' | 'product' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  alternates?: Array<{ hrefLang: string; href: string }>;
  // Product & E-commerce Specific Meta Tags
  priceAmount?: number;
  priceCurrency?: string;
  availability?: string; // 'in stock' | 'out of stock'
  productCondition?: string; // 'new' | 'used' | 'refurbished'
  brand?: string;
  category?: string;
  // GEO & Local SEO
  geoRegion?: string; // e.g. "PE-LMA"
  geoPlacename?: string; // e.g. "Lima, Surco, Perú"
  geoPosition?: string; // e.g. "-12.1284;-76.9742"
  icbm?: string; // e.g. "-12.1284, -76.9742"
  // SEM & Tracking
  googleAnalyticsId?: string;
  metaPixelId?: string;
  // AIO (AI Optimization & Voice Search)
  speakableSelectors?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

export interface MotorcycleSchemaData {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  kms: number;
  price: number;
  currency?: string;
  condition?: string;
  category: string;
  power?: string;
  displacement?: number;
  fuel?: string;
  featuredImage: string;
  gallery?: string[];
  description: string;
  url: string;
}

export interface ArticleSchemaData {
  id?: string;
  title: string;
  description?: string;
  excerpt?: string;
  url?: string;
  slug?: string;
  coverImage?: string;
  image?: string;
  datePublished?: string;
  date?: string;
  dateModified?: string;
  authorName?: string;
  authorRole?: string;
  author?: {
    name: string;
    role?: string;
  };
  category?: string;
  tags?: string[];
}
