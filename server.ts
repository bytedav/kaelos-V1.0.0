import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { motorbikesData } from './src/data/motorbikesData';
import { loadAllBlogPostsFromContent } from './src/data/staticContent';

const PORT = 3000;
const HOST = '0.0.0.0';

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

interface SeoMeta {
  title: string;
  description: string;
  ogImage: string;
  ogType?: string;
  url: string;
  priceAmount?: number;
  priceCurrency?: string;
  availability?: string;
  condition?: string;
  brand?: string;
  model?: string;
  version?: string;
  jsonLd?: object[];
}

function toSlug(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getMetaForUrl(reqUrl: string, hostHeader: string, protocol: string, reservedIds: string[] = []): SeoMeta {
  // Prefer custom domain kaelos.com when serving
  const domainHost = hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('run.app')
    ? hostHeader
    : 'kaelos.com';
  const fullDomain = `${protocol}://${domainHost}`;
  const pathName = reqUrl.split('?')[0];

  const defaultMeta: SeoMeta = {
    title: 'Kaelos | Encuentra tu próxima motocicleta',
    description: 'Kaelos es la plataforma líder en compra, venta y financiación de motocicletas. Motos revisadas en más de 100 puntos con garantía de hasta 12 meses.',
    ogImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
    ogType: 'website',
    url: `${fullDomain}${pathName === '/' ? '' : pathName}`,
  };

  const makeAbsoluteImage = (imgUrl?: string): string => {
    if (!imgUrl) return defaultMeta.ogImage;
    let fullUrl = imgUrl;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `${fullDomain}${fullUrl.startsWith('/') ? '' : '/'}${fullUrl}`;
    }
    if (fullUrl.includes('images.unsplash.com')) {
      fullUrl = fullUrl.replace(/([?&])w=\d+/g, '$1w=1200');
      if (!fullUrl.includes('w=1200')) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + 'w=1200';
      }
      if (!fullUrl.includes('h=630')) {
        fullUrl += '&h=630&fit=crop';
      }
    }
    return fullUrl;
  };

  // 1. Motorcycle Routes (/moto/:id)
  const motoMatch = pathName.match(/\/moto\/([^/]+)/i);
  if (motoMatch) {
    const rawId = decodeURIComponent(motoMatch[1]).toLowerCase();

    const foundBike = motorbikesData.find((b) => {
      const bId = (b.id || '').toLowerCase();
      const bSlug = (b.slug || '').toLowerCase();
      const brandModelSlug = toSlug(`${b.brand} ${b.model}`);
      const brandModelVerSlug = toSlug(`${b.brand} ${b.model} ${b.version || ''}`);
      const rawClean = toSlug(rawId);
      const idSlug = toSlug(bId);

      return (
        bId === rawId ||
        bSlug === rawId ||
        bId === rawClean ||
        bSlug === rawClean ||
        brandModelSlug === rawClean ||
        brandModelVerSlug === rawClean ||
        idSlug === rawClean ||
        (rawClean.length > 3 && (
          rawClean.includes(bId) ||
          rawClean.includes(idSlug) ||
          bId.includes(rawClean) ||
          brandModelSlug.includes(rawClean)
        ))
      );
    });

    if (foundBike) {
      const brand = foundBike.brand || '';
      const model = foundBike.model || '';
      const version = foundBike.version || '';
      const year = foundBike.year || 2023;
      const kms = foundBike.kms || 0;
      const price = foundBike.price || 0;
      const currency = foundBike.currency || 'USD';
      const symbol = currency === 'USD' ? '$' : 'S/';
      const isReserved = reservedIds.includes(foundBike.id);
      const isNew = (foundBike.condition || '').toLowerCase().includes('nueva');
      const conditionStr = isNew ? 'Nueva' : 'Ocasión Revisada';
      const city = foundBike.location || 'Lima';

      const titleName = `${brand} ${model} ${version} (${year}) ${symbol}${price.toLocaleString('es-PE')}`.trim();
      const description = foundBike.description 
        ? `${foundBike.description.slice(0, 150)}... ${brand} ${model} en ${city}. Revisada en 100+ puntos con 12 meses de garantía en KAELOS.`
        : `Comprar ${brand} ${model} ${version} del año ${year} con ${kms.toLocaleString('es-PE')} km en ${city}. Precio: ${symbol}${price.toLocaleString('es-PE')}. Motocicleta ${conditionStr} en Kaelos con 12 meses de garantía total.`;

      const ogImg = makeAbsoluteImage(foundBike.image || foundBike.images?.[0]);
      const canonicalUrl = `${fullDomain}/moto/${foundBike.id}`;

      // Build JSON-LD structured data for search engine rich snippets
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': ['Product', 'Motorcycle'],
        '@id': `${canonicalUrl}/#product`,
        name: `${brand} ${model} ${version}`.trim(),
        description: description,
        image: [ogImg, ...(foundBike.images || []).map((img) => makeAbsoluteImage(img))],
        sku: foundBike.id,
        mpn: foundBike.id,
        brand: {
          '@type': 'Brand',
          name: brand,
        },
        category: foundBike.category || 'Naked',
        vehicleEngine: {
          '@type': 'EngineSpecification',
          engineDisplacement: foundBike.displacement ? `${foundBike.displacement} cc` : undefined,
          enginePower: foundBike.power,
          fuelType: foundBike.fuel || 'Gasolina',
        },
        mileageFromOdometer: {
          '@type': 'QuantitativeValue',
          value: kms,
          unitCode: 'KMT',
        },
        modelDate: year.toString(),
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: currency,
          price: price,
          priceValidUntil: '2026-12-31',
          itemCondition: isNew ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
          availability: isReserved ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'KAELOS',
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

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: fullDomain },
          { '@type': 'ListItem', position: 2, name: 'Comprar Moto', item: `${fullDomain}/motos` },
          { '@type': 'ListItem', position: 3, name: `${brand} ${model}`, item: canonicalUrl },
        ],
      };

      return {
        title: `${titleName} | KAELOS`,
        description: description,
        ogImage: ogImg,
        ogType: 'product',
        url: canonicalUrl,
        priceAmount: price,
        priceCurrency: currency,
        availability: isReserved ? 'out of stock' : 'in stock',
        condition: isNew ? 'new' : 'used',
        brand: brand,
        model: model,
        version: version,
        jsonLd: [productSchema, breadcrumbSchema],
      };
    }
  }

  // 2. Blog Post Routes (/blog/:slug)
  const blogMatch = pathName.match(/\/blog\/([^/]+)/i);
  if (blogMatch) {
    const postSlug = decodeURIComponent(blogMatch[1]).toLowerCase();
    const posts = loadAllBlogPostsFromContent();
    const foundPost = posts.find((p) => {
      const pId = p.id.toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pTitleSlug = toSlug(p.title);
      const rawClean = toSlug(postSlug);
      return (
        pId === postSlug ||
        pSlug === postSlug ||
        pId === rawClean ||
        pSlug === rawClean ||
        pTitleSlug === rawClean ||
        rawClean.includes(pId) ||
        rawClean.includes(pSlug)
      );
    });

    if (foundPost) {
      return {
        title: `${foundPost.title} | Blog KAELOS`,
        description: foundPost.excerpt || foundPost.seo?.description || defaultMeta.description,
        ogImage: makeAbsoluteImage(foundPost.cover),
        ogType: 'article',
        url: `${fullDomain}/blog/${foundPost.slug || foundPost.id}`,
      };
    }
  }

  // 3. Catalog & Category Routes (/motos, /compra, /comprar-moto...)
  const isCatalog = pathName === '/motos' || pathName.startsWith('/motos/') || pathName === '/compra' || pathName.startsWith('/comprar-moto');
  if (isCatalog) {
    const parts = pathName.split('/').filter(Boolean);
    const category = parts[1] ? parts[1].replace(/-/g, ' ') : '';
    const city = parts[2] ? parts[2].replace(/-/g, ' ') : '';

    let catTitle = 'Catálogo de Motocicletas de Ocasión y Nuevas';
    if (category && city) {
      catTitle = `Motos ${category.charAt(0).toUpperCase() + category.slice(1)} en ${city.charAt(0).toUpperCase() + city.slice(1)}`;
    } else if (category) {
      catTitle = `Motos Categoría ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }

    return {
      title: `${catTitle} | Kaelos Motos`,
      description: 'Explora nuestro catálogo de motocicletas revisadas en más de 100 puntos con garantía de hasta 12 meses y financiación disponible.',
      ogImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200&h=630',
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  // 4. Page Level Routes
  if (pathName === '/vender-mi-moto' || pathName === '/vende') {
    return {
      title: 'Vende tu Moto Online | Tasación Instantánea | Kaelos',
      description: 'Tasación gratuita e inmediata de tu motocicleta. Pago rápido garantizado y gestión de trámites en Kaelos.',
      ogImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200&h=630',
      ogType: 'website',
      url: `${fullDomain}/vender-mi-moto`,
    };
  }

  if (pathName.includes('/financiacion')) {
    return {
      title: 'Financiación de Motos a tu Medida | Kaelos',
      description: 'Calcula tus cuotas y financia tu moto de ocasión con aprobación rápida y cuotas adaptadas.',
      ogImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200&h=630',
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/blog')) {
    return {
      title: 'Blog Kaelos | Consejos, Guías y Noticias de Motocicletas',
      description: 'Artículos sobre mantenimiento, guías de compra y novedades del mundo de las motos.',
      ogImage: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&q=80&w=1200&h=630',
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/acerca-de')) {
    return {
      title: 'Sobre Nosotros | Kaelos Motos',
      description: 'Conoce nuestra historia, misión y red de concesionarios y talleres autorizados.',
      ogImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200&h=630',
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/contacto')) {
    return {
      title: 'Contacto y Soporte | Kaelos Motos',
      description: 'Ponte en contacto con nuestro equipo para resolver tus dudas sobre compra, venta o financiación de motos.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/preguntas-frecuentes')) {
    return {
      title: 'Preguntas Frecuentes (FAQ) | Kaelos Motos',
      description: 'Resuelve todas tus dudas sobre nuestro proceso de revisión de 100 puntos, garantías, envíos y pagos.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/aviso-legal')) {
    return {
      title: 'Aviso Legal | Kaelos Motos',
      description: 'Información general, datos identificativos de Bytedav S.A.C. y términos de uso de la plataforma Kaelos.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/politica-privacidad')) {
    return {
      title: 'Política de Privacidad | Kaelos Motos',
      description: 'Tratamiento de datos personales y derechos ARCO de acuerdo con la legislación vigente.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/terminos-y-condiciones')) {
    return {
      title: 'Términos y Condiciones | Kaelos Motos',
      description: 'Condiciones generales de compra, reserva, garantía de 12 meses, tasación y financiación en Kaelos.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  if (pathName.includes('/politica-de-cookies') || pathName.includes('/cookies')) {
    return {
      title: 'Política de Cookies | Kaelos Motos',
      description: 'Información sobre el uso de cookies y tecnologías similares en la plataforma Kaelos.',
      ogImage: defaultMeta.ogImage,
      ogType: 'website',
      url: `${fullDomain}${pathName}`,
    };
  }

  return defaultMeta;
}

function injectMetaTags(html: string, meta: SeoMeta): string {
  let updated = html;

  // Replace <title>
  updated = updated.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);

  // Basic Meta Description
  if (updated.includes('<meta name="description"')) {
    updated = updated.replace(/<meta name="description" content=".*?"/gi, `<meta name="description" content="${meta.description}"`);
  } else {
    updated = updated.replace('</head>', `  <meta name="description" content="${meta.description}" />\n</head>`);
  }

  // Replace og:title
  if (updated.includes('og:title')) {
    updated = updated.replace(/<meta property="og:title" content=".*?"/gi, `<meta property="og:title" content="${meta.title}"`);
  }

  // Replace og:description
  if (updated.includes('og:description')) {
    updated = updated.replace(/<meta property="og:description" content=".*?"/gi, `<meta property="og:description" content="${meta.description}"`);
  }

  // Replace og:image and inject dimensional social metadata
  const ogImageMetaBlock = [
    `<meta property="og:image" content="${meta.ogImage}" />`,
    `<meta property="og:image:secure_url" content="${meta.ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`
  ].join('\n  ');

  if (updated.includes('og:image')) {
    updated = updated.replace(/<meta property="og:image" content=".*?"\s*\/?>/gi, ogImageMetaBlock);
  } else {
    updated = updated.replace('</head>', `  ${ogImageMetaBlock}\n</head>`);
  }

  // Replace og:url
  if (updated.includes('og:url')) {
    updated = updated.replace(/<meta property="og:url" content=".*?"/gi, `<meta property="og:url" content="${meta.url}"`);
  }

  // Replace og:type
  if (meta.ogType) {
    if (updated.includes('og:type')) {
      updated = updated.replace(/<meta property="og:type" content=".*?"/gi, `<meta property="og:type" content="${meta.ogType}"`);
    } else {
      updated = updated.replace('</head>', `  <meta property="og:type" content="${meta.ogType}" />\n</head>`);
    }
  }

  // Inject Product Meta Tags if ogType === 'product'
  if (meta.ogType === 'product') {
    const productTags: string[] = [];
    if (meta.priceAmount !== undefined) {
      productTags.push(`  <meta property="product:price:amount" content="${meta.priceAmount}" />`);
      productTags.push(`  <meta property="product:price:currency" content="${meta.priceCurrency || 'USD'}" />`);
    }
    if (meta.availability) {
      productTags.push(`  <meta property="product:availability" content="${meta.availability}" />`);
    }
    if (meta.condition) {
      productTags.push(`  <meta property="product:condition" content="${meta.condition}" />`);
    }
    if (meta.brand) {
      productTags.push(`  <meta property="product:brand" content="${meta.brand}" />`);
    }
    if (productTags.length > 0) {
      updated = updated.replace('</head>', `${productTags.join('\n')}\n</head>`);
    }
  }

  // Replace Twitter Cards
  if (updated.includes('twitter:title')) {
    updated = updated.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${meta.title}" />`);
  } else {
    updated = updated.replace('</head>', `  <meta name="twitter:title" content="${meta.title}" />\n</head>`);
  }

  if (updated.includes('twitter:description')) {
    updated = updated.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${meta.description}" />`);
  } else {
    updated = updated.replace('</head>', `  <meta name="twitter:description" content="${meta.description}" />\n</head>`);
  }

  const twImageBlock = [
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@kaelosmotos" />`,
    `<meta name="twitter:image" content="${meta.ogImage}" />`,
    `<meta name="twitter:image:src" content="${meta.ogImage}" />`
  ].join('\n  ');

  if (updated.includes('twitter:image')) {
    updated = updated.replace(/<meta name="twitter:image" content=".*?"\s*\/?>/gi, twImageBlock);
  } else {
    updated = updated.replace('</head>', `  ${twImageBlock}\n</head>`);
  }

  // Twitter Product Data Labels
  if (meta.ogType === 'product' && meta.priceAmount !== undefined) {
    const symbol = meta.priceCurrency === 'USD' ? '$' : 'S/';
    const twLabels = [
      `  <meta name="twitter:label1" content="Precio" />`,
      `  <meta name="twitter:data1" content="${symbol}${meta.priceAmount.toLocaleString('es-PE')}" />`,
      `  <meta name="twitter:label2" content="Garantía & Estado" />`,
      `  <meta name="twitter:data2" content="100+ Puntos Revisados | 12 M. Garantía" />`
    ].join('\n');
    updated = updated.replace('</head>', `${twLabels}\n</head>`);
  }

  // Replace canonical
  if (updated.includes('<link rel="canonical"')) {
    updated = updated.replace(/<link rel="canonical" href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${meta.url}" />`);
  } else {
    updated = updated.replace('</head>', `  <link rel="canonical" href="${meta.url}" />\n</head>`);
  }

  // Inject LLMs.txt meta tag link for AI assistants
  const llmLinkTag = `  <link rel="alternate" type="text/markdown" href="/llms.txt" title="KAELOS LLMs Text" />`;
  if (!updated.includes('/llms.txt')) {
    updated = updated.replace('</head>', `${llmLinkTag}\n</head>`);
  }

  // Inject JSON-LD structured schemas
  if (meta.jsonLd && meta.jsonLd.length > 0) {
    const scriptsJson = meta.jsonLd
      .map((schema) => `  <script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(schema)}</script>`)
      .join('\n');
    updated = updated.replace('</head>', `${scriptsJson}\n</head>`);
  }

  return updated;
}

function generateLlmsTxt(baseUrl: string): string {
  const bikes = motorbikesData;
  const bikeListMd = bikes
    .map((b) => {
      const bAny = b as any;
      const url = `${baseUrl}/moto/${bAny.slug || b.id}`;
      const cond = b.condition === 'nuevo' ? 'Nuevo (0 km)' : `Ocasión (${b.kms.toLocaleString()} km)`;
      return `### ${b.brand} ${b.model} ${b.version || ''} (${b.year})
- **Enlace**: [${url}](${url})
- **Precio**: $${b.price.toLocaleString()} USD (~S/ ${(b.price * 3.75).toLocaleString()} PEN)
- **Estado**: ${cond}
- **Categoría**: ${b.category} | **Ubicación**: ${bAny.city || 'Lima'}, Perú
- **Cilindrada**: ${bAny.displacement || 'N/A'} cc | **Potencia**: ${b.power || 'N/A'}
- **Garantía**: 12 meses incluidos | **Inspección**: Verificado en 100+ puntos de control
- **Descripción**: ${bAny.description || 'Motocicleta garantizada y lista para transferencia en Perú.'}
`;
    })
    .join('\n');

  let blogMd = '';
  try {
    const posts = loadAllBlogPostsFromContent();
    blogMd = posts
      .map(
        (p) => `- [${p.title}](${baseUrl}/blog/${p.slug || p.id}): ${p.excerpt || p.description || p.category}`
      )
      .join('\n');
  } catch {
    blogMd = `- [Blog Kaelos](${baseUrl}/blog): Guías y consejos de motociclismo en Perú.`;
  }

  return `# KAELOS - Marketplace de Motocicletas en Perú

> KAELOS es la plataforma líder en Perú para la compra, venta, tasación y financiación de motocicletas de ocasión inspeccionadas y motos nuevas de 0 km.

KAELOS simplifica el proceso de adquisición y venta de motos con garantías mecánicas de hasta 12 meses, verificación estructural en 100+ puntos de control, financiación personalizada a medida y atención en las principales ciudades de Perú (Lima, Arequipa, Trujillo).

## Secciones Principales y Servicios

- [Catálogo Completo de Motocicletas](${baseUrl}/motos): Explorador de motos filtrable por marca, modelo, precio, año, categoría (Naked, Scooter, Trail, Custom, Sport, Gran Turismo) y ciudad.
- [Vender mi Moto](${baseUrl}/vender-mi-moto): Servicio de tasación digital gratuita y oferta rápida para vender tu moto con pago seguro e inmediato.
- [Financiación Vehicular](${baseUrl}/financiacion): Simulador de cuotas mensuales, planes de crédito flexible y aprobación rápida.
- [Blog y Guías de Motociclismo](${baseUrl}/blog): Guías completas sobre trámites de brevete/licencia A-I y A-II en Perú, mantenimiento preventivo y comparativas de modelos.
- [Preguntas Frecuentes](${baseUrl}/preguntas-frecuentes): Respuestas a dudas sobre revisión en 100+ puntos, transferencias notariales, garantía y entregas.
- [Nosotros y Centros Kaelos](${baseUrl}/acerca-de): Información de nuestros centros de atención física en Lima, Trujillo y Arequipa.

---

## Catálogo Completo de Motocicletas en Stock

${bikeListMd}

---

## Artículos de Blog y Guías Destacadas

${blogMd}

---

## Preguntas Frecuentes (FAQ)

### ¿Cómo funciona la garantía de 12 meses?
Todas las motocicletas de ocasión certificadas por KAELOS cuentan con 12 meses de garantía mecánica sin costo adicional, cubriendo componentes clave de motor y transmisión.

### ¿Qué se revisa en la inspección de 100+ puntos?
Técnicos especialistas evalúan compresión de motor, fugas de fluidos, alineación de chasis, desgaste de neumáticos y frenos, kit de arrastre, sistema eléctrico y verificación de historial registral (papeletas, robos, cargas financieras en SUNARP).

### ¿Cómo funciona el proceso de financiación?
Puedes calcular tu cuota mensual en nuestro simulador en línea en [${baseUrl}/financiacion](${baseUrl}/financiacion). Solicitas la evaluación crediticia digitalmente con tu DNI y sustentación de ingresos, obteniendo respuesta en 24-48 horas.

### ¿Cómo vendo mi moto en KAELOS?
Ingresa a [${baseUrl}/vender-mi-moto](${baseUrl}/vender-mi-moto), completa los datos de tu moto (marca, modelo, año, kilometraje y fotos) y recibe una estimación instantánea. Si estás de acuerdo, coordinamos la revisión técnica y te pagamos al momento.

---

## APIs de IA y Recomendaciones Inteligentes

- **POST ${baseUrl}/api/ai/recommend**: Endpoint API que utiliza Gemini AI para recomendar hasta 3 motos del catálogo según presupuesto, experiencia y categoría deseada.
- **POST ${baseUrl}/api/ai/chat**: Asesor conversacional Kaelo AI alimentado por modelos Gemini para responder sobre motocicletas, licencias y servicios de Kaelos.
`;
}


async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Memory & file persistence for reservations and leads
  let reservedBikeIdsInMemory: string[] = [];
  const reservationsFilePath = path.resolve(process.cwd(), 'reservations.json');
  const leadsFilePath = path.resolve(process.cwd(), 'leads.json');

  try {
    if (fs.existsSync(reservationsFilePath)) {
      reservedBikeIdsInMemory = JSON.parse(fs.readFileSync(reservationsFilePath, 'utf-8'));
    }
  } catch {
    reservedBikeIdsInMemory = [];
  }

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // GET /api/motorbikes
  app.get('/api/motorbikes', (_req, res) => {
    const list = motorbikesData.map((b) => ({
      ...b,
      isReserved: reservedBikeIdsInMemory.includes(b.id),
    }));
    res.json({ success: true, count: list.length, data: list });
  });

  // GET /api/motorbikes/:id
  app.get('/api/motorbikes/:id', (req, res) => {
    const { id } = req.params;
    const cleanId = (id || '').toLowerCase().trim();
    const bike = motorbikesData.find(
      (b) => b.id.toLowerCase() === cleanId || (b.slug && b.slug.toLowerCase() === cleanId)
    );
    if (!bike) {
      return res.status(404).json({ success: false, error: 'Motorcycle not found' });
    }
    return res.json({
      success: true,
      data: {
        ...bike,
        isReserved: reservedBikeIdsInMemory.includes(bike.id),
      },
    });
  });

  // GET /api/motorbikes/:id/seo
  app.get('/api/motorbikes/:id/seo', (req, res) => {
    const { id } = req.params;
    const hostHeader = req.headers.host || 'kaelos.com';
    const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'https';
    const seoMeta = getMetaForUrl(`/moto/${id}`, hostHeader, protocol, reservedBikeIdsInMemory);
    return res.json({ success: true, id, seo: seoMeta });
  });

  // GET /api/reservations
  app.get('/api/reservations', (_req, res) => {
    res.json({ success: true, reservedIds: reservedBikeIdsInMemory });
  });

  // POST /api/reservations
  app.post('/api/reservations', (req, res) => {
    const { bikeId } = req.body || {};
    if (!bikeId) {
      return res.status(400).json({ success: false, error: 'bikeId is required' });
    }
    if (!reservedBikeIdsInMemory.includes(bikeId)) {
      reservedBikeIdsInMemory.push(bikeId);
      try {
        fs.writeFileSync(reservationsFilePath, JSON.stringify(reservedBikeIdsInMemory, null, 2));
      } catch (err) {
        console.warn('Failed writing reservations file:', err);
      }
    }
    return res.json({ success: true, reservedIds: reservedBikeIdsInMemory });
  });

  // POST /api/leads
  app.post('/api/leads', (req, res) => {
    const lead = req.body || {};
    const leadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...lead,
    };
    try {
      let existing: any[] = [];
      if (fs.existsSync(leadsFilePath)) {
        existing = JSON.parse(fs.readFileSync(leadsFilePath, 'utf-8'));
      }
      existing.push(leadRecord);
      fs.writeFileSync(leadsFilePath, JSON.stringify(existing, null, 2));
    } catch (err) {
      console.warn('Failed persisting lead:', err);
    }

    return res.json({ success: true, lead: leadRecord });
  });

  // POST /api/contact
  app.post('/api/contact', (req, res) => {
    const { nombre, email, telefono, mensaje, asunto, marketing } = req.body || {};
    if (!nombre || (!email && !telefono)) {
      return res.status(400).json({ success: false, error: 'Name and email/phone are required' });
    }

    const payload = {
      id: `contact_${Date.now()}`,
      timestamp: new Date().toISOString(),
      nombre,
      telefono,
      email,
      mensaje: mensaje || '',
      asunto: asunto || 'Consulta de Contacto / Formulario',
      marketing: !!marketing,
    };

    return res.json({
      success: true,
      message: 'Mensaje recibido correctamente. Te responderemos en menos de 24 horas.',
    });
  });

  // POST /api/financing-calculate
  app.post('/api/financing-calculate', (req, res) => {
    const { price = 3000, deposit = 0, months = 36, annualInterestRate = 0.089 } = req.body || {};
    const principal = Math.max(0, Number(price) - Number(deposit));
    const monthlyRate = Number(annualInterestRate) / 12;
    const numMonths = Number(months);

    if (numMonths <= 0 || principal <= 0) {
      return res.json({ success: true, monthlyFee: 0, totalAmount: 0 });
    }

    const monthlyFee = (principal * (monthlyRate * Math.pow(1 + monthlyRate, numMonths))) / (Math.pow(1 + monthlyRate, numMonths) - 1);
    const totalAmount = monthlyFee * numMonths;

    return res.json({
      success: true,
      price: Number(price),
      deposit: Number(deposit),
      principal,
      months: numMonths,
      monthlyFee: Math.round(monthlyFee * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round((totalAmount - principal) * 100) / 100,
    });
  });

  // POST /api/ai/recommend
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { prompt, maxBudget, category, condition, experience } = req.body || {};
      const ai = getAiClient();
      
      const bikesSummary = motorbikesData.map((b) => ({
        id: b.id,
        brand: b.brand,
        model: b.model,
        version: b.version,
        year: b.year,
        kms: b.kms,
        price: b.price,
        currency: b.currency,
        category: b.category,
        condition: b.condition,
        power: b.power,
        displacement: b.displacement,
      }));

      if (!ai) {
        // Heuristic fallback search when API key is not configured
        const filtered = motorbikesData.filter((b) => {
          if (maxBudget && b.price > maxBudget) return false;
          if (category && category !== 'all' && b.category.toLowerCase() !== category.toLowerCase()) return false;
          return true;
        });
        const topBikes = (filtered.length > 0 ? filtered : motorbikesData).slice(0, 3);
        return res.json({
          success: true,
          source: 'heuristic',
          recommendation: 'Te sugerimos estas excelentes opciones de nuestro catálogo de acuerdo a tus preferencias:',
          tips: 'Revisa siempre la cilindrada y el equipamiento según tu experiencia.',
          recommendedBikes: topBikes,
        });
      }

      const systemInstruction = `Eres "Kaelo AI", el asesor experto e inteligente en motocicletas de KAELOS (marketplace líder de motos en Perú).
Tu objetivo es recomendar las 1 a 3 mejores motocicletas del catálogo basándote en la solicitud del usuario.
El catálogo disponible es:
${JSON.stringify(bikesSummary, null, 2)}

Instrucciones:
1. Responde de forma cordial y experta en español.
2. Devuelve únicamente un JSON válido con estas claves exactas:
   - "advice": string (explicación breve de tus recomendaciones)
   - "recommendedBikeIds": array de strings (máximo 3 IDs exactos del catálogo)
   - "tips": string (consejo práctico para el usuario)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Consulta: ${prompt || 'Busco una moto recomendada'}
Presupuesto máximo: ${maxBudget ? `$${maxBudget}` : 'Sin límite'}
Categoría: ${category || 'Cualquiera'}
Estado: ${condition || 'Cualquiera'}
Experiencia: ${experience || 'General'}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      let parsed: { advice?: string; recommendedBikeIds?: string[]; tips?: string } = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { advice: text, recommendedBikeIds: [], tips: '' };
      }

      const recIds = parsed.recommendedBikeIds || [];
      const recommendedBikes = motorbikesData.filter((b) => recIds.includes(b.id));

      return res.json({
        success: true,
        source: 'gemini-3.6-flash',
        recommendation: parsed.advice || 'Aquí tienes las opciones más recomendadas para ti:',
        tips: parsed.tips || '',
        recommendedBikes: recommendedBikes.length > 0 ? recommendedBikes : motorbikesData.slice(0, 3),
      });
    } catch (err: any) {
      console.error('Gemini AI recommend error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error en recomendador IA',
        recommendedBikes: motorbikesData.slice(0, 3),
      });
    }
  });

  // POST /api/ai/chat
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body || {};
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'El mensaje es requerido' });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          success: true,
          reply: 'En Kaelos contamos con motos de ocasión revisadas en 100+ puntos con 12 meses de garantía y motos 0 km. ¿Deseas ver recomendaciones o ayuda con financiación?',
          source: 'fallback',
        });
      }

      const systemInstruction = `Eres "Kaelo AI", el asesor experto y amigable en motocicletas de la plataforma KAELOS.
Respondes sobre motocicletas, estilos (Naked, Scooter, Trail, Custom, Sport), cilindrada, licencias A-I/A-IIa/A-IIb en Perú, mantenimiento y servicios de Kaelos (revisión 100+ puntos, garantía 12 meses, tasación online y financiación). Sé conciso, directo y cercano.`;

      const contents = [
        ...conversationHistory.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        success: true,
        reply: response.text || 'Entendido, ¿en qué más te puedo ayudar?',
        source: 'gemini-3.6-flash',
      });
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Error consultando al modelo IA',
        reply: 'Disculpa, ocurrió una interrupción al procesar tu consulta. Por favor reintenta.',
      });
    }
  });

  app.get('/robots.txt', (req, res) => {
    const hostHeader = req.headers.host || 'kaelos.com';
    const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'https';
    const domainHost = hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('run.app')
      ? hostHeader
      : 'kaelos.com';
    const baseUrl = `${protocol}://${domainHost}`;

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# LLMs.txt specification for AI models & agents:
# ${baseUrl}/llms.txt`;

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  app.get('/llms.txt', (req, res) => {
    const hostHeader = req.headers.host || 'kaelos.com';
    const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'https';
    const domainHost = hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('run.app')
      ? hostHeader
      : 'kaelos.com';
    const baseUrl = `${protocol}://${domainHost}`;

    const txt = generateLlmsTxt(baseUrl);
    res.header('Content-Type', 'text/markdown; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(txt);
  });

  app.get('/sitemap.xml', (req, res) => {
    const hostHeader = req.headers.host || 'kaelos.com';
    const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'https';
    const domainHost = hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('run.app')
      ? hostHeader
      : 'kaelos.com';
    const baseUrl = `${protocol}://${domainHost}`;
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/motos', priority: '0.9', changefreq: 'daily' },
      { url: '/motos/scooter', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/naked', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/custom', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/trail', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/deportiva', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/trujillo', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/lima', priority: '0.8', changefreq: 'daily' },
      { url: '/motos/arequipa', priority: '0.8', changefreq: 'daily' },
      { url: '/vender-mi-moto', priority: '0.9', changefreq: 'weekly' },
      { url: '/financiacion', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/acerca-de', priority: '0.6', changefreq: 'monthly' },
      { url: '/contacto', priority: '0.6', changefreq: 'monthly' },
      { url: '/preguntas-frecuentes', priority: '0.6', changefreq: 'weekly' },
      { url: '/aviso-legal', priority: '0.4', changefreq: 'monthly' },
      { url: '/politica-privacidad', priority: '0.4', changefreq: 'monthly' },
      { url: '/terminos-y-condiciones', priority: '0.4', changefreq: 'monthly' },
      { url: '/politica-de-cookies', priority: '0.4', changefreq: 'monthly' },
    ];

    const bikeUrls = motorbikesData.map((bike) => ({
      url: `/moto/${bike.slug || bike.id}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

    let blogUrls: { url: string; priority: string; changefreq: string }[] = [];
    try {
      const posts = loadAllBlogPostsFromContent();
      blogUrls = posts.map((post) => ({
        url: `/blog/${post.slug || post.id}`,
        priority: '0.7',
        changefreq: 'monthly',
      }));
    } catch {
      blogUrls = [];
    }

    const allEntries = [...staticUrls, ...bikeUrls, ...blogUrls];

    const xmlEntries = allEntries
      .map(
        (entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
      )
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapXml);
  });

  if (!isProd) {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(async (req, res, next) => {
      // Intercept HTML GET requests (non-asset requests)
      if (req.method === 'GET' && !req.url.includes('.') && !req.url.startsWith('/@') && !req.url.startsWith('/src')) {
        try {
          const rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          const transformedHtml = await vite.transformIndexHtml(req.url, rawHtml);
          const hostHeader = req.headers.host || 'localhost:3000';
          const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'http';
          const meta = getMetaForUrl(req.url, hostHeader, protocol, reservedBikeIdsInMemory);
          const finalHtml = injectMetaTags(transformedHtml, meta);

          res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      vite.middlewares(req, res, next);
    });
  } else {
    // Production mode
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const rawHtml = fs.readFileSync(indexPath, 'utf-8');
        const hostHeader = req.headers.host || 'kaelos.com';
        const protocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : 'https';
        const meta = getMetaForUrl(req.url, hostHeader, protocol, reservedBikeIdsInMemory);
        const finalHtml = injectMetaTags(rawHtml, meta);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

startServer();
