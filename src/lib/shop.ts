// Affärs-katalog: tillbehör/kläder, bakgrunder och rörelser till följisen.
// Allt köps med Följispoäng och ägs permanent när det är köpt.

export type ShopCategory = "accessory" | "background" | "motion";

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  emoji: string;
  price: number; // Följispoäng
}

export const SHOP_ITEMS: ShopItem[] = [
  // ---------- Tillbehör / kläder ----------
  { id: "acc_hat",      category: "accessory", name: "Spetsig hatt",   description: "En klassisk festhatt på toppen", emoji: "🎩", price: 100 },
  { id: "acc_party",    category: "accessory", name: "Festhatt",       description: "Konformad partyhatt", emoji: "🥳", price: 120 },
  { id: "acc_glasses",  category: "accessory", name: "Solglasögon",    description: "Coola solglasögon", emoji: "🕶️", price: 150 },
  { id: "acc_bow",      category: "accessory", name: "Rosett",         description: "Söt rosett på huvudet", emoji: "🎀", price: 130 },
  { id: "acc_scarf",    category: "accessory", name: "Halsduk",        description: "Mysig stickad halsduk", emoji: "🧣", price: 180 },
  { id: "acc_crown",    category: "accessory", name: "Krona",          description: "Gyllene krona för en kunglig följis", emoji: "👑", price: 350 },
  { id: "acc_flower",   category: "accessory", name: "Blomma",         description: "Liten blomma bakom örat", emoji: "🌸", price: 90 },
  { id: "acc_headphones", category: "accessory", name: "Hörlurar",     description: "Stora bekväma hörlurar", emoji: "🎧", price: 220 },
  { id: "acc_cap",      category: "accessory", name: "Keps",           description: "Sportig keps", emoji: "🧢", price: 160 },
  { id: "acc_wizard",   category: "accessory", name: "Trollkarlshatt", description: "Magisk hatt med stjärnor", emoji: "🧙", price: 400 },

  // ---------- Bakgrunder ----------
  { id: "bg_meadow",  category: "background", name: "Blomsteräng",  description: "Solig äng med blommor", emoji: "🌼", price: 200 },
  { id: "bg_beach",   category: "background", name: "Strand",        description: "Sand, hav och solnedgång", emoji: "🏖️", price: 250 },
  { id: "bg_space",   category: "background", name: "Rymden",        description: "Stjärnor och planeter", emoji: "🌌", price: 350 },
  { id: "bg_forest",  category: "background", name: "Skog",          description: "Lugn skog med trädtoppar", emoji: "🌲", price: 220 },
  { id: "bg_night",   category: "background", name: "Stjärnhimmel",  description: "Mörk himmel med månsken", emoji: "🌙", price: 280 },
  { id: "bg_rainbow", category: "background", name: "Regnbåge",      description: "Färgglad regnbåge", emoji: "🌈", price: 320 },

  // ---------- Rörelser / animationer ----------
  { id: "mo_dance",   category: "motion", name: "Dansa",   description: "Din följis dansar loss", emoji: "💃", price: 180 },
  { id: "mo_jump",    category: "motion", name: "Hoppa",   description: "Studsa upp och ner", emoji: "🤸", price: 150 },
  { id: "mo_spin",    category: "motion", name: "Snurra",  description: "Snurrar runt ett varv", emoji: "🔄", price: 200 },
  { id: "mo_wave",    category: "motion", name: "Vinka",   description: "Vinkar glatt", emoji: "👋", price: 120 },
  { id: "mo_wiggle",  category: "motion", name: "Vicka",   description: "Vickar i sidled", emoji: "🪩", price: 140 },
  { id: "mo_float",   category: "motion", name: "Sväva",   description: "Svävar mjukt upp och ner", emoji: "☁️", price: 260 },
];

export const SHOP_CATEGORIES: { id: ShopCategory; label: string; emoji: string; description: string }[] = [
  { id: "accessory",  label: "Tillbehör",   emoji: "🎩", description: "Hattar, glasögon och kläder till din följis" },
  { id: "background", label: "Bakgrunder",  emoji: "🌌", description: "Scener bakom din följis" },
  { id: "motion",     label: "Rörelser",    emoji: "💃", description: "Animationer din följis kan göra" },
];

export function findShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find(i => i.id === id);
}
