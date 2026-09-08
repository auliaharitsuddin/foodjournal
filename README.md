# FoodJournal

A local-first mobile food and nutrition tracker built with [Expo](https://expo.dev)
(React Native) and TypeScript. Log meals, track daily macro goals, monitor
water intake and body weight over time, and scan food packaging barcodes to
auto-fill nutrition data — all without an account or backend server.

## Features

- **Meal logging** — add meals to breakfast, lunch, dinner, or snack, with
  calories, protein, carbs, and fat tracked per entry.
- **Barcode scanning** — scan a product's barcode with the device camera
  (`expo-camera`) to automatically pull nutrition facts from the free,
  keyless [Open Food Facts](https://world.openfoodfacts.org/) API.
- **Daily goals** — set personal targets for calories, protein, carbs, fat,
  and water intake, and track progress against them.
- **Water & weight tracking** — log water intake and body weight, and view
  trends over time.
- **Onboarding flow** — a guided first-run setup that captures height,
  starting weight, goal weight, activity level, and goal type (lose /
  maintain / gain) to compute personalized daily targets.
- **Trends & charts** — visualize calorie, macro, water, and weight history.
- **Notifications** — optional reminders via `expo-notifications`.
- **Manual meal entry** — add a meal by hand when a barcode isn't available.
- **AI insights** — an optional "Insights" screen that summarizes recent
  eating patterns (via a lightweight knowledge graph built from logged
  meals) and asks a Gemini model for a short, actionable nutrition
  recommendation.
- **Polished UI** — animated transitions (`moti` / `react-native-reanimated`),
  gradients, blur effects, and swipe-to-delete interactions.
- **100% offline / local-first** — all data is persisted on-device with
  `AsyncStorage`. There is no user account system and no backend; the only
  network calls are the optional, keyless Open Food Facts lookup during
  barcode scanning, and the optional Gemini call for AI insights (only if
  an API key is configured).

## Tech stack

- [Expo](https://expo.dev) SDK 57 + Expo Router (file-based routing)
- React Native 0.86 + React 19
- TypeScript
- `@react-native-async-storage/async-storage` for local persistence
- `moti` / `react-native-reanimated` for animation
- `expo-camera` for barcode scanning
- [Open Food Facts API](https://world.openfoodfacts.org/data) for product
  nutrition lookups

## Getting started

Requires [Node.js](https://nodejs.org/) and the Expo CLI (installed
automatically via `npx`).

```bash
npm install
npx expo start
```

To enable the optional AI insights feature, create a `.env` file with:

```
EXPO_PUBLIC_GEMINI_API_KEY=<your Gemini API key>
EXPO_PUBLIC_GEMINI_MODEL=<optional, defaults to gemini-3.6-flash>
```

This is not required for the app to run — every other feature works with
no configuration.

This opens the Expo developer tools. From there you can run the app on:

- **iOS Simulator**: press `i` (macOS only, requires Xcode)
- **Android Emulator**: press `a` (requires Android Studio)
- **Physical device**: scan the QR code with the [Expo Go](https://expo.dev/go)
  app
- **Web**: press `w`

## Project structure

```
app/                  Expo Router screens (file-based routing)
  (tabs)/             Bottom-tab screens: home, diary, trends, profile
  add-meal/           Add-meal flow, including barcode scanning
  food/[id].tsx        Food detail screen
  onboarding.tsx        First-run onboarding flow
  log-water.tsx         Water logging screen
  log-weight.tsx        Weight logging screen
components/           Reusable UI components (charts, cards, buttons, etc.)
lib/
  types.ts             Shared TypeScript types (FoodItem, MealEntry, ...)
  storage.ts           AsyncStorage read/write helpers
  store.tsx            App-wide state (React Context)
  foodDatabase.ts       Local/bundled food database
  openFoodFacts.ts      Open Food Facts API client
  notifications.ts      Local notification scheduling
  theme.ts / useTheme.ts  Theme (dark/light) support
```

## Notes

- The in-app camera permission prompt and some UI copy are in Indonesian, as
  the app was originally built with Indonesian users in mind.
- No API keys or secrets are required to run the core app — the only
  external API used by default (Open Food Facts) is free and keyless. The
  AI insights feature is optional and needs your own Gemini API key.

## License

MIT — see [LICENSE](./LICENSE).

---

## Bahasa Indonesia

### Deskripsi Proyek

**FoodJournal** adalah aplikasi mobile pencatat makanan dan nutrisi yang
sepenuhnya berjalan secara lokal (local-first), dibangun dengan Expo (React
Native) dan TypeScript. Aplikasi ini menyelesaikan masalah sulitnya
mencatat asupan kalori dan nutrisi harian tanpa perlu akun, server backend,
atau koneksi internet yang konstan — semua data tersimpan di perangkat.

### Fungsi

- Mencatat makanan harian beserta kalori, protein, karbohidrat, dan lemak.
- Memindai barcode kemasan makanan untuk mengambil data nutrisi otomatis.
- Melacak target harian (kalori, makro, air) dan progres terhadap target.
- Mencatat berat badan dan asupan air, serta menampilkan tren dari waktu
  ke waktu.
- Memberi rekomendasi pola makan berbasis AI (opsional) dari riwayat
  makan 14 hari terakhir.

### Semua Fitur

- Pencatatan makan (breakfast/lunch/dinner/snack) dengan rincian kalori
  dan makro.
- Pemindaian barcode via kamera perangkat (`expo-camera`), mengambil data
  dari API gratis dan tanpa kunci Open Food Facts.
- Input makan manual (tanpa barcode).
- Target harian personal (kalori, protein, karbo, lemak, air).
- Pencatatan air minum dan berat badan, dengan grafik tren.
- Alur onboarding (tinggi badan, berat awal, target berat, tingkat
  aktivitas, tujuan) untuk menghitung target harian personal.
- Insight AI opsional — ringkasan pola makan via knowledge graph
  sederhana, lalu rekomendasi singkat dari model Gemini.
- Notifikasi pengingat opsional (`expo-notifications`).
- Swipe-to-delete, animasi transisi, gradient, dan efek blur.
- 100% offline / local-first — data tersimpan via `AsyncStorage`, tanpa
  akun pengguna dan tanpa server backend.

### Istilah

- **Local-first** — semua data disimpan di perangkat pengguna, bukan di
  server.
- **Macro (makro)** — makronutrien: protein, karbohidrat, lemak.
- **Open Food Facts** — basis data nutrisi produk makanan sumber terbuka
  dan gratis, dipakai untuk auto-fill hasil scan barcode.
- **Knowledge graph** — struktur ringkasan pola makan (dibangun dari
  data makan tersimpan) yang dipakai sebagai konteks untuk rekomendasi AI.
- **Onboarding** — alur pengaturan awal saat pertama kali membuka
  aplikasi.

### Cara Menggunakan

Membutuhkan [Node.js](https://nodejs.org/) dan Expo CLI (otomatis
terpasang lewat `npx`).

```bash
npm install
npx expo start
```

Lalu jalankan di:

- **iOS Simulator**: tekan `i` (khusus macOS, perlu Xcode)
- **Android Emulator**: tekan `a` (perlu Android Studio)
- **Perangkat fisik**: scan QR code dengan aplikasi Expo Go
- **Web**: tekan `w`

Untuk mengaktifkan fitur insight AI (opsional), buat file `.env` berisi:

```
EXPO_PUBLIC_GEMINI_API_KEY=<isi dengan API key Gemini Anda>
EXPO_PUBLIC_GEMINI_MODEL=<opsional, default gemini-3.6-flash>
```

Fitur ini opsional — seluruh fitur lain berjalan tanpa konfigurasi
tambahan apa pun.
