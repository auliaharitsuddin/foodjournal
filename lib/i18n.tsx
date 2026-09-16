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

    caloriesLabel: 'Kalori', kal: 'kal',
    diaryEmpty: 'Tidak ada catatan di hari ini',

    insightsCardTitle: 'Insight & Rekomendasi AI',
    insightsCardDesc: 'Pola makan & saran kesehatan dari datamu',
    weightLabel: 'Berat Badan',
    log: 'Catat',
    weightChartHint: 'Catat berat badan minimal 2x untuk melihat grafik',
    calories7Days: 'Kalori 7 Hari Terakhir',
    targetPerDay: (n: number) => `Target: ${n} kal/hari`,
    avg7Days: 'Rata-rata 7 Hari',
    daysAchieved: 'Hari Tercapai',

    addFoodTitle: 'Tambah Makanan',
    segBreakfast: 'Sarapan', segLunch: 'Siang', segDinner: 'Malam', segSnack: 'Camilan',
    searchFoodPlaceholder: 'Cari makanan...',
    scanBarcode: 'Scan Barcode',
    addManual: 'Tambah Manual',
    caloriesPer100g: (n: number) => `${n} kal / 100g`,
    foodNotFound: 'Makanan tidak ditemukan',
    tryOtherKeyword: 'Coba kata kunci lain atau scan barcode kemasan',

    manualHint: 'Masukkan nilai gizi per porsi yang kamu makan.',
    foodNameLabel: 'Nama makanan',
    servingGramsLabel: 'Porsi (gram)',
    labelProteinG: 'Protein (g)', labelCarbsG: 'Karbo (g)', labelFatG: 'Lemak (g)',
    next: 'Lanjut',

    scanWebTitle: 'Pindai Barcode Butuh Aplikasi Mobile',
    scanWebDesc: 'Fitur pindai barcode belum tersedia di versi web. Buka FoodJournal di aplikasi iOS/Android untuk memindai kemasan makanan.',
    back: 'Kembali',
    cameraPermTitle: 'Izin Kamera Diperlukan',
    cameraPermDesc: 'Untuk memindai barcode kemasan makanan, aplikasi butuh akses kamera.',
    allowCamera: 'Izinkan Kamera',
    searchingProduct: 'Mencari produk...',
    productNotFound: 'Produk tidak ditemukan. Coba barcode lain atau cari manual.',
    aimCamera: 'Arahkan kamera ke barcode produk',

    activitySedentary: 'Santai', activityLight: 'Ringan', activityModerate: 'Sedang', activityActive: 'Aktif',
    goalLose: 'Turun BB', goalMaintain: 'Jaga BB', goalGain: 'Naik BB',
    editProfileTitle: 'Ubah Profil & Target',
    nameLabel: 'Nama', heightLabel: 'Tinggi badan (cm)', goalWeightLabel: 'Berat badan target (kg)',
    activityLevelLabel: 'Level Aktivitas', goalTypeLabel: 'Tujuan',
    autoCalculate: 'Hitung Otomatis', waterMlLabel: 'Air (ml)', save: 'Simpan',

    defaultFoodName: 'Makanan', servingDefault: '1 porsi',
    tapToChangeGrams: 'gram (ketuk untuk ubah)',
    addToJournal: 'Tambahkan ke Jurnal',

    insightsPageTitle: 'Insight & Rekomendasi',
    aiRecommendationLabel: 'Rekomendasi AI',
    updatedAgo: (s: string) => `Diperbarui ${s}`,
    justNow: 'baru saja',
    minutesAgo: (n: number) => `${n} menit lalu`,
    hoursAgo: (n: number) => `${n} jam lalu`,
    daysAgo: (n: number) => `${n} hari lalu`,
    aiRecommendationDesc: 'Dapatkan rekomendasi pola makan & kesehatan dari Gemini AI berdasarkan data makan dan berat badanmu. Data makan & berat badanmu akan dikirim ke Gemini API untuk membuat rekomendasi ini.',
    genericError: 'Terjadi kesalahan. Coba lagi.',
    loadingLabel: 'Memuat...', updateRecommendation: 'Perbarui Rekomendasi', getRecommendation: 'Dapatkan Rekomendasi',
    patternsFound: 'Pola yang Ditemukan',
    needMoreData: 'Catat minimal 5 makanan untuk mulai menemukan pola.',

    logWaterTitle: 'Catat Air Minum',
    mlToday: (ml: number, goal: number) => `${ml} / ${goal} ml hari ini`,
    presetGlass: 'Gelas', presetSmallBottle: 'Botol Kecil', presetBigBottle: 'Botol Besar', presetOneLiter: '1 Liter',
    customAmount: 'Jumlah kustom',
    addMl: (n: number) => `Tambah ${n} ml`,

    logWeightTitle: 'Catat Berat Badan',
    targetKg: (n: number) => `Target: ${n} kg`,

    activityDescSedentary: 'Jarang olahraga', activityDescLight: 'Olahraga 1-3x/minggu',
    activityDescModerate: 'Olahraga 3-5x/minggu', activityDescActive: 'Olahraga tiap hari',
    goalLoseFull: 'Turun Berat Badan', goalMaintainFull: 'Jaga Berat Badan', goalGainFull: 'Naik Berat Badan',
    welcomeTitle: 'Selamat Datang',
    welcomeDesc: 'Yuk mulai catat perjalanan makan sehatmu. Siapa nama kamu?',
    namePlaceholder: 'Nama kamu',
    goalStepTitle: 'Apa tujuanmu?',
    goalStepDesc: 'Kami akan sesuaikan target kalori harianmu.',
    heightWeightTitle: 'Tinggi & Berat',
    heightWeightDesc: 'Dipakai untuk menghitung kebutuhan kalori harianmu.',
    currentWeightLabel: 'Berat badan saat ini (kg)',
    activityStepTitle: 'Seberapa aktif kamu?',
    activityStepDesc: 'Semakin aktif, semakin besar kebutuhan kalorimu.',
    allSetTitle: (name: string) => `Semua siap, ${name}!`,
    allSetDesc: 'Kami sudah menyiapkan target kalori & nutrisi harian yang disesuaikan untukmu. Kamu bisa mengubahnya kapan saja di halaman Profil.',
    startTracking: 'Mulai Catat',
    youDefault: 'Kamu',

    settingsSection: 'Pengaturan',
    dailyReminder: 'Pengingat Harian',
    reminderNotSupportedWeb: 'Tidak didukung di web',
    reminderDeniedTitle: 'Izin ditolak',
    reminderWebOnlyMobile: 'Pengingat harian hanya tersedia di aplikasi iOS/Android.',
    reminderEnableInSettings: 'Aktifkan izin notifikasi di pengaturan sistem.',
    reminderWebHint: 'Hanya tersedia di iOS/Android',
    reminderTimeHint: 'Setiap jam 19:00',
    madeWith: 'FoodJournal · dibuat dengan 🧡',
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

    caloriesLabel: 'Calories', kal: 'cal',
    diaryEmpty: 'No entries logged today',

    insightsCardTitle: 'AI Insight & Recommendation',
    insightsCardDesc: 'Eating patterns & health tips from your data',
    weightLabel: 'Weight',
    log: 'Log',
    weightChartHint: 'Log your weight at least twice to see a chart',
    calories7Days: 'Calories Last 7 Days',
    targetPerDay: (n: number) => `Target: ${n} cal/day`,
    avg7Days: '7-Day Average',
    daysAchieved: 'Days Hit',

    addFoodTitle: 'Add Food',
    segBreakfast: 'Breakfast', segLunch: 'Lunch', segDinner: 'Dinner', segSnack: 'Snack',
    searchFoodPlaceholder: 'Search food...',
    scanBarcode: 'Scan Barcode',
    addManual: 'Add Manually',
    caloriesPer100g: (n: number) => `${n} cal / 100g`,
    foodNotFound: 'Food not found',
    tryOtherKeyword: 'Try another keyword or scan a barcode',

    manualHint: 'Enter the nutrition values for the portion you ate.',
    foodNameLabel: 'Food name',
    servingGramsLabel: 'Serving (grams)',
    labelProteinG: 'Protein (g)', labelCarbsG: 'Carbs (g)', labelFatG: 'Fat (g)',
    next: 'Next',

    scanWebTitle: 'Barcode Scanning Needs the Mobile App',
    scanWebDesc: 'Barcode scanning is not yet available on the web version. Open FoodJournal on iOS/Android to scan food packaging.',
    back: 'Back',
    cameraPermTitle: 'Camera Permission Needed',
    cameraPermDesc: 'To scan food packaging barcodes, the app needs camera access.',
    allowCamera: 'Allow Camera',
    searchingProduct: 'Looking up product...',
    productNotFound: 'Product not found. Try another barcode or search manually.',
    aimCamera: 'Point your camera at a product barcode',

    activitySedentary: 'Sedentary', activityLight: 'Light', activityModerate: 'Moderate', activityActive: 'Active',
    goalLose: 'Lose Weight', goalMaintain: 'Maintain', goalGain: 'Gain Weight',
    editProfileTitle: 'Edit Profile & Goals',
    nameLabel: 'Name', heightLabel: 'Height (cm)', goalWeightLabel: 'Goal weight (kg)',
    activityLevelLabel: 'Activity Level', goalTypeLabel: 'Goal',
    autoCalculate: 'Auto Calculate', waterMlLabel: 'Water (ml)', save: 'Save',

    defaultFoodName: 'Food', servingDefault: '1 serving',
    tapToChangeGrams: 'grams (tap to edit)',
    addToJournal: 'Add to Journal',

    insightsPageTitle: 'Insight & Recommendation',
    aiRecommendationLabel: 'AI Recommendation',
    updatedAgo: (s: string) => `Updated ${s}`,
    justNow: 'just now',
    minutesAgo: (n: number) => `${n} min ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,
    aiRecommendationDesc: 'Get eating pattern & health recommendations from Gemini AI based on your meal and weight data. Your meal and weight data will be sent to the Gemini API to generate this recommendation.',
    genericError: 'Something went wrong. Please try again.',
    loadingLabel: 'Loading...', updateRecommendation: 'Update Recommendation', getRecommendation: 'Get Recommendation',
    patternsFound: 'Patterns Found',
    needMoreData: 'Log at least 5 meals to start finding patterns.',

    logWaterTitle: 'Log Water',
    mlToday: (ml: number, goal: number) => `${ml} / ${goal} ml today`,
    presetGlass: 'Glass', presetSmallBottle: 'Small Bottle', presetBigBottle: 'Big Bottle', presetOneLiter: '1 Liter',
    customAmount: 'Custom amount',
    addMl: (n: number) => `Add ${n} ml`,

    logWeightTitle: 'Log Weight',
    targetKg: (n: number) => `Target: ${n} kg`,

    activityDescSedentary: 'Rarely exercise', activityDescLight: 'Exercise 1-3x/week',
    activityDescModerate: 'Exercise 3-5x/week', activityDescActive: 'Exercise every day',
    goalLoseFull: 'Lose Weight', goalMaintainFull: 'Maintain Weight', goalGainFull: 'Gain Weight',
    welcomeTitle: 'Welcome',
    welcomeDesc: "Let's start tracking your healthy eating journey. What's your name?",
    namePlaceholder: 'Your name',
    goalStepTitle: "What's your goal?",
    goalStepDesc: "We'll tailor your daily calorie target.",
    heightWeightTitle: 'Height & Weight',
    heightWeightDesc: 'Used to calculate your daily calorie needs.',
    currentWeightLabel: 'Current weight (kg)',
    activityStepTitle: 'How active are you?',
    activityStepDesc: 'The more active, the higher your calorie needs.',
    allSetTitle: (name: string) => `All set, ${name}!`,
    allSetDesc: "We've set up daily calorie & nutrition targets tailored for you. You can change them anytime on the Profile page.",
    startTracking: 'Start Tracking',
    youDefault: 'You',

    settingsSection: 'Settings',
    dailyReminder: 'Daily Reminder',
    reminderNotSupportedWeb: 'Not supported on web',
    reminderDeniedTitle: 'Permission denied',
    reminderWebOnlyMobile: 'Daily reminders are only available in the iOS/Android app.',
    reminderEnableInSettings: 'Enable notification permission in system settings.',
    reminderWebHint: 'Only available on iOS/Android',
    reminderTimeHint: 'Every day at 7:00 PM',
    madeWith: 'FoodJournal · made with 🧡',
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
