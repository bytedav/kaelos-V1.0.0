import customCities from './cities.json';
import { motorbikesData } from './motorbikesData';

/**
 * Configuración global de ciudades en KAELOS.
 * 
 * Para agregar o modificar ciudades de manera rápida, puedes hacerlo desde
 * `/src/data/cities.json` o usando Pages CMS.
 * El sistema las sincronizará automáticamente en filtros, SEO y menús de la web.
 */

const rawCities: any = customCities;
export const DEFAULT_GLOBAL_CITIES: string[] = Array.isArray(rawCities)
  ? rawCities
  : Array.isArray(rawCities?.cities)
  ? rawCities.cities
  : [];

/**
 * Obtiene la lista completa de ciudades combinando la lista global configurada
 * en cities.json más cualquier ciudad presente dinámicamente en el inventario de motos.
 */
export function getAllCities(inventory: Array<{ location?: string; city?: string }> = motorbikesData): string[] {
  const citiesSet = new Set<string>();

  // 1. Agregar ciudades globales
  DEFAULT_GLOBAL_CITIES.forEach(c => {
    if (c && typeof c === 'string') citiesSet.add(c.trim());
  });

  // 2. Extraer ciudades del inventario si existe
  if (inventory && Array.isArray(inventory)) {
    inventory.forEach(bike => {
      if (bike.location && typeof bike.location === 'string') {
        citiesSet.add(bike.location.trim());
      }
    });
  }

  return Array.from(citiesSet);
}

/**
 * Obtiene las ciudades principales recomendadas para bloques de filtros rápidos.
 */
export function getTopFilterCities(limit: number = 7, inventory?: Array<{ location?: string }>): string[] {
  const all = getAllCities(inventory);
  return all.slice(0, limit);
}
