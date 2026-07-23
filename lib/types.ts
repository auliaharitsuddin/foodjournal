export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  emoji: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultServingG: number;
  servingLabel: string;
}

export interface MealEntry {
  id: string;
  foodId: string;
  name: string;
  emoji: string;
  mealType: MealType;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string; // ISO
}

export interface WaterEntry {
  id: string;
  ml: number;
  loggedAt: string;
}

export interface WeightEntry {
  id: string;
  kg: number;
  loggedAt: string;
}

export interface UserProfile {
  name: string;
  hasOnboarded: boolean;
  goalCalories: number;
  goalProteinG: number;
  goalCarbsG: number;
  goalFatG: number;
  goalWaterMl: number;
  heightCm: number;
  startWeightKg: number;
  goalWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  goalType: 'lose' | 'maintain' | 'gain';
}

export interface AppState {
  profile: UserProfile;
  meals: MealEntry[];
  water: WaterEntry[];
  weights: WeightEntry[];
}
