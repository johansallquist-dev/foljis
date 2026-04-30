// Affärs-katalog: tillbehör/kläder och bakgrunder till följisen.
// Allt köps med Följispoäng och ägs permanent när det är köpt.

export type ShopCategory = "accessory" | "background";

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
  { id: "acc_hat",        category: "accessory", name: "Spetsig hatt",     description: "En klassisk festhatt på toppen", emoji: "🎩", price: 100 },
  { id: "acc_party",      category: "accessory", name: "Festhatt",         description: "Konformad partyhatt", emoji: "🥳", price: 120 },
  { id: "acc_glasses",    category: "accessory", name: "Solglasögon",      description: "Coola solglasögon", emoji: "🕶️", price: 150 },
  { id: "acc_bow",        category: "accessory", name: "Rosett",           description: "Söt rosett på huvudet", emoji: "🎀", price: 130 },
  { id: "acc_scarf",      category: "accessory", name: "Halsduk",          description: "Mysig stickad halsduk", emoji: "🧣", price: 180 },
  { id: "acc_crown",      category: "accessory", name: "Krona",            description: "Gyllene krona för en kunglig följis", emoji: "👑", price: 350 },
  { id: "acc_flower",     category: "accessory", name: "Blomma",           description: "Liten blomma bakom örat", emoji: "🌸", price: 90 },
  { id: "acc_headphones", category: "accessory", name: "Hörlurar",         description: "Stora bekväma hörlurar", emoji: "🎧", price: 220 },
  { id: "acc_cap",        category: "accessory", name: "Keps",             description: "Sportig keps", emoji: "🧢", price: 160 },
  { id: "acc_wizard",     category: "accessory", name: "Trollkarlshatt",   description: "Magisk hatt med stjärnor", emoji: "🧙", price: 400 },
  { id: "acc_glasses_round", category: "accessory", name: "Runda glasögon", description: "Smarta runda glasögon", emoji: "👓", price: 140 },
  { id: "acc_tophat",     category: "accessory", name: "Hög hatt",         description: "Elegant hög cylinderhatt", emoji: "🎩", price: 260 },
  { id: "acc_beret",      category: "accessory", name: "Basker",           description: "Konstnärlig basker", emoji: "🎨", price: 170 },
  { id: "acc_tiara",      category: "accessory", name: "Diadem",           description: "Glittrigt diadem med ädelstenar", emoji: "💎", price: 320 },
  { id: "acc_santa",      category: "accessory", name: "Tomtemössa",       description: "Röd och vit tomtemössa", emoji: "🎅", price: 200 },
  
  { id: "acc_helmet",     category: "accessory", name: "Riddarhjälm",      description: "Skinande riddarhjälm", emoji: "⛑️", price: 240 },
  { id: "acc_pirate",     category: "accessory", name: "Piratlapp",        description: "Svart ögonlapp för pirater", emoji: "🏴‍☠️", price: 190 },
  { id: "acc_glasses_3d", category: "accessory", name: "Trekantiga glasögon",   description: "Glasögon i trekantsform", emoji: "🔺", price: 210 },
  { id: "acc_antlers",    category: "accessory", name: "Renhorn",          description: "Mysiga horn för julstämning", emoji: "🦌", price: 230 },
  { id: "acc_butterfly",  category: "accessory", name: "Fjäril",           description: "Fjäril som landat på huvudet", emoji: "🦋", price: 150 },
  { id: "acc_leaf",       category: "accessory", name: "Höstlöv",          description: "Litet löv på örat", emoji: "🍁", price: 80 },

  // ---------- Bakgrunder ----------
  { id: "bg_meadow",   category: "background", name: "Blomsteräng",   description: "Solig äng med blommor", emoji: "🌼", price: 200 },
  { id: "bg_beach",    category: "background", name: "Strand",        description: "Sand, hav och solnedgång", emoji: "🏖️", price: 250 },
  { id: "bg_space",    category: "background", name: "Rymden",        description: "Stjärnor och planeter", emoji: "🌌", price: 350 },
  { id: "bg_forest",   category: "background", name: "Skog",          description: "Lugn skog med trädtoppar", emoji: "🌲", price: 220 },
  { id: "bg_night",    category: "background", name: "Stjärnhimmel",  description: "Mörk himmel med månsken", emoji: "🌙", price: 280 },
  { id: "bg_rainbow",  category: "background", name: "Regnbåge",      description: "Färgglad regnbåge", emoji: "🌈", price: 320 },
  { id: "bg_mountain", category: "background", name: "Berg",          description: "Snöklädda bergstoppar", emoji: "⛰️", price: 270 },
  { id: "bg_ocean",    category: "background", name: "Hav",           description: "Djupblått hav med vågor", emoji: "🌊", price: 240 },
  { id: "bg_city",     category: "background", name: "Stad",          description: "Stadssilhuett i skymning", emoji: "🏙️", price: 290 },
  { id: "bg_aurora",   category: "background", name: "Norrsken",      description: "Magiskt norrsken på natthimlen", emoji: "✨", price: 380 },
  { id: "bg_sunrise",  category: "background", name: "Soluppgång",    description: "Mjuka morgonfärger", emoji: "🌅", price: 230 },
  { id: "bg_sakura",   category: "background", name: "Körsbärsblom",  description: "Rosa körsbärsblommor", emoji: "🌸", price: 260 },
  { id: "bg_winter",   category: "background", name: "Vinterland",    description: "Snötäckt landskap", emoji: "❄️", price: 250 },
  { id: "bg_garden",   category: "background", name: "Trädgård",      description: "Frodig trädgård med blommor", emoji: "🌺", price: 220 },
  { id: "bg_clouds",   category: "background", name: "Molnhimmel",    description: "Mjuka moln på blå himmel", emoji: "☁️", price: 180 },
  { id: "bg_underwater", category: "background", name: "Under vattnet", description: "Korallrev med fiskar", emoji: "🐠", price: 310 },
];

export const SHOP_CATEGORIES: { id: ShopCategory; label: string; emoji: string; description: string }[] = [
  { id: "accessory",  label: "Tillbehör",   emoji: "🎩", description: "Hattar, glasögon och kläder till din följis" },
  { id: "background", label: "Bakgrunder",  emoji: "🌌", description: "Scener bakom din följis" },
];

export function findShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find(i => i.id === id);
}
