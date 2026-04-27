import { createContext, useContext, ReactNode } from "react";
import { useAppState as useAppStateInternal } from "./useAppState";

type AppStateValue = ReturnType<typeof useAppStateInternal>;

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const value = useAppStateInternal();
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useApp måste användas inom AppStateProvider");
  return ctx;
}
