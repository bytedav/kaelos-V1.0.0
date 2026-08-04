import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (id: string, e?: React.MouseEvent) => {
        if (e) {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (typeof e.stopPropagation === 'function') e.stopPropagation();
        }
        const current = get().favorites;
        if (current.includes(id)) {
          set({ favorites: current.filter((favId) => favId !== id) });
        } else {
          set({ favorites: [...current, id] });
        }
      },

      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'kaelos_favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
