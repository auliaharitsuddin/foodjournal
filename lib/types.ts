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

export interface AiRecommendation {
  text: string;
  generatedAt: string;
}

export interface AppState {
  profile: UserProfile;
  meals: MealEntry[];
  water: WaterEntry[];
  weights: WeightEntry[];
  aiRecommendation: AiRecommendation | null;
}

export type GraphNodeType = 'food' | 'mealType' | 'weekday' | 'metric';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  weight: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
  label: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
