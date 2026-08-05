import {
  MotorbikeContent,
  BlogPostContent,
  FaqCategoryContent,
  FaqItemContent,
  PageContent,
  GeneralSettingsContent,
} from '../types/content';
import {
  loadAllMotorcyclesFromCms,
  loadAllBlogPostsFromCms,
  loadAllFaqsFromCms,
  loadAllPagesFromCms,
  loadSettingsFromCms,
} from '../utils/cms';

// Static fallbacks
export function getStaticMotorcycles(): MotorbikeContent[] {
  return [
    {
      id: 'bmw-r-1250-gs',
      slug: 'bmw-r-1250-gs',
      brand: 'BMW',
      model: 'R 1250 GS',
      version: 'HP Adventure',
      year: 2024,
      category: 'Trail',
      condition: 'nueva',
      price: 21900,
      currency: 'PEN',
      kms: 0,
      displacement: 1254,
      power: '136 CV',
      fuel: 'Gasolina',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=1200'
      ],
      imperfections: [],
      description: 'La reina indomable de las rutas y aventuras todoterreno. Equipamiento completo con modos de conducción Pro y suspensión Dynamic ESA.',
      published: true,
      seo: {
        title: 'BMW R 1250 GS Nueva 2024 | Kaelos Motos',
        description: 'La mejor Maxitrail del mercado disponible para entrega inmediata.'
      }
    },
    {
      id: 'yamaha-mt-03',
      slug: 'yamaha-mt-03',
      brand: 'Yamaha',
      model: 'MT 03',
      version: 'Ice Fluo',
      year: 2023,
      category: 'Naked',
      condition: 'ocasión',
      price: 5199,
      currency: 'PEN',
      kms: 4204,
      displacement: 321,
      power: '42 CV',
      fuel: 'Gasolina',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200'
      ],
      imperfections: [
        {
          image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
          title: 'Roce leve en espejo derecho',
          description: 'Pequeño rasguño estético en la carcasa del retrovisor derecho. Sin grietas ni afectación de visión.'
        }
      ],
      description: "Pura agilidad e inspiración 'Dark Side of Japan'. La MT-03 combina motor bicilíndrico de 321 cc con suspensión delantera invertida.",
      published: true,
      seo: {
        title: 'Yamaha MT 03 2023 | Kaelos Motos',
        description: 'Consigue la Yamaha MT-03 con financiación a tu medida.'
      }
    },
    {
      id: 'yamaha-mt-125',
      slug: 'yamaha-mt-125',
      brand: 'Yamaha',
      model: 'MT 125',
      version: 'ABS',
      year: 2025,
      category: 'Naked',
      condition: 'ocasión',
      price: 5499,
      currency: 'PEN',
      kms: 1966,
      displacement: 125,
      power: '15 CV',
      fuel: 'Gasolina',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200'
      ],
      imperfections: [
        {
          image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
          title: 'Desgaste menor en protector de escape',
          description: 'Marca leve de pintura en el embellecedor protector del tubo de escape.'
        }
      ],
      description: 'La Yamaha MT-125 ofrece la máxima actitud hyper naked con motor de accionamiento de válvula variable y chasís Deltabox.',
      published: true,
      seo: {
        title: 'Yamaha MT 125 2025 en Venta | Kaelos Motos',
        description: 'Compra o alquila la Yamaha MT 125 de ocasión revisada con garantía.'
      }
    }
  ];
}

export function loadAllMotorcyclesFromContent(): MotorbikeContent[] {
  return getStaticMotorcycles();
}

export async function fetchAllMotorcyclesAsync(): Promise<MotorbikeContent[]> {
  const cms = await loadAllMotorcyclesFromCms();
  return cms.length > 0 ? cms : getStaticMotorcycles();
}

export function loadAllBlogPostsFromContent(): BlogPostContent[] {
  return loadAllBlogPostsFromCms();
}

export async function fetchAllBlogPostsAsync(): Promise<BlogPostContent[]> {
  return loadAllBlogPostsFromCms();
}

export function loadAllFaqsFromContent(): FaqCategoryContent[] {
  return loadAllFaqsFromCms();
}

export async function fetchAllFaqsAsync(): Promise<FaqCategoryContent[]> {
  return loadAllFaqsFromCms();
}

export function loadAllPagesFromContent(): PageContent[] {
  return [
    {
      id: 'acerca-de',
      slug: 'acerca-de',
      title: 'Sobre Kaelos Motos',
      description: 'Reinventando la compra, venta y suscripción de motocicletas en Perú.',
      seo: {
        title: 'Sobre Nosotros | Kaelos Motos',
        description: 'Conoce nuestra historia, misión y red de concesionarios y talleres autorizados.'
      },
      body: `En **Kaelos Motos** nacimos con una misión clara: simplificar de punta a punta la experiencia de comprar, vender, financiar o suscribirse a una motocicleta.

## Nuestra Visión

Creemos en una movilidad sobre dos ruedas transparente, accesible y libre de fricciones. Cada motocicleta de nuestro catálogo pasa por un proceso de revisión riguroso de más de 100 puntos clave en nuestros propios talleres certificados.

## ¿Por qué elegir Kaelos?

- **Transparencia total:** Sin letras pequeñas ni precios ocultos.
- **Garantía Kaelos:** Hasta 12 meses de cobertura mecánica en motos de ocasión.
- **Prueba y compra online:** Te entregamos tu moto revisada y matriculada en la puerta de tu casa.`
    }
  ];
}

export async function fetchAllPagesAsync(): Promise<PageContent[]> {
  const cms = await loadAllPagesFromCms();
  return cms.length > 0 ? cms : loadAllPagesFromContent();
}

export function loadSettingsFromContent(): GeneralSettingsContent {
  return {
    siteName: 'Kaelos Motos',
    contactPhone: '+51 987 654 321',
    whatsappNumber: '51987654321',
    email: 'bytedav@gmail.com'
  };
}

export async function fetchSettingsAsync(): Promise<GeneralSettingsContent> {
  const cms = await loadSettingsFromCms();
  return cms || loadSettingsFromContent();
}

