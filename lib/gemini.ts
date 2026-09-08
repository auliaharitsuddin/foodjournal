import { AppState } from './types';
import { buildKnowledgeGraph, describeGraph } from './knowledgeGraph';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-3.6-flash';

function last14DaysSummary(state: AppState) {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const meals = state.meals.filter((m) => new Date(m.loggedAt).getTime() >= cutoff);
  const totalCal = meals.reduce((a, m) => a + m.calories, 0);
  const days = new Set(meals.map((m) => m.loggedAt.slice(0, 10))).size || 1;
  const topFoods = Object.entries(
    meals.reduce<Record<string, number>>((acc, m) => {
      acc[m.name] = (acc[m.name] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => `${name} (${count}x)`);

  return {
    avgCaloriesPerDay: Math.round(totalCal / days),
    daysLogged: days,
    topFoods,
  };
}

export async function getFoodRecommendation(state: AppState): Promise<string> {
  if (!API_KEY) {
    throw new Error('Gemini API key belum diset. Tambahkan EXPO_PUBLIC_GEMINI_API_KEY di file .env.');
  }

  const graph = buildKnowledgeGraph(state);
  const insights = describeGraph(graph, 10).map((i) => i.label);
  const summary = last14DaysSummary(state);
  const p = state.profile;

  const prompt = `Kamu adalah asisten nutrisi. Berdasarkan data berikut, beri rekomendasi pola makan dan saran kesehatan singkat (maks 200 kata, bahasa Indonesia, gaya ramah dan actionable, gunakan poin-poin):

Profil: tinggi ${p.heightCm}cm, tujuan ${p.goalType}, target kalori ${p.goalCalories}/hari, target protein ${p.goalProteinG}g, karbo ${p.goalCarbsG}g, lemak ${p.goalFatG}g.

Ringkasan 14 hari terakhir: rata-rata ${summary.avgCaloriesPerDay} kalori/hari (${summary.daysLogged} hari tercatat). Makanan paling sering: ${summary.topFoods.join(', ') || 'belum ada data'}.

Pola yang terdeteksi dari data:
${insights.length ? insights.map((i) => `- ${i}`).join('\n') : '- Belum cukup data untuk pola.'}

Berikan rekomendasi konkret berdasarkan data di atas, bukan saran generik.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal menghubungi Gemini (${res.status}). Coba lagi nanti.`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini tidak memberikan respons yang valid.');
  return text.trim();
}
