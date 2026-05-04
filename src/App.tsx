import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider, useApp } from "@/lib/AppStateContext";
import { AppLayout } from "@/components/AppLayout";
import { Onboarding } from "@/components/Onboarding";
import { CookieBanner } from "@/components/CookieBanner";
import HomePage from "./pages/HomePage";
import MorningPage from "./pages/MorningPage";
import EveningPage from "./pages/EveningPage";
import SchedulePage from "./pages/SchedulePage";
import MoodPage from "./pages/MoodPage";
import TipsPage from "./pages/TipsPage";
import ShopPage from "./pages/ShopPage";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { state } = useApp();
  if (!state.onboardingDone) return <Onboarding />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/morgon" element={<MorningPage />} />
          <Route path="/kvall" element={<EveningPage />} />
          <Route path="/schema" element={<SchedulePage />} />
          <Route path="/maende" element={<MoodPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/affar" element={<ShopPage />} />
          <Route path="/min-sida" element={<MyPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AppStateProvider>
        <AppContent />
        <CookieBanner />
      </AppStateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
