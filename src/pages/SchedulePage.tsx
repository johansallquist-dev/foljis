import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { todayKey, Lesson } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Check, Clock, MapPin } from "lucide-react";

const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
const SUBJECT_EMOJIS = ["📚","🔢","🧪","🌍","🎨","🎵","🏃","💻","🔤","📖","✍️","🌱","🌌","🍳","🛠️"];

export default function SchedulePage() {
  const { state, addLesson, removeLesson, setLessonRating } = useApp();
  const today = todayKey();
  const jsDay = new Date().getDay();
  const todaySchoolDay = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : 0;

  const [activeDay, setActiveDay] = useState(todaySchoolDay);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<Lesson, "id">>({
    day: todaySchoolDay,
    subject: "",
    startTime: "08:30",
    endTime: "09:30",
    room: "",
    emoji: "📚",
    color: "primary",
  });

  const lessons = [...state.schedule]
    .filter(l => l.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAdd = () => {
    if (!draft.subject.trim()) return;
    addLesson({ ...draft, day: activeDay });
    setDraft({ ...draft, subject: "", room: "" });
    setOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Schema</p>
        <h1 className="text-2xl font-display font-semibold">Mitt schema 📅</h1>
      </header>

      {/* Veckodagsväljare */}
      <div className="grid grid-cols-5 gap-1.5">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setActiveDay(i)}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeDay === i
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span className="block text-xs opacity-80">{i === todaySchoolDay ? "Idag" : ""}</span>
            <span>{d.slice(0, 3)}</span>
          </button>
        ))}
      </div>

      {/* Lektioner */}
      <div className="space-y-2">
        {lessons.length === 0 && (
          <Card className="p-6 text-center border-dashed border-2 bg-transparent">
            <p className="text-muted-foreground">Inga lektioner inlagda för {DAYS[activeDay].toLowerCase()}.</p>
          </Card>
        )}

        {lessons.map(l => {
          const isToday = activeDay === todaySchoolDay;
          const completion = state.lessonCompletions.find(c => c.date === today && c.lessonId === l.id);
          const rating = completion?.rating;
          const isDone = !!completion;

          const RATING_OPTIONS: { value: "bad" | "ok" | "good"; emoji: string; label: string; bg: string; ring: string }[] = [
            { value: "bad",  emoji: "😟", label: "Dåligt",     bg: "bg-mood-1",  ring: "ring-mood-1" },
            { value: "ok",   emoji: "😐", label: "Mittemellan", bg: "bg-mood-3", ring: "ring-mood-3" },
            { value: "good", emoji: "😊", label: "Bra",        bg: "bg-mood-5", ring: "ring-mood-5" },
          ];

          return (
            <Card
              key={l.id}
              className={`p-4 border-0 shadow-card-soft transition-colors ${
                isDone ? "bg-calm-soft" : "bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{l.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isDone ? "line-through text-muted-foreground" : ""}`}>
                    {l.subject}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{l.startTime}–{l.endTime}</span>
                    {l.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.room}</span>}
                  </div>
                </div>
                <button
                  onClick={() => removeLesson(l.id)}
                  className="p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Ta bort"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isToday && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <p className="text-xs text-muted-foreground mb-2">Hur det kändes?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {RATING_OPTIONS.map(opt => {
                      const selected = rating === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setLessonRating(l.id, opt.value)}
                          className={`py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                            selected
                              ? `${opt.bg} ring-2 ${opt.ring} shadow-soft`
                              : "bg-muted hover:bg-secondary"
                          }`}
                          aria-label={opt.label}
                          aria-pressed={selected}
                        >
                          <span className="text-xl">{opt.emoji}</span>
                          <span className="text-[11px] font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full h-14 rounded-2xl border-dashed border-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-5 h-5 mr-2" /> Lägg till lektion
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Ny lektion på {DAYS[activeDay].toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Ämne</Label>
              <Input
                placeholder="T.ex. Matematik"
                value={draft.subject}
                onChange={e => setDraft({ ...draft, subject: e.target.value })}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start</Label>
                <Input type="time" value={draft.startTime} onChange={e => setDraft({ ...draft, startTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slut</Label>
                <Input type="time" value={draft.endTime} onChange={e => setDraft({ ...draft, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Sal (valfritt)</Label>
              <Input
                placeholder="T.ex. 12B"
                value={draft.room}
                onChange={e => setDraft({ ...draft, room: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ikon</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => setDraft({ ...draft, emoji: em })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      draft.emoji === em ? "bg-primary-soft ring-2 ring-primary" : "bg-muted"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
            <Button onClick={handleAdd}>Spara</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
