import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { Companion } from "@/components/Companion";
import { useCompanionMood } from "@/lib/useCompanionMood";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Trash2, Pencil } from "lucide-react";

export default function MyPage() {
  const { state, setCompanionName, resetAll } = useApp();
  const mood = useCompanionMood();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.companionName);

  const unlocked = ACHIEVEMENTS.filter(a => state.unlockedAchievements.includes(a.id));
  const locked = ACHIEVEMENTS.filter(a => !state.unlockedAchievements.includes(a.id));

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Min sida</p>
        <h1 className="text-2xl font-display font-semibold">Du och din följeslagare</h1>
      </header>

      {/* Följeslagare */}
      <Card className="border-0 gradient-hero p-6 text-center shadow-card-soft">
        <Companion mood={mood} size={160} name={state.companionName} />
        {editing ? (
          <div className="flex gap-2 mt-3 max-w-xs mx-auto">
            <Input value={nameDraft} onChange={e => setNameDraft(e.target.value)} maxLength={20} />
            <Button onClick={() => { setCompanionName(nameDraft.trim() || "Solis"); setEditing(false); }}>Spara</Button>
          </div>
        ) : (
          <button
            onClick={() => { setNameDraft(state.companionName); setEditing(true); }}
            className="flex items-center gap-2 mx-auto mt-2 font-display text-xl"
          >
            {state.companionName} <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-card/60 rounded-xl p-2">
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="font-display text-xl font-bold">🔥 {state.streak}</p>
          </div>
          <div className="bg-card/60 rounded-xl p-2">
            <p className="text-xs text-muted-foreground">Poäng</p>
            <p className="font-display text-xl font-bold">✨ {state.points}</p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <section className="space-y-3">
        <h2 className="font-display font-semibold text-lg">Achievements ({unlocked.length}/{ACHIEVEMENTS.length})</h2>

        {unlocked.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map(a => (
              <Card key={a.id} className="p-4 border-0 shadow-card-soft bg-accent-soft">
                <div className="text-3xl mb-1">{a.icon}</div>
                <p className="font-semibold text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </Card>
            ))}
          </div>
        )}

        {locked.length > 0 && (
          <>
            <p className="text-xs uppercase tracking-wide text-muted-foreground pt-3">Att låsa upp</p>
            <div className="grid grid-cols-2 gap-3">
              {locked.map(a => (
                <Card key={a.id} className="p-4 border-0 shadow-card-soft opacity-60">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xl grayscale">{a.icon}</span>
                  </div>
                  <p className="font-semibold text-sm">???</p>
                  <p className="text-xs text-muted-foreground">{a.hint}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Integritet & rensa */}
      <section className="pt-4 space-y-3">
        <Card className="p-4 border-0 shadow-card-soft bg-primary-soft">
          <p className="font-semibold text-sm">🔒 Helt privat</p>
          <p className="text-xs text-muted-foreground mt-1">
            Allt du gör i appen sparas bara på din enhet. Ingen annan kan se dina achievements,
            ditt mående eller ditt schema.
          </p>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-2xl text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Rensa all data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Rensa allt och börja om?</AlertDialogTitle>
              <AlertDialogDescription>
                Detta tar bort ditt schema, dina rutiner, mående-incheckningar, poäng,
                streak och achievements. Det går inte att ångra.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction onClick={resetAll} className="bg-destructive hover:bg-destructive/90">
                Ja, rensa allt
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
