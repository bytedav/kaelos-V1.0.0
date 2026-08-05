import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { submitLeadInDb } from '../utils/storage';

interface LeadFormProps {
  onNavigateServicios?: () => void;
}

export default function LeadForm({ onNavigateServicios }: LeadFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [accessory, setAccessory] = useState('');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) {
      setError('Por favor, indica la marca y el modelo de tu moto.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError('Por favor, completa todos los datos de contacto.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    submitLeadInDb({
      type: 'equipamiento_accesorios',
      name,
      phone,
      email,
      metadata: {
        brand,
        model,
        accessory: accessory || 'General',
      }
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-[28px] p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl border border-slate-100 text-left animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900">
            ¡Solicitud de equipamiento enviada!
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Gracias <strong className="text-slate-900">{name}</strong>. Hemos recibido tu consulta para <strong className="text-slate-900">{brand} {model}</strong>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff0d41]" />
            Próximos pasos:
          </p>
          <ul className="space-y-1.5 pl-5 list-disc text-[12px] text-slate-600">
            <li>Comprobaremos la compatibilidad oficial de los accesorios.</li>
            <li>Te llamaremos con la disponibilidad y presupuesto sin compromiso.</li>
          </ul>
        </div>

        <button
          onClick={() => {
            setStep(1);
            setBrand('');
            setModel('');
            setAccessory('');
            setName('');
            setPhone('');
            setEmail('');
            setIsSubmitted(false);
          }}
          className="w-full bg-[#282828] hover:bg-[#111] text-white text-xs font-black py-3.5 rounded-2xl transition cursor-pointer uppercase tracking-wider"
        >
          Solicitar para otra moto
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 text-slate-900 space-y-6 shadow-2xl border border-slate-100 text-left">
      {/* Top Step Header exactly matching screenshot */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${step === 1 ? 'bg-[#ff0d41] text-white' : 'bg-slate-200 text-slate-500'}`}>
            1
          </div>
          <span className={`text-xs sm:text-sm ${step === 1 ? 'font-bold text-slate-900' : 'font-medium text-slate-400'}`}>
            Indícanos tu moto
          </span>
        </div>

        <span className="text-slate-300 font-light hidden sm:inline">—</span>

        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${step === 2 ? 'bg-[#ff0d41] text-white' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
          <span className={`text-xs sm:text-sm ${step === 2 ? 'font-bold text-slate-900' : 'font-medium text-slate-400'}`}>
            Datos de contacto
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4">
          {/* Marca */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Marca
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Yamaha"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-[#f4f4f5] border-0 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            />
          </div>

          {/* Modelo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Modelo
            </label>
            <input
              type="text"
              required
              placeholder="Ej: MT-07"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#f4f4f5] border-0 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#282828] hover:bg-[#111111] active:scale-[0.98] text-white text-xs sm:text-sm font-black py-4 px-6 rounded-2xl transition duration-150 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-md"
          >
            <span>SIGUIENTE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#f4f4f5] rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Moto seleccionada:</p>
              <p className="font-bold text-slate-900">{brand} {model}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[11px] text-[#ff0d41] font-bold hover:underline"
            >
              Cambiar
            </button>
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Nombre completo</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f4f4f5] border-0 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-3.5 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Teléfono / WhatsApp</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#f4f4f5] border-0 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-3.5 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
              />
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f4f4f5] border-0 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-3.5 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#282828] hover:bg-[#111111] text-white text-xs sm:text-sm font-black py-3.5 px-6 rounded-2xl transition duration-150 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-md"
            >
              <span>{isSubmitting ? 'ENVIANDO...' : 'SOLICITAR PRESUPUESTO'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

