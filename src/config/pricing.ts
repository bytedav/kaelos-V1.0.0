/**
 * Configuración global de negocio para Kaelos Motos
 * Tarifas globales, reserva, gastos de gestión y parámetros de financiamiento.
 */

export const PRICING_CONFIG = {
  /**
   * Importe fijo de reserva para congelar precio / separar la moto (en Soles S/)
   */
  RESERVATION_FEE: 250,

  /**
   * Gastos de gestión y trámites de placa e inmatriculación predeterminados (en Soles S/)
   */
  REGISTRATION_FEE_DEFAULT: 250,

  /**
   * Parámetros para simulador y calculadoras de financiamiento
   */
  FINANCING: {
    /**
     * Tasa de interés anual de referencia (TEA) para estimaciones (8% = 0.08)
     */
    DEFAULT_ANNUAL_RATE: 0.08,

    /**
     * Plazos en meses permitidos para financiamiento
     */
    ALLOWED_TERMS_MONTHS: [12, 18, 24] as const,

    /**
     * Plazo predeterminado en meses
     */
    DEFAULT_TERM_MONTHS: 24,

    /**
     * Entrada / Inicial mínima sugerida (porcentaje del precio de la moto, e.g. 10%)
     */
    MIN_ENTRANCE_PERCENT: 0.10,
  },
} as const;

export type AllowedTermMonths = typeof PRICING_CONFIG.FINANCING.ALLOWED_TERMS_MONTHS[number];
