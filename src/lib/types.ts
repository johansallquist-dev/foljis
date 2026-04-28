// Typer för hela appen
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type Feeling =
  | "glad" | "lugn" | "stolt" | "tacksam"
  | "trött" | "okoncentrerad" | "uttråkad"
  | "orolig" | "nervös" | "stressad"
  | "ledsen" | "ensam" | "besviken"
  | "arg" | "frustrerad";

export interface MoodEntry {
  id: string;
  date: string; // ISO date
  mood: MoodLevel;
  feeling?: Feeling;
  note?: string;
}

export interface RoutineItem {
  id: string;
  label: string;
  emoji: string;
}

export interface RoutineCompletion {
  date: string; // YYYY-MM-DD
  itemIds: string[];
}

export interface Lesson {
  id: string;
  day: number; // 0 = måndag … 4 = fredag (skolveckodagar)
  subject: string;
  startTime: string; // "08:30"
  endTime: string;   // "09:30"
  room?: string;
  emoji: string;
  color: string; // semantic key
}

export type LessonRating = "bad" | "ok" | "good";

export interface LessonCompletion {
  date: string;
  lessonId: string;
  rating?: LessonRating;
}

export type CompanionSpeciesId =
  | "sun" | "fox" | "panda" | "bunny" | "cat" | "owl" | "dragon" | "axolotl" | "penguin";

export interface AppState {
  points: number;
  streak: number;
  lastActiveDate: string | null;
  routine: RoutineItem[];
  routineHistory: RoutineCompletion[];
  eveningRoutine: RoutineItem[];
  eveningHistory: RoutineCompletion[];
  schedule: Lesson[];
  lessonCompletions: LessonCompletion[];
  moodEntries: MoodEntry[];
  unlockedAchievements: string[];
  readTips: string[];
  companionName: string;
  companionSpecies: CompanionSpeciesId;
  onboardingDone: boolean;
  pettingCount: number;
}

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const defaultRoutine: RoutineItem[] = [
  { id: "r1", label: "Vakna och stiga upp", emoji: "☀️" },
  { id: "r2", label: "Ätit frukost", emoji: "🥣" },
  { id: "r3", label: "Borstat tänderna", emoji: "🪥" },
  { id: "r4", label: "Tagit på kläder", emoji: "👕" },
  { id: "r5", label: "Packat skolväskan", emoji: "🎒" },
  { id: "r6", label: "På väg till skolan", emoji: "🚶" },
];

export const defaultEveningRoutine: RoutineItem[] = [
  { id: "e1", label: "Lägg fram kläder till imorgon", emoji: "👕" },
  { id: "e2", label: "Packa skolväskan", emoji: "🎒" },
  { id: "e3", label: "Borsta tänderna", emoji: "🪥" },
  { id: "e4", label: "Duscha", emoji: "🚿" },
  { id: "e5", label: "Läs en stund", emoji: "📖" },
  { id: "e6", label: "Lägg undan mobilen", emoji: "📱" },
  { id: "e7", label: "Gå och lägg dig", emoji: "🛏️" },
];

export const initialState: AppState = {
  points: 0,
  streak: 0,
  lastActiveDate: null,
  routine: defaultRoutine,
  routineHistory: [],
  eveningRoutine: defaultEveningRoutine,
  eveningHistory: [],
  schedule: [],
  lessonCompletions: [],
  moodEntries: [],
  unlockedAchievements: [],
  readTips: [],
  companionName: "Solis",
  companionSpecies: "sun",
  onboardingDone: false,
  pettingCount: 0,
};
