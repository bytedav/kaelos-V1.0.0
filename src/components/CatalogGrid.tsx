import React from 'react';
import { StyleBike } from '../types';
import { StyleBikeCard } from './StyleBikeCard';
import { SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import { BikeCardSkeleton } from './ui/Skeleton';

interface CatalogGridProps {
  bikes: StyleBike[];
  favorites: string[];
  reservedBikeIds?: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (bike: StyleBike) => void;
  isGridLoading?: boolean;
  clearFilters?: () => void;
  handleParentMenuClick?: (page: any) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage?: number;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  bikes,
  favorites,
  reservedBikeIds = [],
  onToggleFavorite,
  onSelect,
  isGridLoading = false,
  clearFilters,
  currentPage,
  setCurrentPage,
  itemsPerPage = 9,
}) => {
  if (isGridLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 my-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BikeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center my-8 shadow-xs">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <SearchX className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-2">No encontramos motocicletas</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Prueba ajustando o limpiando tus filtros para ver más opciones disponibles en nuestro catálogo.
        </p>
        {clearFilters && (
          <button
            onClick={clearFilters}
            className="bg-[#121214] hover:bg-black text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>
    );
  }

  const totalPages = Math.ceil(bikes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBikes = bikes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentBikes.map((bike) => (
          <StyleBikeCard
            key={bike.id}
            moto={bike}
            isSaved={favorites.includes(bike.id)}
            isReserved={bike.isReserved || reservedBikeIds?.includes(bike.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelect}
            className="w-full bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-slate-300 lg:hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer block"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
          <button
            onClick={() => {
              setCurrentPage(Math.max(1, currentPage - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setCurrentPage(Math.min(totalPages, currentPage + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Siguiente página"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogGrid;
