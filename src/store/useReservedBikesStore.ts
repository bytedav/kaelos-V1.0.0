import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { reserveBikeInDb } from '../utils/storage';

interface ReservedBikesState {
  reservedBikeIds: string[];
  setReservedBikeIds: (ids: string[]) => void;
  reserveBike: (id: string) => void;
  isReserved: (id: string) => boolean;
}

export const useReservedBikesStore = create<ReservedBikesState>()(
  persist(
    (set, get) => ({
      reservedBikeIds: [],

      setReservedBikeIds: (ids: string[]) => {
        set({ reservedBikeIds: ids });
      },

      reserveBike: (id: string) => {
        reserveBikeInDb(id);
        const current = get().reservedBikeIds;
        if (!current.includes(id)) {
          set({ reservedBikeIds: [...current, id] });
        }
      },

      isReserved: (id: string) => {
        return get().reservedBikeIds.includes(id);
      },
    }),
    {
      name: 'kaelos_reserved_bikes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
