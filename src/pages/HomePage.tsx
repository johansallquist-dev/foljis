import { useApp } from "@/lib/AppStateContext";
import { Companion } from "@/components/Companion";
import { useCompanionMood } from "@/lib/useCompanionMood";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, ListChecks, Heart, CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { todayKey } from "@/lib/types";

const greetings = (hour: number, name: string) => {
  if (hour < 10) return `God morgon${name ? ", " + name : ""}!`;
  if (hour < 14) return `Hej${name ? " " + name : ""}, hur går dagen?`;
  if (hour < 18) return `Hej igen${name ? ", " + name : ""}!`;
  return `God kväll${name ? ", " + name : ""}!`;
};

const dayNames = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];
const monthNames = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];

export default function HomePage() {
  const { state } = useApp();
  const mood = useCompanionMood();
  const navigate = useNavigate();
  const now = new Date();
  const today = todayKey();

  const todayRoutine = state.routineHistory.find(h => h.date === today);
  const routineDone = todayRoutine?.itemIds.length || 0;
  const routineTotal = state.routine.length;

  const todayEvening = state.eveningHistory.find(h => h.date === today);
  const eveningDone = todayEvening?.itemIds.length || 0;
  const eveningTotal = state.eveningRoutine.length;

  const todayMoods = state.moodEntries.filter(m => m.date.startsWith(today));

  // hitta nästa lektion idag (mån=0..fre=4 i datat; JS getDay sön=0..lör=6)
  const jsDay = now.getDay();
  const schoolDay = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : null;
  const todayLessons = schoolDay !== null
    ? [...state.schedule].filter(l => l.day === schoolDay).sort((a,b) => a.startTime.localeCompare(b.startTime))
    : [];
  const nowHM = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const nextLesson = todayLessons.find(l => l.endTime > nowHM);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-6">
      {/* Hälsning */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground capitalize">
          {dayNames[jsDay]} {now.getDate()} {monthNames[now.getMonth()]}
        </p>
        <h1 className="text-2xl font-display font-semibold">
          {greetings(now.getHours(), "")}
        </h1>
      </div>

      {/* Följeslagaren */}
      <div className="gradient-hero rounded-3xl p-6 shadow-card-soft text-center space-y-3">
        <Companion mood={mood} size={180} name={state.companionName} species={state.companionSpecies} />
        <div>
          <p className="font-display text-lg">{state.companionName}</p>
          <p className="text-sm text-muted-foreground">
            {mood >= 4 ? "är supertaggad idag!" : mood >= 3 ? "ser glad ut!" : mood >= 2 ? "trivs med dig" : mood >= 1 ? "väntar på lite kärlek" : "är lite trött..."}
          </p>
        </div>
      </div>

      {/* Streak & Poäng */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 flex items-center gap-3 border-0 shadow-card-soft bg-joy-soft">
          <div className="w-12 h-12 rounded-2xl bg-joy/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-joy" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-joy">{state.streak}</p>
            <p className="text-xs text-muted-foreground">dagar i rad</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3 border-0 shadow-card-soft bg-accent-soft">
          <div className="w-12 h-12 rounded-2xl bg-accent/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-accent-foreground">{state.points}</p>
            <p className="text-xs text-muted-foreground">poäng totalt</p>
          </div>
        </Card>
      </div>

      {/* Nästa lektion */}
      {nextLesson && (
        <Card
          className="p-4 border-0 shadow-card-soft cursor-pointer hover:shadow-soft transition-shadow"
          onClick={() => navigate("/schema")}
        >
          <p className="text-xs text-muted-foreground mb-1">Nästa aktivitet</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{nextLesson.emoji}</span>
              <div>
                <p className="font-semibold">{nextLesson.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {nextLesson.startTime}–{nextLesson.endTime}
                  {nextLesson.room && ` · ${nextLesson.room}`}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      )}

      {/* Snabbåtgärder */}
      <div className="space-y-3">
        <h2 className="font-display font-semibold text-lg px-1">Hur ska vi börja?</h2>

        <ActionCard
          onClick={() => navigate("/morgon")}
          icon={<ListChecks className="w-6 h-6" />}
          title="Morgonrutin"
          subtitle={routineTotal === 0
            ? "Skapa din rutin"
            : `${routineDone} / ${routineTotal} klart idag`}
          progress={routineTotal > 0 ? routineDone / routineTotal : 0}
          accent="primary"
        />

        <ActionCard
          onClick={() => navigate("/kvall")}
          icon={<span className="text-xl">🌙</span>}
          title="Kvällsrutin"
          subtitle={eveningTotal === 0
            ? "Skapa din kvällsrutin"
            : `${eveningDone} / ${eveningTotal} klart ikväll`}
          progress={eveningTotal > 0 ? eveningDone / eveningTotal : 0}
          accent="accent"
        />

        <ActionCard
          onClick={() => navigate("/maende")}
          icon={<Heart className="w-6 h-6" />}
          title="Hur mår du?"
          subtitle={todayMoods.length > 0
            ? `${todayMoods.length} incheckning${todayMoods.length > 1 ? "ar" : ""} idag`
            : "Ta en kort koll på dig själv"}
          accent="joy"
        />

        <ActionCard
          onClick={() => navigate("/schema")}
          icon={<CalendarDays className="w-6 h-6" />}
          title="Mitt schema"
          subtitle={state.schedule.length === 0
            ? "Lägg in dina lektioner"
            : `${todayLessons.length} lektion${todayLessons.length === 1 ? "" : "er"} idag`}
          accent="calm"
        />

        <ActionCard
          onClick={() => navigate("/tips")}
          icon={<Sparkles className="w-6 h-6" />}
          title="Tips & hjälp"
          subtitle="Korta tips som hjälper dig genom dagen"
          accent="accent"
        />
      </div>

      <div className="text-center pt-2">
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => navigate("/min-sida")}
        >
          Dina achievements →
        </Button>
      </div>
    </div>
  );
}

function ActionCard({
  onClick, icon, title, subtitle, progress, accent
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  progress?: number;
  accent: "primary" | "joy" | "calm" | "accent";
}) {
  const bgMap = {
    primary: "bg-primary-soft text-primary",
    joy: "bg-joy-soft text-joy",
    calm: "bg-calm-soft text-calm",
    accent: "bg-accent-soft text-accent-foreground",
  };
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl p-4 shadow-card-soft hover:shadow-soft transition-all active:scale-[0.99] flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgMap[accent]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        {progress !== undefined && progress > 0 && (
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        )}
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </button>
  );
}
