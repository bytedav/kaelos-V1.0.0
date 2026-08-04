import { useMemo } from 'react';
import Fuse, { IFuseOptions, FuseOptionKey } from 'fuse.js';

export interface UseFuseSearchOptions<T> {
  data: T[];
  query: string;
  keys: FuseOptionKey<T>[];
  threshold?: number;
  includeScore?: boolean;
  shouldSort?: boolean;
  minMatchCharLength?: number;
  ignoreLocation?: boolean;
  findAllMatches?: boolean;
  useExtendedSearch?: boolean;
}

/**
 * Normaliza cadenas de texto eliminando acentos/diacríticos, convirtiendo a minúsculas,
 * limpiando signos de puntuación redundantes y colapsando espacios en blanco.
 */
export function normalizeSearchString(str: any): string {
  if (str === null || str === undefined) return '';
  const val = typeof str === 'string' ? str : String(str);
  return val
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos/diacríticos (ej: "ocasión" -> "ocasion", "clásica" -> "clasica")
    .toLowerCase()
    .replace(/[-_/.,]/g, ' ') // Reemplaza signos de puntuación con espacios (ej: "MT-07" -> "MT 07", "B/A1" -> "B A1")
    .replace(/\s+/g, ' ') // Colapsa múltiples espacios
    .trim();
}

/**
 * Obtiene el valor de una propiedad según su ruta (soporta propiedades anidadas como "user.name")
 */
function getPropertyByPath(obj: any, path: string | string[]): any {
  if (!obj) return null;
  if (Array.isArray(path)) {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }
  if (typeof path === 'string') {
    if (path.includes('.')) {
      return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    }
    return obj[path];
  }
  return null;
}

/**
 * Serializador seguro para las llaves de Fuse (evita errores con JSON.stringify si hay funciones o objetos complejos)
 */
function serializeKeys<T>(keys: FuseOptionKey<T>[]): string {
  if (!Array.isArray(keys)) return '';
  return keys
    .map((k) => {
      if (typeof k === 'string') return k;
      if (typeof k === 'object' && k !== null) {
        return `${String((k as any).name)}:${(k as any).weight ?? 1}`;
      }
      return String(k);
    })
    .join('|');
}

/**
 * Hook de búsqueda difusa mejorado usando Fuse.js.
 * 
 * Características:
 * - Insensible a acentos y mayúsculas/minúsculas ("clasica" halla "Clásica", "ocasion" halla "Ocasión")
 * - Tolerancia a errores ortográficos (ej. "yamha" -> "Yamaha")
 * - Búsqueda multi-palabra y multi-campo inteligente (soporta búsquedas compuestas como "Yamaha 125" o "Honda Surco")
 * - Umbral dinámico para términos cortos ("CB", "R1", "A2")
 * - Serialización segura de llaves
 */
export function useFuseSearch<T>({
  data,
  query,
  keys,
  threshold = 0.35,
  includeScore = true,
  shouldSort = true,
  minMatchCharLength = 1,
  ignoreLocation = true,
  findAllMatches = false,
  useExtendedSearch = false,
}: UseFuseSearchOptions<T>): T[] {
  const normalizedQuery = useMemo(() => normalizeSearchString(query), [query]);

  // Serialización segura de llaves
  const serializedKeys = useMemo(() => serializeKeys(keys), [keys]);

  // Instancia memoizada de Fuse.js con extractor normalizado getFn
  const fuse = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Umbral adaptativo para consultas cortas (1-2 caracteres)
    const effectiveThreshold = normalizedQuery.length <= 2 ? Math.min(threshold, 0.2) : threshold;

    const options: IFuseOptions<T> = {
      keys,
      threshold: effectiveThreshold,
      includeScore: true,
      shouldSort,
      minMatchCharLength,
      ignoreLocation,
      findAllMatches,
      useExtendedSearch,
      getFn: (obj: T, path: string | string[]) => {
        const val = getPropertyByPath(obj, path);
        if (typeof val === 'string') {
          return normalizeSearchString(val);
        }
        if (Array.isArray(val)) {
          return val.map((item) => (typeof item === 'string' ? normalizeSearchString(item) : item));
        }
        return val;
      },
    };

    return new Fuse(data, options);
  }, [
    data,
    serializedKeys,
    threshold,
    shouldSort,
    minMatchCharLength,
    ignoreLocation,
    findAllMatches,
    useExtendedSearch,
    normalizedQuery.length,
  ]);

  // Filtrado optimizado con soporte multi-token
  const filteredData = useMemo(() => {
    if (!normalizedQuery || !fuse || !data || data.length === 0) {
      return data || [];
    }

    // 1. Intentar búsqueda directa
    const results = fuse.search(normalizedQuery);

    if (results.length > 0) {
      return results.map((result) => result.item);
    }

    // 2. Si la consulta tiene múltiples palabras y la búsqueda directa no arrojó resultados,
    //    hacer búsqueda por tokens individuales (AND) a través de los campos
    const tokens = normalizedQuery.split(' ').filter((t) => t.length > 0);
    if (tokens.length > 1) {
      const tokenResultSets = tokens.map((token) => {
        const tokenSearch = fuse.search(token);
        return new Set(tokenSearch.map((res) => res.item));
      });

      // Intersección (AND) de los conjuntos de resultados
      const commonItems = data.filter((item) =>
        tokenResultSets.every((resultSet) => resultSet.has(item))
      );

      if (commonItems.length > 0) {
        return commonItems;
      }
    }

    return [];
  }, [normalizedQuery, fuse, data]);

  return filteredData;
}

