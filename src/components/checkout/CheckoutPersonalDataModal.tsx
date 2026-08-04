import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User } from 'lucide-react';

interface CheckoutPersonalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutPersonalDataModal: React.FC<CheckoutPersonalDataModalProps> = ({
  isOpen,
  onClose,
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  city,
  setCity,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 pb-4 relative border-b border-slate-100 text-left">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#ff0d41] flex items-center justify-center font-bold">
                  <User className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Datos Personales
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Ingresa tus datos de contacto para iniciar la reserva oficial de tu motocicleta.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="p-6 sm:p-7 space-y-4 text-left"
            >
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider mb-1">
                    Nombres y Apellidos *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Carlos Pérez"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 987654321"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ej. correo@ejemplo.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider mb-1">
                    Ciudad / Departamento *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Lima"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-black text-white text-xs font-black px-6 py-3 rounded-xl transition uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  GUARDAR DATOS &rarr;
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
