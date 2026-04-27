import { useAppState } from "@/lib/useAppState";
import { todayKey } from "@/lib/types";
import { useMemo } from "react";

/**
 * Räknar ut följeslagarens mood (0-4) baserat på:
 * - streak
 * - dagens aktivitet (morgonrutin, mående, lektioner)
 */
export function useCompanionMood() {
  const { state } = useAppState();

  return useMemo(() => {
    const today = todayKey();
    const todayMoods = state.moodEntries.filter(m => m.date.startsWith(today));
    const todayRoutine = state.routineHistory.find(h => h.date === today);
    const routineDoneRatio = state.routine.length > 0
      ? (todayRoutine?.itemIds.length || 0) / state.routine.length
      : 0;

    let score = 1;
    if (state.streak >= 1) score += 0.5;
    if (state.streak >= 3) score += 0.5;
    if (state.streak >= 7) score += 0.5;
    if (todayMoods.length > 0) score += 0.5;
    if (routineDoneRatio >= 0.5) score += 0.5;
    if (routineDoneRatio >= 1) score += 0.5;

    if (state.lastActiveDate !== today) score = Math.min(score, 1);

    return Math.max(0, Math.min(4, Math.round(score)));
  }, [state]);
}
