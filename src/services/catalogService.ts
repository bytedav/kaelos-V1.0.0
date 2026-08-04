import { MotorbikeExtended } from '../components/MotorbikeCard';
import { motorbikesData } from '../data/motorbikesData';

/**
 * Service Abstraction Layer for Catalog Operations.
 * Currently backed by in-memory mock data, easily swappable with Firebase / Supabase.
 */

export async function getMotorbikes(): Promise<MotorbikeExtended[]> {
  try {
    const res = await fetch('/api/motorbikes');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // API network fallback
  }
  return motorbikesData;
}

export function getMotorbikesSync(): MotorbikeExtended[] {
  return motorbikesData;
}

export function getMotorbikeById(id: string): MotorbikeExtended | undefined {
  if (!id) return undefined;
  const targetId = id.toLowerCase().trim();
  return motorbikesData.find(b => b.id.toLowerCase() === targetId);
}

export function getRelatedMotorbikes(currentId: string, category?: string, limit: number = 4): MotorbikeExtended[] {
  return motorbikesData
    .filter(b => b.id !== currentId && (!category || b.category.toLowerCase() === category.toLowerCase()))
    .slice(0, limit);
}
