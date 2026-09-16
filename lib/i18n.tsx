import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'id' | 'en';
const KEY = 'foodjournal.lang';

function dictFor(lang: Lang) {
  const id = {
    greetMorning: 'Selamat Pagi', greetNoon: 'Selamat Siang', greetAfternoon: 'Selamat Sore', greetEvening: 'Selamat Malam',
    you: 'kamu',
    caloriesLeft: 'kalori tersisa',
    protein: 'Protein', carbs: 'Karbo', fat: 'Lemak',
    waterIntake: 'Air Minum',
    addMeal: 'Tambah Makan',
    mealBreakfast: 'Sarapan', mealLunch: 'Makan Siang', mealDinner: 'Makan Malam', mealSnack: 'Camilan',
    todayMeals: 'Makan Hari Ini',
    itemsCount: (n: number) => `${n} item`,
    noMealsYet: 'Belum ada makanan dicatat',

    tabHome: 'Hari Ini', tabDiary: 'Jurnal', tabTrends: 'Progres', tabProfile: 'Profil',

    profileTitle: 'Profil',
    editProfile: 'Edit Profil',
    dailyGoals: 'Target Harian',
    language: 'Bahasa',
    resetData: 'Reset Data',
    resetConfirmTitle: 'Reset semua data?',
    resetConfirmMsg: 'Semua catatan makan, air, dan berat badan akan dihapus. Tindakan ini tidak bisa dibatalkan.',
    cancel: 'Batal', confirm: 'Reset',
  };

  const en: typeof id = {
    greetMorning: 'Good Morning', greetNoon: 'Good Afternoon', greetAfternoon: 'Good Afternoon', greetEvening: 'Good Evening',
    you: 'you',
    caloriesLeft: 'calories left',
    protein: 'Protein', carbs: 'Carbs', fat: 'Fat',
    waterIntake: 'Water Intake',
    addMeal: 'Add Meal',
    mealBreakfast: 'Breakfast', mealLunch: 'Lunch', mealDinner: 'Dinner', mealSnack: 'Snack',
    todayMeals: "Today's Meals",
    itemsCount: (n: number) => `${n} items`,
    noMealsYet: 'No meals logged yet',

    tabHome: 'Today', tabDiary: 'Diary', tabTrends: 'Progress', tabProfile: 'Profile',

    profileTitle: 'Profile',
    editProfile: 'Edit Profile',
    dailyGoals: 'Daily Goals',
    language: 'Language',
    resetData: 'Reset Data',
    resetConfirmTitle: 'Reset all data?',
    resetConfirmMsg: 'All meal, water, and weight entries will be deleted. This cannot be undone.',
    cancel: 'Cancel', confirm: 'Reset',
  };

  return lang === 'id' ? id : en;
}

export type Dict = ReturnType<typeof dictFor>;

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id');
  useEffect(() => { AsyncStorage.getItem(KEY).then((v) => { if (v === 'en' || v === 'id') setLangState(v); }); }, []);
  const setLang = (l: Lang) => { setLangState(l); AsyncStorage.setItem(KEY, l).catch(() => {}); };
  return <LanguageContext.Provider value={{ lang, setLang, t: dictFor(lang) }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
