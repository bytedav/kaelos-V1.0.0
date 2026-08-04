import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e?: React.FormEvent) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  variant?: 'default' | 'header' | 'header-glass' | 'hero' | 'minimal';
  autoFocus?: boolean;
  showClearButton?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Buscar modelos, estilos, cilindradas...',
  className = '',
  inputClassName = '',
  buttonClassName = '',
  variant = 'default',
  autoFocus = false,
  showClearButton = true,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  if (variant === 'header-glass') {
    return (
      <form
        onSubmit={handleSubmit}
        className={`w-full flex items-center bg-white/12 border border-white/15 hover:border-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/10 rounded-xl overflow-hidden transition-all duration-300 ${className}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className={`w-full bg-transparent text-sm pl-4 pr-2 py-2.5 outline-none font-sans text-white placeholder-white/60 transition-all duration-300 ${inputClassName}`}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-white/70 hover:text-white font-bold text-xs px-2 cursor-pointer transition shrink-0"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className={`h-9 w-9 rounded-lg bg-white hover:bg-slate-100 text-[#003859] flex items-center justify-center transition-all duration-300 shrink-0 mr-1 shadow-xs cursor-pointer ${buttonClassName}`}
          aria-label="Buscar"
        >
          <Search className="w-4 h-4 text-[#003859]" strokeWidth={2.5} />
        </button>
      </form>
    );
  }

  if (variant === 'header') {
    return (
      <form
        onSubmit={handleSubmit}
        className={`w-full flex items-center bg-slate-100 border border-slate-200 hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-400/15 rounded-xl overflow-hidden transition-all duration-300 ${className}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className={`w-full bg-transparent text-sm pl-4 pr-2 py-2.5 outline-none font-sans text-slate-900 placeholder-slate-400 transition-all duration-300 ${inputClassName}`}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-600 font-bold text-xs px-2 cursor-pointer transition shrink-0"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className={`h-9 w-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all duration-300 shrink-0 mr-1 shadow-xs cursor-pointer ${buttonClassName}`}
          aria-label="Buscar"
        >
          <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
        </button>
      </form>
    );
  }

  if (variant === 'hero') {
    return (
      <form
        onSubmit={handleSubmit}
        className={`w-full flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-2 gap-2 ${className}`}
      >
        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className={`w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm font-medium py-2.5 ${inputClassName}`}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-white font-bold text-xs px-2 cursor-pointer transition shrink-0"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`relative w-full ${className}`}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-slate-350 transition shadow-xs ${inputClassName}`}
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-650 p-0.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex items-stretch bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-200 transition ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={`flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none font-sans ${inputClassName}`}
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-slate-400 hover:text-slate-600 font-bold text-xs px-2.5 flex items-center cursor-pointer transition shrink-0 bg-transparent"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </button>
      )}
      <button
        type={onSubmit ? 'submit' : 'button'}
        onClick={onSubmit ? undefined : (e) => { e.preventDefault(); }}
        className={`bg-slate-50 border-l border-slate-200 hover:bg-slate-100 px-5 flex items-center justify-center text-slate-700 transition cursor-pointer shrink-0 ${buttonClassName}`}
        aria-label="Buscar"
      >
        <Search className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default SearchBar;
