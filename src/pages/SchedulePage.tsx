import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { todayKey, Lesson } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Clock, MapPin } from "lucide-react";

const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
const SUBJECT_EMOJIS = [
  // Skolämnen
  "📚","🔢","🧪","🌍","🎨","🎵","🏃","💻","🔤","📖","✍️","🌱","🌌","🍳","🛠️",
  // Aktiviteter & sport
  "⚽","🏀","🏐","🎾","🏓","🏸","🥊","🥋","🤸","🏊","🚴","🛹","⛸️","🎿","🏂","🏇","🏑","🏒","🥅","🏉","🥏",
  // Musik & dans
  "🎸","🎹","🥁","🎺","🎻","🎤","💃","🩰",
  // Övrigt
  "🎭","🎬","🧩","♟️","🐴","🐶","🌳","🧘","🛼","🧗"
];

const QUICK_TAGS: { emoji: string; label: string }[] = [
  { emoji: "😊", label: "Bra lektion" },
  { emoji: "😞", label: "Dålig lektion" },
  { emoji: "👥", label: "Grupparbete" },
  { emoji: "🧑", label: "Eget arbete" },
  { emoji: "🔊", label: "Högljutt" },
  { emoji: "🤫", label: "Lugnt" },
  { emoji: "🙋", label: "Fick hjälp" },
  { emoji: "🤷", label: "Fick ingen hjälp" },
  { emoji: "🟢", label: "För lätt" },
  { emoji: "🟡", label: "Lagom svårt" },
  { emoji: "🔴", label: "För svårt" },
];

export default function SchedulePage() {
  const { state, addLesson, removeLesson, setLessonRating, setLessonNote } = useApp();
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
        <h1 className="text-2xl font-display font-semibold">Mina aktiviteter 📅</h1>
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

      {/* Aktiviteter */}
      <div className="space-y-2">
        {lessons.length === 0 && (
          <Card className="p-6 text-center border-dashed border-2 bg-transparent">
            <p className="text-muted-foreground">Inga aktiviteter inlagda för {DAYS[activeDay].toLowerCase()}.</p>
          </Card>
        )}

        {lessons.map(l => {
          const isToday = activeDay === todaySchoolDay;
          const completion = state.lessonCompletions.find(c => c.date === today && c.lessonId === l.id);
          const rating = completion?.rating;
          const isDone = !!completion;

          const RATING_OPTIONS: { value: "bad" | "ok" | "good"; emoji: string; label: string; bg: string; ring: string }[] = [
            { value: "bad",  emoji: "😟", label: "Dåligt",      bg: "bg-destructive/80 text-destructive-foreground", ring: "ring-destructive" },
            { value: "ok",   emoji: "😐", label: "Mittemellan", bg: "bg-mood-3 text-foreground",                     ring: "ring-mood-3" },
            { value: "good", emoji: "😊", label: "Bra",         bg: "bg-calm text-calm-foreground",                  ring: "ring-calm" },
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
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1.5">Snabbval</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {QUICK_TAGS.map(tag => {
                        const note = completion?.note ?? "";
                        const marker = `#${tag.label}`;
                        const active = note.includes(marker);
                        return (
                          <button
                            key={tag.label}
                            type="button"
                            onClick={() => {
                              const current = completion?.note ?? "";
                              let next: string;
                              if (active) {
                                next = current
                                  .replace(new RegExp(`\\s*${marker}\\b`, "g"), "")
                                  .trim();
                              } else {
                                next = current ? `${current.trim()} ${marker}` : marker;
                              }
                              setLessonNote(l.id, next);
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                              active
                                ? "bg-primary text-primary-foreground shadow-soft"
                                : "bg-muted text-muted-foreground hover:bg-secondary"
                            }`}
                            aria-pressed={active}
                          >
                            {tag.emoji} {tag.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">Kommentar (valfritt)</p>
                    <Textarea
                      value={completion?.note ?? ""}
                      onChange={e => setLessonNote(l.id, e.target.value)}
                      placeholder="Skriv något du vill berätta för en vuxen…"
                      className="rounded-xl bg-background min-h-[60px] text-sm"
                      maxLength={500}
                    />
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
        <Plus className="w-5 h-5 mr-2" /> Lägg till aktivitet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Ny aktivitet på {DAYS[activeDay].toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Aktivitet / ämne</Label>
              <Input
                placeholder="T.ex. Matematik, Fotboll, Pianolektion"
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
              <Label>Sal eller plats (valfritt)</Label>
              <Input
                placeholder="T.ex. 12B eller Idrottshallen"
                value={draft.room}
                onChange={e => setDraft({ ...draft, room: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Ikon</Label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 rounded-xl bg-muted/30 border border-border">
                {SUBJECT_EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => setDraft({ ...draft, emoji: em })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all shrink-0 ${
                      draft.emoji === em ? "bg-primary-soft ring-2 ring-primary" : "bg-card"
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
