import React from 'react';
import { Calculator } from 'lucide-react';
import { formatSoles } from '../utils/format';
import { calculateCuota, clampEntranceFee, getMinEntrance, FINANCE_TERMS } from '../utils/finance';
import { Badge } from './common/Badge';

export interface FinanceSimulatorProps {
  price: number;
  entranceFee: number;
  setEntranceFee: (val: number) => void;
  termMonths: number;
  setTermMonths: (val: number) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  className?: string;
  showToggleHeader?: boolean;
}

export const FinanceSimulator: React.FC<FinanceSimulatorProps> = ({
  price,
  entranceFee,
  setEntranceFee,
  termMonths,
  setTermMonths,
  isOpen = true,
  onToggleOpen,
  className = '',
  showToggleHeader = true,
}) => {
  const minEntrance = getMinEntrance(price);
  const monthlyFee = calculateCuota(price, entranceFee, termMonths);

  return (
    <div className={`space-y-3 ${className}`}>
      {showToggleHeader && onToggleOpen && (
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500 font-medium">Cuota estimada</span>
            <div className="text-xl font-bold text-slate-900">
              {formatSoles(monthlyFee)}<span className="text-xs font-normal text-slate-500">/mes</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Entrada {formatSoles(entranceFee)} a {termMonths} meses
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-center gap-1.5 text-slate-900 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <Calculator className="w-4 h-4 text-slate-700" strokeWidth={2} />
            <span>{isOpen ? 'Cerrar' : 'Calcula tu cuota'}</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-2 border-t border-slate-200/80">
          {/* Input & Slider for initial entrance */}
          <div className="sm:col-span-6 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">
                Entrada inicial (Mín. {formatSoles(minEntrance)})
              </label>
              <span className="font-extrabold text-slate-900">{formatSoles(entranceFee)}</span>
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                value={entranceFee === 0 ? '' : entranceFee}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setEntranceFee(isNaN(val) ? 0 : val);
                }}
                onBlur={() => {
                  setEntranceFee(clampEntranceFee(price, entranceFee));
                }}
                min={minEntrance}
                max={price - 1}
                placeholder={`${minEntrance}`}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-slate-400 text-slate-900 transition pr-8"
              />
              <span className="absolute right-3 font-bold text-xs pointer-events-none text-slate-400">S/.</span>
            </div>

            <input
              type="range"
              min={minEntrance}
              max={Math.max(minEntrance + 1000, Math.round(price * 0.7))}
              step={100}
              value={entranceFee}
              onChange={(e) => setEntranceFee(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          {/* Terms (Months) Selection */}
          <div className="sm:col-span-6 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Plazo (meses)</label>
              <Badge variant="red" size="sm">
                50% TEA
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {FINANCE_TERMS.map((term) => {
                const isSelected = termMonths === term;
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setTermMonths(term)}
                    className={`h-9 min-w-[38px] px-2.5 flex items-center justify-center rounded-xl text-xs transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-slate-950 text-white font-black shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-800 hover:border-slate-300 font-bold'
                    }`}
                  >
                    {term}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSimulator;
