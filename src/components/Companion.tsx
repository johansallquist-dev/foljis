import { useMemo, useRef, useState, useCallback, useEffect } from "react";

export type CompanionSpecies =
  | "sun"     // Solis – sol
  | "fox"     // Räven Räv
  | "panda"   // Pandan
  | "bunny"   // Kaninen
  | "cat"     // Katten
  | "owl"     // Ugglan
  | "dragon"  // Drakungen
  | "axolotl" // Axolotl
  | "penguin" // Pingvin
  | "giraffe";// Giraff

export interface SpeciesInfo {
  id: CompanionSpecies;
  name: string;
  emoji: string;
  defaultName: string;
  description: string;
}

export const SPECIES: SpeciesInfo[] = [
  { id: "sun",     name: "Solstråle",  emoji: "☀️", defaultName: "Solis",   description: "Glad och varm, lyser upp dagen" },
  { id: "fox",     name: "Räv",        emoji: "🦊", defaultName: "Rufus",   description: "Klipsk och nyfiken" },
  { id: "panda",   name: "Panda",      emoji: "🐼", defaultName: "Bambu",   description: "Lugn och mysig" },
  { id: "bunny",   name: "Kanin",      emoji: "🐰", defaultName: "Hopp",    description: "Pigg och peppig" },
  { id: "cat",     name: "Katt",       emoji: "🐱", defaultName: "Mons",    description: "Mjuk och självsäker" },
  { id: "owl",     name: "Uggla",      emoji: "🦉", defaultName: "Ulf",     description: "Vis och stöttande" },
  { id: "dragon",  name: "Drake",      emoji: "🐲", defaultName: "Funke",   description: "Modig och mysig" },
  { id: "axolotl", name: "Axolotl",    emoji: "🦎", defaultName: "Lotti",   description: "Lite annorlunda, väldigt snäll" },
  { id: "penguin", name: "Pingvin",    emoji: "🐧", defaultName: "Pingo",   description: "Cool och tålmodig" },
  { id: "giraffe", name: "Giraff",     emoji: "🦒", defaultName: "Gina",    description: "Lång och lugn, ser långt fram" },
];

interface Props {
  /** 0-4: trött, ok, glad, strålande, megaglad */
  mood: number;
  size?: number;
  celebrate?: boolean;
  name?: string;
  species?: CompanionSpecies;
  /** Aktivera klapp-interaktion (klicka och dra över). Default: true */
  pettable?: boolean;
  /** Anropas när användaren klappar följisn */
  onPet?: () => void;
}

interface Heart { id: number; x: number; y: number; }

/** Helt SVG-baserade följis. Ansiktsuttryck byts efter humör. */
export function Companion({ mood, size = 180, celebrate, name, species = "sun", pettable = true, onPet }: Props) {
  const [isPetting, setIsPetting] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const pettingRef = useRef(false);
  const lastHeartRef = useRef(0);
  const heartIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cls = useMemo(() => {
    const base = "companion-float";
    if (celebrate) return `${base} celebrate`;
    if (isPetting) return `${base} wiggle`;
    return base;
  }, [celebrate, isPetting]);

  // Boostat humör vid klapp
  const displayMood = isPetting ? Math.max(mood, 4) : mood;
  const expr = getExpression(displayMood);

  const spawnHeart = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left + (Math.random() * 20 - 10);
    const y = clientY - rect.top + (Math.random() * 10 - 5);
    const id = heartIdRef.current++;
    setHearts(h => [...h, { id, x, y }]);
    setTimeout(() => setHearts(h => h.filter(p => p.id !== id)), 900);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!pettingRef.current) return;
    const now = Date.now();
    if (now - lastHeartRef.current > 140) {
      lastHeartRef.current = now;
      spawnHeart(clientX, clientY);
      onPet?.();
    }
  }, [spawnHeart, onPet]);

  const startPet = useCallback((clientX: number, clientY: number) => {
    if (!pettable) return;
    pettingRef.current = true;
    setIsPetting(true);
    spawnHeart(clientX, clientY);
    onPet?.();
  }, [pettable, spawnHeart, onPet]);

  const stopPet = useCallback(() => {
    pettingRef.current = false;
    setIsPetting(false);
  }, []);

  // Globalt mouseup/touchend för att alltid sluta
  useEffect(() => {
    const up = () => stopPet();
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, [stopPet]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className={`relative ${pettable ? "cursor-grab active:cursor-grabbing select-none" : ""}`}
        style={{ width: size, height: size, touchAction: pettable ? "none" : undefined }}
        onMouseDown={pettable ? e => startPet(e.clientX, e.clientY) : undefined}
        onMouseMove={pettable ? e => handleMove(e.clientX, e.clientY) : undefined}
        onMouseEnter={pettable ? e => { if (e.buttons === 1) startPet(e.clientX, e.clientY); } : undefined}
        onMouseLeave={pettable ? stopPet : undefined}
        onTouchStart={pettable ? e => { const t = e.touches[0]; startPet(t.clientX, t.clientY); } : undefined}
        onTouchMove={pettable ? e => { const t = e.touches[0]; handleMove(t.clientX, t.clientY); } : undefined}
      >
        <div className={cls} style={{ width: size, height: size }}>
          <svg viewBox="0 0 200 200" width={size} height={size} aria-label={`${name || "Följis"}`}>
            <defs>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dx="0" dy="3" result="off" />
                <feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer>
                <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {renderSpecies(species, expr, displayMood)}
          </svg>
        </div>
        {hearts.map(h => (
          <span
            key={h.id}
            className="pointer-events-none absolute text-2xl heart-pop"
            style={{ left: h.x, top: h.y, transform: "translate(-50%, -50%)" }}
            aria-hidden
          >
            💖
          </span>
        ))}
      </div>
    </div>
  );
}

type Expression = {
  eyes: "happy" | "open" | "tired";
  mouth: "bigSmile" | "smile" | "neutral" | "sad";
  cheeks: boolean;
  sparkles: boolean;
};

function getExpression(mood: number): Expression {
  return {
    eyes: mood >= 3 ? "happy" : mood >= 1 ? "open" : "tired",
    mouth: mood >= 3 ? "bigSmile" : mood >= 2 ? "smile" : mood >= 1 ? "neutral" : "sad",
    cheeks: mood >= 2,
    sparkles: mood >= 4,
  };
}

function renderSpecies(s: CompanionSpecies, e: Expression, mood: number) {
  switch (s) {
    case "sun":     return <Sun e={e} mood={mood} />;
    case "fox":     return <Fox e={e} mood={mood} />;
    case "panda":   return <Panda e={e} mood={mood} />;
    case "bunny":   return <Bunny e={e} mood={mood} />;
    case "cat":     return <Cat e={e} mood={mood} />;
    case "owl":     return <Owl e={e} mood={mood} />;
    case "dragon":  return <Dragon e={e} mood={mood} />;
    case "axolotl": return <Axolotl e={e} mood={mood} />;
    case "penguin": return <Penguin e={e} mood={mood} />;
    case "giraffe": return <Giraffe e={e} mood={mood} />;
  }
}

/* ---------- Gemensamma ansiktsdrag ---------- */
function Face({ e, cx = 100, cy = 105, eyeDx = 17, eyeDy = -10, mouthDy = 17, color = "hsl(220 50% 22%)" }:
  { e: Expression; cx?: number; cy?: number; eyeDx?: number; eyeDy?: number; mouthDy?: number; color?: string }) {
  const lx = cx - eyeDx, rx = cx + eyeDx, ey = cy + eyeDy, my = cy + mouthDy;
  return (
    <>
      {e.cheeks && (
        <>
          <ellipse cx={cx - 26} cy={cy + 8} rx="7" ry="4" fill="hsl(8 85% 75%)" opacity="0.55" />
          <ellipse cx={cx + 26} cy={cy + 8} rx="7" ry="4" fill="hsl(8 85% 75%)" opacity="0.55" />
        </>
      )}
      {e.eyes === "happy" && (
        <>
          <path d={`M${lx-5} ${ey} Q${lx} ${ey-7} ${lx+5} ${ey}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d={`M${rx-5} ${ey} Q${rx} ${ey-7} ${rx+5} ${ey}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {e.eyes === "open" && (
        <>
          <circle cx={lx} cy={ey} r="3.8" fill={color} />
          <circle cx={rx} cy={ey} r="3.8" fill={color} />
          <circle cx={lx + 1.2} cy={ey - 1.2} r="1.2" fill="white" />
          <circle cx={rx + 1.2} cy={ey - 1.2} r="1.2" fill="white" />
        </>
      )}
      {e.eyes === "tired" && (
        <>
          <path d={`M${lx-5} ${ey} L${lx+5} ${ey}`} stroke="hsl(220 30% 40%)" strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${rx-5} ${ey} L${rx+5} ${ey}`} stroke="hsl(220 30% 40%)" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
      {e.mouth === "bigSmile" && (
        <path d={`M${cx-14} ${my} Q${cx} ${my+18} ${cx+14} ${my}`} stroke={color} strokeWidth="3.5" fill="hsl(8 80% 60%)" strokeLinecap="round" />
      )}
      {e.mouth === "smile" && (
        <path d={`M${cx-10} ${my+1} Q${cx} ${my+9} ${cx+10} ${my+1}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {e.mouth === "neutral" && (
        <path d={`M${cx-9} ${my+3} L${cx+9} ${my+3}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      )}
      {e.mouth === "sad" && (
        <path d={`M${cx-10} ${my+6} Q${cx} ${my-2} ${cx+10} ${my+6}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      {e.sparkles && (
        <g>
          <text x={cx - 60} y={cy - 55} fontSize="20">✨</text>
          <text x={cx + 50} y={cy - 50} fontSize="20">✨</text>
        </g>
      )}
    </>
  );
}

/* ---------- Sol ---------- */
function Sun({ e, mood }: { e: Expression; mood: number }) {
  const stops = mood >= 3 ? ["hsl(42 100% 75%)", "hsl(42 95% 60%)"]
              : mood >= 1 ? ["hsl(42 80% 80%)", "hsl(42 70% 65%)"]
              : ["hsl(40 30% 80%)", "hsl(40 25% 65%)"];
  return (
    <>
      <defs>
        <radialGradient id="sun-body" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={stops[0]} /><stop offset="100%" stopColor={stops[1]} />
        </radialGradient>
      </defs>
      {mood >= 3 && (
        <g opacity="0.85">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <g key={a} transform={`rotate(${a} 100 105)`}>
              <path d="M100 28 L96 16 L104 16 Z" fill={stops[1]} />
            </g>
          ))}
        </g>
      )}
      <circle cx="100" cy="105" r="60" fill="url(#sun-body)" filter="url(#softShadow)" />
      <Face e={e} />
    </>
  );
}

/* ---------- Räv ---------- */
function Fox({ e, mood }: { e: Expression; mood: number }) {
  const orange = mood >= 1 ? "hsl(20 85% 62%)" : "hsl(20 30% 65%)";
  const dark = mood >= 1 ? "hsl(20 70% 45%)" : "hsl(20 20% 50%)";
  return (
    <>
      {/* Öron */}
      <path d="M55 70 L70 35 L85 65 Z" fill={orange} />
      <path d="M145 70 L130 35 L115 65 Z" fill={orange} />
      <path d="M62 62 L70 45 L78 60 Z" fill={dark} opacity="0.4" />
      <path d="M138 62 L130 45 L122 60 Z" fill={dark} opacity="0.4" />
      {/* Kropp/huvud */}
      <ellipse cx="100" cy="110" rx="60" ry="55" fill={orange} filter="url(#softShadow)" />
      {/* Vit nos/kind */}
      <ellipse cx="100" cy="125" rx="32" ry="28" fill="hsl(40 50% 96%)" />
      {/* Liten svart nos */}
      <ellipse cx="100" cy="118" rx="5" ry="3.5" fill={dark} />
      <Face e={e} cy={108} eyeDx={17} eyeDy={-12} mouthDy={20} />
    </>
  );
}

/* ---------- Panda ---------- */
function Panda({ e, mood }: { e: Expression; mood: number }) {
  const dark = mood >= 1 ? "hsl(220 25% 22%)" : "hsl(220 15% 45%)";
  return (
    <>
      {/* Öron */}
      <circle cx="62" cy="58" r="18" fill={dark} />
      <circle cx="138" cy="58" r="18" fill={dark} />
      {/* Kropp */}
      <circle cx="100" cy="108" r="60" fill="hsl(40 30% 96%)" filter="url(#softShadow)" />
      {/* Mörka ögonringar */}
      <ellipse cx="83" cy="98" rx="13" ry="16" fill={dark} transform="rotate(-15 83 98)" />
      <ellipse cx="117" cy="98" rx="13" ry="16" fill={dark} transform="rotate(15 117 98)" />
      {/* Liten nos */}
      <ellipse cx="100" cy="120" rx="4" ry="3" fill={dark} />
      {/* Ögon ovanpå mörka ringar */}
      {e.eyes === "happy" && (
        <>
          <path d="M78 96 Q83 90 88 96" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M112 96 Q117 90 122 96" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {e.eyes === "open" && (
        <>
          <circle cx="83" cy="98" r="3.5" fill="white" />
          <circle cx="117" cy="98" r="3.5" fill="white" />
        </>
      )}
      {e.eyes === "tired" && (
        <>
          <path d="M78 100 L88 100" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M112 100 L122 100" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* Mun + kinder via Face (utan ögon) */}
      <FaceMouthOnly e={e} cy={108} mouthDy={22} />
      {e.cheeks && (
        <>
          <ellipse cx="68" cy="118" rx="7" ry="4" fill="hsl(8 85% 75%)" opacity="0.55" />
          <ellipse cx="132" cy="118" rx="7" ry="4" fill="hsl(8 85% 75%)" opacity="0.55" />
        </>
      )}
      {e.sparkles && (<g><text x="40" y="55" fontSize="20">✨</text><text x="150" y="60" fontSize="20">✨</text></g>)}
    </>
  );
}

function FaceMouthOnly({ e, cy = 105, mouthDy = 18, cx = 100, color = "hsl(220 50% 22%)" }:
  { e: Expression; cy?: number; mouthDy?: number; cx?: number; color?: string }) {
  const my = cy + mouthDy;
  return (
    <>
      {e.mouth === "bigSmile" && <path d={`M${cx-14} ${my} Q${cx} ${my+18} ${cx+14} ${my}`} stroke={color} strokeWidth="3.5" fill="hsl(8 80% 60%)" strokeLinecap="round" />}
      {e.mouth === "smile" && <path d={`M${cx-10} ${my+1} Q${cx} ${my+9} ${cx+10} ${my+1}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {e.mouth === "neutral" && <path d={`M${cx-9} ${my+3} L${cx+9} ${my+3}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" />}
      {e.mouth === "sad" && <path d={`M${cx-10} ${my+6} Q${cx} ${my-2} ${cx+10} ${my+6}`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />}
    </>
  );
}

/* ---------- Kanin ---------- */
function Bunny({ e, mood }: { e: Expression; mood: number }) {
  const fur = mood >= 1 ? "hsl(40 30% 95%)" : "hsl(40 10% 85%)";
  const inner = "hsl(8 70% 88%)";
  return (
    <>
      {/* Långa öron */}
      <ellipse cx="78" cy="48" rx="11" ry="32" fill={fur} />
      <ellipse cx="122" cy="48" rx="11" ry="32" fill={fur} />
      <ellipse cx="78" cy="50" rx="5" ry="22" fill={inner} />
      <ellipse cx="122" cy="50" rx="5" ry="22" fill={inner} />
      {/* Huvud */}
      <ellipse cx="100" cy="115" rx="58" ry="52" fill={fur} filter="url(#softShadow)" />
      {/* Liten rosa nos */}
      <path d="M96 117 Q100 122 104 117 Q100 124 96 117 Z" fill="hsl(8 70% 65%)" />
      <Face e={e} cy={113} eyeDx={18} eyeDy={-10} mouthDy={16} />
    </>
  );
}

/* ---------- Katt ---------- */
function Cat({ e, mood }: { e: Expression; mood: number }) {
  const fur = mood >= 1 ? "hsl(35 50% 65%)" : "hsl(35 15% 65%)";
  const dark = "hsl(35 50% 45%)";
  return (
    <>
      {/* Öron */}
      <path d="M55 78 L62 38 L88 68 Z" fill={fur} />
      <path d="M145 78 L138 38 L112 68 Z" fill={fur} />
      <path d="M62 70 L67 50 L78 65 Z" fill="hsl(8 70% 80%)" />
      <path d="M138 70 L133 50 L122 65 Z" fill="hsl(8 70% 80%)" />
      {/* Huvud */}
      <ellipse cx="100" cy="115" rx="58" ry="50" fill={fur} filter="url(#softShadow)" />
      {/* Nos */}
      <path d="M96 118 L100 122 L104 118 Z" fill={dark} />
      {/* Morrhår */}
      <line x1="60" y1="120" x2="80" y2="118" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="128" x2="80" y2="124" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="140" y1="120" x2="120" y2="118" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="140" y1="128" x2="120" y2="124" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
      <Face e={e} cy={112} eyeDx={17} eyeDy={-10} mouthDy={14} />
    </>
  );
}

/* ---------- Uggla ---------- */
function Owl({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(260 30% 55%)" : "hsl(260 15% 60%)";
  const belly = "hsl(260 40% 88%)";
  return (
    <>
      {/* Tofsar */}
      <path d="M70 55 L78 38 L86 58 Z" fill={body} />
      <path d="M130 55 L122 38 L114 58 Z" fill={body} />
      {/* Kropp */}
      <ellipse cx="100" cy="115" rx="60" ry="58" fill={body} filter="url(#softShadow)" />
      <ellipse cx="100" cy="125" rx="38" ry="38" fill={belly} />
      {/* Stora ögoncirklar */}
      <circle cx="83" cy="98" r="18" fill="hsl(40 50% 96%)" />
      <circle cx="117" cy="98" r="18" fill="hsl(40 50% 96%)" />
      {/* Näbb */}
      <path d="M94 118 L100 128 L106 118 Z" fill="hsl(42 95% 55%)" />
      {/* Ögon i de stora cirklarna */}
      {e.eyes === "happy" && (
        <>
          <path d="M76 100 Q83 92 90 100" stroke="hsl(220 50% 22%)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M110 100 Q117 92 124 100" stroke="hsl(220 50% 22%)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {e.eyes === "open" && (
        <>
          <circle cx="83" cy="98" r="6" fill="hsl(220 50% 22%)" /><circle cx="85" cy="96" r="2" fill="white" />
          <circle cx="117" cy="98" r="6" fill="hsl(220 50% 22%)" /><circle cx="119" cy="96" r="2" fill="white" />
        </>
      )}
      {e.eyes === "tired" && (
        <>
          <path d="M76 100 L90 100" stroke="hsl(220 30% 40%)" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 100 L124 100" stroke="hsl(220 30% 40%)" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <FaceMouthOnly e={e} cy={120} mouthDy={20} />
      {e.cheeks && (<><ellipse cx="65" cy="125" rx="6" ry="3" fill="hsl(8 85% 75%)" opacity="0.55"/><ellipse cx="135" cy="125" rx="6" ry="3" fill="hsl(8 85% 75%)" opacity="0.55"/></>)}
      {e.sparkles && (<g><text x="40" y="55" fontSize="20">✨</text><text x="150" y="60" fontSize="20">✨</text></g>)}
    </>
  );
}

/* ---------- Drake ---------- */
function Dragon({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(152 50% 60%)" : "hsl(152 20% 60%)";
  const dark = "hsl(152 55% 40%)";
  return (
    <>
      {/* Hornen */}
      <path d="M70 60 L65 38 L80 55 Z" fill={dark} />
      <path d="M130 60 L135 38 L120 55 Z" fill={dark} />
      {/* Vingar */}
      <path d="M40 110 Q20 90 30 130 Q45 130 50 115 Z" fill={dark} opacity="0.85" />
      <path d="M160 110 Q180 90 170 130 Q155 130 150 115 Z" fill={dark} opacity="0.85" />
      {/* Kropp */}
      <ellipse cx="100" cy="115" rx="58" ry="55" fill={body} filter="url(#softShadow)" />
      {/* Buktecken */}
      <ellipse cx="100" cy="130" rx="30" ry="22" fill="hsl(42 80% 88%)" />
      {/* Ryggtaggar */}
      <path d="M85 60 L95 50 L105 60 L115 50 L125 60" stroke={dark} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <Face e={e} cy={112} eyeDx={16} eyeDy={-10} mouthDy={14} />
    </>
  );
}

/* ---------- Axolotl ---------- */
function Axolotl({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(330 80% 85%)" : "hsl(330 25% 80%)";
  const gill = mood >= 1 ? "hsl(330 80% 75%)" : "hsl(330 25% 70%)";
  return (
    <>
      {/* Gälar – små "fjädrar" på sidorna */}
      {[0, 1, 2].map(i => (
        <g key={`l${i}`}>
          <ellipse cx={50 - i*4} cy={90 + i*16} rx="10" ry="6" fill={gill} transform={`rotate(${-20 + i*8} ${50} ${90 + i*16})`} />
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={`r${i}`}>
          <ellipse cx={150 + i*4} cy={90 + i*16} rx="10" ry="6" fill={gill} transform={`rotate(${20 - i*8} ${150} ${90 + i*16})`} />
        </g>
      ))}
      {/* Kropp */}
      <ellipse cx="100" cy="115" rx="55" ry="55" fill={body} filter="url(#softShadow)" />
      <Face e={e} cy={112} eyeDx={16} eyeDy={-8} mouthDy={14} />
    </>
  );
}

/* ---------- Pingvin ---------- */
function Penguin({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(220 30% 25%)" : "hsl(220 10% 45%)";
  return (
    <>
      {/* Kropp */}
      <ellipse cx="100" cy="115" rx="58" ry="58" fill={body} filter="url(#softShadow)" />
      {/* Vit mage/ansikte */}
      <ellipse cx="100" cy="120" rx="40" ry="48" fill="hsl(40 50% 96%)" />
      {/* Näbb */}
      <path d="M92 118 L100 128 L108 118 Z" fill="hsl(42 95% 55%)" />
      {/* Vingar */}
      <ellipse cx="48" cy="125" rx="12" ry="28" fill={body} transform="rotate(-15 48 125)" />
      <ellipse cx="152" cy="125" rx="12" ry="28" fill={body} transform="rotate(15 152 125)" />
      <Face e={e} cy={108} eyeDx={14} eyeDy={-8} mouthDy={20} />
    </>
  );
}
