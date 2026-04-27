import { AppState, todayKey } from "./types";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  check: (s: AppState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    title: "Första steget",
    description: "Du har börjat din resa!",
    hint: "Kom igång med appen",
    icon: "🌱",
    check: (s) => s.points >= 1,
  },
  {
    id: "morning-hero",
    title: "Morgonhjälte",
    description: "Klarat hela morgonrutinen en dag",
    hint: "Bocka av allt på morgonchecklistan",
    icon: "☀️",
    check: (s) => s.routineHistory.some(h => h.itemIds.length >= s.routine.length && s.routine.length > 0),
  },
  {
    id: "morning-week",
    title: "Veckans morgon",
    description: "5 morgnar i rad med full checklista",
    hint: "Klara morgonrutinen 5 dagar i rad",
    icon: "🌅",
    check: (s) => {
      const sorted = [...s.routineHistory].sort((a, b) => a.date.localeCompare(b.date));
      let streak = 0;
      let last: string | null = null;
      for (const h of sorted) {
        if (h.itemIds.length < s.routine.length || s.routine.length === 0) {
          streak = 0; last = h.date; continue;
        }
        if (last) {
          const d = new Date(last); d.setDate(d.getDate() + 1);
          const expected = d.toISOString().slice(0,10);
          streak = h.date === expected ? streak + 1 : 1;
        } else streak = 1;
        last = h.date;
        if (streak >= 5) return true;
      }
      return false;
    },
  },
  {
    id: "mood-5",
    title: "Lyssnar på sig själv",
    description: "5 mående-incheckningar",
    hint: "Checka in ditt mående flera gånger",
    icon: "💛",
    check: (s) => s.moodEntries.length >= 5,
  },
  {
    id: "mood-20",
    title: "Känslospanare",
    description: "20 mående-incheckningar",
    hint: "Fortsätt checka in ditt mående",
    icon: "🔮",
    check: (s) => s.moodEntries.length >= 20,
  },
  {
    id: "streak-3",
    title: "Tre i rad",
    description: "3 dagars streak!",
    hint: "Använd appen flera dagar i rad",
    icon: "✨",
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    title: "Veckokämpe",
    description: "7 dagars streak!",
    hint: "En hel vecka i rad",
    icon: "🔥",
    check: (s) => s.streak >= 7,
  },
  {
    id: "streak-30",
    title: "Månadens stjärna",
    description: "30 dagar i rad – wow!",
    hint: "En hel månad i rad",
    icon: "🌟",
    check: (s) => s.streak >= 30,
  },
  {
    id: "schedule-built",
    title: "Strukturerad",
    description: "Du har lagt in ditt schema",
    hint: "Lägg till lektioner i schemat",
    icon: "📅",
    check: (s) => s.schedule.length >= 3,
  },
  {
    id: "tip-explorer",
    title: "Nyfiken",
    description: "Läst 5 tips",
    hint: "Utforska tipsbiblioteket",
    icon: "🧭",
    check: (s) => s.readTips.length >= 5,
  },
  {
    id: "points-100",
    title: "100-klubben",
    description: "Samlat 100 poäng",
    hint: "Samla poäng genom att använda appen",
    icon: "💯",
    check: (s) => s.points >= 100,
  },
  {
    id: "points-500",
    title: "Stjärnsamlare",
    description: "500 poäng – fantastiskt!",
    hint: "Fortsätt samla poäng",
    icon: "⭐",
    check: (s) => s.points >= 500,
  },
];

export function evaluateAchievements(state: AppState): string[] {
  const newly: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!state.unlockedAchievements.includes(a.id) && a.check(state)) {
      newly.push(a.id);
    }
  }
  return newly;
}
