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
        answer: item.answer,
      })),
    }));
  }, []);

  const staticFaqData: FAQCategory[] = [
    {
      title: 'Vender o intercambiar',
      items: [
        {
          id: 'vender-sin-comprar',
          question: '¿Puedo venderos mi moto sin comprar una?',
          answer: (
            <span>
              Sí. Puedes enviarnos los detalles de tu moto a través del apartado "Vender" en el menú de esta página. Nuestros tasadores <strong className="font-extrabold text-[#111215]">evaluarán tu moto de manera gratuita e instantánea.</strong> Te ofrecerán un precio basado en la marca, modelo, año de matriculación, kilometraje y estado de tu moto.
            </span>
          )
        },
        {
          id: 'moto-parte-pago',
          question: '¿Puedo pagar ofreciendo mi moto usada como parte del pago?',
          answer: (
            <span>
              Sí, aceptamos tu moto usada como parte del pago para tu nueva moto. Tasamos tu moto actual de forma rápida y gratuita para descontar su valor de la nueva compra, lo que te permite estrenar moto de la manera más cómoda.
            </span>
          )
        },
        {
          id: 'entrega-moto-descuento',
          question: '¿Cómo funciona la entrega de mi moto antigua como descuento para una moto nueva?',
          answer: (
            <span>
              Tras realizar la tasación online o física, descontamos el valor de tasación acordado del precio total de tu nueva moto o del importe a financiar. Nosotros nos encargamos de recoger tu moto antigua en el mismo momento en que te entregamos tu nueva moto.
            </span>
          )
        },
        {
          id: 'ventajas-vender-kaelos',
          question: '¿Qué ventajas tengo al vender mi moto a Kaelos?',
          answer: (
            <span>
              Ofrecemos tasación gratuita en minutos, pago garantizado e inmediato, nos encargamos de todo el papeleo y el cambio de nombre, y recogemos la moto directamente en tu domicilio sin costes ocultos.
            </span>
          )
        },
        {
          id: 'documentacion-vender',
          question: '¿Qué documentación necesito para vender mi moto antigua?',
          answer: (
            <span>
              Necesitarás presentar la Tarjeta de Identificación Vehicular (TIV) original, el Certificado de Inspección Técnica Vehicular (CITV / Revisión Técnica en vigor si corresponde), el impuesto vehicular (SAT) si aplica y tu DNI o Carnet de Extranjería (CE) vigente.
            </span>
          )
        },
        {
          id: 'recogida-gratis',
          question: '¿Tengo que pagar por la recogida de mi moto antigua?',
          answer: (
            <span>
              No, la recogida de tu moto antigua es completamente gratuita en todo el Perú cuando realizas una operación de compra o venta con Kaelos.
            </span>
          )
        }
      ]
    },
    {
      title: 'Comprar una moto',
      items: [
        {
          id: 'reacondicionamiento',
          question: '¿Reacondicionáis vosotros las motos?',
          answer: (
            <span>
              Sí, todas nuestras motos de ocasión pasan por un riguroso proceso de revisión de más de 100 puntos críticos en nuestros propios talleres para garantizar que se encuentran en perfectas condiciones tanto mecánicas como estéticas antes de la entrega.
            </span>
          )
        },
        {
          id: 'ver-motos',
          question: '¿Puedo ir a ver las motos?',
          answer: (
            <span>
              ¡Por supuesto! Disponemos de grandes centros de exposición donde puedes ver físicamente nuestra amplia gama de motos de ocasión. Te recomendamos solicitar una cita previa con nuestro equipo comercial para ofrecerte una atención personalizada.
            </span>
          )
        },
        {
          id: 'reservar-moto',
          question: '¿Qué pasa cuando reservo una moto de segunda mano?',
          answer: (
            <span>
              Al realizar la reserva online, la moto queda bloqueada temporalmente en exclusiva para ti para evitar que otros compradores interesados puedan adquirirla. Un asesor comercial especializado se pondrá en contacto contigo de inmediato para guiarte en los siguientes pasos del proceso.
            </span>
          )
        },
        {
          id: 'documentos-comprar',
          question: '¿Qué documentos necesito para comprar una moto de ocasión?',
          answer: (
            <span>
              Para compras al contado, solo necesitamos tu DNI, NIE o pasaporte en vigor. Si optas por financiar la compra, se requerirá documentación adicional para el estudio financiero (como nóminas recientes, vida laboral o declaración de la renta).
            </span>
          )
        },
        {
          id: 'gastos-extra',
          question: '¿Hay gastos extra en la compra de la moto?',
          answer: (
            <span>
              Los precios de nuestras motos incluyen la revisión completa de entrega. Los costes correspondientes al cambio de nombre (gestoría oficial) y el transporte a domicilio (en caso de que prefieras recibirla en casa) se detallan de forma totalmente transparente antes del pago.
            </span>
          )
        },
        {
          id: 'sin-carnet',
          question: 'Quiero comprar una moto pero aún no tengo la licencia de conducir adecuada. ¿La puedo comprar igualmente?',
          answer: (
            <span>
              Sí, puedes comprar y registrar la moto a tu nombre sin disponer de la licencia de conducir Clase B en ese momento. No obstante, recuerda que legalmente no podrás conducirla por la vía pública hasta que obtengas el breve o brevete requerido.
            </span>
          )
        }
      ]
    },
    {
      title: 'Financiaciones y otros métodos de pago',
      items: [
        {
          id: 'formas-pago',
          question: '¿Qué formas de pago ofrece Kaelos?',
          answer: (
            <span>
              Ofrecemos múltiples opciones de pago: transferencia bancaria segura, pago con tarjeta de débito/crédito, y opciones de financiación 100% online y flexible adaptada a la cuota mensual que mejor se ajuste a tu presupuesto.
            </span>
          )
        },
        {
          id: 'precios-definitivos-financiacion',
          question: '¿Los precios de financiación que se muestran son los definitivos?',
          answer: (
            <span>
              Las cuotas mensuales que se muestran en el simulador son estimaciones orientativas basadas en las condiciones generales de las entidades financieras colaboradoras. Las condiciones finales y cuotas definitivas se confirman una vez que la entidad aprueba formalmente la solicitud.
            </span>
          )
        },
        {
          id: 'documentos-financiar',
          question: '¿Qué documentos necesito para financiar una moto de segunda mano?',
          answer: (
            <span>
              Normalmente se solicita: DNI o NIE en vigor, última nómina (o justificante de ingresos si eres autónomo o pensionista), un recibo bancario reciente donde conste tu número de cuenta (IBAN) para domiciliar los pagos y la última declaración de la Renta en algunos casos.
            </span>
          )
        },
        {
          id: 'requisitos-financiar',
          question: '¿Qué requisitos tengo que cumplir para financiar una moto de segunda mano?',
          answer: (
            <span>
              Para solicitar una financiación debes ser mayor de edad, residir legalmente en el Perú (DNI o CE), contar con ingresos regulares justificables (boletas de pago, recibos por honorarios o sustentación de ingresos) y mantener un historial crediticio adecuado en centrales de riesgo (como Infocorp / Sentinel).
            </span>
          )
        },
        {
          id: 'cancelar-financiacion',
          question: '¿Puedo saldar la financiación en cualquier momento?',
          answer: (
            <span>
              Sí, tienes derecho a realizar amortizaciones parciales o a cancelar anticipadamente la totalidad de tu préstamo en cualquier momento, de acuerdo con los límites de comisión regulados por ley (habitualmente del 0,5% al 1% sobre el capital pendiente).
            </span>
          )
        }
      ]
    },
    {
      title: 'Envíos y entregas',
      items: [
        {
          id: 'envio-casa',
          question: '¿Me enviáis la moto a mi casa?',
          answer: (
            <span>
              Sí, realizamos envíos seguros directamente a tu domicilio en cualquier punto de todo el Perú. La moto es transportada en furgones o camiones especializados para vehículos de dos ruedas y se entrega totalmente lista para rodar.
            </span>
          )
        },
        {
          id: 'envios-islas',
          question: '¿Hacéis envíos a provincias y regiones del Perú?',
          answer: (
            <span>
              Sí, realizamos envíos a todas las regiones y provincias del Perú (Arequipa, Cusco, Trujillo, Piura, Huancayo, Chiclayo, Iquitos, etc.). Consulta con nuestro equipo para conocer las tarifas de transporte y tiempos de entrega.
            </span>
          )
        },
        {
          id: 'recibir-otra-persona',
          question: '¿Tengo que recibir yo la moto o puede hacerlo alguien en mi lugar?',
          answer: (
            <span>
              Recomendamos que sea el propio comprador quien reciba el vehículo para verificar su estado. No obstante, puedes autorizar por escrito a un tercero mayor de edad, aportando una copia de tu DNI y del documento de autorización firmado.
            </span>
          )
        },
        {
          id: 'documentacion-definitiva',
          question: '¿Cuándo recibiré mi tarjeta de identificación vehicular y toda la documentación?',
          answer: (
            <span>
              Junto con la entrega de la moto, te facilitamos la documentación de trámite registral para que puedas rodar de forma 100% legal. La Tarjeta de Identificación Vehicular (TIV) definitiva tramitada a tu nombre ante SUNARP se gestionará de manera rápida y segura.
            </span>
          )
        }
      ]
    },
    {
      title: 'Garantías y seguros',
      items: [
        {
          id: 'garantia-moto',
          question: '¿Tengo garantía al comprar una moto de segunda mano?',
          answer: (
            <span>
              Sí, absolutamente. Todas nuestras motos de ocasión cuentan por contrato con una garantía completa de 12 meses de duración a partir del momento de la entrega, cubriendo cualquier avería mecánica que no se deba al desgaste habitual por uso.
            </span>
          )
        },
        {
          id: 'ventajas-pack-completo',
          question: '¿Qué ventajas tiene el Pack Completo?',
          answer: (
            <span>
              El Pack Completo te ofrece la máxima tranquilidad al incluir la extensión de garantía mecánica, coberturas especiales de mantenimiento periódico en nuestros talleres oficiales y servicios VIP de asistencia en viaje.
            </span>
          )
        },
        {
          id: 'ampliar-garantia',
          question: '¿Puedo ampliar la garantía?',
          answer: (
            <span>
              Sí, durante el proceso de compra de tu moto puedes contratar una ampliación de garantía de 12 meses adicionales, disfrutando así de un total de 24 meses de cobertura y seguridad completas.
            </span>
          )
        },
        {
          id: 'moto-sustitucion',
          question: '¿Tendré moto de sustitución?',
          answer: (
            <span>
              Sí, en caso de que contrates los servicios de cobertura premium o el Pack Completo, tendrás derecho a una moto de sustitución gratuita durante el tiempo que dure la reparación en garantía, sujeto a las condiciones de la póliza contratada.
            </span>
          )
        },
        {
          id: 'moto-sustitucion-islas',
          question: '¿Tendré moto de sustitución en provincias?',
          answer: (
            <span>
              El servicio de moto de sustitución en provincias está sujeto a la disponibilidad geográfica local de nuestros centros autorizados y coberturas de tu contrato. Consulta los detalles específicos con tu asesor comercial.
            </span>
          )
        },
        {
          id: 'recompra-asegurada',
          question: '¿Cómo funciona la recompra asegurada de mi moto?',
          answer: (
            <span>
              Kaelos te garantiza por contrato la recompra del vehículo a un valor mínimo pactado si decides venderla de nuevo tras un plazo establecido. Esto te protege de la devaluación y facilita que cambies de moto de forma económica cuando lo desees.
            </span>
          )
        },
        {
          id: 'taller-garantia-coste',
          question: '¿Tengo que pagar algo al enviar mi moto en garantía al taller de Kaelos?',
          answer: (
            <span>
              No. Si el vehículo requiere una reparación que entra dentro de las condiciones de la garantía oficial contratada, tanto la mano de obra especializada como las piezas de recambio oficiales sustituidas serán 100% gratuitas para ti.
            </span>
          )
        }
      ]
    },
    {
      title: 'Devoluciones',
      items: [
        {
          id: 'devolucion-reserva',
          question: 'Si cancelo una reserva ¿me devolvéis el dinero?',
          answer: (
            <span>
              Sí, si decides cancelar la reserva de una moto dentro de los plazos indicados y antes de formalizar el cambio de nombre, te reembolsaremos el 100% del importe depositado para la reserva de forma ágil y sin preguntas.
            </span>
          )
        },
        {
          id: 'desistimiento-compra',
          question: 'Ya tengo la moto y quiero devolverla, ¿cómo lo hago?',
          answer: (
            <span>
              Ofrecemos un derecho de desistimiento de 15 días o 1.000 kilómetros recorridos (lo que suceda antes). Si la moto no te convence por completo, puedes solicitar la devolución del vehículo y te reembolsaremos el importe abonado de acuerdo con las condiciones del contrato de desistimiento.
            </span>
          )
        }
      ]
    }
  ];

  const faqData = useMemo(() => {
    return [...cmsFaqs, ...staticFaqData];
  }, [cmsFaqs]);

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
