/**
 * ARCHIVO 1: ENRUTADOR DINÁMICO UNIVERSAL (Venta / Ocasión)
 * Gestiona de forma limpia y continua todas las rutas de la plataforma sin recargar la página.
 */

export interface ParsedRoute {
  page: string;
  id?: string;
  subView?: string;
  ciudad?: string;
  condicion?: 'nuevas' | 'ocasion';
  slug?: string;
  queryParams: Record<string, string>;
}

export function toSlug(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // convierte espacios en guiones
    .replace(/-+/g, "-"); // une guiones múltiples
}

export function slugToCityName(slug: string): string {
  if (!slug || slug === 'todas') return '';
  const s = slug.toLowerCase();
  if (s === 'lima' || s === 'lima-surco' || s === 'surco') return 'Lima - Surco';
  if (s === 'los-olivos' || s === 'lima-los-olivos') return 'Lima - Los Olivos';
  if (s === 'arequipa') return 'Arequipa';
  if (s === 'trujillo') return 'Trujillo';
  if (s === 'chiclayo') return 'Chiclayo';
  if (s === 'piura') return 'Piura';
  if (s === 'cusco') return 'Cusco';
  if (s === 'huancayo') return 'Huancayo';
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
}

export function cityNameToSlug(city: string): string {
  if (!city) return '';
  const s = city.toLowerCase();
  if (s.includes('surco')) return 'lima-surco';
  if (s.includes('los olivos') || s.includes('los-olivos')) return 'lima-los-olivos';
  if (s.includes('arequipa')) return 'arequipa';
  if (s.includes('trujillo')) return 'trujillo';
  if (s.includes('chiclayo')) return 'chiclayo';
  if (s.includes('piura')) return 'piura';
  if (s.includes('cusco')) return 'cusco';
  if (s.includes('huancayo')) return 'huancayo';
  if (s.includes('lima')) return 'lima';
  return toSlug(city);
}

/**
 * Parsea cualquier ruta relativa entrante para obtener la vista activa, parámetros e id.
 */
export function parseCurrentRoute(pathname: string, search: string): ParsedRoute {
  const queryParams: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((val, key) => {
    queryParams[key] = val;
  });

  const path = pathname.replace(/\/+$/, '') || '/';

  // 1. Ocasión / Venta Dynamic Filter: /motos/filter/:ciudad/:condicion
  const filterMatch = path.match(/^\/motos\/filter\/([^/]+)(?:\/([^/]+))?$/);
  if (filterMatch) {
    const rawCiudad = decodeURIComponent(filterMatch[1]);
    const rawCondicion = filterMatch[2] ? decodeURIComponent(filterMatch[2]).toLowerCase() : undefined;
    const condicion: 'nuevas' | 'ocasion' | undefined = rawCondicion === 'nuevas' ? 'nuevas' : (rawCondicion === 'ocasion' ? 'ocasion' : undefined);
    return {
      page: 'catalogo',
      ciudad: slugToCityName(rawCiudad),
      condicion,
      queryParams
    };
  }

  // 2. Moto Detail y Sub-vistas (/moto/:id, plus subviews)
  const motoMatch = path.match(/^\/moto\/([^/]+)(?:\/(finance|pack|images|checkout))?$/);
  if (motoMatch) {
    return {
      page: 'moto',
      id: decodeURIComponent(motoMatch[1]),
      subView: motoMatch[2] || 'detail',
      queryParams
    };
  }

  // 3. Blog y Artículos Individuales (/blog y /blog/[slug])
  const blogPostMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogPostMatch) {
    return {
      page: 'blog',
      slug: decodeURIComponent(blogPostMatch[1]),
      queryParams
    };
  }
  if (path === '/blog') {
    return { page: 'blog', queryParams };
  }

  // 4. Catalog path (/motos)
  if (path === '/motos' || path.startsWith('/motos/')) {
    return { page: 'catalogo', queryParams };
  }

  // 5. Servicios Comerciales y Páginas Generales
  switch (path) {
    case '/':
      return { page: 'home', queryParams };
    case '/financiacion':
      return { page: 'financiacion', queryParams };
    case '/vender-mi-moto':
      return { page: 'vende', queryParams };
    case '/tramites':
    case '/tramites-documentales':
      return { page: 'tramites', queryParams };
    case '/mantenimiento':
      return { page: 'mantenimiento', queryParams };
    case '/transporte':
      return { page: 'transporte', queryParams };
    case '/equipamiento':
    case '/maletas-y-accesorios':
      return { page: 'equipamiento', queryParams };
    case '/favoritos':
    case '/user/favorites':
      return { page: 'favoritos', queryParams };
    case '/acerca-de':
      return { page: 'acerca-de', queryParams };
    case '/preguntas-frecuentes':
      return { page: 'preguntas-frecuentes', queryParams };
    case '/contacto':
      return { page: 'contacto', queryParams };
    case '/aviso-legal':
      return { page: 'aviso-legal', queryParams };
    case '/politica-privacidad':
      return { page: 'politica-privacidad', queryParams };
    case '/terminos-y-condiciones':
      return { page: 'terminos-y-condiciones', queryParams };
    case '/politica-de-cookies':
    case '/cookies':
      return { page: 'cookies', queryParams };
    default:
      return { page: 'catalogo', queryParams };
  }
}

/**
 * Navega sin recargar la página utilizando URLs relativas dinámicas y React Router.
 */
export function navigateTo(path: string, options?: { replace?: boolean }) {
  if (window.location.pathname + window.location.search === path) return;
  const reactNav = (window as any).__reactNavigate;
  if (typeof reactNav === 'function') {
    reactNav(path, { replace: !!options?.replace });
    return;
  }
  if (options?.replace) {
    window.history.replaceState(null, '', path);
  } else {
    window.history.pushState(null, '', path);
  }
  // Disparar evento para sincronizar el estado del enrutador global
  window.dispatchEvent(new Event('popstate'));
}
