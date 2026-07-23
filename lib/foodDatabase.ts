import { FoodItem } from './types';

// Curated offline food database (Indonesian favorites + common international items).
// Values are per 100g unless noted; used for fast offline quick-add without any API key.
export const FOOD_DATABASE: FoodItem[] = [
  // --- Indonesian staples ---
  { id: 'nasi-putih', name: 'Nasi Putih', emoji: '🍚', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, defaultServingG: 150, servingLabel: '1 centong' },
  { id: 'nasi-goreng', name: 'Nasi Goreng', emoji: '🍛', caloriesPer100g: 168, proteinPer100g: 4.2, carbsPer100g: 24, fatPer100g: 6.5, defaultServingG: 250, servingLabel: '1 piring' },
  { id: 'ayam-goreng', name: 'Ayam Goreng', emoji: '🍗', caloriesPer100g: 260, proteinPer100g: 27, carbsPer100g: 6, fatPer100g: 15, defaultServingG: 120, servingLabel: '1 potong' },
  { id: 'ayam-bakar', name: 'Ayam Bakar', emoji: '🍢', caloriesPer100g: 215, proteinPer100g: 28, carbsPer100g: 3, fatPer100g: 10, defaultServingG: 120, servingLabel: '1 potong' },
  { id: 'rendang', name: 'Rendang Daging', emoji: '🥘', caloriesPer100g: 275, proteinPer100g: 20, carbsPer100g: 6, fatPer100g: 19, defaultServingG: 100, servingLabel: '1 porsi' },
  { id: 'sate-ayam', name: 'Sate Ayam (+ bumbu kacang)', emoji: '🍡', caloriesPer100g: 220, proteinPer100g: 18, carbsPer100g: 8, fatPer100g: 13, defaultServingG: 100, servingLabel: '10 tusuk' },
  { id: 'gado-gado', name: 'Gado-Gado', emoji: '🥗', caloriesPer100g: 150, proteinPer100g: 6, carbsPer100g: 12, fatPer100g: 9, defaultServingG: 250, servingLabel: '1 piring' },
  { id: 'soto-ayam', name: 'Soto Ayam', emoji: '🍲', caloriesPer100g: 65, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 3, defaultServingG: 300, servingLabel: '1 mangkuk' },
  { id: 'bakso', name: 'Bakso', emoji: '🍜', caloriesPer100g: 95, proteinPer100g: 8, carbsPer100g: 6, fatPer100g: 4, defaultServingG: 350, servingLabel: '1 mangkuk' },
  { id: 'mie-goreng', name: 'Mie Goreng', emoji: '🍝', caloriesPer100g: 175, proteinPer100g: 4.5, carbsPer100g: 25, fatPer100g: 6.5, defaultServingG: 250, servingLabel: '1 piring' },
  { id: 'tempe-goreng', name: 'Tempe Goreng', emoji: '🟫', caloriesPer100g: 195, proteinPer100g: 15, carbsPer100g: 12, fatPer100g: 10, defaultServingG: 50, servingLabel: '2 potong' },
  { id: 'tahu-goreng', name: 'Tahu Goreng', emoji: '⬜', caloriesPer100g: 145, proteinPer100g: 10, carbsPer100g: 5, fatPer100g: 9, defaultServingG: 50, servingLabel: '2 potong' },
  { id: 'telur-dadar', name: 'Telur Dadar', emoji: '🍳', caloriesPer100g: 196, proteinPer100g: 13, carbsPer100g: 2, fatPer100g: 15, defaultServingG: 60, servingLabel: '1 butir' },
  { id: 'telur-rebus', name: 'Telur Rebus', emoji: '🥚', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1, fatPer100g: 11, defaultServingG: 55, servingLabel: '1 butir' },
  { id: 'pecel-lele', name: 'Pecel Lele', emoji: '🐟', caloriesPer100g: 210, proteinPer100g: 18, carbsPer100g: 4, fatPer100g: 14, defaultServingG: 150, servingLabel: '1 ekor' },
  { id: 'rawon', name: 'Rawon', emoji: '🍛', caloriesPer100g: 145, proteinPer100g: 12, carbsPer100g: 5, fatPer100g: 9, defaultServingG: 300, servingLabel: '1 mangkuk' },
  { id: 'gudeg', name: 'Gudeg', emoji: '🍱', caloriesPer100g: 160, proteinPer100g: 5, carbsPer100g: 20, fatPer100g: 7, defaultServingG: 250, servingLabel: '1 porsi' },
  { id: 'nasi-uduk', name: 'Nasi Uduk', emoji: '🍚', caloriesPer100g: 180, proteinPer100g: 3.5, carbsPer100g: 26, fatPer100g: 7, defaultServingG: 200, servingLabel: '1 porsi' },
  { id: 'martabak-manis', name: 'Martabak Manis', emoji: '🥞', caloriesPer100g: 330, proteinPer100g: 6, carbsPer100g: 45, fatPer100g: 14, defaultServingG: 100, servingLabel: '1 potong' },
  { id: 'pisang-goreng', name: 'Pisang Goreng', emoji: '🍌', caloriesPer100g: 260, proteinPer100g: 2, carbsPer100g: 40, fatPer100g: 10, defaultServingG: 80, servingLabel: '2 buah' },
  { id: 'kerupuk', name: 'Kerupuk', emoji: '🍘', caloriesPer100g: 500, proteinPer100g: 5, carbsPer100g: 60, fatPer100g: 27, defaultServingG: 15, servingLabel: '3 keping' },
  { id: 'sambal', name: 'Sambal', emoji: '🌶️', caloriesPer100g: 45, proteinPer100g: 1.5, carbsPer100g: 8, fatPer100g: 1, defaultServingG: 20, servingLabel: '1 sdm' },
  { id: 'capcay', name: 'Capcay', emoji: '🥦', caloriesPer100g: 65, proteinPer100g: 3, carbsPer100g: 7, fatPer100g: 3, defaultServingG: 200, servingLabel: '1 porsi' },
  { id: 'kolak', name: 'Kolak Pisang', emoji: '🍮', caloriesPer100g: 150, proteinPer100g: 1.5, carbsPer100g: 28, fatPer100g: 4, defaultServingG: 200, servingLabel: '1 mangkuk' },

  // --- Fruits & veg ---
  { id: 'apple', name: 'Apel', emoji: '🍎', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, defaultServingG: 150, servingLabel: '1 buah' },
  { id: 'banana', name: 'Pisang', emoji: '🍌', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, defaultServingG: 120, servingLabel: '1 buah' },
  { id: 'papaya', name: 'Pepaya', emoji: '🧡', caloriesPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 11, fatPer100g: 0.3, defaultServingG: 150, servingLabel: '1 potong' },
  { id: 'watermelon', name: 'Semangka', emoji: '🍉', caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 8, fatPer100g: 0.2, defaultServingG: 200, servingLabel: '1 potong' },
  { id: 'orange', name: 'Jeruk', emoji: '🍊', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, defaultServingG: 130, servingLabel: '1 buah' },
  { id: 'broccoli', name: 'Brokoli', emoji: '🥦', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, defaultServingG: 100, servingLabel: '1 mangkuk' },
  { id: 'spinach', name: 'Bayam', emoji: '🥬', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, defaultServingG: 100, servingLabel: '1 mangkuk' },
  { id: 'avocado', name: 'Alpukat', emoji: '🥑', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, defaultServingG: 100, servingLabel: '1/2 buah' },

  // --- Proteins & staples ---
  { id: 'chicken-breast', name: 'Dada Ayam (tanpa kulit)', emoji: '🍗', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, defaultServingG: 120, servingLabel: '1 potong' },
  { id: 'salmon', name: 'Salmon', emoji: '🐟', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, defaultServingG: 120, servingLabel: '1 fillet' },
  { id: 'beef', name: 'Daging Sapi', emoji: '🥩', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 17, defaultServingG: 100, servingLabel: '1 porsi' },
  { id: 'shrimp', name: 'Udang', emoji: '🍤', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3, defaultServingG: 100, servingLabel: '1 porsi' },
  { id: 'rice-brown', name: 'Nasi Merah', emoji: '🍙', caloriesPer100g: 111, proteinPer100g: 2.6, carbsPer100g: 23, fatPer100g: 0.9, defaultServingG: 150, servingLabel: '1 centong' },
  { id: 'oatmeal', name: 'Oatmeal', emoji: '🥣', caloriesPer100g: 68, proteinPer100g: 2.4, carbsPer100g: 12, fatPer100g: 1.4, defaultServingG: 200, servingLabel: '1 mangkuk' },
  { id: 'bread', name: 'Roti Tawar', emoji: '🍞', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.2, defaultServingG: 30, servingLabel: '1 lembar' },
  { id: 'egg-boiled', name: 'Telur Rebus', emoji: '🥚', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, defaultServingG: 55, servingLabel: '1 butir' },
  { id: 'milk', name: 'Susu Sapi', emoji: '🥛', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, defaultServingG: 250, servingLabel: '1 gelas' },
  { id: 'yogurt', name: 'Greek Yogurt', emoji: '🍦', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4, defaultServingG: 150, servingLabel: '1 cup' },
  { id: 'tofu', name: 'Tahu', emoji: '⬜', caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8, defaultServingG: 100, servingLabel: '1 potong besar' },
  { id: 'tempeh', name: 'Tempe', emoji: '🟫', caloriesPer100g: 193, proteinPer100g: 19, carbsPer100g: 9, fatPer100g: 11, defaultServingG: 80, servingLabel: '2 potong' },
  { id: 'almonds', name: 'Kacang Almond', emoji: '🌰', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, defaultServingG: 30, servingLabel: '1 genggam' },
  { id: 'coffee-black', name: 'Kopi Hitam', emoji: '☕', caloriesPer100g: 2, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0, defaultServingG: 200, servingLabel: '1 cangkir' },
  { id: 'kopi-susu', name: 'Kopi Susu', emoji: '🥤', caloriesPer100g: 60, proteinPer100g: 1.8, carbsPer100g: 8, fatPer100g: 2.2, defaultServingG: 250, servingLabel: '1 gelas' },
  { id: 'boba', name: 'Boba / Bubble Tea', emoji: '🧋', caloriesPer100g: 90, proteinPer100g: 0.3, carbsPer100g: 20, fatPer100g: 1, defaultServingG: 350, servingLabel: '1 gelas' },
  { id: 'french-fries', name: 'Kentang Goreng', emoji: '🍟', caloriesPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41, fatPer100g: 15, defaultServingG: 100, servingLabel: '1 porsi kecil' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', caloriesPer100g: 266, proteinPer100g: 11, carbsPer100g: 33, fatPer100g: 10, defaultServingG: 120, servingLabel: '2 slice' },
  { id: 'burger', name: 'Burger', emoji: '🍔', caloriesPer100g: 295, proteinPer100g: 17, carbsPer100g: 24, fatPer100g: 14, defaultServingG: 200, servingLabel: '1 buah' },
  { id: 'instant-noodle', name: 'Mie Instan', emoji: '🍜', caloriesPer100g: 436, proteinPer100g: 9, carbsPer100g: 58, fatPer100g: 18, defaultServingG: 85, servingLabel: '1 bungkus' },
  { id: 'chocolate', name: 'Cokelat', emoji: '🍫', caloriesPer100g: 546, proteinPer100g: 4.9, carbsPer100g: 61, fatPer100g: 31, defaultServingG: 30, servingLabel: '1 batang kecil' },
];

export function searchFoodDatabase(query: string): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q));
}
