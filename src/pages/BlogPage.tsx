import React, { useState, useMemo, useEffect } from 'react';
import { useFuseSearch } from '../hooks/useFuseSearch';
import { toSlug } from '../utils/router';
import { loadAllBlogPostsFromContent, fetchAllBlogPostsAsync } from '../data/staticContent';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { getArticleSchema, updateHeadTags } from '../utils/seo';
import { SearchBar } from '../components/SearchBar';
import { BlogGridSection } from '../components/BlogGridSection';
import { BottomCatalogCTA } from '../components/BottomCatalogCTA';
import { 
  Search, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Send,
  Sparkles,
  FileText,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  category: string;
  image: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  likes: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'guia-compra-scooter-125',
    title: 'Las mejores scooters de 125cc para moverte por la ciudad en 2026',
    excerpt: '¿Pensando en comprar un scooter de 125 para evitar los atascos? Analizamos los modelos líderes en consumo, fiabilidad y capacidad de carga.',
    category: 'Guías de Compra',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min',
    date: '18 Jul 2026',
    author: {
      name: 'Carlos Ruiz',
      role: 'Experto en Movilidad Urbana',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    tags: ['Scooter', 'Ciudad', '125cc', 'Licencia BII'],
    likes: 124,
    content: (
      <div className="space-y-6 text-slate-700 leading-relaxed font-medium">
        <p className="text-lg text-slate-800 font-semibold leading-relaxed">
          La movilidad urbana ha cambiado drásticamente en los últimos años. Las restricciones de tráfico, el coste del combustible y la necesidad de ahorrar tiempo en los desplazamientos diarios han convertido a los scooters de 125cc en los reyes indiscutibles del asfalto de nuestras ciudades.
        </p>
        
        <h2 className="text-xl font-extrabold text-[#111215] mt-8 tracking-tight">
          ¿Por qué un scooter de 125cc es la mejor opción?
        </h2>
        <p>
          Con la licencia de conducir Clase BII-a, cualquier conductor puede ponerse a los mandos de un scooter de 125cc para desplazarse ágilmente por la ciudad. Esto abre la puerta a un ahorro drástico en tiempos de trayecto y en combustible, con medias que apenas superan los 2.2 litros a los 100 km.
        </p>

        <h2 className="text-xl font-extrabold text-[#111215] mt-8 tracking-tight">
          Factores clave antes de tomar tu decisión
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-slate-900">Rueda alta vs. Rueda pequeña:</strong> Los de rueda alta (16 pulgadas) ofrecen máxima estabilidad en avenidas y baches, mientras que los de rueda pequeña ganan en maniobrabilidad en calles estrechas y hueco bajo el asiento.</li>
          <li><strong className="text-slate-900">Frenada combinada (CBS) o ABS:</strong> Siempre que tu presupuesto lo permita, opta por sistemas con ABS de doble canal para evitar bloqueos en mojado.</li>
          <li><strong className="text-slate-900">Capacidad de almacenamiento:</strong> Comprueba si cabe un casco integral bajo el asiento sin esfuerzo.</li>
        </ul>

        <div className="bg-slate-50 border-l-4 border-[#ff0d41] p-5 rounded-r-2xl my-6">
          <p className="text-sm font-bold text-[#111215]">
            💡 Consejo Kaelos:
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Si vas a hacer tramos diarios de autopista o circunvalación (M-30, Ronda de Dalt, V-30), busca modelos de 125cc con motores de 14 o 15 CV (el límite legal) para mantener un ritmo fluido de 100-110 km/h sin forzar la mecánica.
          </p>
        </div>
      </div>
    )
  }
];

interface BlogPageProps {
  onNavigate: (page: any) => void;
  selectedPostId: string | null;
  onSelectPostId: (id: string | null) => void;
}

export default function BlogPage({ onNavigate, selectedPostId, onSelectPostId }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Array<{name: string, date: string, text: string}>>>({});
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [isPagesCmsModalOpen, setIsPagesCmsModalOpen] = useState(false);

  // Always scroll to top when opening article, changing category, or searching
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedPostId, selectedCategory]);

  const [dbBlogPosts, setDbBlogPosts] = useState<BlogPost[]>([]);
  const [isBlogLoading, setIsBlogLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDbBlogPosts() {
      try {
        const posts = await fetchAllBlogPostsAsync();
        if (posts && posts.length > 0) {
          setDbBlogPosts(
            posts.map((p) => ({
              id: p.id || p.slug,
              title: p.title,
              excerpt: p.excerpt || p.description || '',
              content: p.body,
              category: p.category || 'Novedades',
              image: p.cover || 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=800&q=80',
              readTime: p.readTime || '5 min',
              date: p.date || '2026',
              author: {
                name: p.author?.name || 'Redacción Kaelos',
                role: p.author?.role || 'Especialista',
                avatar: p.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              },
              tags: p.tags || [],
              likes: 120,
            }))
          );
        }
      } finally {
        setIsBlogLoading(false);
      }
    }
    loadDbBlogPosts();
  }, []);

  const cmsPosts: BlogPost[] = useMemo(() => {
    const raw = loadAllBlogPostsFromContent();
    return raw.map((p) => ({
      id: p.id || p.slug,
      title: p.title,
      excerpt: p.excerpt || p.description || '',
      content: p.body,
      category: p.category || 'Novedades',
      image: p.cover || 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=800&q=80',
      readTime: p.readTime || '5 min',
      date: p.date || '2026',
      author: {
        name: p.author?.name || 'Redacción Kaelos',
        role: p.author?.role || 'Especialista',
        avatar: p.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      },
      tags: p.tags || [],
      likes: 120,
    }));
  }, []);

  const blogPosts = useMemo(() => {
    const postMap = new Map<string, BlogPost>();
    [...dbBlogPosts, ...cmsPosts, ...BLOG_POSTS].forEach((p) => {
      if (p && p.id && !postMap.has(p.id)) {
        postMap.set(p.id, p);
      }
    });
    return Array.from(postMap.values());
  }, [dbBlogPosts, cmsPosts]);

  // Dynamic categories derived from base list and any posts from DB/CMS
  const categories = useMemo(() => {
    const baseCats = ['Todos', 'Guías de Compra', 'Novedades', 'Rutas y Viajes'];
    const set = new Set<string>(baseCats);
    blogPosts.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [blogPosts]);

  const searchableBlogPosts = useMemo(() => {
    return blogPosts.map((post) => ({
      ...post,
      fullText: [
        post.title,
        post.excerpt || '',
        post.category || '',
        Array.isArray(post.tags) ? post.tags.join(' ') : post.tags || '',
        post.author?.name || '',
        post.content || '',
      ]
        .filter(Boolean)
        .join(' '),
    }));
  }, [blogPosts]);

  const blogSearchKeys = useMemo(
    () => [
      { name: 'fullText', weight: 0.4 },
      { name: 'title', weight: 0.3 },
      { name: 'category', weight: 0.15 },
      { name: 'tags', weight: 0.1 },
      { name: 'excerpt', weight: 0.05 },
    ],
    []
  );

  const blogSearchResults = useFuseSearch<BlogPost & { fullText: string }>({
    data: searchableBlogPosts,
    query: searchQuery,
    keys: blogSearchKeys,
    threshold: 0.35,
  });

  const blogSearchMatchingIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return new Set(blogSearchResults.map((post) => post.id));
  }, [searchQuery, blogSearchResults]);

  // Filter blog posts based on search and category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = !blogSearchMatchingIds || blogSearchMatchingIds.has(post.id);
      const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, blogSearchMatchingIds, selectedCategory]);

  const activePost = useMemo(() => {
    if (!selectedPostId) return null;
    const targetSlug = selectedPostId.toLowerCase();
    return blogPosts.find(p => 
      p.id.toLowerCase() === targetSlug || 
      toSlug(p.title) === targetSlug || 
      toSlug(p.id) === targetSlug
    ) || null;
  }, [blogPosts, selectedPostId]);

  // Update SEO Head and inject Article Schema.org when reading an active blog post
  useEffect(() => {
    if (activePost) {
      const postSlug = toSlug(activePost.title);
      const articleSchema = getArticleSchema({
        id: activePost.id,
        title: activePost.title,
        excerpt: activePost.excerpt,
        category: activePost.category,
        image: activePost.image,
        date: activePost.date,
        author: activePost.author,
        slug: postSlug,
      });

      updateHeadTags(
        {
          title: `${activePost.title} | Blog KAELOS`,
          description: activePost.excerpt,
          canonical: `/blog/${postSlug}`,
          ogImage: activePost.image,
          ogImageAlt: activePost.title,
          type: 'article',
          twitterCard: 'summary_large_image',
          publishedTime: activePost.date,
          robots: 'index, follow, max-image-preview:large',
          keywords: activePost.tags || ['blog', 'motos', 'kaelos'],
        },
        [
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: activePost.title, url: `/blog/${postSlug}` }
        ],
        [articleSchema]
      );
    }
  }, [activePost]);

  const handleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasLiked = likedPosts[id];
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    
    // Calculate current like count
    const post = blogPosts.find(p => p.id === id);
    const baseLikes = post ? post.likes : 0;
    setPostLikes(prev => ({
      ...prev,
      [id]: hasLiked ? (prev[id] ?? baseLikes) - 1 : (prev[id] ?? baseLikes) + 1
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !newCommentName.trim() || !newCommentText.trim()) return;

    const newComment = {
      name: newCommentName.trim(),
      date: 'Hoy',
      text: newCommentText.trim()
    };

    setComments(prev => ({
      ...prev,
      [selectedPostId]: [newComment, ...(prev[selectedPostId] || [])]
    }));

    setNewCommentName('');
    setNewCommentText('');
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const handleSharePost = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: activePost?.title,
        text: activePost?.excerpt,
        url: currentUrl
      }).catch(() => {
        navigator.clipboard.writeText(currentUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(currentUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleShareCard = (post: BlogPost, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `${window.location.origin}/blog/${toSlug(post.title)}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: postUrl,
      }).catch(() => {
        navigator.clipboard.writeText(postUrl);
        setCopiedCardId(post.id);
        setTimeout(() => setCopiedCardId(null), 2500);
      });
    } else {
      navigator.clipboard.writeText(postUrl);
      setCopiedCardId(post.id);
      setTimeout(() => setCopiedCardId(null), 2500);
    }
  };

  const activePostLikes = activePost ? (postLikes[activePost.id] ?? activePost.likes) : 0;
  const activePostBookmarked = activePost ? !!bookmarkedPosts[activePost.id] : false;
  const activePostLiked = activePost ? !!likedPosts[activePost.id] : false;
  const activePostComments = activePost ? (comments[activePost.id] || [
    { name: 'Miguel Ángel', date: 'Hace 2 días', text: '¡Excelente artículo! Muy bien estructurado y de gran ayuda.' },
    { name: 'Sonia Gómez', date: 'Hace 4 días', text: 'Me viene de perlas, justo estaba dudando entre el primer y segundo modelo.' }
  ]) : [];

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen text-slate-900 font-sans select-none relative" id="blog-root">
      
      {!selectedPostId ? (
        <>
          {/* 2. CATEGORY BAR SECTION */}
          <section className="bg-white border-b border-slate-100 py-2.5 sm:py-4 sticky top-14 sm:top-16 z-30 shadow-sm" id="blog-category-bar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-3">
              {/* Search input inside Hero */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                className="max-w-2xl"
              />
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#111215] text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#111215]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 3. FEATURED POSTS / GRID */}
          <BlogGridSection
            filteredPosts={filteredPosts}
            bookmarkedPosts={bookmarkedPosts}
            likedPosts={likedPosts}
            postLikes={postLikes}
            copiedCardId={copiedCardId}
            onSelectPostId={onSelectPostId}
            handleLike={handleLike}
            handleShareCard={handleShareCard}
            isLoading={isBlogLoading}
            onResetFilters={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
            }}
          />
        </>
      ) : (
        /* IMMERSIVE READING MODE VIEW */
        activePost && (
          <div className="w-full bg-white pb-20" id="blog-reading-view">
            
            {/* Elegant Header with Floating Action Buttons */}
            <div className="sticky top-14 sm:top-16 bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5 z-40" id="reading-bar">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPostId(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#111215] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  VOLVER
                </a>
                
                <div className="flex items-center gap-2">


                  <button
                    onClick={handleSharePost}
                    className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                      shareCopied 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Compartir artículo"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Immersive Main Container */}
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 text-left">
              
              {/* Category tag */}
              <div>
                <span className="text-xs font-black text-[#ff0d41] uppercase tracking-widest">
                  {activePost.category}
                </span>
                
                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111215] tracking-tight leading-snug mt-2">
                  {activePost.title}
                </h1>
              </div>

              {/* Author & Meta details */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={activePost.author.avatar} 
                    alt={activePost.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">
                      Por {activePost.author.name}
                    </span>
                    <span className="text-xs font-medium text-slate-400 block">
                      {activePost.author.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {activePost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activePost.readTime} de lectura
                  </span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-50 relative">
                <img 
                  src={activePost.image} 
                  alt={activePost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body Content */}
              <div className="prose prose-slate max-w-none pb-12 border-b border-slate-100">
                {typeof activePost.content === 'string' ? (
                  <MarkdownRenderer content={activePost.content} />
                ) : (
                  activePost.content
                )}
              </div>





              {/* Bottom Catalog CTA */}
              <BottomCatalogCTA onNavigate={onNavigate} />

            </article>

          </div>
        )
      )}

      {/* PAGES CMS INTEGRATION MODAL */}
      {isPagesCmsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-left relative">
            <button
              onClick={() => setIsPagesCmsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Integración con Pages CMS</h3>
                <p className="text-xs text-slate-500 font-medium">Gestor de contenidos rápido y sin servidor (pagescms.org)</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Archivo de configuración:</strong> <code>.pages.yml</code> creado en la raíz del proyecto.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Colección de Blog:</strong> Los artículos se guardan en formato Markdown en <code>content/blog/*.md</code> con metadatos YAML.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Gestión multimedia:</strong> Las imágenes se organizan en <code>public/uploads</code>.
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              Para agregar o editar artículos desde la interfaz gráfica de Pages CMS, conecta tu repositorio GitHub a <a href="https://app.pagescms.org" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold underline">app.pagescms.org</a>. Pages CMS leerá automáticamente la configuración de <code>.pages.yml</code>.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://app.pagescms.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-slate-900 text-white hover:bg-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Abrir Pages CMS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsPagesCmsModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
