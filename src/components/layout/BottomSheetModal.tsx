import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Check } from 'lucide-react';
import { useFuseSearch } from '../../hooks/useFuseSearch';
import { SearchBar } from '../SearchBar';

export interface BottomSheetOption {
  value: any;
  label: string;
}

export interface BottomSheetConfig {
  type: string;
  title?: string;
  options: BottomSheetOption[];
  selectedValue: any;
  onSelect: (value: any) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export interface BottomSheetModalProps {
  activeBottomSheet: BottomSheetConfig | null;
  setActiveBottomSheet: (sheet: BottomSheetConfig | null) => void;
  bottomSheetSearch: string;
  setBottomSheetSearch: (search: string) => void;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  activeBottomSheet,
  setActiveBottomSheet,
  bottomSheetSearch,
  setBottomSheetSearch,
}) => {
  const options = activeBottomSheet?.options || [];

  const filteredOptions = useFuseSearch<BottomSheetOption>({
    data: options,
    query: bottomSheetSearch,
    keys: ['label'],
    threshold: 0.35,
  });

  return (
    <AnimatePresence>
      {activeBottomSheet && (
        <div className="fixed inset-0 z-[130] lg:hidden flex items-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBottomSheet(null)}
            className="fixed inset-0 bg-black"
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.8 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 80 || info.velocity.y > 300) {
                setActiveBottomSheet(null);
                setBottomSheetSearch('');
              }
            }}
            className="relative w-full bg-white rounded-t-[32px] max-h-[85vh] flex flex-col z-10 shadow-2xl outline-none"
          >
            {/* Drag Handle Bar */}
            <div className="flex justify-center py-3 select-none cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            
            {/* Optional Search filter input for large list options like Brand */}
            {activeBottomSheet.showSearch && (
              <div className="px-5 pb-3">
                <SearchBar
                  value={bottomSheetSearch}
                  onChange={setBottomSheetSearch}
                  onClear={() => setBottomSheetSearch('')}
                  placeholder={activeBottomSheet.searchPlaceholder || "Buscar..."}
                  variant="minimal"
                />
              </div>
            )}
            
            {/* Options Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-1.5 custom-scrollbar max-h-[55vh]">
              {filteredOptions.map((opt) => {
                  const isSelected = activeBottomSheet.selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        activeBottomSheet.onSelect(opt.value);
                        setActiveBottomSheet(null);
                        setBottomSheetSearch('');
                      }}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-100 text-slate-950 font-black' 
                          : 'text-slate-700 hover:bg-slate-50 font-semibold'
                      }`}
                    >
                      <span className="tracking-wide">{opt.label}</span>
                      {isSelected && (
                        <Check className="w-4.5 h-4.5 text-slate-950" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })
              }
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
