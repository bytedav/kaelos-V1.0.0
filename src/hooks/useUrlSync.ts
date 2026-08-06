import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motorbikesData } from '../data/motorbikesData';
import { MotorbikeExtended } from '../components/MotorbikeCard';
import { getOrderById } from '../utils/storage';
import { toSlug, slugToCityName as slugToCity, cityNameToSlug as cityToSlug } from '../utils/router';
import { matchBrandFromSlug } from '../data/brands';

export const PATH_MAP: Record<string, string> = {
  home: '/',
  compra: '/motos',
  moto: '/moto',
  transporte: '/transporte',
  mantenimiento: '/mantenimiento',
  'tramites-documentales': '/tramites-documentales',
  seguros: '/seguros',
  localizador: '/localizador',
  'acerca-de': '/acerca-de',
  financiacion: '/financiacion',
  'preguntas-frecuentes': '/preguntas-frecuentes',
  blog: '/blog',
  favorites: '/user/favorites',
  vende: '/vender-mi-moto',
  equipamiento: '/equipamiento',
  contacto: '/contacto',
  'aviso-legal': '/aviso-legal',
  'politica-privacidad': '/politica-privacidad',
  'terminos-y-condiciones': '/terminos-y-condiciones',
  cookies: '/politica-de-cookies',
};

export const REVERSE_PATH_MAP: Record<string, string> = {
  '/': 'home',
  '/motos': 'compra',
  '/moto': 'moto',
  '/transporte': 'transporte',
  '/mantenimiento': 'mantenimiento',
  '/tramites-documentales': 'tramites-documentales',
  '/seguros': 'seguros',
  '/localizador': 'localizador',
  '/acerca-de': 'acerca-de',
  '/financiacion': 'financiacion',
  '/preguntas-frecuentes': 'preguntas-frecuentes',
  '/blog': 'blog',
  '/user/favorites': 'favorites',
  '/vender-mi-moto': 'vende',
  '/equipamiento': 'equipamiento',
  '/maletas-y-accesorios': 'equipamiento',
  '/contacto': 'contacto',
  '/aviso-legal': 'aviso-legal',
  '/politica-privacidad': 'politica-privacidad',
  '/terminos-y-condiciones': 'terminos-y-condiciones',
  '/politica-de-cookies': 'cookies',
  '/cookies': 'cookies',
};

export { toSlug, slugToCity, cityToSlug };

export const STYLE_MAP_TO_SLUG: Record<string, string> = {
  'SCOOTER': 'scooters',
  'TRAIL': 'trail',
  'NAKED': 'naked',
  'DEPORTIVA': 'deportivas',
  'SUPERMOTARD': 'supermotard',
  'CUSTOM': 'custom',
  'TOURING': 'touring',
  'TRES RUEDAS': 'tres-ruedas',
  'MAXI SCOOTER': 'maxi-scooters',
  'CLÁSICA': 'clasicas',
  'OFF-ROAD': 'off-road'
};

export const SLUG_MAP_TO_STYLE: Record<string, string> = {
  'scooters': 'SCOOTER',
  'scooter': 'SCOOTER',
  'trail': 'TRAIL',
  'naked': 'NAKED',
  'deportivas': 'DEPORTIVA',
  'deportiva': 'DEPORTIVA',
  'supermotard': 'SUPERMOTARD',
  'custom': 'CUSTOM',
  'touring': 'TOURING',
  'tres-ruedas': 'TRES RUEDAS',
  'maxi-scooters': 'MAXI SCOOTER',
  'maxi-scooter': 'MAXI SCOOTER',
  'clasicas': 'CLÁSICA',
  'clasica': 'CLÁSICA',
  'off-road': 'OFF-ROAD'
};

// Helper to find bike by id or slug (exact id match prioritized)
export const findBikeInSource = (source: MotorbikeExtended[], rawId: string): MotorbikeExtended | undefined => {
  if (!rawId) return undefined;
  const target = rawId.toLowerCase();
  const exactById = source.find(b => b.id.toLowerCase() === target);
  if (exactById) return exactById;
  return source.find(b => 
    (b.slug && b.slug.toLowerCase() === target) || 
    toSlug(`${b.brand} ${b.model}`) === target ||
    toSlug(b.id) === target
  );
};

export interface ParsedUrlState {
  activePage: 'home' | 'compra' | 'moto' | 'moto-images' | 'moto-finance' | 'acerca-de' | 'financiacion' | 'preguntas-frecuentes' | 'blog' | 'favorites' | 'vende' | 'equipamiento' | 'contacto' | 'aviso-legal' | 'politica-privacidad' | 'terminos-y-condiciones' | 'cookies' | 'tramites-documentales' | 'seguros' | 'localizador' | 'mantenimiento' | 'transporte';
  selectedDetailedBike: MotorbikeExtended | null;
  selectedBlogPostId: string | null;
  selectedCiudades: string[];
  selectedStyles: string[];
  selectedBrand: string;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  isKm0: boolean;
  isOffersOnly: boolean;
  cilindradaDesde: number;
  cilindradaHasta: number;
  precioDesde: number;
  precioHasta: number;
  kmsDesde: number;
  kmsHasta: number;
  añoDesde: number;
  añoHasta: number;
  currentPage: number;
  searchQuery: string;
}

export function parseUrlToState(
  currentPath: string, 
  currentSearch: string, 
  bikesSource: MotorbikeExtended[] = motorbikesData
): ParsedUrlState {
  let activePage: any = 'home';
  let selectedDetailedBike: MotorbikeExtended | null = null;
  let selectedBlogPostId: string | null = null;
  let selectedCiudades: string[] = [];
  let selectedStyles: string[] = [];
  let selectedBrand = 'all';
  let selectedCondition: 'all' | 'ocasión' | 'nueva' = 'all';
  let isKm0 = false;
  let isOffersOnly = false;
  let cilindradaDesde = 0;
  let cilindradaHasta = 1200;
  let precioDesde = 0;
  let precioHasta = 25000;
  let kmsDesde = 0;
  let kmsHasta = 100000;
  let añoDesde = 1995;
  let añoHasta = 2026;
  let currentPage = 1;
  let searchQuery = '';

  const blogPostMatch = currentPath.match(/^\/blog\/([^/]+)$/);
  const isBlogHome = currentPath === '/blog';

  if (blogPostMatch) {
    selectedBlogPostId = decodeURIComponent(blogPostMatch[1]);
    activePage = 'blog';
  } else if (isBlogHome) {
    selectedBlogPostId = null;
    activePage = 'blog';
  } else {
    const detailSubMatch = currentPath.match(/^\/moto\/([^/]+)\/(finance|pack|images)$/);
    const motoPathMatch = currentPath.match(/^\/moto\/([^/]+)$/);

    const isCompraPath = currentPath === '/motos' || currentPath.startsWith('/motos/');
    const isVendePath = currentPath === '/vender-mi-moto';

    if (detailSubMatch) {
      const bikeId = decodeURIComponent(detailSubMatch[1]);
      const sub = detailSubMatch[2];
      selectedDetailedBike = findBikeInSource(bikesSource, bikeId) || null;
      if (sub === 'images') {
        activePage = 'moto-images';
      } else {
        activePage = 'moto-finance';
      }
    } else if (motoPathMatch) {
      const bikeId = decodeURIComponent(motoPathMatch[1]);
      selectedDetailedBike = findBikeInSource(bikesSource, bikeId) || null;
      activePage = 'moto';
    } else if (isVendePath) {
      activePage = 'vende';
    } else if (isCompraPath) {
      activePage = 'compra';

      const prefix = '/motos';
      const subPath = currentPath.substring(prefix.length);
      const segments = subPath.split('/').filter(Boolean);

      let cityVal: string | null = null;
      let styleVal: string | null = null;

      const STYLE_NAMES_LOWER = ['scooter', 'scooters', 'naked', 'deportiva', 'deportivas', 'trail', 'touring', 'custom', 'clasica', 'clasicas', 'off-road', 'supermotard', 'tres-ruedas', 'maxi-scooters', 'maxi-scooter'];

      if (segments.length === 1) {
        const segLower = segments[0].toLowerCase();
        if (STYLE_NAMES_LOWER.includes(segLower)) {
          styleVal = SLUG_MAP_TO_STYLE[segLower] || segLower.toUpperCase();
        } else {
          cityVal = slugToCity(segments[0]);
        }
      } else if (segments.length >= 2) {
        cityVal = slugToCity(segments[0]);
        const styleSeg = segments[1].toLowerCase();
        styleVal = SLUG_MAP_TO_STYLE[styleSeg] || styleSeg.toUpperCase();
      }

      if (cityVal) selectedCiudades = [cityVal];
      if (styleVal) selectedStyles = [styleVal];

      const params = new URLSearchParams(currentSearch);

      const condParam = params.get('condicion') || params.get('condition');
      if (condParam) {
        const cLower = condParam.toLowerCase();
        if (cLower === 'nueva' || cLower === 'nuevo' || cLower === 'new') {
          selectedCondition = 'nueva';
        } else {
          selectedCondition = 'ocasión';
        }
      }

      const brandParam = params.get('marca') || params.get('brand');
      if (brandParam) {
        const matched = matchBrandFromSlug(brandParam, motorbikesData);
        if (matched) {
          selectedBrand = matched;
        } else {
          selectedBrand = brandParam.charAt(0).toUpperCase() + brandParam.slice(1);
        }
      }

      isKm0 = params.get('km0') === 'true' || params.get('is_km0') === 'true';
      isOffersOnly = params.get('ofertas-solo') === 'true' || params.get('is_offer') === 'true';

      const ccMinParam = params.get('cilindrada-desde') || params.get('cc_min');
      if (ccMinParam) cilindradaDesde = parseInt(ccMinParam.replace(/[^0-9]/g, '')) || 0;
      const ccMaxParam = params.get('cilindrada-hasta') || params.get('cc_max');
      if (ccMaxParam) cilindradaHasta = parseInt(ccMaxParam.replace(/[^0-9]/g, '')) || 1200;

      const priceMinParam = params.get('precio-desde') || params.get('price_min');
      if (priceMinParam) precioDesde = parseInt(priceMinParam.replace(/[^0-9]/g, '')) || 0;
      const priceMaxParam = params.get('precio-hasta') || params.get('price_max');
      if (priceMaxParam) precioHasta = parseInt(priceMaxParam.replace(/[^0-9]/g, '')) || 25000;

      const kmsMinParam = params.get('kms-desde') || params.get('kms_min');
      if (kmsMinParam) kmsDesde = parseInt(kmsMinParam.replace(/[^0-9]/g, '')) || 0;
      const kmsMaxParam = params.get('kms-hasta') || params.get('kms_max');
      if (kmsMaxParam) kmsHasta = parseInt(kmsMaxParam.replace(/[^0-9]/g, '')) || 100000;

      const yearMinParam = params.get('ano-desde') || params.get('year_min');
      if (yearMinParam) añoDesde = parseInt(yearMinParam) || 1995;
      const yearMaxParam = params.get('ano-hasta') || params.get('year_max');
      if (yearMaxParam) añoHasta = parseInt(yearMaxParam) || 2026;

      const storesParam = params.get('stores');
      if (storesParam && !cityVal) selectedCiudades = storesParam.split(',');

      const motorbikeTypeParam = params.get('motorbike_type');
      if (motorbikeTypeParam && !styleVal) selectedStyles = motorbikeTypeParam.split(',');

      const pageParam = params.get('page');
      if (pageParam) currentPage = parseInt(pageParam) || 1;

      const qParam = params.get('q') || params.get('search') || params.get('query') || params.get('buscar');
      if (qParam) searchQuery = qParam;
    } else {
      activePage = REVERSE_PATH_MAP[currentPath] || 'home';
    }
  }

  // Also check query param q on general pages if present
  const generalParams = new URLSearchParams(currentSearch);
  const generalQ = generalParams.get('q') || generalParams.get('search') || generalParams.get('query') || generalParams.get('buscar');
  if (generalQ) searchQuery = generalQ;

  return {
    activePage,
    selectedDetailedBike,
    selectedBlogPostId,
    selectedCiudades,
    selectedStyles,
    selectedBrand,
    selectedCondition,
    isKm0,
    isOffersOnly,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    currentPage,
    searchQuery,
  };
}

export interface UseUrlSyncProps {
  motorbikesList?: MotorbikeExtended[];
  activePage: string;
  setActivePage: (page: any) => void;
  selectedDetailedBike: MotorbikeExtended | null;
  setSelectedDetailedBike: (bike: MotorbikeExtended | null) => void;
  selectedBlogPostId: string | null;
  setSelectedBlogPostId: (id: string | null) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCondition: 'all' | 'ocasión' | 'nueva';
  setSelectedCondition: (cond: 'all' | 'ocasión' | 'nueva') => void;
  isKm0: boolean;
  setIsKm0: (km0: boolean) => void;
  isOffersOnly: boolean;
  setIsOffersOnly: (offers: boolean) => void;
  cuotaDesde?: number;
  setCuotaDesde?: (cuota: number) => void;
  cuotaHasta?: number;
  setCuotaHasta?: (cuota: number) => void;
  cilindradaDesde: number;
  setCilindradaDesde: (cc: number) => void;
  cilindradaHasta: number;
  setCilindradaHasta: (cc: number) => void;
  precioDesde: number;
  setPrecioDesde: (price: number) => void;
  precioHasta: number;
  setPrecioHasta: (price: number) => void;
  selectedStyles: string[];
  setSelectedStyles: (styles: string[]) => void;
  kmsDesde: number;
  setKmsDesde: (kms: number) => void;
  kmsHasta: number;
  setKmsHasta: (kms: number) => void;
  añoDesde: number;
  setAñoDesde: (yr: number) => void;
  añoHasta: number;
  setAñoHasta: (yr: number) => void;
  selectedCiudades: string[];
  setSelectedCiudades: (cities: string[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function useUrlSync({
  motorbikesList,
  activePage,
  setActivePage,
  selectedDetailedBike,
  setSelectedDetailedBike,
  selectedBlogPostId,
  setSelectedBlogPostId,
  selectedBrand,
  setSelectedBrand,
  selectedCondition,
  setSelectedCondition,
  isKm0,
  setIsKm0,
  isOffersOnly,
  setIsOffersOnly,
  cuotaDesde,
  setCuotaDesde,
  cuotaHasta,
  setCuotaHasta,
  cilindradaDesde,
  setCilindradaDesde,
  cilindradaHasta,
  setCilindradaHasta,
  precioDesde,
  setPrecioDesde,
  precioHasta,
  setPrecioHasta,
  selectedStyles,
  setSelectedStyles,
  kmsDesde,
  setKmsDesde,
  kmsHasta,
  setKmsHasta,
  añoDesde,
  setAñoDesde,
  añoHasta,
  setAñoHasta,
  selectedCiudades,
  setSelectedCiudades,
  currentPage,
  setCurrentPage,
  searchQuery = '',
  setSearchQuery,
}: UseUrlSyncProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Expose React Router navigate helper globally for utility functions
  useEffect(() => {
    (window as any).__reactNavigate = navigate;
  }, [navigate]);

  const isSyncingFromUrlRef = useRef(false);

  // Synchronize URL path and query parameters to state whenever location changes
  useEffect(() => {
    isSyncingFromUrlRef.current = true;

    const applyUrlToState = (currentPath: string, currentSearch: string) => {
      const bikesSource = (motorbikesList && motorbikesList.length > 0) ? motorbikesList : motorbikesData;
      const parsed = parseUrlToState(currentPath, currentSearch, bikesSource);

      setActivePage(parsed.activePage);
      if (parsed.selectedDetailedBike) {
        setSelectedDetailedBike(parsed.selectedDetailedBike);
      }
      setSelectedBlogPostId(parsed.selectedBlogPostId);

      if (parsed.selectedCiudades) setSelectedCiudades(parsed.selectedCiudades);
      if (parsed.selectedStyles) setSelectedStyles(parsed.selectedStyles);
      if (parsed.selectedBrand) setSelectedBrand(parsed.selectedBrand);
      if (parsed.selectedCondition) setSelectedCondition(parsed.selectedCondition);
      setIsKm0(parsed.isKm0);
      setIsOffersOnly(parsed.isOffersOnly);
      setCilindradaDesde(parsed.cilindradaDesde);
      setCilindradaHasta(parsed.cilindradaHasta);
      setPrecioDesde(parsed.precioDesde);
      setPrecioHasta(parsed.precioHasta);
      if (setCuotaDesde && (parsed as any).cuotaDesde !== undefined) setCuotaDesde((parsed as any).cuotaDesde);
      if (setCuotaHasta && (parsed as any).cuotaHasta !== undefined) setCuotaHasta((parsed as any).cuotaHasta);
      setKmsDesde(parsed.kmsDesde);
      setKmsHasta(parsed.kmsHasta);
      setAñoDesde(parsed.añoDesde);
      setAñoHasta(parsed.añoHasta);
      setCurrentPage(parsed.currentPage);
      if (setSearchQuery) {
        setSearchQuery(parsed.searchQuery || '');
      }
    };

    // Run parsing when location changes
    applyUrlToState(location.pathname, location.search);

    const handlePopState = () => {
      isSyncingFromUrlRef.current = true;
      applyUrlToState(window.location.pathname, window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, location.search]);

  // Update URL history when page or filters change
  useEffect(() => {
    // Skip updating URL if we just parsed state from URL
    if (isSyncingFromUrlRef.current) {
      isSyncingFromUrlRef.current = false;
      return;
    }
    const queryParams = new URLSearchParams();
    let targetPath = '/';
    if (activePage === 'moto') {
      const bikeId = selectedDetailedBike?.id || 'harley-heritage-classic';
      targetPath = `/moto/${bikeId}`;
    } else if (activePage === 'moto-images') {
      const bikeId = selectedDetailedBike?.id || 'harley-heritage-classic';
      targetPath = `/moto/${bikeId}/images`;
    } else if (activePage === 'moto-finance') {
      const bikeId = selectedDetailedBike?.id || 'harley-heritage-classic';
      const isPack = window.location.pathname.endsWith('/pack');
      targetPath = `/moto/${bikeId}/${isPack ? 'pack' : 'finance'}`;
      const currentParams = new URLSearchParams(window.location.search);
      const entrance = currentParams.get('entrance');
      const term = currentParams.get('term');
      if (entrance) queryParams.set('entrance', entrance);
      if (term) queryParams.set('term', term);
    } else if (activePage === 'compra') {
      targetPath = '/motos';
      if (selectedCiudades.length > 0) {
        targetPath += `/${cityToSlug(selectedCiudades[0])}`;
      }
      if (selectedStyles.length > 0) {
        const styleSlug = STYLE_MAP_TO_SLUG[selectedStyles[0].toUpperCase()] || toSlug(selectedStyles[0]);
        targetPath += `/${styleSlug}`;
      }
    } else if (activePage === 'blog') {
      targetPath = selectedBlogPostId ? `/blog/${selectedBlogPostId}` : '/blog';
    } else {
      targetPath = PATH_MAP[activePage as any] || '/';
    }

    if (activePage === 'compra') {
      if (selectedCondition !== 'all') {
        queryParams.set('condicion', selectedCondition === 'nueva' ? 'nuevo' : 'ocasion');
      }
      if (isKm0) queryParams.set('km0', 'true');
      if (isOffersOnly) queryParams.set('ofertas-solo', 'true');
      if (cilindradaDesde > 0) queryParams.set('cilindrada-desde', `${cilindradaDesde}cc`);
      if (cilindradaHasta < 1200) queryParams.set('cilindrada-hasta', `${cilindradaHasta}cc`);
      if (precioDesde > 0) queryParams.set('precio-desde', precioDesde.toString());
      if (precioHasta < 25000) queryParams.set('precio-hasta', precioHasta.toString());
      if (kmsDesde > 0) queryParams.set('kms-desde', kmsDesde.toString());
      if (kmsHasta < 100000) queryParams.set('kms-hasta', kmsHasta.toString());
      if (añoDesde > 1995) queryParams.set('ano-desde', añoDesde.toString());
      if (añoHasta < 2026) queryParams.set('ano-hasta', añoHasta.toString());
      if (currentPage > 1) queryParams.set('page', currentPage.toString());

      if (selectedBrand !== 'all') {
        queryParams.set('marca', toSlug(selectedBrand));
      }
      if (searchQuery && searchQuery.trim() !== '') {
        queryParams.set('q', searchQuery.trim());
      }
    }

    const qStr = queryParams.toString();
    const fullTarget = targetPath + (qStr ? `?${qStr}` : '');

    if (location.pathname + location.search !== fullTarget) {
      if (location.pathname !== targetPath) {
        navigate(fullTarget, { replace: false });
      } else {
        navigate(fullTarget, { replace: true });
      }
    }

  }, [
    activePage,
    selectedCondition,
    isKm0,
    isOffersOnly,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    selectedBrand,
    selectedCiudades,
    selectedStyles,
    currentPage,
    searchQuery,
    selectedDetailedBike,
    selectedBlogPostId
  ]);

  const getFilterUrl = (
    updates: {
      brand?: string;
      condition?: string;
      km0?: boolean;
      offersOnly?: boolean;
      ccDesde?: number;
      ccHasta?: number;
      priceDesde?: number;
      priceHasta?: number;
      styleRemoved?: string;
      styleAdded?: string;
      styleToggle?: string;
      cityRemoved?: string;
      cityAdded?: string;
      cityToggle?: string;
      q?: string;
      kmsDesde?: number;
      kmsHasta?: number;
      añoDesde?: number;
      añoHasta?: number;
    } = {}
  ) => {
    let brand = selectedBrand;
    if (updates.brand !== undefined) brand = updates.brand;

    let qSearch = searchQuery;
    if (updates.q !== undefined) qSearch = updates.q;

    let styles = [...selectedStyles];
    if (updates.styleRemoved !== undefined) {
      styles = styles.filter(s => s !== updates.styleRemoved);
    }
    if (updates.styleAdded !== undefined) {
      if (!styles.includes(updates.styleAdded)) styles.push(updates.styleAdded);
    }
    if (updates.styleToggle !== undefined) {
      if (styles.includes(updates.styleToggle)) {
        styles = styles.filter(s => s !== updates.styleToggle);
      } else {
        styles.push(updates.styleToggle);
      }
    }

    let cities = [...selectedCiudades];
    if (updates.cityRemoved !== undefined) {
      cities = cities.filter(c => c !== updates.cityRemoved);
    }
    if (updates.cityAdded !== undefined) {
      if (!cities.includes(updates.cityAdded)) cities.push(updates.cityAdded);
    }
    if (updates.cityToggle !== undefined) {
      if (cities.includes(updates.cityToggle)) {
        cities = cities.filter(c => c !== updates.cityToggle);
      } else {
        cities.push(updates.cityToggle);
      }
    }

    let cond = selectedCondition;
    if (updates.condition !== undefined) cond = updates.condition as any;

    let km0 = isKm0;
    if (updates.km0 !== undefined) km0 = updates.km0;

    let offer = isOffersOnly;
    if (updates.offersOnly !== undefined) offer = updates.offersOnly;

    let ccMin = cilindradaDesde;
    if (updates.ccDesde !== undefined) ccMin = updates.ccDesde;
    let ccMax = cilindradaHasta;
    if (updates.ccHasta !== undefined) ccMax = updates.ccHasta;

    let pMin = precioDesde;
    if (updates.priceDesde !== undefined) pMin = updates.priceDesde;
    let pMax = precioHasta;
    if (updates.priceHasta !== undefined) pMax = updates.priceHasta;

    let kMin = kmsDesde;
    if (updates.kmsDesde !== undefined) kMin = updates.kmsDesde;
    let kMax = kmsHasta;
    if (updates.kmsHasta !== undefined) kMax = updates.kmsHasta;

    let yMin = añoDesde;
    if (updates.añoDesde !== undefined) yMin = updates.añoDesde;
    let yMax = añoHasta;
    if (updates.añoHasta !== undefined) yMax = updates.añoHasta;

    let path = '/motos';
    if (cities.length > 0) {
      path += `/${cityToSlug(cities[0])}`;
    }
    if (styles.length > 0) {
      const styleSlug = STYLE_MAP_TO_SLUG[styles[0].toUpperCase()] || toSlug(styles[0]);
      path += `/${styleSlug}`;
    }

    const params = new URLSearchParams();
    if (cond !== 'all') {
      params.set('condicion', cond === 'nueva' ? 'nuevo' : 'ocasion');
    }
    if (km0) {
      params.set('km0', 'true');
    }
    if (offer) {
      params.set('ofertas-solo', 'true');
    }
    if (ccMin > 0) {
      params.set('cilindrada-desde', `${ccMin}cc`);
    }
    if (ccMax < 1200) {
      params.set('cilindrada-hasta', `${ccMax}cc`);
    }
    if (pMin > 0) {
      params.set('precio-desde', pMin.toString());
    }
    if (pMax < 25000) {
      params.set('precio-hasta', pMax.toString());
    }
    if (kMin > 0) {
      params.set('kms-desde', kMin.toString());
    }
    if (kMax < 100000) {
      params.set('kms-hasta', kMax.toString());
    }
    if (yMin > 1995) {
      params.set('ano-desde', yMin.toString());
    }
    if (yMax < 2026) {
      params.set('ano-hasta', yMax.toString());
    }
    if (brand !== 'all') {
      params.set('marca', toSlug(brand));
    }
    if (qSearch && qSearch.trim() !== '') {
      params.set('q', qSearch.trim());
    }

    const qStr = params.toString();
    return path + (qStr ? `?${qStr}` : '');
  };

  return { getFilterUrl };
}
