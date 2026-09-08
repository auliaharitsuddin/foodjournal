import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, FoodItem, MealEntry, MealType, UserProfile, WaterEntry, WeightEntry } from './types';
import { clearState, defaultState, loadState, saveState } from './storage';

interface StoreValue {
  state: AppState;
  ready: boolean;
  updateProfile: (patch: Partial<UserProfile>) => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  addMeal: (food: FoodItem, grams: number, mealType: MealType, loggedAt?: string) => void;
  removeMeal: (id: string) => void;
  addWater: (ml: number) => void;
  removeWater: (id: string) => void;
  addWeight: (kg: number) => void;
  resetAll: () => void;
  setAiRecommendation: (text: string) => void;
  todayMeals: MealEntry[];
  todayWater: WaterEntry[];
  todayTotals: { calories: number; protein: number; carbs: number; fat: number };
  streakDays: number;
}

const StoreContext = createContext<StoreValue | null>(null);

function isSameDay(iso: string, ref: Date) {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const completeOnboarding = useCallback((profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile, hasOnboarded: true },
      weights: profile.startWeightKg
        ? [{ id: uid(), kg: profile.startWeightKg, loggedAt: new Date().toISOString() }]
        : prev.weights,
    }));
  }, []);

  const addMeal = useCallback((food: FoodItem, grams: number, mealType: MealType, loggedAt?: string) => {
    const factor = grams / 100;
    const entry: MealEntry = {
      id: uid(),
      foodId: food.id,
      name: food.name,
      emoji: food.emoji,
      mealType,
      grams,
      calories: Math.round(food.caloriesPer100g * factor),
      protein: Math.round(food.proteinPer100g * factor * 10) / 10,
      carbs: Math.round(food.carbsPer100g * factor * 10) / 10,
      fat: Math.round(food.fatPer100g * factor * 10) / 10,
      loggedAt: loggedAt ?? new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, meals: [entry, ...prev.meals] }));
  }, []);

  const removeMeal = useCallback((id: string) => {
    setState((prev) => ({ ...prev, meals: prev.meals.filter((m) => m.id !== id) }));
  }, []);

  const addWater = useCallback((ml: number) => {
    const entry: WaterEntry = { id: uid(), ml, loggedAt: new Date().toISOString() };
    setState((prev) => ({ ...prev, water: [entry, ...prev.water] }));
  }, []);

  const removeWater = useCallback((id: string) => {
    setState((prev) => ({ ...prev, water: prev.water.filter((w) => w.id !== id) }));
  }, []);

  const addWeight = useCallback((kg: number) => {
    const entry: WeightEntry = { id: uid(), kg, loggedAt: new Date().toISOString() };
    setState((prev) => ({ ...prev, weights: [entry, ...prev.weights] }));
  }, []);

  const resetAll = useCallback(() => {
    clearState();
    setState(defaultState);
  }, []);

  const setAiRecommendation = useCallback((text: string) => {
    setState((prev) => ({ ...prev, aiRecommendation: { text, generatedAt: new Date().toISOString() } }));
  }, []);

  const today = new Date();
  const todayMeals = useMemo(() => state.meals.filter((m) => isSameDay(m.loggedAt, today)), [state.meals]);
  const todayWater = useMemo(() => state.water.filter((w) => isSameDay(w.loggedAt, today)), [state.water]);

  const todayTotals = useMemo(
    () =>
      todayMeals.reduce(
        (acc, m) => ({
          calories: acc.calories + m.calories,
          protein: acc.protein + m.protein,
          carbs: acc.carbs + m.carbs,
          fat: acc.fat + m.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [todayMeals]
  );

  const streakDays = useMemo(() => {
    let streak = 0;
    const cursor = new Date();
    // If nothing logged today yet, still allow streak counting from yesterday backward.
    for (let i = 0; i < 365; i++) {
      const hasEntry = state.meals.some((m) => isSameDay(m.loggedAt, cursor));
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      } else {
        // no entry today yet — don't break the streak, just don't count today
      }
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }, [state.meals]);

  const value: StoreValue = {
    state,
    ready,
    updateProfile,
    completeOnboarding,
    addMeal,
    removeMeal,
    addWater,
    removeWater,
    addWeight,
    resetAll,
    setAiRecommendation,
    todayMeals,
    todayWater,
    todayTotals,
    streakDays,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
