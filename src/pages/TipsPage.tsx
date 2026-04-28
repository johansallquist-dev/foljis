import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { TIPS, TIP_CATEGORIES, Tip } from "@/lib/tips";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

export default function TipsPage() {
  const { state, markTipRead } = useApp();
  const [selected, setSelected] = useState<Tip | null>(null);
  const [activeCat, setActiveCat] = useState<Tip["category"] | "all">("all");

  const filtered = activeCat === "all" ? TIPS : TIPS.filter(t => t.category === activeCat);

  if (selected) {
    const isRead = state.readTips.includes(selected.id);
    return (
      <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </button>
        <Card className={`p-6 border-0 shadow-card-soft ${TIP_CATEGORIES[selected.category].gradient}`}>
          <div className="text-6xl mb-3">{selected.emoji}</div>
          <h1 className="font-display text-2xl font-semibold mb-2">{selected.title}</h1>
          <p className="text-base leading-relaxed">{selected.body}</p>
        </Card>
        <Button
          className="w-full"
          disabled={isRead}
          onClick={() => { markTipRead(selected.id); }}
        >
          {isRead ? <><Check className="w-4 h-4 mr-1" /> Läst</> : "Markera som läst (+2 Följispoäng)"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Tips & hjälp</p>
        <h1 className="text-2xl font-display font-semibold">Korta tips för dagen ✨</h1>
      </header>

      {/* Kategorier */}
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
        <CatChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>Alla</CatChip>
        {(Object.keys(TIP_CATEGORIES) as Tip["category"][]).map(cat => (
          <CatChip key={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)}>
            {TIP_CATEGORIES[cat].emoji} {TIP_CATEGORIES[cat].label}
          </CatChip>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(tip => {
          const isRead = state.readTips.includes(tip.id);
          return (
            <button
              key={tip.id}
              onClick={() => setSelected(tip)}
              className="text-left bg-card rounded-2xl p-4 shadow-card-soft hover:shadow-soft active:scale-[0.99] transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">{tip.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tip.body}</p>
                </div>
                {isRead && <Check className="w-4 h-4 text-calm shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
