import { MotorbikeExtended } from '../components/MotorbikeCard';
import { loadAllMotorcyclesFromContent } from './staticContent';
import { getCategoryFallbackImage, getCategoryFallbackGallery } from '../utils/images';

export function resolveCondition(item: { condition?: string; kms?: number }): string {
  if (item.condition) return item.condition;
  return (item.kms || 0) === 0 ? 'nueva' : 'ocasión';
}

const cmsMotorbikes: MotorbikeExtended[] = loadAllMotorcyclesFromContent().map((item) => {
  const category = (item.category as any) || 'Naked';
  const fallbackImg = getCategoryFallbackImage(category);
  const mainImage = item.featuredImage || fallbackImg;
  const gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [mainImage];

  return {
    id: item.id || item.slug,
    brand: item.brand,
    model: item.model,
    version: item.version,
    year: item.year || 2024,
    kms: item.kms || 0,
    power: item.power || '',
    price: item.price,
    oldPrice: item.discountPrice,
    category,
    image: mainImage,
    images: gallery,
    fuel: item.fuel || 'Gasolina',
    isKm0: (item.kms || 0) < 200,
    hasOffer: item.isOffer || false,
    badge: item.badge,
    condition: resolveCondition(item),
    imperfections: item.imperfections || [],
  };
});

const baseMotorbikes: MotorbikeExtended[] = [
  {
    id: 'honda-pcx-125',
    brand: 'Honda',
    model: 'PCX 125',
    year: 2024,
    kms: 4200,
    power: '12.5 CV',
    price: 3100,
    category: 'Scooter',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200'
    ],
    fuel: 'Gasolina',
    isKm0: false,
    condition: resolveCondition({ kms: 4200 })
  },
  {
    id: 'yamaha-yzf-5',
    brand: 'Yamaha',
    model: 'YZF R 125',
    year: 2023,
    kms: 9480,
    power: '15 CV',
    price: 4899,
    category: 'Deportiva',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200'
    ],
    fuel: 'Gasolina',
    isKm0: false,
    condition: resolveCondition({ kms: 9480 })
  },
  {
    id: 'bmw-gs-1250',
    brand: 'BMW',
    model: 'R 1250 GS Adventure',
    year: 2022,
    kms: 12500,
    power: '136 CV',
    price: 18900,
    category: 'Trail',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=1200'
    ],
    fuel: 'Gasolina',
    isKm0: false,
    condition: resolveCondition({ kms: 12500 })
  },
  {
    id: 'yamaha-tracer-9',
    brand: 'Yamaha',
    model: 'Tracer 9 GT',
    year: 2024,
    kms: 3500,
    power: '119 CV',
    price: 13500,
    category: 'Touring',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200'
    ],
    fuel: 'Gasolina',
    isKm0: false,
    condition: resolveCondition({ kms: 3500 })
  },
  {
    id: 'harley-sportster-s',
    brand: 'Harley-Davidson',
    model: 'Sportster S',
    year: 2023,
    kms: 5200,
    power: '121 CV',
    price: 15900,
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200'
    ],
    fuel: 'Gasolina',
    isKm0: false,
    condition: resolveCondition({ kms: 5200 })
  }
];

const rawMotos = [...cmsMotorbikes, ...baseMotorbikes];
const motoMap = new Map<string, MotorbikeExtended>();
rawMotos.forEach(moto => {
  if (moto && moto.id && !motoMap.has(moto.id)) {
    motoMap.set(moto.id, moto);
  }
});

export const motorbikesData: MotorbikeExtended[] = Array.from(motoMap.values()).map(moto => ({
  ...moto,
  condition: resolveCondition(moto)
}));

