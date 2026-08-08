import { load } from 'js-yaml';
import { BlogPostContent } from '../types/content';

function parseMarkdownFile(raw: string, filepath: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {} as Record<string, any>, body: raw.trim() };
  }
  try {
    const frontmatter = (load(match[1]) as Record<string, any>) || {};
    const body = match[2].trim();
    return { frontmatter, body };
  } catch (e) {
    console.error(`Error parsing frontmatter in ${filepath}:`, e);
    return { frontmatter: {} as Record<string, any>, body: raw.trim() };
  }
}

export function loadAllMotorcyclesFromCms(): any[] {
  try {
    const modules = import.meta.glob(['/content/motos/*.md', '/content/motorbikes/*.md'], { query: '?raw', eager: true });
    const motos: any[] = [];

    for (const [filepath, mod] of Object.entries(modules)) {
      const rawContent = typeof mod === 'string' ? mod : (mod as any)?.default || '';
      if (!rawContent) continue;

      const { frontmatter, body } = parseMarkdownFile(rawContent, filepath);
      const filename = filepath.split('/').pop()?.replace('.md', '') || '';
      const slug = String(frontmatter.slug || filename);
      const bikeId = String(frontmatter.id || frontmatter.uuid || slug);

      const parseNum = (val: any): number | undefined => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const cleaned = val.replace(/[^0-9.]/g, '');
          const parsed = parseFloat(cleaned);
          if (!isNaN(parsed)) return parsed;
        }
        return undefined;
      };

      const yearVal = parseNum(frontmatter.year);
      const priceVal = parseNum(frontmatter.price);
      const kmsVal = parseNum(frontmatter.kms);
      const dispVal = parseNum(frontmatter.displacement);
      const discountVal = parseNum(frontmatter.discountPrice || frontmatter.oldPrice);

      motos.push({
        id: bikeId,
        slug: slug,
        brand: frontmatter.brand || 'Marca',
        model: frontmatter.model || 'Modelo',
        version: frontmatter.version || '',
        year: yearVal ?? 2024,
        category: frontmatter.category || 'Naked',
        condition: String(frontmatter.condition || '').toLowerCase() === 'nueva' ? 'nueva' : 'ocasión',
        price: priceVal ?? 0,
        currency: frontmatter.currency || 'PEN',
        kms: kmsVal ?? 0,
        displacement: dispVal,
        power: frontmatter.power || '',
        fuel: frontmatter.fuel || '',
        transmission: frontmatter.transmission || '',
        city: frontmatter.city || frontmatter.location || '',
        location: frontmatter.city || frontmatter.location || '',
        color: frontmatter.color || '',
        originCountry: frontmatter.originCountry || '',
        keysCount: parseNum(frontmatter.keysCount),
        citvValidity: frontmatter.citvValidity || '',
        vatType: frontmatter.vatType || '',
        lastRevisionDate: frontmatter.lastRevisionDate || '',
        revisionCenter: frontmatter.revisionCenter || '',
        revisionDateFormatted: frontmatter.revisionDateFormatted || '',
        revisionKms: parseNum(frontmatter.revisionKms),
        serviceHistory: Array.isArray(frontmatter.serviceHistory) ? frontmatter.serviceHistory : [],
        componentScores: typeof frontmatter.componentScores === 'object' && frontmatter.componentScores ? frontmatter.componentScores : undefined,
        reserved: Boolean(frontmatter.reserved),
        featured: frontmatter.featured !== false,
        featuredImage: frontmatter.featuredImage || frontmatter.image || '',
        gallery: Array.isArray(frontmatter.gallery) ? frontmatter.gallery : (frontmatter.featuredImage ? [frontmatter.featuredImage] : []),
        imperfections: Array.isArray(frontmatter.imperfections) ? frontmatter.imperfections : [],
        description: frontmatter.description || body || '',
        published: frontmatter.published !== false,
        isOffer: Boolean(frontmatter.isOffer || discountVal),
        discountPrice: discountVal,
        badge: frontmatter.badge,
        seo: {
          title: `${frontmatter.brand || ''} ${frontmatter.model || ''}`.trim(),
          description: frontmatter.description || body || ''
        }
      });
    }

    return motos;
  } catch (error) {
    console.error('Error loading motorcycles from Pages CMS:', error);
    return [];
  }
}

export function loadAllBlogPostsFromCms(): BlogPostContent[] {
  try {
    const modules = import.meta.glob('/content/blog/*.md', { query: '?raw', eager: true });
    const posts: BlogPostContent[] = [];

    for (const [filepath, mod] of Object.entries(modules)) {
      const rawContent = typeof mod === 'string' ? mod : (mod as any)?.default || '';
      if (!rawContent) continue;

      const { frontmatter, body } = parseMarkdownFile(rawContent, filepath);
      const filename = filepath.split('/').pop()?.replace('.md', '') || '';
      const slug = frontmatter.slug || filename;

      posts.push({
        id: slug,
        slug: slug,
        title: frontmatter.title || 'Sin Título',
        excerpt: frontmatter.excerpt || frontmatter.description || '',
        category: frontmatter.category || 'General',
        cover: frontmatter.image || frontmatter.cover || 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=800&q=80',
        readTime: frontmatter.readTime || '5 min',
        date: frontmatter.date ? String(frontmatter.date) : new Date().toISOString().split('T')[0],
        published: frontmatter.published !== false,
        author: {
          name: frontmatter.authorName || frontmatter.author?.name || 'Equipo Kaelos',
          role: frontmatter.authorRole || frontmatter.author?.role || 'Redacción Kaelos',
          avatar: frontmatter.authorAvatar || frontmatter.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        },
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        seo: {
          title: frontmatter.title || 'Sin Título',
          description: frontmatter.excerpt || frontmatter.description || ''
        },
        body
      });
    }

    return posts;
  } catch (error) {
    console.error('Error loading blog posts from Pages CMS:', error);
    return [];
  }
}

export function loadAllFaqsFromCms(): any[] {
  try {
    const modules = import.meta.glob('/content/faqs/*.md', { query: '?raw', eager: true });
    const categoryMap: Record<string, any[]> = {};

    const entries = Object.entries(modules);
    if (entries.length === 0) return [];

    for (const [filepath, mod] of entries) {
      const rawContent = typeof mod === 'string' ? mod : (mod as any)?.default || '';
      if (!rawContent) continue;

      const { frontmatter, body } = parseMarkdownFile(rawContent, filepath);
      const filename = filepath.split('/').pop()?.replace('.md', '') || '';
      const slug = frontmatter.slug || filename;
      const question = frontmatter.title || frontmatter.question || 'Pregunta';
      const category = frontmatter.category || 'General';
      const order = typeof frontmatter.order === 'number' ? frontmatter.order : 99;

      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }

      categoryMap[category].push({
        id: slug,
        question,
        answer: body,
        order
      });
    }

    const categories = Object.entries(categoryMap).map(([categoryName, items]) => {
      items.sort((a, b) => (a.order || 99) - (b.order || 99));
      return {
        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: categoryName,
        items: items.map(({ id, question, answer }) => ({ id, question, answer }))
      };
    });

    return categories;
  } catch (error) {
    console.error('Error loading FAQs from Pages CMS:', error);
    return [];
  }
}

export async function loadAllPagesFromCms(): Promise<any[]> {
  return [];
}

export async function loadSettingsFromCms(): Promise<any | null> {
  return null;
}

export function resolveImageUrl(url?: string): string {
  if (!url) return '';
  return url;
}

