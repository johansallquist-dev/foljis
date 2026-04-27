import { useEffect, useState, useCallback } from "react";
import { AppState, initialState, todayKey, MoodEntry, MoodLevel, Feeling, RoutineItem, Lesson, CompanionSpeciesId, LessonRating } from "./types";
import { ACHIEVEMENTS, evaluateAchievements } from "./achievements";
import { toast } from "sonner";

const STORAGE_KEY = "solstrale-app-state-v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Kunde inte spara", e);
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);

// Räknar ut ny streak baserat på senaste aktiva datum
function bumpStreak(state: AppState): { streak: number; lastActiveDate: string } {
  const today = todayKey();
  if (state.lastActiveDate === today) return { streak: state.streak, lastActiveDate: today };
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  return { streak: newStreak, lastActiveDate: today };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Vid varje render där dag bytt, justera streak om mer än 1 dag passerat
  useEffect(() => {
    if (!state.lastActiveDate) return;
    const today = todayKey();
    const yesterday = todayKey(new Date(Date.now() - 86400000));
    if (state.lastActiveDate !== today && state.lastActiveDate !== yesterday && state.streak !== 0) {
      setState(s => ({ ...s, streak: 0 }));
    }
  }, [state.lastActiveDate, state.streak]);

  const checkAchievements = useCallback((next: AppState) => {
    const newly = evaluateAchievements(next);
    if (newly.length > 0) {
      const unlocked = [...next.unlockedAchievements, ...newly];
      newly.forEach(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (a) {
          toast.success(`🏆 Achievement upplåst!`, {
            description: `${a.icon} ${a.title}`,
          });
        }
      });
      return { ...next, unlockedAchievements: unlocked };
    }
    return next;
  }, []);

  const addPoints = useCallback((amount: number, reason?: string) => {
    setState(s => {
      const { streak, lastActiveDate } = bumpStreak(s);
      const next: AppState = { ...s, points: s.points + amount, streak, lastActiveDate };
      if (reason) {
        toast(`+${amount} poäng`, { description: reason });
      }
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const toggleRoutineItem = useCallback((itemId: string) => {
    setState(s => {
      const today = todayKey();
      const existing = s.routineHistory.find(h => h.date === today);
      const wasDone = existing?.itemIds.includes(itemId) ?? false;
      let history;
      if (existing) {
        const updated = wasDone
          ? existing.itemIds.filter(i => i !== itemId)
          : [...existing.itemIds, itemId];
        history = s.routineHistory.map(h => h.date === today ? { ...h, itemIds: updated } : h);
      } else {
        history = [...s.routineHistory, { date: today, itemIds: [itemId] }];
      }
      const { streak, lastActiveDate } = bumpStreak(s);
      const pointDelta = wasDone ? -5 : 5;
      const next: AppState = {
        ...s,
        routineHistory: history,
        points: Math.max(0, s.points + pointDelta),
        streak,
        lastActiveDate,
      };

      // Bonuspoäng om alla rutinpunkter klara idag
      const todayDone = history.find(h => h.date === today)?.itemIds || [];
      if (!wasDone && todayDone.length === s.routine.length && s.routine.length > 0) {
        next.points += 15;
        toast.success("🎉 Hela morgonrutinen klar!", { description: "+15 bonuspoäng" });
      }
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const addRoutineItem = useCallback((label: string, emoji: string) => {
    setState(s => ({ ...s, routine: [...s.routine, { id: uid(), label, emoji }] }));
  }, []);

  const removeRoutineItem = useCallback((id: string) => {
    setState(s => ({ ...s, routine: s.routine.filter(r => r.id !== id) }));
  }, []);

  const reorderRoutine = useCallback((items: RoutineItem[]) => {
    setState(s => ({ ...s, routine: items }));
  }, []);

  const toggleEveningItem = useCallback((itemId: string) => {
    setState(s => {
      const today = todayKey();
      const existing = s.eveningHistory.find(h => h.date === today);
      const wasDone = existing?.itemIds.includes(itemId) ?? false;
      let history;
      if (existing) {
        const updated = wasDone
          ? existing.itemIds.filter(i => i !== itemId)
          : [...existing.itemIds, itemId];
        history = s.eveningHistory.map(h => h.date === today ? { ...h, itemIds: updated } : h);
      } else {
        history = [...s.eveningHistory, { date: today, itemIds: [itemId] }];
      }
      const { streak, lastActiveDate } = bumpStreak(s);
      const pointDelta = wasDone ? -5 : 5;
      const next: AppState = {
        ...s,
        eveningHistory: history,
        points: Math.max(0, s.points + pointDelta),
        streak,
        lastActiveDate,
      };
      const todayDone = history.find(h => h.date === today)?.itemIds || [];
      if (!wasDone && todayDone.length === s.eveningRoutine.length && s.eveningRoutine.length > 0) {
        next.points += 15;
        toast.success("🌙 Hela kvällsrutinen klar!", { description: "+15 bonuspoäng" });
      }
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const addEveningItem = useCallback((label: string, emoji: string) => {
    setState(s => ({ ...s, eveningRoutine: [...s.eveningRoutine, { id: uid(), label, emoji }] }));
  }, []);

  const removeEveningItem = useCallback((id: string) => {
    setState(s => ({ ...s, eveningRoutine: s.eveningRoutine.filter(r => r.id !== id) }));
  }, []);

  const addMoodEntry = useCallback((mood: MoodLevel, feeling?: Feeling, note?: string) => {
    setState(s => {
      const entry: MoodEntry = {
        id: uid(),
        date: new Date().toISOString(),
        mood,
        feeling,
        note,
      };
      const { streak, lastActiveDate } = bumpStreak(s);
      const next: AppState = {
        ...s,
        moodEntries: [entry, ...s.moodEntries],
        points: s.points + 10,
        streak,
        lastActiveDate,
      };
      toast("+10 poäng", { description: "Tack för att du checkade in 💛" });
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const addLesson = useCallback((lesson: Omit<Lesson, "id">) => {
    setState(s => ({ ...s, schedule: [...s.schedule, { ...lesson, id: uid() }] }));
  }, []);

  const updateLesson = useCallback((id: string, patch: Partial<Lesson>) => {
    setState(s => ({ ...s, schedule: s.schedule.map(l => l.id === id ? { ...l, ...patch } : l) }));
  }, []);

  const removeLesson = useCallback((id: string) => {
    setState(s => ({ ...s, schedule: s.schedule.filter(l => l.id !== id) }));
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setState(s => {
      const today = todayKey();
      const existing = s.lessonCompletions.find(c => c.date === today && c.lessonId === lessonId);
      let completions;
      let pointDelta;
      if (existing) {
        completions = s.lessonCompletions.filter(c => !(c.date === today && c.lessonId === lessonId));
        pointDelta = -3;
      } else {
        completions = [...s.lessonCompletions, { date: today, lessonId }];
        pointDelta = 3;
      }
      const { streak, lastActiveDate } = bumpStreak(s);
      const next: AppState = {
        ...s,
        lessonCompletions: completions,
        points: Math.max(0, s.points + pointDelta),
        streak,
        lastActiveDate,
      };
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const setLessonRating = useCallback((lessonId: string, rating: LessonRating) => {
    setState(s => {
      const today = todayKey();
      const existing = s.lessonCompletions.find(c => c.date === today && c.lessonId === lessonId);
      let completions;
      let pointDelta = 0;
      if (existing) {
        if (existing.rating === rating) {
          completions = s.lessonCompletions.filter(c => !(c.date === today && c.lessonId === lessonId));
          pointDelta = -3;
        } else {
          completions = s.lessonCompletions.map(c =>
            c.date === today && c.lessonId === lessonId ? { ...c, rating } : c
          );
        }
      } else {
        completions = [...s.lessonCompletions, { date: today, lessonId, rating }];
        pointDelta = 3;
      }
      const { streak, lastActiveDate } = bumpStreak(s);
      const next: AppState = {
        ...s,
        lessonCompletions: completions,
        points: Math.max(0, s.points + pointDelta),
        streak,
        lastActiveDate,
      };
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const markTipRead = useCallback((tipId: string) => {
    setState(s => {
      if (s.readTips.includes(tipId)) return s;
      const { streak, lastActiveDate } = bumpStreak(s);
      const next: AppState = {
        ...s,
        readTips: [...s.readTips, tipId],
        points: s.points + 2,
        streak,
        lastActiveDate,
      };
      return checkAchievements(next);
    });
  }, [checkAchievements]);

  const setCompanionName = useCallback((name: string) => {
    setState(s => ({ ...s, companionName: name }));
  }, []);

  const setCompanionSpecies = useCallback((species: CompanionSpeciesId) => {
    setState(s => ({ ...s, companionSpecies: species }));
  }, []);

  const finishOnboarding = useCallback(() => {
    setState(s => ({ ...s, onboardingDone: true }));
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
    toast("Allt är rensat", { description: "Vi börjar om från början 🌱" });
  }, []);

  return {
    state,
    addPoints,
    toggleRoutineItem,
    addRoutineItem,
    removeRoutineItem,
    reorderRoutine,
    toggleEveningItem,
    addEveningItem,
    removeEveningItem,
    addMoodEntry,
    addLesson,
    updateLesson,
    removeLesson,
    toggleLessonComplete,
    setLessonRating,
    markTipRead,
    setCompanionName,
    setCompanionSpecies,
    finishOnboarding,
    resetAll,
  };
}
