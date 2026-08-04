/**
 * Formateador universal de moneda a soles peruanos (S/.)
 * Aplica estrictamente comas para miles y puntos para decimales en Perú (es-PE / Intl.NumberFormat)
 */
export const formatSoles = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return 'S/. 0.00';
  
  const formatted = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  // Garantiza formato 'S/. X,XXX.XX'
  // Si es-PE usa espacio o símbolo PEN, limpiamos y aseguramos S/.
  const cleanNum = formatted.replace(/[^\d.,]/g, '').trim();
  
  return `S/. ${cleanNum}`;
};
