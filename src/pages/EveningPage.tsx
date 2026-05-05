import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/lib/AppStateContext";
import { todayKey } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Companion } from "@/components/Companion";
import { SortableRoutineList } from "@/components/SortableRoutineList";

const SUGGESTIONS = ["👕","🎒","🪥","🚿","📖","📱","🛏️","🌙","💧","🧸","🧦","🪞","🎧","🍵","✨"];

export default function EveningPage() {
  const { state, toggleEveningItem, addEveningItem, removeEveningItem, reorderEveningRoutine } = useApp();
  const today = todayKey();
  const hasMoodToday = state.moodEntries.some(m => m.date.startsWith(today));
  if (!hasMoodToday) return <Navigate to="/maende" replace state={{ from: "kvall" }} />;
  const todayDone = state.eveningHistory.find(h => h.date === today)?.itemIds || [];
  const allDone = state.eveningRoutine.length > 0 && todayDone.length === state.eveningRoutine.length;

  // Plocka fram något positivt från dagen
  const morningDoneToday = state.routineHistory.find(h => h.date === today)?.itemIds.length ?? 0;
  const morningTotal = state.routine.length;
  const morningAllDone = morningTotal > 0 && morningDoneToday >= morningTotal;
  const lessonsToday = state.lessonCompletions.filter(c => c.date === today);
  const goodLessons = lessonsToday.filter(c => c.rating === "good");
  const moodEntriesToday = state.moodEntries.filter(m => m.date.startsWith(today));
  const avgMoodToday = moodEntriesToday.length
    ? moodEntriesToday.reduce((a, b) => a + b.mood, 0) / moodEntriesToday.length
    : 0;

  type Highlight = { emoji: string; title: string; text: string };
  const highlights: Highlight[] = [];
  if (morningAllDone) {
    highlights.push({ emoji: "☀️", title: "Du klarade hela morgonrutinen!", text: "Vilken bra start på dagen – det är något att vara stolt över." });
  } else if (morningDoneToday > 0) {
    highlights.push({ emoji: "🌅", title: `Du gjorde ${morningDoneToday} av ${morningTotal} morgonrutiner`, text: "Varje liten sak räknas – bra jobbat!" });
  }
  if (goodLessons.length > 0) {
    highlights.push({ emoji: "🎉", title: `${goodLessons.length} aktivitet${goodLessons.length === 1 ? "" : "er"} kändes bra idag`, text: "Kul att något gick riktigt fint – kom ihåg den känslan." });
  } else if (lessonsToday.length > 0) {
    highlights.push({ emoji: "💪", title: `Du tog dig igenom ${lessonsToday.length} aktivitet${lessonsToday.length === 1 ? "" : "er"}`, text: "Att göra det man ska, även sega dagar, är värt att fira." });
  }
  if (moodEntriesToday.length > 0) {
    if (avgMoodToday >= 4) {
      highlights.push({ emoji: "💛", title: "Du checkade in ditt mående", text: "Och det verkar ha varit en ganska fin dag – härligt!" });
    } else {
      highlights.push({ emoji: "💛", title: "Du checkade in ditt mående", text: "Det är modigt att lyssna på sig själv – bra att du gjorde det." });
    }
  }
  if (state.streak > 1) {
    highlights.push({ emoji: "🔥", title: `${state.streak} dagar i rad!`, text: "Din streak växer – du dyker upp för dig själv." });
  }
  if (highlights.length === 0) {
    highlights.push({ emoji: "🌱", title: "Du är här – och det räknas", text: "Bara att checka in på kvällen är en bra vana att vara stolt över." });
  }
  const highlight = highlights[Math.floor(Math.random() * highlights.length)];

  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("🌙");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addEveningItem(newLabel.trim(), newEmoji);
    setNewLabel("");
    setNewEmoji("🌙");
    setAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Kvällsrutin</p>
        <h1 className="text-2xl font-display font-semibold">Gör dig redo för imorgon 🌙</h1>
        <p className="text-sm text-muted-foreground">
          Bocka av allt eftersom – varje punkt ger 5 Följispoäng, hela listan ger bonus!
        </p>
      </header>

      {allDone && (
        <Card className="border-0 gradient-hero p-5 text-center pop-in shadow-card-soft">
          <Companion mood={4} size={120} celebrate species={state.companionSpecies} accessoryId={state.equippedAccessoryId} backgroundId={state.equippedBackgroundId} />
          <p className="font-display text-lg mt-2">Bra jobbat – nu kan du sova lugnt 💤</p>
          <p className="text-sm text-muted-foreground">Imorgon blir en bra dag.</p>
        </Card>
      )}

      <div className="space-y-2">
        {state.eveningRoutine.length === 0 && (
          <Card className="p-6 text-center border-dashed border-2 border-border bg-transparent">
            <p className="text-muted-foreground">Du har ingen kvällsrutin än. Lägg till första punkten nedan ↓</p>
          </Card>
        )}

        {state.eveningRoutine.length > 0 && (
          <SortableRoutineList
            items={state.eveningRoutine}
            doneIds={todayDone}
            onToggle={toggleEveningItem}
            onRemove={removeEveningItem}
            onReorder={reorderEveningRoutine}
          />
        )}
      </div>

      {adding ? (
        <Card className="p-4 border-0 shadow-card-soft space-y-3">
          <Input
            placeholder="T.ex. 'Lägg fram kläder'"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Välj en emoji</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => setNewEmoji(em)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    newEmoji === em ? "bg-primary-soft ring-2 ring-primary" : "bg-muted"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="flex-1">Lägg till</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Avbryt</Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl border-dashed border-2"
          onClick={() => setAdding(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Lägg till en punkt
        </Button>
      )}
    </div>
  );
}
