import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { StyleBike } from '../types';
import { MotorbikeExtended } from '../components/MotorbikeCard';
import { getStyleBikesData, styleBikesData } from '../data/styleBikesData';
import { getBudgetBikesData, budgetBikesData } from '../data/budgetBikesData';
import { motorbikesData } from '../data/motorbikesData';
import { StyleBikeCard } from '../components/StyleBikeCard';
import { FavoritesSkeleton } from '../components/ui/Skeleton';
import { useFavoritesStore } from '../store/useFavoritesStore';

interface FavoritesPageProps {
  favorites?: string[];
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onNavigate: (page: any) => void;
  onSelectDetailedBike?: (bike: any) => void;
  motorbikesList?: MotorbikeExtended[];
  isLoading?: boolean;
}

export default function FavoritesPage({
  favorites: propsFavorites,
  onToggleFavorite: propsToggleFavorite,
  onNavigate,
  onSelectDetailedBike,
  motorbikesList,
  isLoading
}: FavoritesPageProps) {
  const storeFavorites = useFavoritesStore((state) => state.favorites);
  const storeToggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const favorites = propsFavorites ?? storeFavorites;
  const onToggleFavorite = propsToggleFavorite ?? storeToggleFavorite;

  if (isLoading) {
    return <FavoritesSkeleton />;
  }
  // We resolve the favorites from all data sources
  const resolvedBikes: StyleBike[] = React.useMemo(() => {
    const bikesSource = (motorbikesList && motorbikesList.length > 0) ? motorbikesList : motorbikesData;
    const flatStyleBikes = Object.values(getStyleBikesData(bikesSource)).flat();
    const flatBudgetBikes = Object.values(getBudgetBikesData(bikesSource)).flat();
    
    // We Map over favorite IDs
    return favorites.map(id => {
      // 1. Search in main motorbikesData (Primary Single Source of Truth)
      const mainMatch = bikesSource.find(b => b.id === id);
      if (mainMatch) {
        return {
          id: mainMatch.id,
          brand: mainMatch.brand.toUpperCase(),
          model: mainMatch.model.toUpperCase(),
          year: mainMatch.year,
          kms: `${mainMatch.kms.toLocaleString('es-PE')} KM`,
          price: mainMatch.price,
          financePrice: Math.round(mainMatch.price * 0.0214) || Math.round(mainMatch.price * 0.018 + 12),
          images: mainMatch.images && mainMatch.images.length > 0 ? mainMatch.images : [mainMatch.image]
        } as StyleBike;
      }

      // 2. Search in budgetBikes
      const budgetMatch = flatBudgetBikes.find(b => b.id === id);
      if (budgetMatch) return budgetMatch;

      // 3. Search in styleBikes
      const styleMatch = flatStyleBikes.find(b => b.id === id);
      if (styleMatch) return styleMatch;

      return null;
    }).filter((b): b is StyleBike => b !== null);
  }, [favorites]);

  const handleVerMoto = (moto: StyleBike) => {
    if (onSelectDetailedBike) {
      // We convert it to MotorbikeExtended format
      onSelectDetailedBike({
        id: moto.id,
        brand: moto.brand,
        model: moto.model,
        year: moto.year,
        kms: typeof moto.kms === 'string' ? parseInt(moto.kms.replace(/\D/g, '')) || 0 : moto.kms,
        power: '74 CV',
        price: moto.price,
        category: 'Custom',
        image: moto.images[0],
        images: moto.images,
        fuel: 'Gasolina'
      });
      onNavigate('moto');
    } else {
      onNavigate('compra');
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Back button link */}
        <button 
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        {/* Page Title */}
        <h1 className="text-[28px] sm:text-[32px] font-black text-slate-950 tracking-tight mb-8">
          Mis favoritos
        </h1>

        {resolvedBikes.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm mt-8 animate-fade-in">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FavoriteButton size="xl" isFavorite={true} className="pointer-events-none" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes favoritos</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Explora nuestro catálogo con más de 1.000 motos totalmente revisadas y con un año de garantía.
            </p>
            <button
              onClick={() => onNavigate('compra')}
              className="bg-[#ff0d41] hover:bg-[#e00a37] text-white font-bold py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-sm inline-flex items-center gap-2"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resolvedBikes.map((moto) => (
              <StyleBikeCard
                key={moto.id}
                moto={moto}
                isSaved={true}
                onToggleFavorite={onToggleFavorite}
                onSelect={handleVerMoto}
                className="w-full bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-slate-300 lg:hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer block"
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
