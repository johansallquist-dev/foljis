import { useMemo } from "react";

interface Props {
  /** 0-4: trött, ok, glad, strålande, megaglad */
  mood: number;
  size?: number;
  celebrate?: boolean;
  name?: string;
}

/**
 * Solis - en liten sol-/blob-följeslagare.
 * Helt SVG, byter ansiktsuttryck efter humör.
 */
export function Companion({ mood, size = 180, celebrate, name }: Props) {
  const cls = useMemo(() => {
    const base = "companion-float";
    if (celebrate) return `${base} celebrate`;
    return base;
  }, [celebrate]);

  // ansiktsuttryck baserat på mood (0-4)
  const eyes = mood >= 3 ? "happy" : mood >= 1 ? "open" : "tired";
  const mouth = mood >= 3 ? "bigSmile" : mood >= 2 ? "smile" : mood >= 1 ? "neutral" : "sad";
  const cheeks = mood >= 2;
  const sparkles = mood >= 4;

  // färg-gradient baserad på humör
  const stops = mood >= 3
    ? ["hsl(42 100% 75%)", "hsl(42 95% 60%)"]
    : mood >= 2
    ? ["hsl(42 90% 80%)", "hsl(42 85% 65%)"]
    : mood >= 1
    ? ["hsl(42 50% 80%)", "hsl(42 40% 65%)"]
    : ["hsl(220 25% 80%)", "hsl(220 25% 65%)"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cls} style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" width={size} height={size} aria-label={`${name || "Solis"}, din följeslagare`}>
          <defs>
            <radialGradient id="solBody" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor={stops[0]} />
              <stop offset="100%" stopColor={stops[1]} />
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="0" dy="3" result="off" />
              <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Solstrålar (bara om glad) */}
          {mood >= 3 && (
            <g opacity="0.9">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <g key={a} transform={`rotate(${a} 100 100)`}>
                  <path d="M100 18 L96 6 L104 6 Z" fill={stops[1]} opacity="0.7" />
                </g>
              ))}
            </g>
          )}

          {/* Kropp */}
          <circle cx="100" cy="105" r="62" fill="url(#solBody)" filter="url(#softShadow)" />

          {/* Kinder */}
          {cheeks && (
            <>
              <ellipse cx="72" cy="115" rx="8" ry="5" fill="hsl(8 85% 75%)" opacity="0.6" />
              <ellipse cx="128" cy="115" rx="8" ry="5" fill="hsl(8 85% 75%)" opacity="0.6" />
            </>
          )}

          {/* Ögon */}
          {eyes === "happy" && (
            <>
              <path d="M78 95 Q83 88 88 95" stroke="hsl(220 50% 25%)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M112 95 Q117 88 122 95" stroke="hsl(220 50% 25%)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </>
          )}
          {eyes === "open" && (
            <>
              <circle cx="83" cy="95" r="4" fill="hsl(220 50% 25%)" />
              <circle cx="117" cy="95" r="4" fill="hsl(220 50% 25%)" />
            </>
          )}
          {eyes === "tired" && (
            <>
              <path d="M76 96 L92 96" stroke="hsl(220 30% 40%)" strokeWidth="4" strokeLinecap="round"/>
              <path d="M108 96 L124 96" stroke="hsl(220 30% 40%)" strokeWidth="4" strokeLinecap="round"/>
            </>
          )}

          {/* Mun */}
          {mouth === "bigSmile" && (
            <path d="M82 122 Q100 142 118 122" stroke="hsl(220 50% 25%)" strokeWidth="4" fill="hsl(8 80% 55%)" strokeLinecap="round"/>
          )}
          {mouth === "smile" && (
            <path d="M86 124 Q100 134 114 124" stroke="hsl(220 50% 25%)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          )}
          {mouth === "neutral" && (
            <path d="M88 126 L112 126" stroke="hsl(220 50% 25%)" strokeWidth="4" strokeLinecap="round"/>
          )}
          {mouth === "sad" && (
            <path d="M86 130 Q100 120 114 130" stroke="hsl(220 50% 25%)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          )}

          {/* Glitter när megaglad */}
          {sparkles && (
            <g>
              <text x="40" y="55" fontSize="22">✨</text>
              <text x="150" y="60" fontSize="22">✨</text>
              <text x="155" y="155" fontSize="18">⭐</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
