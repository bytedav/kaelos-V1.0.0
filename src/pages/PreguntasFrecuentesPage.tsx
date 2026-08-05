import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useFuseSearch } from '../hooks/useFuseSearch';
import { loadAllFaqsFromContent, fetchAllFaqsAsync } from '../data/staticContent';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { getFAQSchema, updateHeadTags } from '../utils/seo';
import { SearchBar } from '../components/SearchBar';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  plainTextAnswer?: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

interface PreguntasFrecuentesPageProps {
  onNavigate: (page: any) => void;
}

export default function PreguntasFrecuentesPage({ onNavigate }: PreguntasFrecuentesPageProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dbFaqCategories, setDbFaqCategories] = useState<FAQCategory[]>([]);

  // Always scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    async function loadFaqs() {
      const dbCategories = await fetchAllFaqsAsync();
      if (dbCategories && dbCategories.length > 0) {
        setDbFaqCategories(
          dbCategories.map((cat) => ({
            title: cat.category,
            items: cat.items.map((item) => ({
              id: item.id,
              question: item.question,
              answer: typeof item.answer === 'string' ? <MarkdownRenderer content={item.answer} /> : item.answer,
              plainTextAnswer: typeof item.answer === 'string' ? item.answer : undefined,
            })),
          }))
        );
      }
    }
    loadFaqs();
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/34600000000?text=Hola,%20tengo%20una%20pregunta%20sobre%20Kaelos.', '_blank');
  };

  const cmsFaqs: FAQCategory[] = useMemo(() => {
    const rawCategories = loadAllFaqsFromContent();
    return rawCategories.map((cat) => ({
      title: cat.category,
      items: cat.items.map((item) => ({
        id: item.id,
        question: item.question,
        answer: typeof item.answer === 'string' ? <MarkdownRenderer content={item.answer} /> : item.answer,
        plainTextAnswer: typeof item.answer === 'string' ? item.answer : undefined,
      })),
    }));
  }, []);

  const faqData = useMemo(() => {
    if (dbFaqCategories && dbFaqCategories.length > 0) {
      return dbFaqCategories;
    }
    return cmsFaqs;
  }, [dbFaqCategories, cmsFaqs]);

  // Flatten all FAQ items for Fuse.js indexing and schema generation
  const allFaqItems = useMemo(
    () => faqData.flatMap((category) => category.items),
    [faqData]
  );

  const searchableFaqItems = useMemo(
    () =>
      allFaqItems.map((item) => ({
        ...item,
        fullText: `${item.question} ${item.answer}`,
      })),
    [allFaqItems]
  );

  const faqSearchKeys = useMemo(
    () => [
      { name: 'question', weight: 0.6 },
      { name: 'answer', weight: 0.3 },
      { name: 'fullText', weight: 0.4 },
    ],
    []
  );

  const faqSearchResults = useFuseSearch<FAQItem & { fullText: string }>({
    data: searchableFaqItems,
    query: searchQuery,
    keys: faqSearchKeys,
    threshold: 0.35,
  });

  const faqMatchingIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return new Set(faqSearchResults.map((item) => item.id));
  }, [searchQuery, faqSearchResults]);

  // Filter FAQ based on search query
  const filteredFaqData = faqData
    .map((category) => {
      const filteredItems = category.items.filter((item) =>
        !faqMatchingIds || faqMatchingIds.has(item.id)
      );
      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((category) => category.items.length > 0);

  // Inject FAQ Schema.org JSON-LD for rich snippet results and AI search engine grounding (AEO)
  useEffect(() => {
    const faqSchemaItems = allFaqItems.slice(0, 20).map((item) => ({
      question: item.question,
      answer: item.plainTextAnswer || (typeof item.answer === 'string' ? item.answer : item.question),
    }));

    const faqSchema = getFAQSchema(faqSchemaItems);
    updateHeadTags(
      {
        title: 'Preguntas Frecuentes y Ayuda | KAELOS',
        description: 'Encuentra respuestas a todas tus preguntas sobre compra, venta, tasación, financiación y garantía de motocicletas en KAELOS.',
        canonical: '/preguntas-frecuentes',
        robots: 'index, follow',
        keywords: ['preguntas frecuentes', 'faq kaelos', 'garantia moto', 'comprar moto peru', 'financiacion motos'],
      },
      [
        { name: 'Inicio', url: '/' },
        { name: 'Preguntas Frecuentes', url: '/preguntas-frecuentes' }
      ],
      [faqSchema]
    );
  }, [allFaqItems]);

  return (
    <div className="w-full bg-[#fcfcfd] min-h-screen text-slate-900 font-sans select-none relative" id="preguntas-frecuentes-root">
      
      {/* 1. HERO / TITLE SECTION */}
      <section className="bg-white pt-20 pb-6 border-b border-slate-100" id="faq-header-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Preguntas frecuentes
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111215] tracking-tight mb-4">
            ¿Tienes preguntas? Encuentra tu respuesta
          </h1>

          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Buscar preguntas..."
            className="max-w-xl"
          />
        </div>
      </section>

      {/* 2. FAQ ACCORDION SECTION */}
      <section className="py-8 md:py-10" id="faq-content-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((category, catIndex) => (
              <div key={catIndex} className="space-y-4">
                {/* Category Header */}
                <h2 className="text-xl font-extrabold text-[#111215] tracking-tight border-b border-slate-100 pb-2 mb-4">
                  {category.title}
                </h2>

                {/* Items */}
                <div className="space-y-3">
                  {category.items.map((item) => {
                    const isOpen = !!openItems[item.id];
                    return (
                      <div key={item.id} className="transition-all duration-300">
                        {isOpen ? (
                          // Expanded state looks like Image 3: bordered gray container
                          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="w-full flex items-start text-left focus:outline-none cursor-pointer group"
                            >
                              <span className="text-[#ff0d41] font-black text-2xl mr-3.5 leading-none shrink-0 select-none">
                                −
                              </span>
                              <span className="text-sm sm:text-base font-extrabold text-[#111215] tracking-tight leading-snug">
                                {item.question}
                              </span>
                            </button>
                            <div className="pl-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                              {typeof item.answer === 'string' ? (
                                <MarkdownRenderer content={item.answer} />
                              ) : (
                                item.answer
                              )}
                            </div>
                          </div>
                        ) : (
                          // Collapsed state looks like Image 1, 2, 4
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-start text-left py-3 px-1 hover:bg-slate-50/50 rounded-xl transition-all focus:outline-none cursor-pointer group"
                          >
                            <span className="text-[#ff0d41] font-black text-2xl mr-3.5 leading-none shrink-0 select-none">
                              +
                            </span>
                            <span className="text-sm sm:text-base font-bold text-slate-700 group-hover:text-[#111215] transition-colors tracking-tight leading-snug pt-0.5">
                              {item.question}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-lg text-slate-500 font-medium">
                No se han encontrado preguntas que coincidan con tu búsqueda.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm font-bold text-[#ff0d41] hover:underline cursor-pointer"
              >
                Ver todas las preguntas frecuentes
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. CONTACT / STILL HAVE QUESTIONS SECTION */}
      <section className="bg-slate-50 border-t border-slate-100 py-14" id="faq-help-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#111215]">
            ¿Sigues con dudas?
          </h3>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            Nuestro equipo de expertos está a tu entera disposición para resolver cualquier duda que tengas sobre la compra, venta o financiación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <WhatsAppButton
              label="CHATEAR POR WHATSAPP"
              message="Hola, tengo una pregunta sobre Kaelos."
              size="md"
            />
            <button
              onClick={() => onNavigate('compra')}
              className="px-6 py-3.5 rounded-xl bg-[#111215] hover:bg-black text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              VER CATÁLOGO DE MOTOS
            </button>
          </div>
        </div>
      </section>



    </div>
  );
}
