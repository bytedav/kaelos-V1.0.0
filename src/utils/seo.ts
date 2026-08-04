import { SEOMetadata, BreadcrumbItem, FAQSchemaItem, MotorcycleSchemaData, ArticleSchemaData } from '../types/seo';

const DEFAULT_SITE_NAME = 'KAELOS';
const DEFAULT_DOMAIN = 'https://kaelos.com'; // Default canonical base domain
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200';
const DEFAULT_DESCRIPTION = 'Kaelos es la plataforma líder en compra, venta y financiación de motocicletas en Perú. Motos revisadas en más de 100 puntos con garantía de hasta 12 meses.';

export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return DEFAULT_DOMAIN;
}

export function formatTitle(title?: string): string {
  if (!title || title.trim() === '' || title.toLowerCase().includes('react app') || title.toLowerCase().includes('vite app')) {
    return 'Kaelos | Encuentra tu próxima motocicleta';
  }
  const cleanTitle = title.trim();
  if (cleanTitle.toLowerCase().includes('kaelos')) {
    return cleanTitle;
  }
  return `${cleanTitle} | ${DEFAULT_SITE_NAME}`;
}

export function buildCanonicalUrl(path: string): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// ==========================================
// JSON-LD SCHEMA BUILDERS (AEO / GEO / RICH RESULTS)
// ==========================================

export function getOrganizationSchema() {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: DEFAULT_SITE_NAME,
    legalName: 'Kaelos Motos S.A.C.',
    url: base,
    logo: {
      '@type': 'ImageObject',
      url: `${base}/logo.png`,
      width: 512,
      height: 512,
    },
    description: DEFAULT_DESCRIPTION,
    foundingDate: '2019',
    sameAs: [
      'https://www.facebook.com/kaelosmotos',
      'https://www.instagram.com/kaelosmotos',
      'https://twitter.com/kaelosmotos',
      'https://www.linkedin.com/company/kaelosmotos',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+51-1-710-3333',
      contactType: 'customer service',
      areaServed: 'PE',
      availableLanguage: ['Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Cristobal de Peralta Sur 968',
      addressLocality: 'Surco',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
  };
}

export function getWebSiteSchema() {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: DEFAULT_SITE_NAME,
    publisher: {
      '@id': `${base}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/motos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getLocalBusinessSchema(customLocations?: Array<{ id: string; city: string; address: string; phone?: string; schedule?: string; lat?: number; lng?: number }>) {
  const base = getBaseUrl();
  
  if (customLocations && customLocations.length > 0) {
    return customLocations.map((loc, idx) => {
      const isLima = loc.city.toLowerCase().includes('lima') || loc.city.toLowerCase().includes('surco');
      const isArequipa = loc.city.toLowerCase().includes('arequipa');
      const isTrujillo = loc.city.toLowerCase().includes('trujillo');

      let lat = -12.1284;
      let lng = -76.9742;
      if (isArequipa) { lat = -16.4090; lng = -71.5375; }
      else if (isTrujillo) { lat = -8.1116; lng = -79.0287; }

      return {
        '@context': 'https://schema.org',
        '@type': 'MotorcycleDealer',
        '@id': `${base}/#localbusiness-${loc.id || idx}`,
        name: `${DEFAULT_SITE_NAME} Motos - Centro ${loc.city}`,
        image: DEFAULT_OG_IMAGE,
        url: base,
        telephone: loc.phone || '+51-1-710-3333',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: loc.address,
          addressLocality: loc.city,
          addressRegion: isLima ? 'Lima' : (isArequipa ? 'Arequipa' : 'La Libertad'),
          addressCountry: 'PE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:30',
            closes: '20:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
      };
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'MotorcycleDealer',
    '@id': `${base}/#localbusiness`,
    name: `${DEFAULT_SITE_NAME} Motos - Centro Surco`,
    image: DEFAULT_OG_IMAGE,
    url: base,
    telephone: '+51-1-710-3333',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Cristobal de Peralta Sur 968',
      addressLocality: 'Santiago de Surco',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -12.1284,
      longitude: -76.9742,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  };
}

/**
 * Speakable & AIO (AI Optimization for Perplexity, ChatGPT, Gemini, Voice Search)
 */
export function getSpeakableSchema(cssSelectors: string[] = ['h1', '.seo-speakable', '.faq-answer']) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${base}/#speakablePage`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}

export function getBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  const base = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${base}${crumb.url.startsWith('/') ? crumb.url : `/${crumb.url}`}`,
    })),
  };
}

export function getMotorcycleProductSchema(moto: MotorcycleSchemaData) {
  const base = getBaseUrl();
  const motoUrl = moto.url.startsWith('http') ? moto.url : `${base}${moto.url.startsWith('/') ? moto.url : `/${moto.url}`}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Motorcycle'],
    '@id': `${motoUrl}/#product`,
    name: `${moto.brand} ${moto.model} ${moto.version || ''}`.trim(),
    description: moto.description,
    image: [moto.featuredImage, ...(moto.gallery || [])],
    sku: moto.id,
    mpn: moto.id,
    brand: {
      '@type': 'Brand',
      name: moto.brand,
    },
    category: moto.category,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      engineDisplacement: moto.displacement ? `${moto.displacement} cc` : undefined,
      enginePower: moto.power,
      fuelType: moto.fuel || 'Gasolina',
    },
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: moto.kms,
      unitCode: 'KMT',
    },
    modelDate: moto.year.toString(),
    offers: {
      '@type': 'Offer',
      url: motoUrl,
      priceCurrency: moto.currency || 'PEN',
      price: moto.price,
      priceValidUntil: '2026-12-31',
      itemCondition: ((moto.condition || '').toLowerCase().includes('nueva')) ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function getArticleSchema(article: ArticleSchemaData) {
  const base = getBaseUrl();
  const rawUrl = article.url || `/blog/${article.slug || article.id || ''}`;
  const articleUrl = rawUrl.startsWith('http') ? rawUrl : `${base}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
  const authorName = article.authorName || article.author?.name || 'Redacción KAELOS';
  const authorRole = article.authorRole || article.author?.role || 'Especialista en Motos';
  const description = article.description || article.excerpt || article.title;
  const image = article.coverImage || article.image || `${base}/logo.png`;
  const datePublished = article.datePublished || article.date || '2026-01-01';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}/#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: article.dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/logo.png`,
      },
    },
    keywords: article.tags ? article.tags.join(', ') : undefined,
    articleSection: article.category,
  };
}

export function getFAQSchema(faqs: FAQSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/[*#]/g, '').trim(), // Clean markdown symbols for raw answer text
      },
    })),
  };
}

// ==========================================
// CENTRALIZED DOM HEAD TAG INJECTOR
// ==========================================

export function updateHeadTags(
  metadata: SEOMetadata,
  breadcrumbs?: BreadcrumbItem[],
  jsonLdSchemas?: object[]
) {
  if (typeof document === 'undefined') return;

  const base = getBaseUrl();
  const formattedTitle = formatTitle(metadata.title);
  const description = metadata.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = metadata.canonical
    ? (metadata.canonical.startsWith('http') ? metadata.canonical : `${base}${metadata.canonical.startsWith('/') ? metadata.canonical : `/${metadata.canonical}`}`)
    : buildCanonicalUrl(typeof window !== 'undefined' ? window.location.pathname : '/');

  const ogImg = metadata.ogImage || DEFAULT_OG_IMAGE;
  const twImg = metadata.twitterImage || ogImg;
  const robots = metadata.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // 1. Title
  document.title = formattedTitle;

  // Helper for meta creation/update
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let tag = document.querySelector(selector) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrVal);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Helper for link tags
  const setLinkTag = (rel: string, href: string, hrefLang?: string) => {
    const selector = hrefLang ? `link[rel="${rel}"][hreflang="${hrefLang}"]` : `link[rel="${rel}"]`;
    let tag = document.querySelector(selector) as HTMLLinkElement;
    if (!tag) {
      tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      if (hrefLang) tag.setAttribute('hreflang', hrefLang);
      document.head.appendChild(tag);
    }
    tag.setAttribute('href', href);
  };

  // 2. Basic Meta
  setMetaTag('meta[name="description"]', 'name', 'description', description);
  setMetaTag('meta[name="robots"]', 'name', 'robots', robots);
  setMetaTag('meta[name="author"]', 'name', 'author', metadata.author || DEFAULT_SITE_NAME);
  setMetaTag('meta[name="publisher"]', 'name', 'publisher', metadata.publisher || DEFAULT_SITE_NAME);
  
  if (metadata.keywords && metadata.keywords.length > 0) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', metadata.keywords.join(', '));
  }

  // 3. Canonical & Alternates
  setLinkTag('canonical', canonicalUrl);
  setLinkTag('alternate', canonicalUrl, 'es-PE');
  setLinkTag('alternate', canonicalUrl, 'x-default');

  if (metadata.alternates) {
    metadata.alternates.forEach((alt) => {
      setLinkTag('alternate', alt.href, alt.hrefLang);
    });
  }

  // 4. Open Graph (Facebook, WhatsApp, LinkedIn, Telegram, Discord, X)
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', DEFAULT_SITE_NAME);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', metadata.type || 'website');
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImg);
  setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', ogImg);
  setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg');
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', metadata.ogImageAlt || formattedTitle);
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'es_PE');

  if (metadata.type === 'product') {
    if (metadata.priceAmount !== undefined) {
      setMetaTag('meta[property="product:price:amount"]', 'property', 'product:price:amount', metadata.priceAmount.toString());
      setMetaTag('meta[property="product:price:currency"]', 'property', 'product:price:currency', metadata.priceCurrency || 'PEN');
    }
    setMetaTag('meta[property="product:availability"]', 'property', 'product:availability', metadata.availability || 'in stock');
    if (metadata.productCondition) {
      setMetaTag('meta[property="product:condition"]', 'property', 'product:condition', metadata.productCondition);
    }
    if (metadata.brand) {
      setMetaTag('meta[property="product:brand"]', 'property', 'product:brand', metadata.brand);
    }
  }

  if (metadata.publishedTime) {
    setMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', metadata.publishedTime);
  }
  if (metadata.modifiedTime) {
    setMetaTag('meta[property="article:modified_time"]', 'property', 'article:modified_time', metadata.modifiedTime);
  }

  // 5. Twitter Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', metadata.twitterCard || 'summary_large_image');
  setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@kaelosmotos');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', twImg);

  if (metadata.type === 'product' && metadata.priceAmount !== undefined) {
    const symbol = metadata.priceCurrency === 'USD' ? '$' : 'S/';
    setMetaTag('meta[name="twitter:label1"]', 'name', 'twitter:label1', 'Precio');
    setMetaTag('meta[name="twitter:data1"]', 'name', 'twitter:data1', `${symbol}${metadata.priceAmount.toLocaleString('es-PE')}`);
    setMetaTag('meta[name="twitter:label2"]', 'name', 'twitter:label2', 'Garantía & Estado');
    setMetaTag('meta[name="twitter:data2"]', 'name', 'twitter:data2', '100+ Puntos Revisados | 12 Meses Garantía');
  }

  // 5.5 GEO Local Meta Tags
  setMetaTag('meta[name="geo.region"]', 'name', 'geo.region', metadata.geoRegion || 'PE-LMA');
  setMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', metadata.geoPlacename || 'Lima, Surco, Perú');
  setMetaTag('meta[name="geo.position"]', 'name', 'geo.position', metadata.geoPosition || '-12.1284;-76.9742');
  setMetaTag('meta[name="ICBM"]', 'name', 'ICBM', metadata.icbm || '-12.1284, -76.9742');

  // 6. JSON-LD Structured Data Injection (AEO / GEO / Search Engine Schema)
  // Clean old managed script tags
  const existingScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
  existingScripts.forEach((s) => s.remove());

  const schemasToInject: object[] = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSpeakableSchema(metadata.speakableSelectors || ['h1', 'h2', 'p', '.seo-speakable', '.faq-answer']),
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemasToInject.push(getBreadcrumbSchema(breadcrumbs));
  }

  if (jsonLdSchemas && jsonLdSchemas.length > 0) {
    schemasToInject.push(...jsonLdSchemas);
  }

  schemasToInject.forEach((schemaData, idx) => {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.setAttribute('data-seo-jsonld', 'true');
    scriptTag.setAttribute('data-schema-index', idx.toString());
    scriptTag.text = JSON.stringify(schemaData);
    document.head.appendChild(scriptTag);
  });
}
