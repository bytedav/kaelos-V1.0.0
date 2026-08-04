import React from 'react';
import { navigateTo } from '../utils/router';

export interface FilterInfo {
  filterType: 'brand' | 'style' | 'city' | 'cc';
  value: string;
}

interface CatalogSEOSectionProps {
  onNavigate?: (page: string, filterInfo?: FilterInfo) => void;
}

const OCASION_BRANDS = [
  'Yamaha', 'Honda', 'Bajaj', 'TVS', 'Kawasaki', 'BMW', 'Kymco', 'Suzuki', 'KTM', 'SYM', 'Triumph',
  'Piaggio', 'Ducati', 'Zontes', 'Benelli', 'Keeway', 'Aprilia', 'Harley Davidson', 'Peugeot',
  'Vespa', 'Voge', 'Husqvarna', 'Royal Enfield', 'CFMoto', 'Mitt', 'QJMotor', 'Moto Guzzi',
  'Rieju', 'Brixton', 'FB Mondial', 'Hyosung', 'Daelim', 'Nmoto', 'UM', 'Wottan', 'MV Agusta',
  'Motor Hispania', 'Hanway', 'Indian', 'Leonart', 'Moto Morini', 'Mash', 'Fantic', 'Swm',
  'Askoll', 'Gas Gas', 'Malaguti', 'Mutt', 'Motron', 'Velca', 'Orcal', 'Horwin', 'Sherco', 'Beta',
  'Royal Alloy', 'Nerva', 'Arena', 'Lambretta', 'Seat', 'Italjet', 'Morbidelli', 'Derbi',
  'Segway', 'Ajp', 'Malcor', 'Lvneng', 'Sumco', 'Gilera', 'Victory', 'Joyner', 'Goes', 'Benda',
  'FK Motors', 'Riya', 'TM', 'Jin Lun', 'Lintex', 'Monkey Bikes', 'Bullit', 'Ronco', 'Wanxin',
  'Senda', 'Lifan', 'Zongshen', 'Nexus'
];

const ESTILOS = [
  'Scooter', 'Naked', 'Deportiva', 'Trail', 'Touring', 'Custom',
  'Clásica', 'Off-road', 'Maxi Scooter', 'Supermotard', 'Tres ruedas'
];

const CIUDADES_PERU = [
  'Lima - Surco', 'Lima - Los Olivos', 'Arequipa', 'Trujillo',
  'Chiclayo', 'Piura', 'Cusco', 'Huancayo',
  'Ica', 'Tacna', 'Chimbote', 'Cajamarca',
  'Juliaca', 'Pucallpa', 'Iquitos', 'Tarapoto',
  'Ayacucho', 'Huánuco', 'Sullana', 'Chincha'
];

const CILINDRADAS = ['50cc', '125cc', '250cc', '500cc'];


const toSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const cityToSlug = (city: string) => {
  const clean = city.toLowerCase();
  if (clean.includes('surco')) return 'lima-surco';
  if (clean.includes('los olivos')) return 'lima-los-olivos';
  if (clean.includes('lima')) return 'lima';
  return toSlug(city);
};

export const CatalogSEOSection: React.FC<CatalogSEOSectionProps> = ({ onNavigate }) => {
  
  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: 'compra' | 'renting',
    filterType: 'brand' | 'style' | 'city' | 'cc',
    value: string,
    href: string
  ) => {
    e.preventDefault();

    // Push new state into browser location history
    navigateTo(href);

    if (onNavigate) {
      onNavigate(page, { filterType, value });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white border-t border-slate-200/80 pt-10 pb-12 text-[#111215] font-sans">
      <div className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Motos de Ocasión Layout */}
        <div className="space-y-6">
          <a
            href="/motos"
            onClick={(e) => handleItemClick(e, 'compra', 'brand', 'all', '/motos')}
            className="text-2xl sm:text-[26px] font-black text-[#111215] tracking-tight hover:text-[#ff0d41] transition-colors block"
          >
            Motos de ocasión y catálogo
          </a>

          {/* Marcas */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-[#111215] tracking-tight">
              Marcas
            </h3>
            <div className="text-[12px] sm:text-[13px] font-medium leading-relaxed text-[#8c96a3]">
              {OCASION_BRANDS.map((brand, idx) => {
                const href = `/motos?marca=${toSlug(brand)}`;
                return (
                  <a
                    key={`ocasion-brand-${idx}`}
                    href={href}
                    onClick={(e) => handleItemClick(e, 'compra', 'brand', brand, href)}
                    className="hover:text-[#111215] transition-colors cursor-pointer inline-block mr-3 mb-1.5"
                  >
                    {brand}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sub-sections */}
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-6 pt-2">
            
            {/* Estilos */}
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-sm font-black text-[#111215] tracking-tight">
                Estilos
              </h3>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[12px] sm:text-[13px] font-medium text-[#8c96a3]">
                {ESTILOS.map((estilo, idx) => {
                  const href = `/motos/${toSlug(estilo)}`;
                  return (
                    <a
                      key={`ocasion-estilo-${idx}`}
                      href={href}
                      onClick={(e) => handleItemClick(e, 'compra', 'style', estilo, href)}
                      className="hover:text-[#111215] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {estilo}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Ciudades */}
            <div className="md:col-span-5 space-y-2">
              <h3 className="text-sm font-black text-[#111215] tracking-tight">
                Ciudades
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] sm:text-[13px] font-medium text-[#8c96a3]">
                {CIUDADES_PERU.map((ciudad, idx) => {
                  const href = `/motos/${cityToSlug(ciudad)}`;
                  return (
                    <a
                      key={`ocasion-ciudad-${idx}`}
                      href={href}
                      onClick={(e) => handleItemClick(e, 'compra', 'city', ciudad, href)}
                      className="hover:text-[#111215] transition-colors cursor-pointer truncate"
                      title={ciudad}
                    >
                      {ciudad}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Cilindradas */}
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-sm font-black text-[#111215] tracking-tight">
                Cilindradas
              </h3>
              <div className="flex flex-col gap-y-1 text-[12px] sm:text-[13px] font-medium text-[#8c96a3]">
                {CILINDRADAS.map((cc, idx) => {
                  const href = `/motos?cilindrada=${cc}`;
                  return (
                    <a
                      key={`ocasion-d-cc-${idx}`}
                      href={href}
                      onClick={(e) => handleItemClick(e, 'compra', 'cc', cc, href)}
                      className="hover:text-[#111215] transition-colors cursor-pointer"
                    >
                      {cc}
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
