import { useState, useEffect, useMemo } from 'react';
import { motorbikesData } from '../data/motorbikesData';
import { useFuseSearch } from './useFuseSearch';
import { getBrandFilterOptions } from '../data/brands';

export const sortOptions = [
  { id: 'recomendadas', label: 'Recomendadas (Destacadas)' },
  { id: 'precio-bajo-alto', label: 'Menor precio' },
  { id: 'precio-alto-bajo', label: 'Mayor precio' },
  { id: 'kms-bajo-alto', label: 'Menor kilometraje' },
  { id: 'nuevas', label: 'Año más reciente' },
  { id: 'anuncio-nuevo', label: 'Anuncio más reciente' },
  { id: 'mayor-oferta', label: 'Con mayor oferta' }
];

export function getBikeDisplacement(bike: any): number {
  const modelLower = bike.model.toLowerCase();
  if (modelLower.includes('1250')) return 1250;
  if (modelLower.includes('125')) return 125;
  if (modelLower.includes('390')) return 390;
  if (modelLower.includes('560')) return 560;
  if (modelLower.includes('937')) return 937;
  if (modelLower.includes('900')) return 900;
  if (modelLower.includes('03')) return 321; // MT-03 is 321cc
  return 125; // fallback
}

export function getBikeCity(bike: any): string {
  const hash = bike.id.charCodeAt(0) + (bike.id.charCodeAt(bike.id.length - 1) || 0);
  if (hash % 4 === 0) return 'Lima - Surco';
  if (hash % 4 === 1) return 'Lima - Los Olivos';
  if (hash % 4 === 2) return 'Arequipa';
  return 'Trujillo';
}

interface UseBikeFiltersOptions {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  setActiveBottomSheet?: (sheet: any) => void;
  bikesList?: any[];
  initialFilters?: Partial<{
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
    selectedStyles: string[];
    selectedCiudades: string[];
    currentPage: number;
  }>;
}

export function useBikeFilters(options: UseBikeFiltersOptions = {}) {
  const { searchQuery = '', setSearchQuery, setActiveBottomSheet, bikesList, initialFilters } = options;
  const bikesSource = (bikesList && bikesList.length > 0) ? bikesList : motorbikesData;

  // High-fidelity filter states
  const [selectedBrand, setSelectedBrand] = useState<string>(initialFilters?.selectedBrand ?? 'all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'ocasión' | 'nueva'>(initialFilters?.selectedCondition ?? 'all');
  const [isKm0, setIsKm0] = useState<boolean>(initialFilters?.isKm0 ?? false);
  const [isOffersOnly, setIsOffersOnly] = useState<boolean>(initialFilters?.isOffersOnly ?? false);
  const [innerSearchQuery, setInnerSearchQuery] = useState<string>(searchQuery);

  // Keep innerSearchQuery in sync with searchQuery when header search updates
  useEffect(() => {
    setInnerSearchQuery(searchQuery);
  }, [searchQuery]);

  // Wrapper function to update both innerSearchQuery and header searchQuery simultaneously
  const handleSetInnerSearchQuery = (query: string) => {
    setInnerSearchQuery(query);
    if (setSearchQuery) {
      setSearchQuery(query);
    }
  };
  const [selectedSort, setSelectedSort] = useState<string>('recomendadas');
  const [sessionSeed] = useState<number>(() => Math.floor(Math.random() * 100000) + 1);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(initialFilters?.currentPage ?? 1);

  // New detailed filters states
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    Cilindrada: false,
    Precio: false,
    Estilo: false,
    Kilometraje: false,
    Año: false,
    Ciudad: false,
  });

  const [cilindradaDesde, setCilindradaDesde] = useState<number>(initialFilters?.cilindradaDesde ?? 0);
  const [cilindradaHasta, setCilindradaHasta] = useState<number>(initialFilters?.cilindradaHasta ?? 1200); // 1200 represents 'Más de 900 CC'
  const [precioDesde, setPrecioDesde] = useState<number>(initialFilters?.precioDesde ?? 0);
  const [precioHasta, setPrecioHasta] = useState<number>(initialFilters?.precioHasta ?? 25000); // 25000 represents 'Más de S/. 25,000'
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialFilters?.selectedStyles ?? []);
  const [kmsDesde, setKmsDesde] = useState<number>(initialFilters?.kmsDesde ?? 0);
  const [kmsHasta, setKmsHasta] = useState<number>(initialFilters?.kmsHasta ?? 100000); // 100000 represents 'Más de 40.000 KM'
  const [añoDesde, setAñoDesde] = useState<number>(initialFilters?.añoDesde ?? 1995);
  const [añoHasta, setAñoHasta] = useState<number>(initialFilters?.añoHasta ?? 2026);
  const [selectedCiudades, setSelectedCiudades] = useState<string[]>(initialFilters?.selectedCiudades ?? []);

  // Reset pagination to page 1 when filters or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedBrand,
    selectedCondition,
    isKm0,
    isOffersOnly,
    innerSearchQuery,
    selectedSort,
    cilindradaDesde,
    cilindradaHasta,
    precioDesde,
    precioHasta,
    selectedStyles.length,
    kmsDesde,
    kmsHasta,
    añoDesde,
    añoHasta,
    selectedCiudades.length
  ]);

  const clearFilters = () => {
    setSelectedBrand('all');
    setSelectedCondition('all');
    setIsKm0(false);
    setIsOffersOnly(false);
    setInnerSearchQuery('');
    if (setSearchQuery) setSearchQuery('');
    setSelectedSort('recomendadas');

    // Clear detailed filters too
    setCilindradaDesde(0);
    setCilindradaHasta(1200);
    setPrecioDesde(0);
    setPrecioHasta(25000);
    setSelectedStyles([]);
    setKmsDesde(0);
    setKmsHasta(100000);
    setAñoDesde(1995);
    setAñoHasta(2026);
    setSelectedCiudades([]);
  };

  const hasActiveFilters = 
    selectedBrand !== 'all' ||
    selectedCondition !== 'all' ||
    isKm0 ||
    isOffersOnly ||
    cilindradaDesde > 0 ||
    cilindradaHasta < 1200 ||
    precioDesde > 0 ||
    precioHasta < 25000 ||
    selectedStyles.length > 0 ||
    kmsDesde > 0 ||
    kmsHasta < 100000 ||
    añoDesde > 1995 ||
    añoHasta < 2026 ||
    selectedCiudades.length > 0 ||
    innerSearchQuery.trim() !== '' ||
    searchQuery.trim() !== '';

  // Preparar ítems enriquecidos para la búsqueda completa con Fuse.js
  const searchableMotorbikes = useMemo(() => {
    return bikesSource.map((bike) => {
      const disp = getBikeDisplacement(bike);
      const city = getBikeCity(bike);
      const cond = bike.condition || (bike.kms === 0 ? 'nueva km0' : 'ocasión segunda mano');
      const fullSearchText = [
        bike.brand,
        bike.model,
        bike.version || '',
        bike.category,
        cond,
        `${bike.year}`,
        `${disp}cc`,
        city,
        bike.badge || '',
        bike.fuel || '',
        `S/. ${bike.price}`,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        ...bike,
        fullSearchText,
        cityName: city,
        displacementCc: `${disp}cc`,
      };
    });
  }, [bikesSource]);

  // Fuse.js search setup for Header (searchQuery)
  const bikeSearchKeys = useMemo(
    () => [
      { name: 'fullSearchText', weight: 0.4 },
      { name: 'brand', weight: 0.25 },
      { name: 'model', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'cityName', weight: 0.05 },
    ],
    []
  );

  const headerSearchResults = useFuseSearch({
    data: searchableMotorbikes,
    query: searchQuery,
    keys: bikeSearchKeys,
    threshold: 0.35,
  });

  const headerSearchMatchingIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return new Set(headerSearchResults.map((bike) => bike.id));
  }, [searchQuery, headerSearchResults]);

  // Fuse.js search setup for Catalog inner search (innerSearchQuery)
  const innerSearchResults = useFuseSearch({
    data: searchableMotorbikes,
    query: innerSearchQuery,
    keys: bikeSearchKeys,
    threshold: 0.35,
  });

  const innerSearchMatchingIds = useMemo(() => {
    if (!innerSearchQuery.trim()) return null;
    return new Set(innerSearchResults.map((bike) => bike.id));
  }, [innerSearchQuery, innerSearchResults]);

  // High-fidelity filter & sort logic
  const filteredBikes = bikesSource.filter((bike) => {
    // Brand filter
    if (selectedBrand !== 'all' && bike.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }

    // Condition filter (single source of truth: bike.condition)
    if (selectedCondition !== 'all') {
      const bikeCond = (bike.condition || (bike.kms === 0 ? 'nueva' : 'ocasión')).toLowerCase();
      if (selectedCondition === 'ocasión') {
        if (!bikeCond.includes('ocasion') && !bikeCond.includes('ocasión') && bikeCond !== 'segunda mano') {
          return false;
        }
      } else if (selectedCondition === 'nueva') {
        if (!bikeCond.includes('nueva')) {
          return false;
        }
      }
    }

    // Km 0 filter
    if (isKm0 && bike.kms > 0) {
      return false;
    }

    // Offers filter
    if (isOffersOnly && !bike.hasOffer) {
      return false;
    }

    // Cilindrada filter
    const disp = getBikeDisplacement(bike);
    if (disp < cilindradaDesde) {
      return false;
    }
    if (cilindradaHasta < 1200 && disp > cilindradaHasta) {
      return false;
    }

    // Precio filter
    if (bike.price < precioDesde) {
      return false;
    }
    if (precioHasta < 25000 && bike.price > precioHasta) {
      return false;
    }

    // Estilo filter
    if (selectedStyles.length > 0) {
      if (!selectedStyles.includes(bike.category.toUpperCase())) {
        return false;
      }
    }

    // Kilometraje filter
    if (bike.kms < kmsDesde) {
      return false;
    }
    if (kmsHasta < 100000 && bike.kms > kmsHasta) {
      return false;
    }

    // Año filter
    if (bike.year < añoDesde || bike.year > añoHasta) {
      return false;
    }

    // Ciudad filter
    if (selectedCiudades.length > 0) {
      const city = getBikeCity(bike);
      if (!selectedCiudades.includes(city)) {
        return false;
      }
    }

    // Search query filters (matches brand, model, category via Fuse.js)
    if (innerSearchMatchingIds && !innerSearchMatchingIds.has(bike.id)) {
      return false;
    }

    if (headerSearchMatchingIds && !headerSearchMatchingIds.has(bike.id)) {
      return false;
    }

    return true;
  });

  const sortedBikes = [...filteredBikes].sort((a, b) => {
    if (selectedSort === 'recomendadas') {
      // Automatic dynamic random mix of new & used bikes per session
      const hashA = ((a.id || '').split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), sessionSeed)) % 1000007;
      const hashB = ((b.id || '').split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), sessionSeed)) % 1000007;
      return hashA - hashB;
    }
    if (selectedSort === 'precio-bajo-alto') {
      return a.price - b.price;
    }
    if (selectedSort === 'precio-alto-bajo') {
      return b.price - a.price;
    }
    if (selectedSort === 'kms-bajo-alto') {
      return a.kms - b.kms;
    }
    if (selectedSort === 'nuevas') {
      return b.year - a.year;
    }
    if (selectedSort === 'anuncio-nuevo') {
      return b.id.localeCompare(a.id);
    }
    if (selectedSort === 'mayor-oferta') {
      const bOffer = b.hasOffer ? 1 : 0;
      const aOffer = a.hasOffer ? 1 : 0;
      if (bOffer !== aOffer) return bOffer - aOffer;
      
      const bDiscount = (b.oldPrice || b.price) - b.price;
      const aDiscount = (a.oldPrice || a.price) - a.price;
      return bDiscount - aDiscount;
    }
    return 0;
  });

  const openBottomSheet = (type: string) => {
    if (!setActiveBottomSheet) return;
    if (type === 'sort') {
      setActiveBottomSheet({
        type,
        title: '',
        selectedValue: selectedSort,
        onSelect: (val: any) => setSelectedSort(val),
        options: sortOptions.map(opt => ({ value: opt.id, label: opt.label }))
      });
    } else if (type === 'brand') {
      setActiveBottomSheet({
        type,
        title: '',
        showSearch: true,
        searchPlaceholder: 'Filtra...',
        selectedValue: selectedBrand,
        onSelect: (val: any) => setSelectedBrand(val),
        options: getBrandFilterOptions(bikesSource)
      });
    } else if (type === 'cilindradaDesde') {
      setActiveBottomSheet({
        type,
        selectedValue: cilindradaDesde,
        onSelect: (val: any) => setCilindradaDesde(Number(val)),
        options: [
          { value: 0, label: '0 CC' },
          { value: 50, label: '50 CC' },
          { value: 125, label: '125 CC' },
          { value: 150, label: '150 CC' },
          { value: 250, label: '250 CC' },
          { value: 500, label: '500 CC' },
          { value: 900, label: '900 CC' }
        ]
      });
    } else if (type === 'cilindradaHasta') {
      setActiveBottomSheet({
        type,
        selectedValue: cilindradaHasta,
        onSelect: (val: any) => setCilindradaHasta(Number(val)),
        options: [
          { value: 125, label: '125 CC' },
          { value: 250, label: '250 CC' },
          { value: 500, label: '500 CC' },
          { value: 750, label: '750 CC' },
          { value: 900, label: '900 CC' },
          { value: 1200, label: 'Más de 900 CC' }
        ]
      });
    } else if (type === 'precioDesde') {
      setActiveBottomSheet({
        type,
        selectedValue: precioDesde,
        onSelect: (val: any) => setPrecioDesde(Number(val)),
        options: [
          { value: 0, label: 'S/. 0.00' },
          { value: 1000, label: 'S/. 1,000.00' },
          { value: 2000, label: 'S/. 2,000.00' },
          { value: 3000, label: 'S/. 3,000.00' },
          { value: 5000, label: 'S/. 5,000.00' },
          { value: 8000, label: 'S/. 8,000.00' },
          { value: 10000, label: 'S/. 10,000.00' },
          { value: 12000, label: 'S/. 12,000.00' },
          { value: 15000, label: 'S/. 15,000.00' },
          { value: 18000, label: 'S/. 18,000.00' }
        ]
      });
    } else if (type === 'precioHasta') {
      setActiveBottomSheet({
        type,
        selectedValue: precioHasta,
        onSelect: (val: any) => setPrecioHasta(Number(val)),
        options: [
          { value: 2000, label: 'S/. 2,000.00' },
          { value: 3000, label: 'S/. 3,000.00' },
          { value: 5000, label: 'S/. 5,000.00' },
          { value: 8000, label: 'S/. 8,000.00' },
          { value: 10000, label: 'S/. 10,000.00' },
          { value: 12000, label: 'S/. 12,000.00' },
          { value: 15000, label: 'S/. 15,000.00' },
          { value: 18000, label: 'S/. 18,000.00' },
          { value: 25000, label: 'Más de S/. 18,000.00' }
        ]
      });
    } else if (type === 'kmsDesde') {
      setActiveBottomSheet({
        type,
        selectedValue: kmsDesde,
        onSelect: (val: any) => setKmsDesde(Number(val)),
        options: [
          { value: 0, label: '0 KM' },
          { value: 1000, label: '1.000 KM' },
          { value: 5000, label: '5.000 KM' },
          { value: 10000, label: '10.000 KM' },
          { value: 20000, label: '20.000 KM' },
          { value: 30000, label: '30.000 KM' },
          { value: 40000, label: '40.000 KM' }
        ]
      });
    } else if (type === 'kmsHasta') {
      setActiveBottomSheet({
        type,
        selectedValue: kmsHasta,
        onSelect: (val: any) => setKmsHasta(Number(val)),
        options: [
          { value: 5000, label: '5.000 KM' },
          { value: 10000, label: '10.000 KM' },
          { value: 20000, label: '20.000 KM' },
          { value: 30000, label: '30.000 KM' },
          { value: 40000, label: '40.000 KM' },
          { value: 100000, label: 'Más de 40.000 KM' }
        ]
      });
    } else if (type === 'añoDesde') {
      setActiveBottomSheet({
        type,
        selectedValue: añoDesde,
        onSelect: (val: any) => setAñoDesde(Number(val)),
        options: [
          { value: 1995, label: '1995' },
          { value: 2000, label: '2000' },
          { value: 2005, label: '2005' },
          { value: 2010, label: '2010' },
          { value: 2015, label: '2015' },
          { value: 2018, label: '2018' },
          { value: 2020, label: '2020' },
          { value: 2022, label: '2022' },
          { value: 2024, label: '2024' }
        ]
      });
    } else if (type === 'añoHasta') {
      setActiveBottomSheet({
        type,
        selectedValue: añoHasta,
        onSelect: (val: any) => setAñoHasta(Number(val)),
        options: [
          { value: 2000, label: '2000' },
          { value: 2005, label: '2005' },
          { value: 2010, label: '2010' },
          { value: 2015, label: '2015' },
          { value: 2018, label: '2018' },
          { value: 2020, label: '2020' },
          { value: 2022, label: '2022' },
          { value: 2024, label: '2024' },
          { value: 2026, label: '2026' }
        ]
      });
    }
  };

  return {
    selectedBrand,
    setSelectedBrand,
    selectedCondition,
    setSelectedCondition,
    isKm0,
    setIsKm0,
    isOffersOnly,
    setIsOffersOnly,
    innerSearchQuery,
    setInnerSearchQuery: handleSetInnerSearchQuery,
    selectedSort,
    setSelectedSort,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    currentPage,
    setCurrentPage,
    expandedFilters,
    setExpandedFilters,
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
    clearFilters,
    hasActiveFilters,
    filteredBikes,
    sortedBikes,
    openBottomSheet,
    getBikeDisplacement,
    getBikeCity,
  };
}
