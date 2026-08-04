export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Scooter: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
  Naked: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
  Deportiva: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
  Trail: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=1200',
  Touring: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200',
  Custom: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200'
};

export function getCategoryFallbackImage(category?: string): string {
  if (!category) return CATEGORY_FALLBACK_IMAGES.Naked;
  const key = Object.keys(CATEGORY_FALLBACK_IMAGES).find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  return key ? CATEGORY_FALLBACK_IMAGES[key] : CATEGORY_FALLBACK_IMAGES.Naked;
}

export function getCategoryFallbackGallery(category?: string, mainImg?: string): string[] {
  const main = mainImg || getCategoryFallbackImage(category);
  const alt = getCategoryFallbackImage(category === 'Naked' ? 'Trail' : 'Naked');
  const general1 = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200';
  const general2 = 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1200';
  
  const list = [main, alt, general1, general2].filter(Boolean);
  return Array.from(new Set(list));
}
