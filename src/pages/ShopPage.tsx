import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { SHOP_ITEMS, SHOP_CATEGORIES, ShopCategory, ShopItem, findShopItem } from "@/lib/shop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Companion } from "@/components/Companion";
import { Check, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const { state, buyShopItem, equipAccessory, equipBackground } = useApp();
  const [tab, setTab] = useState<ShopCategory>("accessory");

  const items = SHOP_ITEMS.filter(i => i.category === tab);

  const equippedAccessory = findShopItem(state.equippedAccessoryId ?? "");
  const equippedBackground = findShopItem(state.equippedBackgroundId ?? "");

  const handleAction = (item: ShopItem) => {
    const owned = state.ownedShopItems.includes(item.id);
    if (!owned) {
      buyShopItem(item.id);
      return;
    }
    if (item.category === "accessory") {
      const isEq = state.equippedAccessoryId === item.id;
      equipAccessory(isEq ? null : item.id);
      toast(isEq ? `${item.emoji} tagen av` : `${item.emoji} på!`);
    } else if (item.category === "background") {
      const isEq = state.equippedBackgroundId === item.id;
      equipBackground(isEq ? null : item.id);
      toast(isEq ? `Bakgrund borttagen` : `${item.emoji} ny scen!`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-2 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Affären</p>
        <h1 className="text-2xl font-display font-semibold">Pynta din följis ✨</h1>
        <p className="text-sm text-muted-foreground">
          Använd dina Följispoäng till tillbehör och bakgrunder. Allt du köper är ditt för alltid.
        </p>
      </header>

      {/* Förhandsvisning */}
      <Card className="border-0 gradient-hero p-5 shadow-card-soft">
        <div className="flex items-center justify-center">
          <Companion
            mood={4}
            size={170}
            species={state.companionSpecies}
            accessoryId={state.equippedAccessoryId}
            backgroundId={state.equippedBackgroundId}
            pettable={false}
          />
        </div>
        <div className="flex items-center justify-between mt-4 bg-card/60 rounded-2xl p-3">
          <div>
            <p className="text-xs text-muted-foreground">Dina Följispoäng</p>
            <p className="font-display text-2xl font-bold">✨ {state.points}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Bär just nu</p>
            <p className="text-sm font-semibold">
              {equippedAccessory ? `${equippedAccessory.emoji} ${equippedAccessory.name}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {equippedBackground ? `${equippedBackground.emoji} ${equippedBackground.name}` : "Ingen bakgrund"}
            </p>
          </div>
        </div>
      </Card>

      {/* Flikar */}
      <div className="grid grid-cols-2 gap-2">
        {SHOP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setTab(cat.id)}
            className={`rounded-2xl p-3 text-center transition-all ${
              tab === cat.id ? "bg-primary text-primary-foreground shadow-card-soft" : "bg-card text-foreground"
            }`}
          >
            <div className="text-2xl">{cat.emoji}</div>
            <p className="text-xs font-semibold mt-1">{cat.label}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground -mt-2 px-1">
        {SHOP_CATEGORIES.find(c => c.id === tab)?.description}
      </p>

      {/* Items-rutnät */}
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => {
          const owned = state.ownedShopItems.includes(item.id);
          const equipped =
            (item.category === "accessory" && state.equippedAccessoryId === item.id) ||
            (item.category === "background" && state.equippedBackgroundId === item.id);
          const canAfford = state.points >= item.price;

          return (
            <Card key={item.id} className={`p-4 border-0 shadow-card-soft flex flex-col ${equipped ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-start gap-2">
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.description}</p>
                </div>
                {owned && (
                  <span className="shrink-0 w-6 h-6 rounded-full bg-calm flex items-center justify-center" title="Ägs">
                    <Check className="w-3.5 h-3.5 text-calm-foreground" />
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                {owned ? (
                  <span className="text-xs font-semibold text-muted-foreground">Ägs</span>
                ) : (
                  <span className={`text-sm font-bold ${canAfford ? "text-foreground" : "text-muted-foreground"}`}>
                    ✨ {item.price}
                  </span>
                )}
                <Button
                  size="sm"
                  variant={owned && !equipped ? "outline" : "default"}
                  disabled={!owned && !canAfford}
                  onClick={() => handleAction(item)}
                  className="rounded-full"
                >
                  {!owned && (
                    <>
                      {canAfford ? <Sparkles className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {canAfford ? "Köp" : "Sparar"}
                    </>
                  )}
                  {owned && item.category === "accessory" && (equipped ? "Ta av" : "Ta på")}
                  {owned && item.category === "background" && (equipped ? "Ta bort" : "Använd")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-center text-muted-foreground py-4">
        Tjäna fler Följispoäng genom morgon- och kvällsrutiner, mående-incheckningar och aktiviteter 🌱
      </p>
    </div>
  );
}
