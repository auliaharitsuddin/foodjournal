import { AppState, GraphEdge, GraphNode, KnowledgeGraph, MealType } from './types';

const WEEKDAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Sarapan',
  lunch: 'Makan Siang',
  dinner: 'Makan Malam',
  snack: 'Camilan',
};

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

// Builds a small relationship graph from the user's own logged data — no network,
// no external model, just co-occurrence/correlation counting over local entries.
export function buildKnowledgeGraph(state: AppState): KnowledgeGraph {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();

  const addNode = (id: string, label: string, type: GraphNode['type']) => {
    const existing = nodes.get(id);
    if (existing) existing.weight += 1;
    else nodes.set(id, { id, label, type, weight: 1 });
  };

  const addEdge = (source: string, target: string, type: string, label: string) => {
    const key = `${source}|${target}|${type}`;
    const existing = edges.get(key);
    if (existing) existing.weight += 1;
    else edges.set(key, { source, target, type, weight: 1, label });
  };

  // food <-> mealType frequency
  for (const meal of state.meals) {
    const foodId = `food:${meal.name}`;
    const mealTypeId = `mealType:${meal.mealType}`;
    addNode(foodId, meal.name, 'food');
    addNode(mealTypeId, MEAL_LABELS[meal.mealType], 'mealType');
    addEdge(foodId, mealTypeId, 'logged-during', `${meal.name} × ${MEAL_LABELS[meal.mealType]}`);
  }

  // food <-> food same-day co-occurrence
  const mealsByDay = new Map<string, string[]>();
  for (const meal of state.meals) {
    const key = dayKey(meal.loggedAt);
    const list = mealsByDay.get(key) ?? [];
    if (!list.includes(meal.name)) list.push(meal.name);
    mealsByDay.set(key, list);
  }
  for (const foods of mealsByDay.values()) {
    for (let i = 0; i < foods.length; i++) {
      for (let j = i + 1; j < foods.length; j++) {
        const [a, b] = [foods[i], foods[j]].sort();
        addEdge(`food:${a}`, `food:${b}`, 'co-occurs-with', `${a} & ${b}`);
      }
    }
  }

  // weekday <-> over-goal-day
  const goal = state.profile.goalCalories;
  const caloriesByDay = new Map<string, number>();
  for (const meal of state.meals) {
    const key = dayKey(meal.loggedAt);
    caloriesByDay.set(key, (caloriesByDay.get(key) ?? 0) + meal.calories);
  }
  for (const [day, totalCal] of caloriesByDay) {
    if (goal > 0 && totalCal > goal) {
      const weekday = new Date(day).getDay();
      const weekdayId = `weekday:${weekday}`;
      addNode(weekdayId, WEEKDAY_LABELS[weekday], 'weekday');
      addEdge(weekdayId, 'metric:over-goal', 'correlates-with', `${WEEKDAY_LABELS[weekday]} sering melebihi target kalori`);
      addNode('metric:over-goal', 'Melebihi target kalori', 'metric');
    }
  }

  // food <-> next-day weight trend (heuristic: foods logged >=3x, compare avg
  // next-day weight delta on days they appear vs days they don't)
  const sortedWeights = [...state.weights].sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
  if (sortedWeights.length >= 3) {
    const weightByDay = new Map<string, number>();
    for (const w of sortedWeights) weightByDay.set(dayKey(w.loggedAt), w.kg);

    const foodCounts = new Map<string, number>();
    for (const meal of state.meals) foodCounts.set(meal.name, (foodCounts.get(meal.name) ?? 0) + 1);

    for (const [food, count] of foodCounts) {
      if (count < 3) continue;
      const daysWithFood = new Set(state.meals.filter((m) => m.name === food).map((m) => dayKey(m.loggedAt)));
      const deltasWith: number[] = [];
      const deltasWithout: number[] = [];

      for (let i = 0; i < sortedWeights.length - 1; i++) {
        const day = dayKey(sortedWeights[i].loggedAt);
        const nextDay = dayKey(sortedWeights[i + 1].loggedAt);
        const nextWeight = weightByDay.get(nextDay);
        if (nextWeight === undefined) continue;
        const delta = nextWeight - sortedWeights[i].kg;
        if (daysWithFood.has(day)) deltasWith.push(delta);
        else deltasWithout.push(delta);
      }

      if (deltasWith.length >= 2 && deltasWithout.length >= 2) {
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        const withAvg = avg(deltasWith);
        const withoutAvg = avg(deltasWithout);
        if (withAvg - withoutAvg > 0.15) {
          addNode('metric:weight-up', 'Berat badan naik', 'metric');
          addEdge(`food:${food}`, 'metric:weight-up', 'may-correlate-with', `Berat badan cenderung naik setelah makan ${food}`);
        }
      }
    }
  }

  return { nodes: Array.from(nodes.values()), edges: Array.from(edges.values()) };
}

// Turns the graph into short Indonesian sentences, ranked by edge weight —
// used both as Gemini prompt context and as the insight-card copy in the UI.
export function describeGraph(graph: KnowledgeGraph, limit = 8): { label: string; weight: number; type: string }[] {
  return [...graph.edges]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((e) => ({ label: e.weight > 1 ? `${e.label} (${e.weight}x)` : e.label, weight: e.weight, type: e.type }));
}
