import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, ListChecks, Moon, CalendarDays, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Companion } from "@/components/Companion";
import { useApp } from "@/lib/AppStateContext";
import { useCompanionMood } from "@/lib/useCompanionMood";

const navItems = [
  { to: "/", label: "Hem", icon: Home, end: true },
  { to: "/morgon", label: "Morgon", icon: ListChecks },
  { to: "/kvall", label: "Kväll", icon: Moon },
  { to: "/schema", label: "Schema", icon: CalendarDays },
  { to: "/maende", label: "Mående", icon: Heart },
];

export function AppLayout() {
  const loc = useLocation();
  const { state } = useApp();
  const mood = useCompanionMood();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-5 pt-5 pb-2 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 -my-1 flex items-center justify-center">
            <Companion mood={mood} size={44} species={state.companionSpecies} />
          </div>
          <span className="font-display font-semibold text-lg">{state.companionName}</span>
        </NavLink>
        <NavLink
          to="/min-sida"
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Min sida"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </NavLink>
      </header>

      <main className="flex-1 pb-24 animate-fade-in" key={loc.pathname}>
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur border-t border-border">
        <div className="max-w-2xl mx-auto px-2 py-2 grid grid-cols-5 gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors text-[11px] font-medium",
                  isActive ? "text-primary bg-primary-soft" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
