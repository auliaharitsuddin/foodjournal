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
- **Polished UI** — animated transitions (`moti` / `react-native-reanimated`),
  gradients, blur effects, and swipe-to-delete interactions.
- **100% offline / local-first** — all data is persisted on-device with
  `AsyncStorage`. There is no user account system and no backend; the only
  network call is the optional, keyless Open Food Facts lookup during
  barcode scanning.

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
- No API keys or secrets are required to run this project — the only
  external API used (Open Food Facts) is free and keyless.

## License

MIT — see [LICENSE](./LICENSE).
