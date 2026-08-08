import customBrands from './brands.json';
import { motorbikesData } from './motorbikesData';

/**
 * Configuración global de marcas de motocicletas en KAELOS.
 * 
 * Para agregar una nueva marca de manera súper rápida, simplemente agrégala
 * al archivo `/src/data/brands.json` o al inventario de motocicletas.
 * El sistema la repartirá automáticamente a todos los filtros, navegación, SEO y URLs.
 */

const rawBrands: any = customBrands;
export const DEFAULT_GLOBAL_BRANDS: string[] = Array.isArray(rawBrands)
  ? rawBrands
  : Array.isArray(rawBrands?.brands)
  ? rawBrands.brands
  : [];

/**
 * Obtiene la lista completa de marcas combinando la lista global configurada
 * y cualquier otra marca encontrada dinámicamente en el inventario.
 */
export function getAllBrands(inventory: Array<{ brand: string }> = motorbikesData): string[] {
  const brandSet = new Map<string, string>();

  // 1. Agregar marcas configuradas por defecto
  DEFAULT_GLOBAL_BRANDS.forEach((b) => {
    brandSet.set(b.toLowerCase().trim(), b);
  });

  // 2. Extraer dinámicamente marcas presentes en el catálogo
  if (inventory && Array.isArray(inventory)) {
    inventory.forEach((item) => {
      if (item && item.brand) {
        const clean = item.brand.trim();
        const key = clean.toLowerCase();
        if (!brandSet.has(key)) {
          brandSet.set(key, clean);
        }
      }
    });
  }

  // Retornar lista ordenada alfabéticamente
  return Array.from(brandSet.values()).sort((a, b) => a.localeCompare(b, 'es'));
}

/**
 * Genera las opciones para componentes de filtro (Selects / Dropdowns)
 */
export function getBrandFilterOptions(inventory?: Array<{ brand: string }>) {
  const brands = getAllBrands(inventory);
  return [
    { value: 'all', label: 'Todas las marcas' },
    ...brands.map((b) => ({
      value: b,
      label: b === 'Bajaj' ? 'Bajaj (Pulsar)' : b,
    })),
  ];
}

/**
 * Obtiene las marcas principales destacadas para el menú de cabecera / Header.
 */
export function getTopHeaderBrands(limit = 12): string[] {
  const priority = ['Honda', 'Bajaj', 'Yamaha', 'Ronco', 'Wanxin', 'TVS', 'Ssenda', 'Suzuki', 'KTM', 'Kawasaki', 'BMW', 'Hero'];
  const all = getAllBrands();
  
  // Mantener el orden prioritario y completar hasta el límite con las demás marcas
  const result: string[] = [];
  priority.forEach((p) => {
    const found = all.find((b) => b.toLowerCase() === p.toLowerCase());
    if (found && !result.includes(found)) {
      result.push(found);
    }
  });

  all.forEach((b) => {
    if (result.length < limit && !result.includes(b)) {
      result.push(b);
    }
  });

  return result.slice(0, limit);
}

/**
 * Busca coincidencia de marca a partir del slug de la URL (p.ej. /compra?marca=harley-davidson)
 */
export function matchBrandFromSlug(slug: string, inventory?: Array<{ brand: string }>): string | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const brands = getAllBrands(inventory);

  const found = brands.find((b) => {
    const bClean = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    return bClean === cleanSlug;
  });

  return found || null;
}
