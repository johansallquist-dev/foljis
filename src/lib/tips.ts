import { Feeling } from "./types";

export interface Tip {
  id: string;
  category: "morgon" | "skola" | "andning" | "social" | "fokus" | "kvall" | "sömn" | "kropp";
  title: string;
  body: string;
  emoji: string;
}

export const TIPS: Tip[] = [
  { id: "t1", category: "morgon", emoji: "🌤️", title: "Lägg fram kläder kvällen innan",
    body: "Lägg fram dina kläder kvällen innan. Då blir morgonen mycket lugnare och du slipper leta." },
  { id: "t2", category: "morgon", emoji: "🥣", title: "Något litet i magen räcker",
    body: "Om du inte är hungrig på morgonen – ta något litet, som en banan eller smörgås. Hjärnan jobbar bättre med energi." },
  { id: "t3", category: "morgon", emoji: "⏰", title: "5 minuters extra-marginal",
    body: "Försök att ställa väckaren 5 minuter tidigare. Lite extra tid gör hela skillnaden." },
  { id: "t4", category: "morgon", emoji: "🎒", title: "Packa väskan kvällen innan",
    body: "Kolla schemat och packa allt kvällen innan. På morgonen behöver du bara ta väskan och gå." },

  { id: "t5", category: "skola", emoji: "💭", title: "Det är okej att inte må toppen",
    body: "Alla har dagar som känns tunga. Försök ändå att gå till skolan – ofta blir det lättare när du väl är där." },
  { id: "t6", category: "skola", emoji: "🤝", title: "Prata med någon vuxen",
    body: "Om något känns jobbigt – berätta för en lärare, kurator eller någon hemma. Du behöver inte bära det själv." },
  { id: "t7", category: "skola", emoji: "🪑", title: "Hitta en lugn plats",
    body: "Om det blir för mycket – fråga om du får gå ut en stund eller sitta på biblioteket. Det är okej att behöva paus." },
  { id: "t8", category: "skola", emoji: "📝", title: "Ett steg i taget",
    body: "Tänk inte på hela dagen. Tänk bara: 'nu går jag till första lektionen'. Sen 'nu går jag till rasten'." },

  { id: "t9", category: "andning", emoji: "🫁", title: "Fyrkantsandning",
    body: "Andas in 4 sekunder, håll 4, andas ut 4, håll 4. Gör det fyra gånger. Det lugnar kroppen snabbt." },
  { id: "t10", category: "andning", emoji: "🌬️", title: "Långa utandningar",
    body: "Andas in genom näsan i 4 sek och ut genom munnen i 6 sek. Det skickar en lugnande signal till hjärnan." },
  { id: "t11", category: "andning", emoji: "🖐️", title: "Handandning",
    body: "Spreta ut fingrarna. Dra långsamt ett finger längs varje finger – andas in upp, andas ut ner." },

  { id: "t12", category: "social", emoji: "👋", title: "Säg bara 'hej'",
    body: "Du behöver inte ha en lång konversation. Ett 'hej' eller leende räcker som start." },
  { id: "t13", category: "social", emoji: "🫂", title: "Du är inte ensam",
    body: "Många känner sig nervösa i sociala situationer – även de som verkar trygga. Det är helt normalt." },
  { id: "t14", category: "social", emoji: "❓", title: "Ställ en fråga",
    body: "Att fråga någon något (även enkelt) är ett bra sätt att börja prata. De flesta gillar att hjälpa till." },

  { id: "t15", category: "fokus", emoji: "🎯", title: "10 minuter i taget",
    body: "Sätt en timer på 10 minuter och jobba bara då. Sen paus. Det är mycket lättare att börja när det är kort." },
  { id: "t16", category: "fokus", emoji: "📵", title: "Lägg undan mobilen",
    body: "Lägg mobilen i ett annat rum medan du pluggar. Hjärnan blir lugnare när den inte väntar på notiser." },
  { id: "t17", category: "fokus", emoji: "💧", title: "Vatten och rörelse",
    body: "Drick vatten och rör på dig 2 minuter. Det väcker hjärnan bättre än att stirra på boken." },
  { id: "t18", category: "fokus", emoji: "📋", title: "Skriv en lista",
    body: "Skriv ner allt du ska göra. Bocka av en sak i taget. Det blir tydligare och du känner dig klokare." },

  // Kvällstips
  { id: "t19", category: "kvall", emoji: "🌙", title: "Kvällsrutin gör morgonen lättare",
    body: "Att göra samma saker i samma ordning varje kväll lugnar hjärnan och hjälper dig somna." },
  { id: "t20", category: "kvall", emoji: "👕", title: "Lägg fram allt redan ikväll",
    body: "Kläder, väska, vattenflaska – ställ fram det vid dörren. Då blir morgonen nästan automatisk." },
  { id: "t21", category: "kvall", emoji: "📵", title: "Skärmpaus en timme innan",
    body: "Lägg undan mobilen ungefär en timme innan du ska sova. Hjärnan får då lättare att varva ner." },
  { id: "t22", category: "kvall", emoji: "📔", title: "Skriv av dig",
    body: "Skriv ner tre saker som var bra idag och en sak du ser fram emot. Det gör tankarna lugnare innan sängen." },
  { id: "t23", category: "kvall", emoji: "🛁", title: "Varmt = sömnigt",
    body: "Ett varmt bad eller dusch på kvällen hjälper kroppen att slappna av och bli redo för sömn." },

  // Sömn
  { id: "t24", category: "sömn", emoji: "🛏️", title: "Samma tid varje kväll",
    body: "Försök gå och lägga dig ungefär samma tid varje dag – även på helger. Kroppen älskar rytm." },
  { id: "t25", category: "sömn", emoji: "🌑", title: "Mörkt och svalt",
    body: "Ett mörkt och lite svalt rum hjälper dig sova djupare. Dra för gardinerna och vädra en stund." },
  { id: "t26", category: "sömn", emoji: "🐑", title: "Tankarna snurrar?",
    body: "Räkna långsamt baklänges från 100. Det ger hjärnan något tråkigt att göra så du somnar lättare." },

  // Kropp & rörelse
  { id: "t27", category: "kropp", emoji: "🚶", title: "Gå en kort runda",
    body: "Bara 10 minuters promenad gör skillnad för humöret. Du behöver inte träna hårt." },
  { id: "t28", category: "kropp", emoji: "🤸", title: "Stretcha 2 minuter",
    body: "Sträck armarna mot taket, rulla axlarna, böj dig framåt. Kroppen blir piggare på sekunder." },
  { id: "t29", category: "kropp", emoji: "💃", title: "En låt = ett pass",
    body: "Sätt på din favoritlåt och dansa loss. Tre minuters rörelse höjer humöret rejält." },
  { id: "t30", category: "kropp", emoji: "🥤", title: "Drick vatten ofta",
    body: "Hjärnan jobbar mycket bättre när du är pigg och hydrerad. Ta ett glas vatten nu." },

  // Fler skola/social/andning
  { id: "t31", category: "skola", emoji: "🎧", title: "Hörlurar som lugn",
    body: "Lugn musik eller brus i hörlurarna kan hjälpa när det är rörigt runt omkring." },
  { id: "t32", category: "social", emoji: "💬", title: "Texta först",
    body: "Att skicka ett kort meddelande är ofta lättare än att prata. Det räknas också!" },
  { id: "t33", category: "andning", emoji: "🌊", title: "Vågandning",
    body: "Tänk dig en våg som rullar in när du andas in och ut när du andas ut. Gör det 5 gånger." },
  { id: "t34", category: "morgon", emoji: "🎵", title: "Morgonlåt",
    body: "Spela en låt du gillar direkt när du vaknar. Den ger kroppen energi att komma igång." },
];

export const TIP_CATEGORIES: Record<Tip["category"], { label: string; emoji: string; gradient: string }> = {
  morgon:  { label: "Klara morgonen",         emoji: "🌅", gradient: "gradient-sunrise" },
  kvall:   { label: "Lugn kväll",             emoji: "🌙", gradient: "gradient-sky" },
  sömn:    { label: "Sova bättre",            emoji: "💤", gradient: "gradient-calm" },
  skola:   { label: "När det känns jobbigt",  emoji: "🌧️", gradient: "gradient-sky" },
  andning: { label: "Andningsövningar",       emoji: "🫁", gradient: "gradient-calm" },
  social:  { label: "Sociala situationer",    emoji: "👋", gradient: "gradient-sky" },
  fokus:   { label: "Fokus & läxor",          emoji: "🎯", gradient: "gradient-sunrise" },
  kropp:   { label: "Kropp & rörelse",        emoji: "💪", gradient: "gradient-sunrise" },
};

// Coping-tips per känsla
export const COPING_BY_FEELING: Record<Feeling, string[]> = {
  glad:        ["t12"],
  lugn:        ["t10"],
  stolt:       ["t12"],
  tacksam:     ["t10"],
  trött:       ["t17", "t3", "t2"],
  okoncentrerad: ["t15", "t16", "t18"],
  uttråkad:    ["t15", "t17"],
  orolig:      ["t9", "t10", "t11"],
  nervös:      ["t9", "t13", "t11"],
  stressad:    ["t9", "t10", "t8"],
  ledsen:      ["t6", "t5", "t7"],
  ensam:       ["t13", "t12", "t14"],
  besviken:    ["t5", "t6"],
  arg:         ["t9", "t10", "t11"],
  frustrerad:  ["t9", "t8", "t7"],
};

export const FEELINGS: { value: Feeling; emoji: string; group: string }[] = [
  { value: "glad",        emoji: "😄", group: "Härliga" },
  { value: "lugn",        emoji: "😌", group: "Härliga" },
  { value: "stolt",       emoji: "😎", group: "Härliga" },
  { value: "tacksam",     emoji: "🥰", group: "Härliga" },
  { value: "trött",       emoji: "😴", group: "Lågt energiläge" },
  { value: "okoncentrerad", emoji: "🌀", group: "Lågt energiläge" },
  { value: "uttråkad",    emoji: "😐", group: "Lågt energiläge" },
  { value: "orolig",      emoji: "😟", group: "Oroliga" },
  { value: "nervös",      emoji: "😬", group: "Oroliga" },
  { value: "stressad",    emoji: "😵", group: "Oroliga" },
  { value: "ledsen",      emoji: "😢", group: "Tunga" },
  { value: "ensam",       emoji: "🥺", group: "Tunga" },
  { value: "besviken",    emoji: "😔", group: "Tunga" },
  { value: "arg",         emoji: "😠", group: "Heta" },
  { value: "frustrerad",  emoji: "😤", group: "Heta" },
];
