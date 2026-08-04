import React, { useState, useRef, useEffect } from 'react';
import { loadAllPagesFromContent, fetchAllPagesAsync } from '../data/staticContent';
import { PageContent } from '../types/content';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

interface AcercaDePageProps {
  onNavigate: (page: any) => void;
}

export const AcercaDePage: React.FC<AcercaDePageProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAboutPage() {
      const pages = await fetchAllPagesAsync();
      const about = pages.find((p) => p.slug === 'acerca-de' || p.id === 'acerca-de');
      if (about) setPageContent(about);
    }
    loadAboutPage();
  }, []);

  const staticPages = loadAllPagesFromContent();
  const cmsPageData = pageContent || staticPages.find((p) => p.slug === 'acerca-de');

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setScrollProgress(scrollLeft / totalScroll);
      }
    }
  };

  return (
    <div className="w-full bg-[#fafbfe] text-slate-900 min-h-screen font-sans" id="acerca-de-container">
      {/* MISSION, VISION & HISTORY SECTION */}
      <section className="pt-10 pb-10 md:pt-14 md:pb-14" id="acerca-de-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
          {/* Team image banner */}
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden aspect-[16/10] md:aspect-[3/1] min-h-[200px] w-full border border-slate-100 bg-slate-900 shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=80" 
              alt="Kaelos team" 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white text-center leading-tight tracking-tight drop-shadow-md">
                Mucho más que motos,<br className="hidden sm:inline" /> un equipo
              </h2>
            </div>
          </div>

          {/* Texts below */}
          <div className="space-y-4 max-w-full text-left">
            <div className="space-y-1.5">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                De dónde venimos
              </h2>
              <p className="text-slate-500 font-medium text-[15px] sm:text-base">
                Nuestra historia
              </p>
            </div>
            
            {cmsPageData?.body ? (
              <MarkdownRenderer content={cmsPageData.body} />
            ) : (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify md:text-left">
                Kaelos nació en el año 2019, en el parking de una casa donde dos amigos tenían una visión transformadora en mente, crear una plataforma que revolucionara la compra y venta de motos de segunda mano. Con sus conocimientos y guiados por su instinto, empezaron a comprar motos, repararlas y venderlas a otros moteros que, como ellos, querían un sistema fácil, rápido y seguro. En cuestión de tiempo, se convirtieron en los líderes del mercado y pudieron expandir sus operaciones y ampliar su inventario, teniendo el mayor stock de motos de segunda mano de todo el Perú. De la plaza de parking a un almacén con oficinas. De 1 a 200 empleados. Y ahora, cada mes, de Lima a los hogares de cientos de moteros en todas las regiones del Perú. Un único objetivo: Ser el Amazon de las motos.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* OUR VALUES - EXACT DESIGN, COPYS AND FORMS FROM THE IMAGES */}
      <section className="py-10 md:py-14 bg-white border-t border-slate-100" id="acerca-de-valores">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header left-aligned exactly like the screenshots */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Lo que nos define
            </h2>
            <p className="text-slate-500 font-medium text-[15px] sm:text-base">
              Nuestros valores
            </p>
          </div>

          {/* Desktop 3x2 Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-x-8 gap-y-12">
            {/* Card 1: Pasionales */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" 
                  alt="Pasionales" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Pasionales
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Queremos que cada persona elija libremente cómo quiere disfrutar su camino.
              </p>
            </div>

            {/* Card 2: Sostenibles */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80" 
                  alt="Sostenibles" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Sostenibles
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Queremos impulsar una interacción más natural y consciente con el mundo que nos rodea.
              </p>
            </div>

            {/* Card 3: Ambiciosos */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Ambiciosos" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Ambiciosos
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                No damos nada por sentado. Pensamos más allá y nos atrevemos a fallar para aprender rápido.
              </p>
            </div>

            {/* Card 4: Transparentes */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80" 
                  alt="Transparentes" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Transparentes
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Porque queremos que nuestros clientes tomen las decisiones importantes. La confianza nos ayuda a caminar juntos más lejos.
              </p>
            </div>

            {/* Card 5: Excelentes */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80" 
                  alt="Excelentes" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Excelentes
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sabemos lo que hacemos, y sabemos cómo mejorar. Solucionar problemas complejos nos inspira para seguir creciendo.
              </p>
            </div>

            {/* Card 6: Profesionales */}
            <div className="space-y-4 text-left">
              <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80" 
                  alt="Profesionales" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Profesionales
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Conocemos a la perfección nuestro producto y ofrecemos soluciones de movilidad para cada persona.
              </p>
            </div>
          </div>

          {/* Mobile Horizontally Scrollable Row with Scroll Indicator */}
          <div className="block md:hidden space-y-6">
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Mobile Card 1 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" 
                    alt="Pasionales" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Pasionales
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Queremos que cada persona elija libremente cómo quiere disfrutar su camino.
                </p>
              </div>

              {/* Mobile Card 2 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80" 
                    alt="Sostenibles" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Sostenibles
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Queremos impulsar una interacción más natural y consciente con el mundo que nos rodea.
                </p>
              </div>

              {/* Mobile Card 3 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                    alt="Ambiciosos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Ambiciosos
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  No damos nada por sentado. Pensamos más allá y nos atrevemos a fallar para aprender rápido.
                </p>
              </div>

              {/* Mobile Card 4 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80" 
                    alt="Transparentes" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Transparentes
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Porque queremos que nuestros clientes tomen las decisiones importantes. La confianza nos ayuda a caminar juntos más lejos.
                </p>
              </div>

              {/* Mobile Card 5 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80" 
                    alt="Excelentes" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Excelentes
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sabemos lo que hacemos, y sabemos cómo mejorar. Solucionar problemas complejos nos inspira para seguir creciendo.
                </p>
              </div>

              {/* Mobile Card 6 */}
              <div className="w-[84%] flex-shrink-0 snap-center space-y-4 text-left">
                <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80" 
                    alt="Profesionales" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight">
                  Profesionales
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Conocemos a la perfección nuestro producto y ofrecemos soluciones de movilidad para cada persona.
                </p>
              </div>
            </div>

            {/* Custom Interactive Scroll Progress Bar at Bottom of Mobile List */}
            <div className="w-24 h-[3px] bg-slate-100 rounded-full mx-auto relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-[#ff0d41] rounded-full transition-all duration-75"
                style={{ 
                  width: '32px', 
                  left: `${scrollProgress * 64}px` 
                }}
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
