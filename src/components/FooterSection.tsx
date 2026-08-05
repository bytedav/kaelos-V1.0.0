import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { CatalogSEOSection, FilterInfo } from './CatalogSEOSection';
import { navigateTo } from '../utils/router';

interface LinkItem {
  label: string;
  href?: string;
  pageKey?: string;
  badge?: string;
}

const OTROS_SERVICIOS: LinkItem[] = [
  { label: 'Financiación de motos', href: '/financiacion', pageKey: 'financiacion' },
  { label: 'Vender mi moto', href: '/vender-mi-moto', pageKey: 'vende' },
];

const SOPORTE: LinkItem[] = [
  { label: 'Contacto', href: '/contacto', pageKey: 'contacto' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes', pageKey: 'preguntas-frecuentes' },
];

const ENLACES_INTERES: LinkItem[] = [
  { label: 'Sobre nosotros', href: '/acerca-de', pageKey: 'acerca-de' },
  { label: 'Blog', href: '/blog', pageKey: 'blog', badge: 'Nuevo' },
];

const LEGAL_LINKS: LinkItem[] = [
  { label: 'Aviso Legal', href: '/aviso-legal', pageKey: 'aviso-legal' },
  { label: 'Política de privacidad', href: '/politica-privacidad', pageKey: 'politica-privacidad' },
  { label: 'Términos y condiciones', href: '/terminos-y-condiciones', pageKey: 'terminos-y-condiciones' },
  { label: 'Canal de denuncias', href: '/contacto', pageKey: 'contacto' },
  { label: 'Cookies', href: '/politica-de-cookies', pageKey: 'cookies' },
];

interface FooterSectionProps {
  onNavigate?: (page: any, filterInfo?: FilterInfo) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  const handleClick = (e: React.MouseEvent, pageKey?: string, href?: string) => {
    if (e) e.preventDefault();
    if (pageKey) {
      if (href) {
        navigateTo(href);
      }
      if (onNavigate) {
        onNavigate(pageKey);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderItem = (item: LinkItem) => {
    if (item.pageKey && item.href) {
      return (
        <a
          href={item.href}
          onClick={(e) => handleClick(e, item.pageKey, item.href)}
          className="hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>{item.label}</span>
          {item.badge && (
            <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {item.badge}
            </span>
          )}
        </a>
      );
    }

    // No page exists -> render a span without any link
    return (
      <span className="text-slate-400 font-medium inline-flex items-center gap-1.5 cursor-default select-none">
        <span>{item.label}</span>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
          Próximamente
        </span>
      </span>
    );
  };

  return (
    <footer className="w-full bg-white font-sans">
      {/* SEO Directory Catalog Section */}
      <CatalogSEOSection onNavigate={onNavigate} />

      <div className="max-w-[96%] xl:max-w-[98%] 2xl:max-w-[1720px] 3xl:max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 pb-10 sm:pb-12">
          
          {/* Column 1: Logo & Para Empresas & Socials */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo */}
            <div 
              onClick={(e) => handleClick(e, 'home', '/')}
              className="flex items-center cursor-pointer select-none"
            >
              <span className="font-black text-3xl tracking-tight">
                <span className="text-[#ff0d41]">kae</span>
                <span className="text-slate-900">los</span>
              </span>
            </div>
 
            {/* Para empresas and Buttons block */}
            <div className="space-y-3">
              <h4 className="text-[15px] font-black text-slate-800 tracking-tight">
                Para empresas
              </h4>
              <div className="flex flex-row lg:flex-col gap-2.5 max-w-full lg:max-w-[190px]">
                <a
                  href="/financiacion"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/financiacion');
                    onNavigate?.('financiacion');
                  }}
                  className="flex-1 lg:flex-initial h-11 bg-[#1e1e1e] hover:bg-black text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl flex items-center justify-center text-center transition-all duration-200 shadow-sm active:scale-98"
                >
                  KAELOS PRO
                </a>
              </div>
            </div>
 
            {/* Social Icons */}
            <div className="flex gap-2.5 pt-1">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
 
          {/* Column 2: Otros servicios & Soporte */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {/* Otros servicios block */}
            <div className="space-y-3.5">
              <h4 className="text-[15px] font-black text-slate-800 tracking-tight">
                Otros servicios
              </h4>
              {/* Desktop view: clean vertical stack */}
              <ul className="hidden lg:flex flex-col space-y-2.5 text-slate-400 font-medium text-[13px] xl:text-sm">
                {OTROS_SERVICIOS.map((item) => (
                  <li key={item.label}>
                    {renderItem(item)}
                  </li>
                ))}
              </ul>
              {/* Mobile/Tablet view: wrapping items side-by-side */}
              <div className="flex lg:hidden flex-wrap gap-x-3.5 gap-y-2 text-slate-400 font-medium text-[13px]">
                {OTROS_SERVICIOS.map((item) => (
                  <span key={item.label} className="inline-block whitespace-nowrap">
                    {renderItem(item)}
                  </span>
                ))}
              </div>
            </div>
 
            {/* Soporte block */}
            <div className="space-y-3.5">
              <h4 className="text-[15px] font-black text-slate-800 tracking-tight">
                Soporte
              </h4>
              {/* Desktop view: clean vertical stack */}
              <ul className="hidden lg:flex flex-col space-y-2.5 text-slate-400 font-medium text-[13px] xl:text-sm">
                {SOPORTE.map((item) => (
                  <li key={item.label}>
                    {renderItem(item)}
                  </li>
                ))}
              </ul>
              {/* Mobile/Tablet view: wrapping items side-by-side */}
              <div className="flex lg:hidden flex-wrap gap-x-3.5 gap-y-2 text-slate-400 font-medium text-[13px]">
                {SOPORTE.map((item) => (
                  <span key={item.label} className="inline-block whitespace-nowrap">
                    {renderItem(item)}
                  </span>
                ))}
              </div>
            </div>
          </div>
 
          {/* Column 3: Enlaces de interés */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-[15px] font-black text-slate-800 tracking-tight">
              Enlaces de interés
            </h4>
            {/* Desktop view: clean vertical stack */}
            <ul className="hidden lg:flex flex-col space-y-2.5 text-slate-400 font-medium text-[13px] xl:text-sm">
              {ENLACES_INTERES.map((item) => (
                <li key={item.label}>
                  {renderItem(item)}
                </li>
              ))}
            </ul>
            {/* Mobile/Tablet view: wrapping items side-by-side */}
            <div className="flex lg:hidden flex-wrap gap-x-3.5 gap-y-2 text-slate-400 font-medium text-[13px]">
              {ENLACES_INTERES.map((item) => (
                <span key={item.label} className="inline-block whitespace-nowrap">
                  {renderItem(item)}
                </span>
              ))}
            </div>
          </div>
 
        </div>

        {/* Bottom Area */}
        <div className="border-t border-slate-100 pt-8 mt-4 space-y-5 text-center">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-slate-400 font-medium text-xs sm:text-[13px]">
            {LEGAL_LINKS.map((link) => (
              <span key={link.label} className="inline-block whitespace-nowrap">
                {renderItem(link)}
              </span>
            ))}
          </div>

          {/* Copyright Text */}
          <p className="text-[11px] sm:text-xs text-slate-400/80 font-medium tracking-wide">
           © Kaelos por Bytedav S.A.C. {new Date().getFullYear()} Todos los derechos reservados
          </p>

          {/* Centered Circle Red Logo */}
          <div className="flex justify-center pt-2">
            <div 
              onClick={(e) => handleClick(e, 'home', '/')}
              className="w-8 h-8 rounded-full bg-[#ff0d41] flex items-center justify-center text-white font-extrabold text-[15px] select-none shadow-sm shadow-red-100/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Kaelos - Ir a inicio"
            >
              K
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
