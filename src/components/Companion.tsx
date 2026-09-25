import { useMemo, useRef, useState, useCallback, useEffect } from "react";

export type CompanionSpecies =
  | "sun"     // Solis – sol
  | "fox"     // Räven Räv
  | "panda"   // Pandan
  | "bunny"   // Kaninen
  | "cat"     // Katten
  | "horse"   // Häst
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
  { id: "horse",   name: "Häst",       emoji: "🐴", defaultName: "Hilda",   description: "Stark och snäll" },
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
  /** Anropas när användaren klappar följisen */
  onPet?: () => void;
  /** Köpt och utrustad accessoar från affären */
  accessoryId?: string | null;
  /** Köpt och utrustad bakgrund från affären */
  backgroundId?: string | null;
  /** Aktiv rörelse-animation (en av "dance", "jump", "spin", "wave", "wiggle", "float") */
  motion?: string | null;
}

interface Heart { id: number; x: number; y: number; }

/** Helt SVG-baserade följis. Ansiktsuttryck byts efter humör. */
export function Companion({ mood, size = 180, celebrate, name, species = "sun", pettable = true, onPet, accessoryId, backgroundId, motion }: Props) {
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
    if (motion) return `${base} motion-${motion}`;
    return base;
  }, [celebrate, isPetting, motion]);

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
        className={`relative rounded-3xl overflow-hidden ${pettable ? "cursor-grab active:cursor-grabbing select-none" : ""}`}
        style={{
          width: size,
          height: size,
          touchAction: pettable ? "none" : undefined,
          background: getBackgroundStyle(backgroundId),
        }}
        onMouseDown={pettable ? e => startPet(e.clientX, e.clientY) : undefined}
        onMouseMove={pettable ? e => handleMove(e.clientX, e.clientY) : undefined}
        onMouseEnter={pettable ? e => { if (e.buttons === 1) startPet(e.clientX, e.clientY); } : undefined}
        onMouseLeave={pettable ? stopPet : undefined}
        onTouchStart={pettable ? e => { const t = e.touches[0]; startPet(t.clientX, t.clientY); } : undefined}
        onTouchMove={pettable ? e => { const t = e.touches[0]; handleMove(t.clientX, t.clientY); } : undefined}
      >
        {backgroundId && <BackgroundDecor id={backgroundId} />}
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
            {accessoryId && renderAccessory(accessoryId)}
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
    case "horse":   return <Horse e={e} mood={mood} />;
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

/* ---------- Häst ---------- */
function Horse({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(30 45% 55%)" : "hsl(30 15% 60%)";
  const mane = mood >= 1 ? "hsl(30 60% 30%)" : "hsl(30 15% 35%)";
  const light = "hsl(40 45% 85%)";
  return (
    <>
      {/* Mähne */}
      <path d="M70 75 Q78 40 100 35 Q122 40 130 75" fill={mane} />
      <path d="M78 55 Q82 35 95 32" stroke={mane} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M95 52 Q100 28 110 32" stroke={mane} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M110 58 Q118 35 125 45" stroke={mane} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Öron */}
      <path d="M68 72 L62 48 L80 65 Z" fill={body} />
      <path d="M132 72 L138 48 L120 65 Z" fill={body} />
      {/* Huvud */}
      <ellipse cx="100" cy="112" rx="58" ry="54" fill={body} filter="url(#softShadow)" />
      {/* Nosparti */}
      <ellipse cx="100" cy="132" rx="22" ry="16" fill={light} />
      {/* Näsborrar */}
      <ellipse cx="94" cy="130" rx="2" ry="2.5" fill="hsl(30 40% 25%)" />
      <ellipse cx="106" cy="130" rx="2" ry="2.5" fill="hsl(30 40% 25%)" />
      <Face e={e} cy={108} eyeDx={16} eyeDy={-8} mouthDy={22} color="hsl(30 40% 20%)" />
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

/* ---------- Giraff ---------- */
function Giraffe({ e, mood }: { e: Expression; mood: number }) {
  const body = mood >= 1 ? "hsl(42 75% 70%)" : "hsl(42 25% 70%)";
  const spot = mood >= 1 ? "hsl(28 60% 40%)" : "hsl(28 15% 50%)";
  const dark = "hsl(28 50% 30%)";
  return (
    <>
      {/* Horn (ossicones) */}
      <line x1="88" y1="48" x2="86" y2="32" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <line x1="112" y1="48" x2="114" y2="32" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <circle cx="86" cy="30" r="4" fill={spot} />
      <circle cx="114" cy="30" r="4" fill={spot} />
      {/* Öron */}
      <ellipse cx="68" cy="62" rx="10" ry="6" fill={body} transform="rotate(-25 68 62)" />
      <ellipse cx="132" cy="62" rx="10" ry="6" fill={body} transform="rotate(25 132 62)" />
      {/* Lång hals (bakom huvudet, leds neråt) */}
      <rect x="92" y="115" width="16" height="60" rx="6" fill={body} />
      {/* Man längs halsen */}
      <path d="M92 120 Q90 140 92 170" stroke={spot} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Huvud */}
      <ellipse cx="100" cy="105" rx="42" ry="48" fill={body} filter="url(#softShadow)" />
      {/* Fläckar */}
      <ellipse cx="78" cy="88" rx="6" ry="5" fill={spot} opacity="0.85" />
      <ellipse cx="124" cy="92" rx="5" ry="4" fill={spot} opacity="0.85" />
      <ellipse cx="82" cy="128" rx="5" ry="4" fill={spot} opacity="0.85" />
      <ellipse cx="120" cy="130" rx="6" ry="5" fill={spot} opacity="0.85" />
      <ellipse cx="98" cy="148" rx="5" ry="4" fill={spot} opacity="0.85" />
      {/* Nosparti */}
      <ellipse cx="100" cy="128" rx="20" ry="14" fill="hsl(42 60% 85%)" />
      {/* Näsborrar */}
      <ellipse cx="94" cy="126" rx="1.5" ry="2" fill={dark} />
      <ellipse cx="106" cy="126" rx="1.5" ry="2" fill={dark} />
      <Face e={e} cy={100} eyeDx={14} eyeDy={-8} mouthDy={28} />
    </>
  );
}

/* ---------- Tillbehör (köpta i affären) ---------- */
function renderAccessory(id: string) {
  switch (id) {
    case "acc_hat":
      return (
        <g>
          <path d="M70 50 L100 12 L130 50 Z" fill="hsl(220 50% 22%)" />
          <rect x="62" y="48" width="76" height="8" rx="3" fill="hsl(220 50% 22%)" />
          <rect x="62" y="48" width="76" height="3" fill="hsl(8 70% 55%)" />
        </g>
      );
    case "acc_party":
      return (
        <g>
          <path d="M82 55 L100 8 L118 55 Z" fill="hsl(330 80% 65%)" />
          <circle cx="100" cy="10" r="5" fill="hsl(42 95% 60%)" />
          <circle cx="92" cy="30" r="2.5" fill="hsl(42 95% 60%)" />
          <circle cx="108" cy="40" r="2.5" fill="hsl(180 70% 60%)" />
        </g>
      );
    case "acc_glasses":
      return (
        <g>
          <circle cx="83" cy="95" r="14" fill="none" stroke="hsl(220 50% 15%)" strokeWidth="3" />
          <circle cx="117" cy="95" r="14" fill="none" stroke="hsl(220 50% 15%)" strokeWidth="3" />
          <circle cx="83" cy="95" r="13" fill="hsl(220 60% 25%)" opacity="0.7" />
          <circle cx="117" cy="95" r="13" fill="hsl(220 60% 25%)" opacity="0.7" />
          <line x1="97" y1="95" x2="103" y2="95" stroke="hsl(220 50% 15%)" strokeWidth="3" />
        </g>
      );
    case "acc_bow":
      return (
        <g transform="translate(70 35)">
          <path d="M0 8 L14 0 L14 16 Z" fill="hsl(330 80% 65%)" />
          <path d="M28 8 L14 0 L14 16 Z" fill="hsl(330 80% 65%)" />
          <circle cx="14" cy="8" r="4" fill="hsl(330 70% 50%)" />
        </g>
      );
    case "acc_scarf":
      return (
        <g>
          <path d="M55 150 Q100 165 145 150 L145 165 Q100 180 55 165 Z" fill="hsl(0 70% 55%)" />
          <path d="M55 165 L40 195 L55 195 L62 168 Z" fill="hsl(0 70% 50%)" />
        </g>
      );
    case "acc_crown":
      return (
        <g>
          <path d="M65 55 L75 25 L85 50 L100 18 L115 50 L125 25 L135 55 L60 55 Z" fill="hsl(42 95% 55%)" stroke="hsl(35 80% 35%)" strokeWidth="1.5" />
          <circle cx="100" cy="35" r="4" fill="hsl(0 80% 55%)" />
          <circle cx="78" cy="42" r="3" fill="hsl(220 80% 60%)" />
          <circle cx="122" cy="42" r="3" fill="hsl(140 70% 50%)" />
        </g>
      );
    case "acc_flower":
      return (
        <g transform="translate(60 70)">
          {[0, 72, 144, 216, 288].map(a => (
            <ellipse key={a} cx="0" cy="-7" rx="5" ry="7" fill="hsl(330 85% 75%)" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="3.5" fill="hsl(42 95% 55%)" />
        </g>
      );
    case "acc_headphones":
      return (
        <g>
          <path d="M55 90 Q55 35 100 35 Q145 35 145 90" stroke="hsl(220 30% 25%)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="46" y="85" width="18" height="28" rx="6" fill="hsl(220 30% 25%)" />
          <rect x="136" y="85" width="18" height="28" rx="6" fill="hsl(220 30% 25%)" />
          <rect x="50" y="90" width="10" height="18" rx="3" fill="hsl(8 70% 55%)" />
          <rect x="140" y="90" width="10" height="18" rx="3" fill="hsl(8 70% 55%)" />
        </g>
      );
    case "acc_cap":
      return (
        <g>
          <path d="M65 60 Q100 25 135 60 L135 70 L65 70 Z" fill="hsl(220 60% 45%)" />
          <path d="M55 70 Q100 75 135 70 L135 78 Q100 84 55 78 Z" fill="hsl(220 60% 35%)" />
          <circle cx="100" cy="50" r="4" fill="hsl(0 80% 55%)" />
        </g>
      );
    case "acc_wizard":
      return (
        <g>
          <path d="M70 60 Q100 -5 130 60 Z" fill="hsl(260 60% 35%)" />
          <rect x="60" y="58" width="80" height="8" rx="3" fill="hsl(260 60% 25%)" />
          <text x="92" y="40" fontSize="10" fill="hsl(42 95% 70%)">⭐</text>
          <text x="80" y="55" fontSize="8" fill="hsl(42 95% 70%)">✨</text>
          <text x="110" y="50" fontSize="8" fill="hsl(42 95% 70%)">✨</text>
        </g>
      );
    case "acc_glasses_round":
      return (
        <g>
          <circle cx="83" cy="95" r="13" fill="hsl(40 50% 96%)" fillOpacity="0.4" stroke="hsl(35 60% 30%)" strokeWidth="3" />
          <circle cx="117" cy="95" r="13" fill="hsl(40 50% 96%)" fillOpacity="0.4" stroke="hsl(35 60% 30%)" strokeWidth="3" />
          <line x1="96" y1="95" x2="104" y2="95" stroke="hsl(35 60% 30%)" strokeWidth="3" />
        </g>
      );
    case "acc_tophat":
      return (
        <g>
          <rect x="78" y="10" width="44" height="42" rx="2" fill="hsl(220 30% 12%)" />
          <rect x="60" y="48" width="80" height="8" rx="2" fill="hsl(220 30% 12%)" />
          <rect x="78" y="38" width="44" height="5" fill="hsl(0 70% 45%)" />
        </g>
      );
    case "acc_beret":
      return (
        <g>
          <ellipse cx="100" cy="48" rx="42" ry="16" fill="hsl(0 65% 45%)" />
          <ellipse cx="100" cy="44" rx="38" ry="12" fill="hsl(0 70% 50%)" />
          <circle cx="118" cy="35" r="5" fill="hsl(0 60% 35%)" />
        </g>
      );
    case "acc_tiara":
      return (
        <g>
          <path d="M65 58 Q100 30 135 58" stroke="hsl(42 95% 60%)" strokeWidth="4" fill="none" />
          <circle cx="100" cy="35" r="5" fill="hsl(195 90% 70%)" stroke="hsl(42 95% 50%)" strokeWidth="1.5" />
          <circle cx="80" cy="48" r="3" fill="hsl(330 80% 70%)" />
          <circle cx="120" cy="48" r="3" fill="hsl(330 80% 70%)" />
        </g>
      );
    case "acc_santa":
      return (
        <g>
          <path d="M68 58 Q100 5 132 58 Z" fill="hsl(0 75% 50%)" />
          <rect x="60" y="56" width="80" height="10" rx="3" fill="hsl(40 50% 96%)" />
          <circle cx="130" cy="20" r="8" fill="hsl(40 50% 96%)" />
        </g>
      );
    case "acc_helmet":
      return (
        <g>
          <path d="M62 65 Q62 28 100 28 Q138 28 138 65 Z" fill="hsl(220 15% 70%)" stroke="hsl(220 20% 40%)" strokeWidth="2" />
          <rect x="62" y="60" width="76" height="8" fill="hsl(220 15% 55%)" />
          <path d="M98 30 L102 30 L102 14 L98 14 Z" fill="hsl(0 70% 50%)" />
          <circle cx="100" cy="12" r="4" fill="hsl(0 70% 50%)" />
        </g>
      );
    case "acc_pirate":
      return (
        <g>
          <ellipse cx="83" cy="95" rx="14" ry="11" fill="hsl(220 30% 10%)" />
          <path d="M70 88 Q100 78 145 92" stroke="hsl(220 30% 10%)" strokeWidth="2.5" fill="none" />
        </g>
      );
    case "acc_glasses_3d":
      return (
        <g>
          <path d="M83 80 L93 105 L73 105 Z" fill="hsl(42 95% 60%)" stroke="hsl(35 70% 35%)" strokeWidth="2" />
          <path d="M117 80 L127 105 L107 105 Z" fill="hsl(42 95% 60%)" stroke="hsl(35 70% 35%)" strokeWidth="2" />
          <line x1="93" y1="95" x2="107" y2="95" stroke="hsl(35 70% 35%)" strokeWidth="2.5" />
        </g>
      );
    case "acc_antlers":
      return (
        <g stroke="hsl(28 50% 30%)" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M82 50 L72 25" />
          <path d="M75 35 L65 30" />
          <path d="M78 42 L68 40" />
          <path d="M118 50 L128 25" />
          <path d="M125 35 L135 30" />
          <path d="M122 42 L132 40" />
        </g>
      );
    case "acc_butterfly":
      return (
        <g transform="translate(72 32)">
          <ellipse cx="-4" cy="-2" rx="6" ry="4" fill="hsl(280 70% 65%)" />
          <ellipse cx="4" cy="-2" rx="6" ry="4" fill="hsl(280 70% 65%)" />
          <ellipse cx="-4" cy="4" rx="5" ry="3" fill="hsl(330 75% 70%)" />
          <ellipse cx="4" cy="4" rx="5" ry="3" fill="hsl(330 75% 70%)" />
          <ellipse cx="0" cy="1" rx="1.5" ry="5" fill="hsl(220 50% 20%)" />
        </g>
      );
    case "acc_leaf":
      return (
        <g transform="translate(60 70) rotate(-25)">
          <path d="M0 0 Q8 -10 14 0 Q8 10 0 0 Z" fill="hsl(20 80% 50%)" />
          <line x1="0" y1="0" x2="14" y2="0" stroke="hsl(28 60% 30%)" strokeWidth="1" />
        </g>
      );
    default:
      return null;
  }
}

/* ---------- Bakgrunder (köpta i affären) ---------- */
function getBackgroundStyle(id?: string | null): string | undefined {
  switch (id) {
    case "bg_meadow":  return "linear-gradient(180deg, hsl(200 80% 80%) 0%, hsl(200 80% 80%) 60%, hsl(95 55% 65%) 60%, hsl(95 55% 55%) 100%)";
    case "bg_beach":   return "linear-gradient(180deg, hsl(28 90% 75%) 0%, hsl(35 95% 65%) 40%, hsl(200 70% 60%) 60%, hsl(45 85% 80%) 80%, hsl(45 85% 70%) 100%)";
    case "bg_space":   return "linear-gradient(180deg, hsl(250 60% 15%) 0%, hsl(270 60% 25%) 100%)";
    case "bg_forest":  return "linear-gradient(180deg, hsl(150 40% 60%) 0%, hsl(150 40% 45%) 60%, hsl(95 35% 35%) 100%)";
    case "bg_night":   return "linear-gradient(180deg, hsl(230 60% 18%) 0%, hsl(240 50% 30%) 100%)";
    case "bg_rainbow": return "linear-gradient(180deg, hsl(0 80% 75%), hsl(30 90% 75%), hsl(50 90% 75%), hsl(120 60% 70%), hsl(200 70% 70%), hsl(260 60% 75%))";
    case "bg_mountain": return "linear-gradient(180deg, hsl(210 70% 75%) 0%, hsl(210 50% 60%) 50%, hsl(220 20% 85%) 60%, hsl(220 15% 70%) 100%)";
    case "bg_ocean":    return "linear-gradient(180deg, hsl(200 80% 70%) 0%, hsl(210 80% 50%) 40%, hsl(220 80% 35%) 100%)";
    case "bg_city":     return "linear-gradient(180deg, hsl(20 80% 70%) 0%, hsl(280 50% 45%) 60%, hsl(260 40% 25%) 100%)";
    case "bg_aurora":   return "linear-gradient(180deg, hsl(240 60% 15%) 0%, hsl(160 70% 35%) 40%, hsl(280 60% 35%) 70%, hsl(240 60% 15%) 100%)";
    case "bg_sunrise":  return "linear-gradient(180deg, hsl(280 50% 60%) 0%, hsl(20 90% 70%) 40%, hsl(42 100% 75%) 70%, hsl(42 100% 85%) 100%)";
    case "bg_sakura":   return "linear-gradient(180deg, hsl(330 70% 88%) 0%, hsl(330 60% 75%) 100%)";
    case "bg_winter":   return "linear-gradient(180deg, hsl(210 50% 80%) 0%, hsl(210 30% 90%) 60%, hsl(0 0% 96%) 60%, hsl(0 0% 90%) 100%)";
    case "bg_garden":   return "linear-gradient(180deg, hsl(195 70% 80%) 0%, hsl(120 50% 70%) 60%, hsl(120 40% 50%) 100%)";
    case "bg_clouds":   return "linear-gradient(180deg, hsl(200 80% 70%) 0%, hsl(200 80% 85%) 100%)";
    case "bg_underwater": return "linear-gradient(180deg, hsl(190 80% 55%) 0%, hsl(210 80% 35%) 60%, hsl(220 70% 25%) 100%)";
    default: return undefined;
  }
}

function BackgroundDecor({ id }: { id: string }) {
  if (id === "bg_space" || id === "bg_night" || id === "bg_aurora") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: 12, y: 18 }, { x: 30, y: 8 }, { x: 70, y: 14 }, { x: 88, y: 24 },
          { x: 18, y: 40 }, { x: 80, y: 50 }, { x: 92, y: 70 }, { x: 8, y: 80 },
        ].map((s, i) => (
          <span key={i} className="absolute text-white" style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: 8 }}>✦</span>
        ))}
        {id === "bg_night" && (
          <span className="absolute text-2xl" style={{ left: "75%", top: "12%" }}>🌙</span>
        )}
      </div>
    );
  }
  if (id === "bg_forest") {
    return (
      <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-around opacity-60 text-2xl pb-1">
        <span>🌲</span><span>🌳</span><span>🌲</span>
      </div>
    );
  }
  if (id === "bg_meadow") {
    return (
      <div className="absolute inset-x-0 bottom-1 pointer-events-none flex justify-around opacity-90 text-sm">
        <span>🌼</span><span>🌷</span><span>🌸</span><span>🌼</span>
      </div>
    );
  }
  if (id === "bg_beach") {
    return (
      <div className="absolute top-2 right-3 pointer-events-none text-2xl opacity-90">☀️</div>
    );
  }
  if (id === "bg_rainbow") {
    return (
      <div className="absolute top-2 left-3 pointer-events-none text-2xl opacity-90">☁️</div>
    );
  }
  if (id === "bg_mountain") {
    return (
      <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-around text-3xl opacity-90 pb-0">
        <span>⛰️</span><span>🏔️</span><span>⛰️</span>
      </div>
    );
  }
  if (id === "bg_ocean") {
    return (
      <div className="absolute inset-x-0 bottom-1 pointer-events-none flex justify-around text-base opacity-90">
        <span>🌊</span><span>🐟</span><span>🌊</span>
      </div>
    );
  }
  if (id === "bg_city") {
    return (
      <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-end justify-around text-2xl opacity-90">
        <span>🏢</span><span>🏙️</span><span>🏬</span>
      </div>
    );
  }
  if (id === "bg_sunrise") {
    return (
      <div className="absolute pointer-events-none text-3xl" style={{ left: "60%", top: "55%" }}>🌅</div>
    );
  }
  if (id === "bg_sakura") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[{x:10,y:15},{x:75,y:20},{x:25,y:60},{x:85,y:70},{x:50,y:30}].map((s,i)=>(
          <span key={i} className="absolute text-sm" style={{left:`${s.x}%`,top:`${s.y}%`}}>🌸</span>
        ))}
      </div>
    );
  }
  if (id === "bg_winter") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[{x:15,y:20},{x:40,y:10},{x:70,y:25},{x:88,y:15},{x:25,y:45},{x:60,y:50}].map((s,i)=>(
          <span key={i} className="absolute text-xs text-white" style={{left:`${s.x}%`,top:`${s.y}%`}}>❄️</span>
        ))}
      </div>
    );
  }
  if (id === "bg_garden") {
    return (
      <div className="absolute inset-x-0 bottom-1 pointer-events-none flex justify-around text-sm">
        <span>🌺</span><span>🌻</span><span>🌷</span><span>🌹</span>
      </div>
    );
  }
  if (id === "bg_clouds") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute text-2xl" style={{left:"10%",top:"15%"}}>☁️</span>
        <span className="absolute text-xl" style={{left:"70%",top:"25%"}}>☁️</span>
        <span className="absolute text-lg" style={{left:"40%",top:"8%"}}>☁️</span>
      </div>
    );
  }
  if (id === "bg_underwater") {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute text-lg" style={{left:"15%",top:"30%"}}>🐠</span>
        <span className="absolute text-base" style={{left:"70%",top:"50%"}}>🐟</span>
        <span className="absolute text-sm" style={{left:"40%",top:"20%"}}>🫧</span>
        <span className="absolute text-2xl" style={{left:"50%",bottom:"2%",top:"auto"}}>🪸</span>
      </div>
    );
  }
  return null;
}
