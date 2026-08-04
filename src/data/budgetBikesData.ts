import { StyleBike } from '../types';
import { motorbikesData } from './motorbikesData';
import { toStyleBike } from './styleBikesData';

import { MotorbikeExtended } from '../components/MotorbikeCard';

export function getBudgetBikesData(motos: MotorbikeExtended[] = motorbikesData): Record<string, StyleBike[]> {
  return {
    'menos_de_2k': motos.filter((b) => b.price < 2000).map(toStyleBike),
    '2k_4k': motos.filter((b) => b.price >= 2000 && b.price < 4000).map(toStyleBike),
    '4k_6k': motos.filter((b) => b.price >= 4000 && b.price < 6000).map(toStyleBike),
    '6k_8k': motos.filter((b) => b.price >= 6000 && b.price < 8000).map(toStyleBike),
    '8k_12k': motos.filter((b) => b.price >= 8000 && b.price < 12000).map(toStyleBike),
    '12k_18k': motos.filter((b) => b.price >= 12000 && b.price < 18000).map(toStyleBike),
    'mas_de_18k': motos.filter((b) => b.price >= 18000).map(toStyleBike),
  };
}

export const budgetBikesData: Record<string, StyleBike[]> = getBudgetBikesData();

