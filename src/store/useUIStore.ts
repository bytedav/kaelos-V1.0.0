import { create } from 'zustand';

export interface BottomSheetConfig {
  type: string;
  title?: string;
  options: { value: any; label: string }[];
  selectedValue: any;
  onSelect: (value: any) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

interface UIState {
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  hoveredMenu: 'compra' | null;
  setHoveredMenu: (menu: 'compra' | null) => void;
  activeBottomSheet: BottomSheetConfig | null;
  setActiveBottomSheet: (sheet: BottomSheetConfig | null) => void;
  bottomSheetSearch: string;
  setBottomSheetSearch: (search: string) => void;
  closeBottomSheet: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isScrolled: false,
  setIsScrolled: (isScrolled) => set({ isScrolled }),

  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (updater) =>
    set((state) => ({
      isMobileMenuOpen: typeof updater === 'function' ? updater(state.isMobileMenuOpen) : updater,
    })),

  isMobileSearchOpen: false,
  setIsMobileSearchOpen: (updater) =>
    set((state) => ({
      isMobileSearchOpen: typeof updater === 'function' ? updater(state.isMobileSearchOpen) : updater,
    })),

  hoveredMenu: null,
  setHoveredMenu: (hoveredMenu) => set({ hoveredMenu }),

  activeBottomSheet: null,
  setActiveBottomSheet: (activeBottomSheet) => set({ activeBottomSheet }),

  bottomSheetSearch: '',
  setBottomSheetSearch: (bottomSheetSearch) => set({ bottomSheetSearch }),

  closeBottomSheet: () => set({ activeBottomSheet: null, bottomSheetSearch: '' }),
}));
