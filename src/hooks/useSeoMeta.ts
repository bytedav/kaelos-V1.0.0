import { useEffect, useState } from 'react';
import { 
  updateHeadTags, 
  getOrganizationSchema, 
  getWebSiteSchema, 
  getLocalBusinessSchema,
  getMotorcycleProductSchema,
  getArticleSchema,
  getSpeakableSchema,
  formatTitle,
  buildCanonicalUrl
} from '../utils/seo';
import { SEOMetadata, BreadcrumbItem } from '../types/seo';
import { loadAllPagesFromCms, loadSettingsFromCms } from '../utils/cms';
import { loadAllBlogPostsFromContent } from '../data/staticContent';
import { PageContent, GeneralSettingsContent } from '../types/content';
import { toSlug, cityToSlug, STYLE_MAP_TO_SLUG } from './useUrlSync';

export interface UseSeoMetaOptions {
  activePage: string;
  selectedCondition: string;
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
  selectedBrand: string;
  selectedCiudades: string[];
  selectedStyles: string[];
  currentPage: number;
  selectedDetailedBike: any | null;
  selectedBlogPostId: string | null;
}

export function useSeoMeta(options: UseSeoMetaOptions) {
  const {
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
    selectedDetailedBike,
    selectedBlogPostId,
  } = options;

  const [dbPages, setDbPages] = useState<PageContent[]>([]);
  const [dbSettings, setDbSettings] = useState<GeneralSettingsContent | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadCmsSeo() {
      try {
        const [pages, settings] = await Promise.all([
          loadAllPagesFromCms(),
          loadSettingsFromCms(),
        ]);
        if (mounted) {
          if (pages) setDbPages(pages);
          if (settings) setDbSettings(settings);
        }
      } catch (err) {
        console.warn('Error loading CMS SEO:', err);
      }
    }
    loadCmsSeo();
    return () => { mounted = false; };
  }, []);

  const getPageTitle = () => {
    let styleText = 'Motos';
    if (selectedStyles && selectedStyles.length > 0) {
      const firstStyle = selectedStyles[0].toLowerCase();
      if (firstStyle === 'scooter' || firstStyle === 'scooters') {
        styleText = 'Scooters';
      } else if (firstStyle === 'naked') {
        styleText = 'Motos Naked';
      } else if (firstStyle === 'deportiva' || firstStyle === 'deportivas') {
        styleText = 'Motos Deportivas';
      } else if (firstStyle === 'trail') {
        styleText = 'Motos Trail';
      } else if (firstStyle === 'touring') {
        styleText = 'Motos Touring';
      } else if (firstStyle === 'custom') {
        styleText = 'Motos Custom';
      } else if (firstStyle === 'clasica' || firstStyle === 'clásica' || firstStyle === 'clasicas') {
        styleText = 'Motos Clásicas';
      } else if (firstStyle === 'off-road') {
        styleText = 'Motos Off-Road';
      } else {
        const capitalizedStyle = firstStyle.charAt(0).toUpperCase() + firstStyle.slice(1);
        styleText = `Motos ${capitalizedStyle}`;
      }
    }

    let brandText = '';
    if (selectedBrand && selectedBrand !== 'all') {
      brandText = ` ${selectedBrand.toUpperCase()}`;
    }

    let conditionText = '';
    if (isKm0) {
      conditionText = ' Km 0';
    } else if (selectedCondition === 'nueva') {
      conditionText = ' Nuevas';
    } else if (selectedCondition === 'ocasión' || selectedCondition === 'ocasion') {
      conditionText = ' de Segunda Mano con Garantía';
    }

    let cityText = '';
    if (selectedCiudades && selectedCiudades.length > 0) {
      const cleanCity = selectedCiudades[0].split('(')[0].trim();
      cityText = ` en ${cleanCity}`;
    }

    if (!brandText && !conditionText && !cityText && (!selectedStyles || selectedStyles.length === 0)) {
      return 'Motos de Segunda Mano con Garantía';
    }

    return `${styleText}${brandText}${conditionText}${cityText}`;
  };

  useEffect(() => {
    let rawTitle = '';
    let description = '';
    let canonical = `/${activePage === 'home' ? '' : activePage}`;
    let keywords: string[] = ['kaelos', 'motos', 'peru', 'comprar moto', 'financiación de motos'];
    let breadcrumbs: BreadcrumbItem[] = [{ name: 'Inicio', url: '/' }];
    let customSchemas: object[] = [];
    let ogImage = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200';

    switch (activePage) {
      case 'home':
        rawTitle = 'Kaelos | Encuentra tu próxima motocicleta';
        description = 'Kaelos es el mayor marketplace de motos en Perú. Compra tu moto de segunda mano u ocasión revisada en 100 puntos con 1 año de garantía total y financiación flexible.';
        keywords = ['kaelos', 'comprar moto', 'venta de motos', 'financiacion de motos', 'motos de ocasion', 'motos segunda mano', 'lima', 'arequipa', 'trujillo'];
        canonical = '/';
        break;

      case 'compra': {
        rawTitle = `${getPageTitle()} | KAELOS`;
        description = `Encuentra ${getPageTitle().toLowerCase()} garantizadas en Lima, Arequipa, Trujillo, Chiclayo y todo el Perú. Financiación rápida a tu medida y entrega a domicilio.`;
        keywords = ['motos segunda mano', 'motos de ocasion', 'comprar moto usada', 'motos garantizadas', 'motos baratas', 'motos lima', 'scooters ocasion'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Comprar Moto', url: '/motos' }];

        // Build dynamic canonical URL reflecting route segments and active filter state
        let catalogPath = '/motos';
        if (selectedCiudades && selectedCiudades.length > 0) {
          const citySlug = cityToSlug(selectedCiudades[0]);
          if (citySlug) catalogPath += `/${citySlug}`;
        }
        if (selectedStyles && selectedStyles.length > 0) {
          const styleUpper = selectedStyles[0].toUpperCase();
          const styleSlug = STYLE_MAP_TO_SLUG[styleUpper] || toSlug(selectedStyles[0]);
          if (styleSlug) catalogPath += `/${styleSlug}`;
        }

        const queryParams = new URLSearchParams();
        if (selectedBrand && selectedBrand !== 'all') {
          queryParams.set('marca', toSlug(selectedBrand));
        }
        if (selectedCondition && selectedCondition !== 'all') {
          queryParams.set('condicion', selectedCondition === 'nueva' ? 'nuevo' : 'ocasion');
        }
        if (isKm0) queryParams.set('km0', 'true');
        if (isOffersOnly) queryParams.set('ofertas-solo', 'true');

        if (cilindradaDesde > 0) queryParams.set('cilindrada-desde', `${cilindradaDesde}cc`);
        if (cilindradaHasta < 1200) queryParams.set('cilindrada-hasta', `${cilindradaHasta}cc`);

        if (precioDesde > 0) queryParams.set('precio-desde', `${precioDesde}`);
        if (precioHasta < 25000) queryParams.set('precio-hasta', `${precioHasta}`);

        if (kmsDesde > 0) queryParams.set('kms-desde', `${kmsDesde}`);
        if (kmsHasta < 100000) queryParams.set('kms-hasta', `${kmsHasta}`);

        if (añoDesde > 1995) queryParams.set('ano-desde', `${añoDesde}`);
        if (añoHasta < 2026) queryParams.set('ano-hasta', `${añoHasta}`);

        if (currentPage > 1) queryParams.set('page', `${currentPage}`);

        const queryString = queryParams.toString();
        canonical = catalogPath + (queryString ? `?${queryString}` : '');
        break;
      }

      case 'transporte':
        rawTitle = 'Transporte Especializado de Motos a Domicilio | KAELOS';
        description = 'Transportamos tu moto a cualquier punto del Perú con la mayor seguridad. Recogida y entrega a domicilio con camión acondicionado y seguro a todo riesgo.';
        keywords = ['transporte de motos', 'enviar moto', 'transportar moto peru', 'portes moto', 'recoger moto'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Financiación y Servicios', url: '/financiacion' }, { name: 'Transporte', url: '/transporte' }];
        canonical = '/transporte';
        break;

      case 'mantenimiento':
        rawTitle = 'Taller Oficial de Motos y Mantenimiento | KAELOS';
        description = 'Reserva tu cita en el taller oficial Kaelos. Revisiones periódicas, cambio de aceite, filtros, neumáticos y kit de transmisión con recambios de calidad y precio cerrado.';
        keywords = ['taller de motos', 'taller oficial kaelos', 'revision moto', 'cambio de aceite moto', 'neumaticos moto'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Financiación y Servicios', url: '/financiacion' }, { name: 'Mantenimiento', url: '/mantenimiento' }];
        canonical = '/mantenimiento';
        break;

      case 'tramites-documentales':
        rawTitle = 'Cambio de Nombre y Transferencia de Motos Online | KAELOS';
        description = 'Gestiona la transferencia de propiedad, cambio de nombre o matriculación de tu moto online. Justificante provisional inmediato y firma digital.';
        keywords = ['cambio de nombre moto', 'transferencia moto', 'gestoria trafico', 'papeles moto', 'transferir ciclomotor online'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Financiación y Servicios', url: '/financiacion' }, { name: 'Trámites', url: '/tramites-documentales' }];
        canonical = '/tramites-documentales';
        break;

      case 'vende':
        rawTitle = 'Vende tu Moto Online | Tasación Instantánea Gratis | KAELOS';
        description = 'Consigue la mejor tasación para tu moto online y de forma inmediata en Kaelos. Pago rápido garantizado, recogida gratuita a domicilio y gestión completa de papeleo.';
        keywords = ['vender moto', 'tasar moto gratis', 'vender moto online', 'tasar mi moto', 'tasacion de motos'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Vender Moto', url: '/vender-mi-moto' }];
        canonical = '/vender-mi-moto';
        break;

      case 'equipamiento':
        rawTitle = 'Catálogo Oficial Shad y Accesorios Premium | KAELOS';
        description = 'Equipa tu moto con maletas, baúles y accesorios profesionales. Compra e instalación oficial directa en nuestros talleres con garantía total.';
        keywords = ['maletas moto', 'baul trasero moto', 'accesorios shad', 'instalacion maletas moto', 'equipamiento motorista'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Financiación y Servicios', url: '/financiacion' }, { name: 'Equipamiento', url: '/equipamiento' }];
        canonical = '/equipamiento';
        break;

      case 'moto':
        if (selectedDetailedBike) {
          const brand = selectedDetailedBike.brand || '';
          const model = selectedDetailedBike.model || '';
          const version = selectedDetailedBike.version || '';
          const price = selectedDetailedBike.price || 0;
          const year = selectedDetailedBike.year || 2023;
          const kms = selectedDetailedBike.kms || 0;
          const city = selectedDetailedBike.location || 'Lima';
          const symbol = selectedDetailedBike.currency === 'USD' ? '$' : 'S/';
          
          rawTitle = `${brand} ${model} ${version} (${year}) ${symbol}${price.toLocaleString('es-PE')}`.trim() + ' | KAELOS';
          description = selectedDetailedBike.description || `Comprar ${brand} ${model} ${version} del año ${year} con ${kms.toLocaleString('es-PE')} km. Ubicada en ${city}. Revisada en más de 100 puntos con 12 meses de garantía total en Kaelos.`;
          ogImage = selectedDetailedBike.image || selectedDetailedBike.featuredImage || selectedDetailedBike.images?.[0] || ogImage;
          canonical = `/moto/${selectedDetailedBike.id}`;
          keywords = [
            brand,
            `${brand} ${model}`,
            `${brand} ${model} ${year}`,
            `${brand} ${model} precio peru`,
            `comprar ${brand} ${model}`,
            `moto ${brand} segunda mano`,
            'kaelos motos'
          ];
          
          breadcrumbs = [
            { name: 'Inicio', url: '/' },
            { name: 'Comprar Moto', url: '/motos' },
            { name: `${brand} ${model}`, url: canonical }
          ];

          customSchemas.push(
            getMotorcycleProductSchema({
              id: selectedDetailedBike.id || 'moto-1',
              brand: brand,
              model: model,
              version: version,
              year: year,
              kms: kms,
              price: price,
              currency: selectedDetailedBike.currency || 'USD',
              condition: selectedDetailedBike.condition || 'ocasión',
              category: selectedDetailedBike.category || 'Naked',
              power: selectedDetailedBike.power || '42 CV',
              displacement: selectedDetailedBike.displacement || 321,
              fuel: selectedDetailedBike.fuel || 'Gasolina',
              featuredImage: ogImage,
              gallery: selectedDetailedBike.images || selectedDetailedBike.gallery || [ogImage],
              description: description,
              url: canonical,
            })
          );
        } else {
          rawTitle = 'Motocicleta en Catálogo | KAELOS';
          description = 'Encuentra las mejores motocicletas de ocasión y reestreno en Kaelos.';
          canonical = '/motos';
        }
        break;

      case 'financiacion':
        rawTitle = 'Financiación de Motos a tu Medida | KAELOS';
        description = 'Calcula tus cuotas mensuales y financia la compra de tu moto de segunda mano u ocasión de forma rápida y flexible. Estudio gratuito y aprobación inmediata.';
        keywords = ['financiar moto', 'financiacion de motos', 'simulador financiacion', 'cuotas de moto', 'comprar moto a plazos'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Financiación', url: '/financiacion' }];
        canonical = '/financiacion';
        break;

      case 'acerca-de':
        rawTitle = 'Sobre Nosotros | Historia y Misión | KAELOS';
        description = 'Conoce la historia de Kaelos, de una visión en Lima a ser el mayor marketplace de motos de segunda mano y ocasión del Perú con el mayor stock y taller propio.';
        keywords = ['kaelos historia', 'sobre nosotros', 'equipo kaelos', 'marketplace motos peru'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Acerca de', url: '/acerca-de' }];
        canonical = '/acerca-de';
        break;

      case 'preguntas-frecuentes':
        rawTitle = 'Preguntas Frecuentes y Ayuda | KAELOS';
        description = 'Resuelve todas tus dudas sobre comprar, vender, financiar o suscribirte a una moto en Kaelos. Respuestas claras sobre garantías, envíos y documentación.';
        keywords = ['preguntas frecuentes', 'faq kaelos', 'garantia moto kaelos', 'envio moto domicilio'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Preguntas Frecuentes', url: '/preguntas-frecuentes' }];
        canonical = '/preguntas-frecuentes';
        break;

      case 'blog':
        if (selectedBlogPostId) {
          const posts = loadAllBlogPostsFromContent();
          const foundPost = posts.find((p) => p.id === selectedBlogPostId || p.slug === selectedBlogPostId);
          if (foundPost) {
            rawTitle = `${foundPost.title} | Blog KAELOS`;
            description = foundPost.excerpt || foundPost.seo?.description || description;
            if (foundPost.cover) {
              ogImage = foundPost.cover.includes('images.unsplash.com')
                ? foundPost.cover.replace(/([?&])w=\d+/g, '$1w=1200')
                : foundPost.cover;
            }
            canonical = `/blog/${foundPost.slug || foundPost.id}`;
            breadcrumbs = [
              { name: 'Inicio', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: foundPost.title, url: canonical }
            ];
            break;
          }
        }
        rawTitle = 'Blog Kaelos | Noticias, Consejos y Guías para Moteros | KAELOS';
        description = 'Artículos expertos sobre motos de ocasión, mantenimiento preventivo, guías de compra, comparativas y consejos para moverte en moto por el Perú.';
        keywords = ['blog de motos', 'consejos de motos', 'guias de compra', 'mantenimiento cadena moto', 'scooter 125cc'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Blog', url: '/blog' }];
        canonical = '/blog';
        break;

      case 'contacto':
        rawTitle = 'Contacto y Atención al Cliente | KAELOS';
        description = 'Ponte en contacto con el equipo de Kaelos Motos. Visita nuestros centros, llámanos o escríbenos para atención personalizada.';
        keywords = ['contacto kaelos', 'telefono kaelos', 'atencion cliente kaelos', 'ubicacion kaelos'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Contacto', url: '/contacto' }];
        canonical = '/contacto';
        break;

      case 'aviso-legal':
        rawTitle = 'Aviso Legal | KAELOS';
        description = 'Información general, titularidad del sitio web y condiciones legales de uso de Kaelos.';
        keywords = ['aviso legal kaelos', 'informacion legal', 'titularidad kaelos'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Aviso Legal', url: '/aviso-legal' }];
        canonical = '/aviso-legal';
        break;

      case 'politica-privacidad':
        rawTitle = 'Política de Privacidad | KAELOS';
        description = 'Protección de datos personales y ejercicio de derechos ARCO conforme a la legislación vigente.';
        keywords = ['politica privacidad kaelos', 'proteccion de datos', 'derechos arco'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Política de Privacidad', url: '/politica-privacidad' }];
        canonical = '/politica-privacidad';
        break;

      case 'terminos-y-condiciones':
        rawTitle = 'Términos y Condiciones | KAELOS';
        description = 'Términos y condiciones para la compra, venta, garantía e inspección de motocicletas en Kaelos.';
        keywords = ['terminos y condiciones kaelos', 'garantia 12 meses', 'condiciones compra moto'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Términos y Condiciones', url: '/terminos-y-condiciones' }];
        canonical = '/terminos-y-condiciones';
        break;

      case 'cookies':
        rawTitle = 'Política de Cookies | KAELOS';
        description = 'Información sobre el uso de cookies y almacenamiento de preferencias en Kaelos.';
        keywords = ['politica de cookies kaelos', 'cookies kaelos'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Política de Cookies', url: '/politica-de-cookies' }];
        canonical = '/politica-de-cookies';
        break;

      case 'favorites':
        rawTitle = 'Mis Favoritos | Motos Guardadas | KAELOS';
        description = 'Consulta tus motocicletas guardadas en Kaelos. Compara especificaciones, precios y cuotas para tomar la mejor decisión.';
        keywords = ['motos favoritas', 'mis favoritos', 'motos guardadas'];
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Favoritos', url: '/user/favorites' }];
        canonical = '/user/favorites';
        break;

      case 'checkout-sale':
      case 'checkout':
        rawTitle = 'Reserva y Checkout Seguro | KAELOS';
        description = 'Gestión privada de pedido y reserva oficial de motocicleta.';
        breadcrumbs = [{ name: 'Inicio', url: '/' }, { name: 'Checkout', url: '/checkout-sale' }];
        canonical = '/checkout-sale';
        break;

      default:
        rawTitle = 'Kaelos | Encuentra tu próxima motocicleta';
        description = 'Plataforma líder en compra, venta y financiación de motocicletas.';
        canonical = '/';
        break;
    }

    // Apply CMS Page overrides from database store
    const matchingCmsPage = dbPages.find(
      (p) => p.slug === activePage || (activePage === 'home' && p.slug === 'inicio')
    );
    if (matchingCmsPage) {
      if (matchingCmsPage.seo?.title || matchingCmsPage.title) {
        rawTitle = matchingCmsPage.seo?.title || matchingCmsPage.title;
      }
      if (matchingCmsPage.seo?.description || matchingCmsPage.description) {
        description = matchingCmsPage.seo?.description || matchingCmsPage.description;
      }
    }

    // Inject GEO Local Business Schema from DB Centers/Locations
    const localSchemas = getLocalBusinessSchema(dbSettings?.locations);
    if (Array.isArray(localSchemas)) {
      customSchemas.push(...localSchemas);
    } else if (localSchemas) {
      customSchemas.push(localSchemas);
    }

    const isPrivatePage = activePage === 'checkout-sale' || activePage === 'checkout' || activePage === 'favorites';
    const hasUserParams = typeof window !== 'undefined' && (
      window.location.search.includes('name=') || 
      window.location.search.includes('email=') || 
      window.location.search.includes('phone=') ||
      window.location.search.includes('order=') ||
      window.location.search.includes('pedido=')
    );

    const isProductPage = activePage === 'moto' && selectedDetailedBike;
    const metadata: SEOMetadata = {
      title: rawTitle,
      description: description,
      canonical: canonical,
      robots: (isPrivatePage || hasUserParams) 
        ? 'noindex, nofollow' 
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      keywords: keywords,
      author: 'KAELOS',
      publisher: 'KAELOS',
      language: 'es-PE',
      type: isProductPage ? 'product' : 'website',
      ogImage: ogImage,
      ogImageAlt: isProductPage ? `${selectedDetailedBike.brand} ${selectedDetailedBike.model}` : rawTitle,
      twitterCard: 'summary_large_image',
      priceAmount: isProductPage ? selectedDetailedBike.price : undefined,
      priceCurrency: isProductPage ? (selectedDetailedBike.currency || 'USD') : undefined,
      availability: isProductPage ? (selectedDetailedBike.isReserved ? 'out of stock' : 'in stock') : undefined,
      productCondition: isProductPage ? ((selectedDetailedBike.condition || '').toLowerCase().includes('nueva') ? 'new' : 'used') : undefined,
      brand: isProductPage ? selectedDetailedBike.brand : undefined,
      category: isProductPage ? selectedDetailedBike.category : undefined,
    };

    updateHeadTags(metadata, breadcrumbs, customSchemas);
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
    selectedDetailedBike,
    selectedBlogPostId,
    dbPages,
    dbSettings,
  ]);

  return { getPageTitle };
}

