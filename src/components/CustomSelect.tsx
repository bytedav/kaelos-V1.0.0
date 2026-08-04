import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFuseSearch } from '../hooks/useFuseSearch';

interface Option {
  value: any;
  label: string;
}

interface CustomSelectProps {
  value: any;
  onChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  alignText?: 'left' | 'center';
  getOptionUrl?: (value: any) => string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  showSearch = false,
  searchPlaceholder = 'Filtra...',
  className = '',
  menuClassName = '',
  align = 'left',
  alignText = 'center',
  getOptionUrl,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    direction: 'up' | 'down';
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const direction = (spaceBelow < 260 && spaceAbove > spaceBelow) ? 'up' : 'down';
    
    const width = Math.max(rect.width, 180);
    let left = align === 'right' ? rect.right - width : rect.left;
    
    if (left < 10) left = 10;
    if (left + width > window.innerWidth - 10) {
      left = window.innerWidth - width - 10;
    }

    if (direction === 'up') {
      setMenuPosition({
        bottom: window.innerHeight - rect.top + 6,
        left,
        width,
        direction: 'up'
      });
    } else {
      setMenuPosition({
        top: rect.bottom + 6,
        left,
        width,
        direction: 'down'
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isMobile) {
      updatePosition();
      const handleScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [isOpen, isMobile, align]);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value);
  }, [options, value]);

  const filteredOptions = useFuseSearch<Option>({
    data: options,
    query: search,
    keys: ['label'],
    threshold: 0.35,
  });

  const handleSelect = (val: any) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  const toggleOpen = () => {
    if (disabled) return;
    const nextState = !isOpen;
    if (nextState && !isMobile) {
      updatePosition();
    }
    setIsOpen(nextState);
  };

  // 1. MOBILE BOTTOM SHEET VIEW
  const renderMobileBottomSheet = () => {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-end justify-center">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }} 
              className="fixed inset-0 bg-black"
            />

            {/* Bottom Sheet Modal Panel */}
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
                  setIsOpen(false);
                  setSearch('');
                }
              }}
              className="relative w-full bg-white rounded-t-[32px] shadow-[0_-10px_35px_rgba(0,0,0,0.15)] flex flex-col z-10 max-h-[85vh] outline-none"
            >
              {/* Drag Indicator handle */}
              <div className="flex flex-col items-center pt-3 pb-2.5 select-none cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              {/* Title / Header */}
              <div className="px-6 pb-2.5 border-b border-slate-50 flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {placeholder || 'Seleccionar'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-50 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Optional Search Filter Bar */}
              {showSearch && (
                <div className="px-5 py-3.5 border-b border-slate-50 shrink-0 bg-slate-50/50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none focus:border-[#ff0d41]/40 transition shadow-xs"
                    />
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" strokeWidth={2.5} />
                    {search && (
                      <button 
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-3.5 top-3.5 text-slate-450 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex-1 overflow-y-auto px-5 py-3.5 space-y-1.5 custom-scrollbar max-h-[55vh] pb-10">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    const optionUrl = getOptionUrl ? getOptionUrl(opt.value) : undefined;

                    const content = (
                      <>
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-slate-950 shrink-0" strokeWidth={3} />
                        )}
                      </>
                    );

                    const optionClass = `w-full text-left px-4 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-100 text-slate-950 font-black' 
                        : 'text-slate-700 hover:bg-slate-50 font-semibold hover:text-slate-900'
                    }`;

                    if (optionUrl) {
                      return (
                        <a
                          key={String(opt.value)}
                          href={optionUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(opt.value);
                          }}
                          className={optionClass}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={optionClass}
                      >
                        {content}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-xs font-semibold text-slate-400">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  // 2. DESKTOP PORTAL DROPDOWN VIEW (FLOATS ABOVE EVERYTHING WITH HIGH Z-INDEX)
  const renderDesktopDropdown = () => {
    if (typeof document === 'undefined' || !menuPosition) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] pointer-events-auto">
            {/* Backdrop for click outside */}
            <div 
              className="fixed inset-0 z-[9998] cursor-default" 
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }} 
            />

            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: menuPosition.direction === 'up' ? -8 : 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: menuPosition.direction === 'up' ? -8 : 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: menuPosition.top !== undefined ? `${menuPosition.top}px` : 'auto',
                bottom: menuPosition.bottom !== undefined ? `${menuPosition.bottom}px` : 'auto',
                left: `${menuPosition.left}px`,
                width: `${menuPosition.width}px`,
                minWidth: '180px'
              }}
              className={`z-[9999] bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-1.5 flex flex-col max-h-[280px] overflow-hidden ${menuClassName}`}
            >
              {/* Optional Search Filter Bar */}
              {showSearch && (
                <div className="px-1 pb-1.5 pt-0.5 border-b border-slate-100 shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 pl-8 pr-7 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-slate-300 transition"
                      autoFocus
                    />
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                    {search && (
                      <button 
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-650 p-0.5 rounded-full hover:bg-slate-100 transition"
                      >
                        <X className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex-1 overflow-y-auto py-1 space-y-0.5 max-h-[220px] pr-0.5 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    const optionUrl = getOptionUrl ? getOptionUrl(opt.value) : undefined;
                    
                    const itemClass = `w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-100 text-slate-950 font-black' 
                        : 'text-slate-700 hover:bg-slate-100/80 font-semibold hover:text-slate-900'
                    }`;

                    if (optionUrl) {
                      return (
                        <a
                          key={String(opt.value)}
                          href={optionUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(opt.value);
                          }}
                          className={itemClass}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-1" strokeWidth={3} />
                          )}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={itemClass}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-1" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-[11px] font-medium text-slate-400">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  const hasBg = className.includes('bg-');
  const hasBorder = className.includes('border-');
  const hasText = className.includes('text-');
  const hasRounded = className.includes('rounded-');
  const hasPadding = className.includes('p-') || className.includes('py-') || className.includes('px-');

  const defaultClasses = `${!hasBg ? 'bg-white' : ''} ${!hasBorder ? 'border border-slate-200 hover:border-slate-300' : ''} ${!hasText ? 'text-slate-800' : ''} ${!hasRounded ? 'rounded-2xl' : ''} ${!hasPadding ? 'py-2.5 px-3' : ''} ${!hasText ? 'text-[11px] sm:text-xs font-black' : ''}`;

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full appearance-none outline-none cursor-pointer transition shadow-xs flex items-center justify-between gap-1.5 focus:border-[#ff0d41]/50 ${defaultClasses} ${
          disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
        } ${
          alignText === 'center' ? 'text-center' : 'text-left'
        } ${className}`}
      >
        <span className={`flex-1 truncate ${alignText === 'center' ? 'text-center' : 'text-left'}`}>
          {selectedOption ? selectedOption.label : placeholder || 'Seleccionar'}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-current opacity-70 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          strokeWidth={2.5}
        />
      </button>

      {/* Render Portal Bottom Sheet on Mobile or Portal Dropdown on Desktop */}
      {isMobile ? renderMobileBottomSheet() : renderDesktopDropdown()}
    </div>
  );
};
