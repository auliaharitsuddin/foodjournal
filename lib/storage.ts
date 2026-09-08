import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './types';

const STORAGE_KEY = '@foodjournal/state/v1';

export const defaultState: AppState = {
  profile: {
    name: '',
    hasOnboarded: false,
    goalCalories: 2000,
    goalProteinG: 100,
    goalCarbsG: 250,
    goalFatG: 65,
    goalWaterMl: 2000,
    heightCm: 165,
    startWeightKg: 65,
    goalWeightKg: 60,
    activityLevel: 'moderate',
    goalType: 'lose',
  },
  meals: [],
  water: [],
  weights: [],
  aiRecommendation: null,
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed, profile: { ...defaultState.profile, ...parsed.profile } };
  } catch {
    return defaultState;
  }
}

export async function saveState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
