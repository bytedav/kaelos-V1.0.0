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

export const motorbikesData: MotorbikeExtended[] = cmsMotorbikes;


