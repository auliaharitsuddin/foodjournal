import { FoodItem } from './types';

// Open Food Facts is a free, keyless public API — used for barcode lookups.
export async function lookupBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    const json = await res.json();
    if (json.status !== 1 || !json.product) return null;
    const p = json.product;
    const n = p.nutriments ?? {};
    const name: string = p.product_name || p.generic_name || 'Produk tidak dikenal';
    const grams = p.serving_quantity ? Number(p.serving_quantity) : 100;
    return {
      id: `off-${barcode}`,
      name,
      brand: p.brands,
      emoji: '📦',
      caloriesPer100g: Math.round(n['energy-kcal_100g'] ?? 0),
      proteinPer100g: Math.round((n.proteins_100g ?? 0) * 10) / 10,
      carbsPer100g: Math.round((n.carbohydrates_100g ?? 0) * 10) / 10,
      fatPer100g: Math.round((n.fat_100g ?? 0) * 10) / 10,
      defaultServingG: grams,
      servingLabel: p.serving_size || '1 porsi',
    };
  } catch {
    return null;
  }
}
