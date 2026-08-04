import React from 'react';
import { motion } from 'motion/react';
import { Check, FileText, Printer } from 'lucide-react';
import { formatSoles } from '../../utils/format';
import { sanitizeCustomerName } from '../../utils/privacy';
import { MotorbikeExtended } from '../MotorbikeCard';
import { PRICING_CONFIG } from '../../config/pricing';

interface CheckoutReceiptViewProps {
  fullName: string;
  orderReference: string;
  resolvedBike: MotorbikeExtended;
  paymentMode: 'financed' | 'cash';
  motoPrice: number;
  registrationFee: number;
  selectedPack: 'basico' | 'economico' | 'premium';
  packPrice: number;
  entryAmount: number;
  totalCash: number;
  onBack: () => void;
}

export const CheckoutReceiptView: React.FC<CheckoutReceiptViewProps> = ({
  fullName,
  orderReference,
  resolvedBike,
  paymentMode,
  motoPrice,
  registrationFee,
  selectedPack,
  packPrice,
  entryAmount,
  totalCash,
  onBack,
}) => {
  const cleanOrderRef = orderReference ? orderReference.replace(/^[#kK-]+/i, '') : '';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-[32px] border border-slate-200 p-6 sm:p-10 text-center shadow-xl space-y-6"
    >
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Check className="w-9 h-9 stroke-[3]" />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
          Comprobante Oficial de Pedido
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          ¡Gracias por tu compra, {sanitizeCustomerName(fullName)}!
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500">
          Código de Pedido: <span className="font-black text-slate-900">#{cleanOrderRef}</span>
        </p>
      </div>

      {/* Voucher / Receipt Card */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ff0d41]" />
            <span className="font-extrabold text-slate-900 text-sm">Resumen del Comprobante</span>
          </div>
          <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Listo para entrega / envío
          </span>
        </div>

        {/* Strict Privacy: ONLY name, order code, bike, payment method & status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-2xs">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Nombre del Cliente</span>
            <span className="font-black text-slate-900 text-sm">{sanitizeCustomerName(fullName)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-2xs">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Código de Pedido</span>
            <span className="font-black text-slate-900 text-sm">#{cleanOrderRef}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-2xs">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Motocicleta Elegida</span>
            <span className="font-black text-slate-900 text-sm">{resolvedBike.brand} {resolvedBike.model}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-2xs">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Método de Pago</span>
            <span className="font-black text-slate-900 text-sm">{paymentMode === 'financed' ? 'Financiado' : 'Al Contado'}</span>
          </div>
        </div>

        {/* Financial Voucher Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Precio de la Motocicleta</span>
            <span className="font-bold text-slate-900">{formatSoles(motoPrice)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Placa y Gastos de Gestoría</span>
            <span className="font-bold text-slate-900">{formatSoles(registrationFee)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Pack {selectedPack.toUpperCase()}</span>
            <span className="font-bold text-slate-900">{formatSoles(packPrice)}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-extrabold border-t border-slate-100 pt-2">
            <span>Abono ({paymentMode === 'cash' ? 'Reserva Obligatoria' : 'Entrada Inicial'})</span>
            <span>-{formatSoles(paymentMode === 'cash' ? PRICING_CONFIG.RESERVATION_FEE : entryAmount)}</span>
          </div>
          {paymentMode === 'cash' && (
            <div className="flex justify-between text-slate-900 font-black text-sm border-t border-slate-200 pt-2">
              <span>Saldo restante a la entrega</span>
              <span className="text-[#ff0d41]">{formatSoles(Math.max(0, totalCash - PRICING_CONFIG.RESERVATION_FEE))}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <Printer className="w-4 h-4" /> IMPRIMIR COMPROBANTE
        </button>
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-xs"
        >
          VOLVER AL CATÁLOGO
        </button>
      </div>
    </motion.div>
  );
};
