import { StyleBike } from '../types';
import { motorbikesData } from './motorbikesData';
import { MotorbikeExtended } from '../components/MotorbikeCard';

export function toStyleBike(bike: MotorbikeExtended): StyleBike {
  const calcFinance = (bike.rentingPrice && bike.rentingPrice > 0)
    ? bike.rentingPrice
    : Math.round(bike.price * 0.0214) || Math.round(bike.price * 0.018 + 12);

  const rawKms = bike.kms ?? 0;
  const formattedKms = typeof rawKms === 'number'
    ? (rawKms === 0 ? '0 KM' : `${rawKms.toLocaleString('es-PE')} KM`)
    : (String(rawKms).toUpperCase().includes('KM') ? String(rawKms).toUpperCase() : `${rawKms} KM`);

  return {
    id: bike.id,
    brand: bike.brand.toUpperCase(),
    model: bike.model.toUpperCase(),
    version: bike.version ? bike.version.toUpperCase() : undefined,
    year: bike.year,
    kms: formattedKms,
    price: bike.price,
    oldPrice: bike.oldPrice,
    financePrice: calcFinance,
    images: bike.images && bike.images.length > 0 ? bike.images : [bike.image],
    isRenting: false,
    rentingPrice: calcFinance,
    condition: bike.condition,
    isReserved: bike.reserved || bike.isReserved,
    hasOffer: bike.hasOffer,
    isKm0: bike.isKm0,
    badge: bike.badge
  };
}

export function getStyleBikesData(motos: MotorbikeExtended[] = motorbikesData): Record<string, StyleBike[]> {
  return {
    scooter: motos.filter((b) => b.category.toLowerCase() === 'scooter').map(toStyleBike),
    naked: motos.filter((b) => b.category.toLowerCase() === 'naked').map(toStyleBike),
    deportiva: motos.filter((b) => b.category.toLowerCase() === 'deportiva').map(toStyleBike),
    trail: motos.filter((b) => b.category.toLowerCase() === 'trail').map(toStyleBike),
    touring: motos.filter((b) => b.category.toLowerCase() === 'touring').map(toStyleBike),
    custom: motos.filter((b) => b.category.toLowerCase() === 'custom').map(toStyleBike),
    clasica: motos.filter((b) => b.category.toLowerCase() === 'custom' || b.model.toLowerCase().includes('bonneville') || b.model.toLowerCase().includes('r ninet')).map(toStyleBike),
    'off-road': motos.filter((b) => b.category.toLowerCase() === 'trail' || b.model.toLowerCase().includes('enduro') || b.model.toLowerCase().includes('exc')).map(toStyleBike),
  };
}

export const styleBikesData: Record<string, StyleBike[]> = getStyleBikesData();

