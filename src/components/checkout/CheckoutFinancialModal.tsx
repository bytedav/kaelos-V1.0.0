import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, MapPin, Navigation, AlertCircle, Loader2, RefreshCw, FileText } from 'lucide-react';
import { compressFileToDataUrl } from '../../utils/fileStorage';

interface CheckoutFinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFinanced?: boolean;
  finModalStep: number;
  setFinModalStep: (step: number) => void;
  dniFrontal: File | null;
  setDniFrontal: (file: File | null) => void;
  dniFrontalName?: string;
  dniFrontalUrl?: string;
  setDniFrontalUrl?: (url: string, name?: string) => void;
  dniTrasera: File | null;
  setDniTrasera: (file: File | null) => void;
  dniTraseraName?: string;
  dniTraseraUrl?: string;
  setDniTraseraUrl?: (url: string, name?: string) => void;
  codigoPostal: string;
  setCodigoPostal: (cp: string) => void;
  carnetFrontal: File | null;
  setCarnetFrontal: (file: File | null) => void;
  carnetTrasera: File | null;
  setCarnetTrasera: (file: File | null) => void;
  rentaUltimoAno: File | null;
  setRentaUltimoAno: (file: File | null) => void;
  reciboServicioName?: string;
  reciboServicioUrl?: string;
  setReciboServicioUrl?: (url: string, name?: string) => void;
  modelo100: File | null;
  setModelo100: (file: File | null) => void;
  userLocation?: { lat: number; lng: number } | null;
  setUserLocation?: (loc: { lat: number; lng: number } | null) => void;
  completedFinModalSteps: Record<number, boolean>;
  setCompletedFinModalSteps: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onFinish: () => void;
}

export const CheckoutFinancialModal: React.FC<CheckoutFinancialModalProps> = ({
  isOpen,
  onClose,
  isFinanced = true,
  finModalStep,
  setFinModalStep,
  dniFrontal,
  setDniFrontal,
  dniFrontalName,
  dniFrontalUrl,
  setDniFrontalUrl,
  dniTrasera,
  setDniTrasera,
  dniTraseraName,
  dniTraseraUrl,
  setDniTraseraUrl,
  codigoPostal,
  setCodigoPostal,
  carnetFrontal,
  setCarnetFrontal,
  carnetTrasera,
  setCarnetTrasera,
  rentaUltimoAno,
  setRentaUltimoAno,
  reciboServicioName,
  reciboServicioUrl,
  setReciboServicioUrl,
  modelo100,
  setModelo100,
  userLocation,
  setUserLocation,
  completedFinModalSteps,
  setCompletedFinModalSteps,
  onFinish,
}) => {
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationData, setLocationData] = useState<{ lat: number; lng: number; accuracy?: number } | null>(
    userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  // Inline step validation guard errors
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      setLocationData({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está soportada por tu navegador.');
      return;
    }
    setIsCapturingLocation(true);
    setLocationError(null);
    setStep3Error(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocationData(coords);
        if (setUserLocation) {
          setUserLocation({ lat: coords.lat, lng: coords.lng });
        }
        setIsCapturingLocation(false);
      },
      (error) => {
        setIsCapturingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permiso denegado. Por favor habilita el acceso a tu ubicación en el navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('La ubicación no está disponible en este momento.');
            break;
          case error.TIMEOUT:
            setLocationError('Excedió el tiempo de espera para obtener tu ubicación.');
            break;
          default:
            setLocationError('No se pudo obtener tu ubicación actual.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-xl rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 pb-4 relative border-b border-slate-100 shrink-0 text-left">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
                Documentos
              </h2>

              <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed mb-1">
                {isFinanced ? (
                  <>
                    Para los trámites de financiación, necesitamos tu <strong className="font-extrabold text-slate-950">documento de identidad o carnet de extranjería</strong>, tu <strong className="font-extrabold text-slate-950">recibo de agua o luz</strong> y tu <strong className="font-extrabold text-slate-950">ubicación en tiempo real</strong>.
                  </>
                ) : (
                  <>
                    Para los trámites de compra al contado, necesitamos tu <strong className="font-extrabold text-slate-950">documento de identidad o carnet de extranjería</strong>.
                  </>
                )}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Asegúrate de que las imágenes sean claras y legibles. Formatos permitidos: <strong className="font-bold text-slate-600">PNG, JPG, PDF</strong>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 pt-6 overflow-y-auto space-y-4 relative flex-1">
              
              {/* Vertical Timeline Connector Line (rendered only if financed) */}
              {isFinanced && (
                <div className="absolute left-[33px] sm:left-[41px] top-10 bottom-10 w-[1.5px] bg-slate-200 z-0" />
              )}

              {/* STEP 1: Fotos de tu DNI / CE */}
              <div className="relative flex gap-2.5 sm:gap-4 text-left">
                {/* Badge */}
                <div className={`relative z-10 w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition ${
                  finModalStep === 1 
                    ? 'bg-brand-dark text-white shadow-xs' 
                    : 'bg-white border border-slate-300 text-slate-800'
                }`}>
                  1
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {finModalStep === 1 ? (
                    <div className="bg-[#fcfcfd] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 animate-fade-in">
                      <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm">
                        Fotos de tu DNI / CE
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Frontal */}
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-500 mb-1">Frontal</span>
                          <label className="border border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer transition relative group p-2 overflow-hidden">
                            <input 
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden" 
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  setDniFrontal(file);
                                  setStep1Error(null);
                                  try {
                                    const info = await compressFileToDataUrl(file);
                                    if (setDniFrontalUrl) setDniFrontalUrl(info.url, info.name);
                                  } catch (err) {
                                    console.error('Error compressing file', err);
                                  }
                                }
                              }} 
                            />
                            {dniFrontal || dniFrontalUrl ? (
                              <div className="text-center w-full px-2">
                                {dniFrontalUrl && dniFrontalUrl.startsWith('data:image/') ? (
                                  <img src={dniFrontalUrl} alt="DNI Frontal" className="h-14 max-w-full object-contain mx-auto rounded-lg shadow-2xs mb-1" />
                                ) : (
                                  <Check className="w-7 h-7 text-emerald-500 mx-auto mb-1 stroke-[2.5]" />
                                )}
                                <span className="text-[10px] font-bold text-slate-800 truncate block max-w-[130px] mx-auto">
                                  {dniFrontal?.name || dniFrontalName || 'DNI Frontal Adjuntado'}
                                </span>
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full border-2 border-[#1a657c] flex items-center justify-center text-[#1a657c] group-hover:scale-105 transition">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Trasera */}
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-500 mb-1">Trasera</span>
                          <label className="border border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer transition relative group p-2 overflow-hidden">
                            <input 
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden" 
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  setDniTrasera(file);
                                  setStep1Error(null);
                                  try {
                                    const info = await compressFileToDataUrl(file);
                                    if (setDniTraseraUrl) setDniTraseraUrl(info.url, info.name);
                                  } catch (err) {
                                    console.error('Error compressing file', err);
                                  }
                                }
                              }} 
                            />
                            {dniTrasera || dniTraseraUrl ? (
                              <div className="text-center w-full px-2">
                                {dniTraseraUrl && dniTraseraUrl.startsWith('data:image/') ? (
                                  <img src={dniTraseraUrl} alt="DNI Trasera" className="h-14 max-w-full object-contain mx-auto rounded-lg shadow-2xs mb-1" />
                                ) : (
                                  <Check className="w-7 h-7 text-emerald-500 mx-auto mb-1 stroke-[2.5]" />
                                )}
                                <span className="text-[10px] font-bold text-slate-800 truncate block max-w-[130px] mx-auto">
                                  {dniTrasera?.name || dniTraseraName || 'DNI Trasera Adjuntado'}
                                </span>
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full border-2 border-[#1a657c] flex items-center justify-center text-[#1a657c] group-hover:scale-105 transition">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Step 1 Error Banner Guard */}
                      {step1Error && (
                        <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2 text-rose-900 text-xs font-semibold animate-fade-in">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.2]" />
                          <span>{step1Error}</span>
                        </div>
                      )}

                      {/* Guardar Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const hasFront = Boolean(dniFrontal || dniFrontalUrl);
                            const hasBack = Boolean(dniTrasera || dniTraseraUrl);
                            if (!hasFront || !hasBack) {
                              setStep1Error('Debes adjuntar ambas fotos (frontal y trasera) de tu DNI / CE para guardar este paso.');
                              return;
                            }
                            setStep1Error(null);
                            setCompletedFinModalSteps(prev => ({ ...prev, 1: true }));
                            if (isFinanced) {
                              setFinModalStep(2);
                            } else {
                              onFinish();
                            }
                          }}
                          className="bg-brand-dark hover:bg-brand-dark-hover text-white px-6 py-2.5 rounded-xl font-extrabold text-[11px] tracking-wider uppercase transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          GUARDAR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFinModalStep(1)}
                      className="w-full bg-[#f2f2f4] hover:bg-[#e8e8ec] text-left rounded-2xl px-5 py-3.5 font-extrabold text-slate-800 text-xs sm:text-sm transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Fotos de tu DNI / CE</span>
                      {completedFinModalSteps[1] && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    </button>
                  )}
                </div>
              </div>

              {/* FINANCED ONLY: STEP 2 (Recibo de agua o luz) & STEP 3 (Ubicación) */}
              {isFinanced && (
                <>
                  {/* STEP 2: Recibo de agua o luz */}
                  <div className="relative flex gap-4 text-left">
                    <div className={`relative z-10 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition ${
                      finModalStep === 2
                        ? 'bg-brand-dark text-white shadow-xs' 
                        : 'bg-white border border-slate-300 text-slate-800'
                    }`}>
                      2
                    </div>

                    <div className="flex-1">
                      {finModalStep === 2 ? (
                        <div className="bg-[#fcfcfd] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 animate-fade-in">
                          <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm">
                            Recibo de Agua o Luz
                          </h3>

                          <div className="w-full sm:w-[220px]">
                            <label className="border border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-2xl h-28 flex flex-col items-center justify-center cursor-pointer transition relative group p-2 overflow-hidden">
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                className="hidden" 
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    setRentaUltimoAno(file);
                                    setStep2Error(null);
                                    try {
                                      const info = await compressFileToDataUrl(file);
                                      if (setReciboServicioUrl) setReciboServicioUrl(info.url, info.name);
                                    } catch (err) {
                                      console.error('Error compressing file', err);
                                    }
                                  }
                                }} 
                              />
                              {rentaUltimoAno || reciboServicioUrl ? (
                                <div className="text-center w-full px-2">
                                  {reciboServicioUrl && reciboServicioUrl.startsWith('data:image/') ? (
                                    <img src={reciboServicioUrl} alt="Recibo" className="h-14 max-w-full object-contain mx-auto rounded-lg shadow-2xs mb-1" />
                                  ) : (
                                    <Check className="w-7 h-7 text-emerald-500 mx-auto mb-1 stroke-[2.5]" />
                                  )}
                                  <span className="text-[10px] font-bold text-slate-800 truncate block max-w-[130px] mx-auto">
                                    {rentaUltimoAno?.name || reciboServicioName || 'Recibo Adjuntado'}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-full border-2 border-[#1a657c] flex items-center justify-center text-[#1a657c] group-hover:scale-105 transition">
                                  <Plus className="w-5 h-5 stroke-[2.5]" />
                                </div>
                              )}
                            </label>
                          </div>

                          {/* Step 2 Error Banner Guard */}
                          {step2Error && (
                            <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2 text-rose-900 text-xs font-semibold animate-fade-in">
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.2]" />
                              <span>{step2Error}</span>
                            </div>
                          )}

                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const hasReceipt = Boolean(rentaUltimoAno || reciboServicioUrl);
                                if (!hasReceipt) {
                                  setStep2Error('Debes adjuntar la foto o PDF de tu recibo de agua o luz para guardar este paso.');
                                  return;
                                }
                                setStep2Error(null);
                                setCompletedFinModalSteps(prev => ({ ...prev, 2: true }));
                                setFinModalStep(3);
                              }}
                              className="bg-brand-dark hover:bg-brand-dark-hover text-white px-6 py-2.5 rounded-xl font-extrabold text-[11px] tracking-wider uppercase transition active:scale-95 cursor-pointer shadow-xs"
                            >
                              GUARDAR
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFinModalStep(2)}
                          className="w-full bg-[#f2f2f4] hover:bg-[#e8e8ec] text-left rounded-2xl px-5 py-3.5 font-extrabold text-slate-800 text-xs sm:text-sm transition flex items-center justify-between cursor-pointer"
                        >
                          <span>Recibo de Agua o Luz</span>
                          {completedFinModalSteps[2] && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* STEP 3: Ubicación en tiempo real */}
                  <div className="relative flex gap-4 text-left">
                    <div className={`relative z-10 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition ${
                      finModalStep === 3 
                        ? 'bg-brand-dark text-white shadow-xs' 
                        : 'bg-white border border-slate-300 text-slate-800'
                    }`}>
                      3
                    </div>

                    <div className="flex-1">
                      {finModalStep === 3 ? (
                        <div className="bg-[#fcfcfd] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 animate-fade-in">
                          <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm">
                            Ubicación
                          </h3>

                          {/* Important Notice Banner */}
                          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 flex items-start gap-3 text-left">
                            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 stroke-[2.2]" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-amber-950 leading-snug">
                                Asegúrate de estar en tu domicilio para este paso para pasar el financiamiento.
                              </p>
                              <p className="text-[11px] text-amber-800 font-medium">
                                Verificamos tu ubicación GPS para validar tu solicitud de crédito instantáneamente.
                              </p>
                            </div>
                          </div>

                          {/* Location Capture Display / Trigger */}
                          <div className="space-y-2">
                            {locationData ? (
                              <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 text-left shadow-2xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block text-xs font-extrabold text-emerald-950">
                                      Ubicación capturada correctamente
                                    </span>
                                    <span className="block text-[11px] font-semibold text-emerald-800 truncate">
                                      Lat: {locationData.lat.toFixed(6)}, Lng: {locationData.lng.toFixed(6)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleGetLocation}
                                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${isCapturingLocation ? 'animate-spin' : ''}`} />
                                  <span>Actualizar</span>
                                </button>
                              </div>
                            ) : isCapturingLocation ? (
                              <div className="w-full border border-slate-200 bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center">
                                <Loader2 className="w-6 h-6 text-brand-dark animate-spin" />
                                <span className="text-xs font-bold text-slate-800">Obteniendo ubicación GPS en tiempo real...</span>
                                <span className="text-[11px] text-slate-500 font-medium">Acepta el permiso de ubicación en tu navegador si te es solicitado</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleGetLocation}
                                className="w-full border-2 border-dashed border-slate-300 hover:border-brand-dark bg-white hover:bg-slate-50/80 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition cursor-pointer group text-center"
                              >
                                <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-brand-dark/10 flex items-center justify-center text-slate-700 group-hover:text-brand-dark transition">
                                  <Navigation className="w-5 h-5 stroke-[2.2]" />
                                </div>
                                <div>
                                  <span className="block text-xs font-extrabold text-slate-900 group-hover:text-slate-950">
                                    Capturar mi ubicación en tiempo real
                                  </span>
                                  <span className="block text-[11px] font-medium text-slate-500 mt-0.5">
                                    Haz clic aquí para activar la geolocalización de tu domicilio
                                  </span>
                                </div>
                              </button>
                            )}

                            {/* Location error notice if permission denied or failed */}
                            {locationError && (
                              <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-3.5 flex items-start justify-between gap-2 text-left">
                                <div className="flex items-start gap-2 text-rose-900 text-xs">
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <span className="font-semibold">{locationError}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleGetLocation}
                                  className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 hover:text-rose-950 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                                >
                                  Reintentar
                                </button>
                              </div>
                            )}

                            {/* Step 3 Error Banner Guard */}
                            {step3Error && (
                              <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-3 flex items-center gap-2 text-rose-900 text-xs font-semibold animate-fade-in">
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.2]" />
                                <span>{step3Error}</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (!locationData && !userLocation) {
                                  setStep3Error('Debes capturar tu ubicación GPS en tiempo real para completar este paso.');
                                  return;
                                }
                                setStep3Error(null);
                                setCompletedFinModalSteps(prev => ({ ...prev, 3: true }));
                                onFinish();
                              }}
                              className="bg-brand-dark hover:bg-brand-dark-hover text-white px-6 py-2.5 rounded-xl font-extrabold text-[11px] tracking-wider uppercase transition active:scale-95 cursor-pointer shadow-xs"
                            >
                              GUARDAR
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFinModalStep(3)}
                          className="w-full bg-[#f2f2f4] hover:bg-[#e8e8ec] text-left rounded-2xl px-5 py-3.5 font-extrabold text-slate-800 text-xs sm:text-sm transition flex items-center justify-between cursor-pointer"
                        >
                          <span>Ubicación</span>
                          {completedFinModalSteps[3] && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
