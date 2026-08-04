/**
 * Utility functions for privacy enforcement and customer data sanitization.
 * Ensures strict compliance with data privacy policies by masking or omitting
 * sensitive personal identifiable information (PII) like full phone numbers,
 * exact physical addresses, and email addresses in public UI layers.
 */

/**
 * Sanitizes customer name for display.
 */
export function sanitizeCustomerName(fullName?: string): string {
  if (!fullName || typeof fullName !== 'string') return 'Cliente KAELOS';
  const clean = fullName.trim();
  if (!clean) return 'Cliente KAELOS';
  return clean;
}

/**
 * Obfuscates or protects phone numbers.
 */
export function maskPhone(phone?: string): string {
  if (!phone) return 'Dato de contacto registrado';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 6) {
    return `${digits.slice(0, 3)} *** ***`;
  }
  return 'Dato de contacto registrado';
}

/**
 * Obfuscates or protects email addresses.
 */
export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'Correo protegido';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

/**
 * Sanitizes exact street address to city or district level for privacy.
 */
export function sanitizeAddress(address?: string, city?: string): string {
  if (city && city.trim()) {
    return `Ciudad de entrega: ${city.trim()}`;
  }
  return 'Dirección de entrega registrada (Protegida)';
}
