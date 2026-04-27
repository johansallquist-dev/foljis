import { useState, useMemo } from "react";
import { useApp } from "@/lib/AppStateContext";
import { Feeling, MoodLevel } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FEELINGS, COPING_BY_FEELING, TIPS } from "@/lib/tips";
import { Companion } from "@/components/Companion";
import { ArrowLeft, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const MOOD_OPTIONS: { value: MoodLevel; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: "😢", label: "Inte alls bra", color: "mood-1" },
  { value: 2, emoji: "😕", label: "Sådär",        color: "mood-2" },
  { value: 3, emoji: "🙂", label: "Okej",         color: "mood-3" },
  { value: 4, emoji: "😊", label: "Bra",          color: "mood-4" },
  { value: 5, emoji: "🤩", label: "Toppen",       color: "mood-5" },
];

type Step = "mood" | "feeling" | "tips" | "history";

export default function MoodPage() {
  const { state, addMoodEntry } = useApp();
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSelectMood = (m: MoodLevel) => {
    setMood(m);
    setStep("feeling");
  };

  const handleSelectFeeling = (f: Feeling) => {
    setFeeling(f);
    if (mood !== null) {
      addMoodEntry(mood, f, note || undefined);
      setSaved(true);
      setStep("tips");
    }
  };

  const handleSkipFeeling = () => {
    if (mood !== null) {
      addMoodEntry(mood, undefined, note || undefined);
      setSaved(true);
      setStep("tips");
    }
  };

  const reset = () => {
    setMood(null); setFeeling(null); setNote(""); setSaved(false); setStep("mood");
  };

  const copingTips = feeling ? (COPING_BY_FEELING[feeling] || []).map(id => TIPS.find(t => t.id === id)).filter(Boolean) : [];

  // historik-data för diagram (senaste 7 dagar, snitt per dag)
  const chartData = useMemo(() => {
    const days: { date: string; label: string; value: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayEntries = state.moodEntries.filter(m => m.date.startsWith(key));
      const avg = dayEntries.length > 0
        ? dayEntries.reduce((s, e) => s + e.mood, 0) / dayEntries.length
        : null;
      days.push({
        date: key,
        label: ["sön","mån","tis","ons","tor","fre","lör"][d.getDay()],
        value: avg,
      });
    }
    return days;
  }, [state.moodEntries]);

  const groupedFeelings = FEELINGS.reduce((acc, f) => {
    (acc[f.group] ||= []).push(f);
    return acc;
  }, {} as Record<string, typeof FEELINGS>);

  if (step === "history") {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
        <button onClick={() => setStep("mood")} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </button>
        <h1 className="text-2xl font-display font-semibold">Din vecka</h1>
        <Card className="p-4 border-0 shadow-card-soft">
          <div className="h-48">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  formatter={(v: number | null) => v ? [v.toFixed(1), "Mående"] : ["—", "Ingen data"]}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <h2 className="font-display font-semibold pt-2">Senaste incheckningarna</h2>
        <div className="space-y-2">
          {state.moodEntries.slice(0, 10).map(e => {
            const opt = MOOD_OPTIONS.find(o => o.value === e.mood)!;
            const f = FEELINGS.find(f => f.value === e.feeling);
            const d = new Date(e.date);
            return (
              <Card key={e.id} className="p-3 border-0 shadow-card-soft flex items-center gap-3">
                <span className="text-3xl">{opt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {opt.label} {f && <span className="text-muted-foreground">· {f.value} {f.emoji}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.toLocaleDateString("sv-SE")} kl {d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {e.note && <p className="text-sm mt-1 italic text-muted-foreground">"{e.note}"</p>}
                </div>
              </Card>
            );
          })}
          {state.moodEntries.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Inga incheckningar ännu.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1 flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Mående</p>
          <h1 className="text-2xl font-display font-semibold">
            {step === "mood" && "Hur mår du? 💛"}
            {step === "feeling" && "Vilken känsla passar bäst?"}
            {step === "tips" && "Bra att du checkade in!"}
          </h1>
        </div>
        {step === "mood" && (
          <Button variant="ghost" size="sm" onClick={() => setStep("history")}>
            Historik
          </Button>
        )}
      </header>

      {step === "mood" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Det finns inget rätt eller fel. Välj det som känns mest sant just nu.</p>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelectMood(opt.value)}
                className="aspect-square rounded-2xl bg-card shadow-card-soft hover:shadow-soft active:scale-95 transition-all flex items-center justify-center text-4xl"
                aria-label={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Inte alls bra</span>
            <span>Toppen</span>
          </div>
        </div>
      )}

      {step === "feeling" && (
        <div className="space-y-5">
          <button onClick={() => setStep("mood")} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </button>
          {Object.entries(groupedFeelings).map(([group, list]) => (
            <div key={group} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">{group}</p>
              <div className="grid grid-cols-3 gap-2">
                {list.map(f => (
                  <button
                    key={f.value}
                    onClick={() => handleSelectFeeling(f.value)}
                    className="bg-card rounded-2xl py-3 px-2 shadow-card-soft hover:shadow-soft active:scale-95 transition-all flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span className="text-xs font-medium capitalize">{f.value}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">Vill du skriva något? (frivilligt)</p>
            <Textarea
              placeholder="Vad händer just nu?"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="rounded-2xl"
              rows={3}
            />
            <Button variant="ghost" className="w-full" onClick={handleSkipFeeling}>
              Hoppa över känsla
            </Button>
          </div>
        </div>
      )}

      {step === "tips" && (
        <div className="space-y-5">
          <Card className="border-0 gradient-calm p-5 text-center pop-in shadow-card-soft">
            <Companion mood={4} size={120} />
            <p className="font-display text-lg mt-2">Tack för att du lyssnade på dig själv 💛</p>
            {feeling && (
              <p className="text-sm text-muted-foreground">Här är några saker som kan hjälpa när du känner dig {feeling}:</p>
            )}
          </Card>

          {copingTips.length > 0 && (
            <div className="space-y-2">
              {copingTips.map(tip => tip && (
                <Card key={tip.id} className="p-4 border-0 shadow-card-soft flex gap-3">
                  <span className="text-3xl shrink-0">{tip.emoji}</span>
                  <div>
                    <p className="font-semibold">{tip.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{tip.body}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={reset} variant="outline" className="rounded-2xl">Checka in igen</Button>
            <Button onClick={() => setStep("history")} className="rounded-2xl">
              <Check className="w-4 h-4 mr-1" /> Klar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
