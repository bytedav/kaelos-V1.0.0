import { MotorbikeExtended } from '../components/MotorbikeCard';

export type MotorbikeData = MotorbikeExtended;

export function getReservedBikeIds(): string[] {
  try {
    const saved = localStorage.getItem('kaelos_reserved_bikes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function reserveBikeInDb(bikeId: string): boolean {
  try {
    const current = getReservedBikeIds();
    if (!current.includes(bikeId)) {
      const updated = [...current, bikeId];
      localStorage.setItem('kaelos_reserved_bikes', JSON.stringify(updated));
    }
    // Async post to backend API
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bikeId }),
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export async function getMotorbikesFromDb(fallback: MotorbikeData[]): Promise<MotorbikeData[]> {
  try {
    const res = await fetch('/api/motorbikes');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        localStorage.setItem('kaelos_motorbikes_data', JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch {
    // API network error fallback
  }

  try {
    const saved = localStorage.getItem('kaelos_motorbikes_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return fallback;
}

export function getOrderById(id: string): any | null {
  try {
    const cleanId = id.replace(/^[#?kK-]+/i, '').trim();
    const saved = localStorage.getItem(`kaelos_order_${cleanId}`);
    if (saved) return JSON.parse(saved);

    // Fallback: search localStorage keys for matching order_id or id
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('kaelos_order_')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed.id === cleanId || parsed.order_id === cleanId) {
            return parsed;
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveOrder(order: any): any {
  try {
    const id = order.id || order.order_id || `ORD-${Date.now()}`;
    const cleanId = String(id).replace(/^[#?kK-]+/i, '').trim();
    const orderToSave = { ...order, id: cleanId, order_id: cleanId };
    localStorage.setItem(`kaelos_order_${cleanId}`, JSON.stringify(orderToSave));
    return orderToSave;
  } catch {
    return order;
  }
}

export function submitLeadInDb(leadData: any): boolean {
  try {
    const saved = localStorage.getItem('kaelos_leads');
    const currentLeads = saved ? JSON.parse(saved) : [];
    currentLeads.push({ ...leadData, createdAt: new Date().toISOString() });
    localStorage.setItem('kaelos_leads', JSON.stringify(currentLeads));

    // Post lead asynchronously to backend
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    }).catch(() => {});

    return true;
  } catch {
    return false;
  }
}
