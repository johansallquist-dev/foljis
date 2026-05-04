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

const SUGGESTIONS = ["🍎","🥪","🪥","👕","🎒","📚","🚲","🚌","💧","🧸","📱","🧥","🧦","🪞","🎧"];

export default function MorningPage() {
  const { state, toggleRoutineItem, addRoutineItem, removeRoutineItem, reorderRoutine } = useApp();
  const today = todayKey();
  const hasMoodToday = state.moodEntries.some(m => m.date.startsWith(today));
  if (!hasMoodToday) return <Navigate to="/maende" replace state={{ from: "morgon" }} />;
  const todayDone = state.routineHistory.find(h => h.date === today)?.itemIds || [];
  const allDone = state.routine.length > 0 && todayDone.length === state.routine.length;

  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("✨");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    addRoutineItem(newLabel.trim(), newEmoji);
    setNewLabel("");
    setNewEmoji("✨");
    setAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Morgonrutin</p>
        <h1 className="text-2xl font-display font-semibold">Dags att göra dig redo 🌅</h1>
        <p className="text-sm text-muted-foreground">
          Bocka av allt eftersom – varje punkt ger 5 Följispoäng, hela listan ger bonus!
        </p>
      </header>

      {allDone && (
        <Card className="border-0 gradient-sunrise p-5 text-center pop-in shadow-card-soft">
          <Companion mood={4} size={120} celebrate species={state.companionSpecies} accessoryId={state.equippedAccessoryId} backgroundId={state.equippedBackgroundId} />
          <p className="font-display text-lg mt-2">Du är redo för dagen! 🎉</p>
          <p className="text-sm text-muted-foreground">Bra jobbat, du klarade allt.</p>
        </Card>
      )}

      <div className="space-y-2">
        {state.routine.length === 0 && (
          <Card className="p-6 text-center border-dashed border-2 border-border bg-transparent">
            <p className="text-muted-foreground">Du har ingen rutin än. Lägg till första punkten nedan ↓</p>
          </Card>
        )}

        {state.routine.length > 0 && (
          <SortableRoutineList
            items={state.routine}
            doneIds={todayDone}
            onToggle={toggleRoutineItem}
            onRemove={removeRoutineItem}
            onReorder={reorderRoutine}
          />
        )}
      </div>

      {adding ? (
        <Card className="p-4 border-0 shadow-card-soft space-y-3">
          <Input
            placeholder="T.ex. 'Ta vitaminer'"
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
