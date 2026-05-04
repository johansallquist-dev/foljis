import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookieConsent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // ignore (e.g. storage disabled)
    }
  }, []);

  const handleConsent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Information om datalagring"
      className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg"
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        <p className="text-sm text-foreground flex-1">
          Denna app använder localStorage för datalagring. Ingen extern spårning används.
        </p>
        <Button onClick={handleConsent} size="sm">
          Godkänna
        </Button>
      </div>
    </div>
  );
}

export default CookieBanner;
