import React from 'react';

interface ToolCardBannerProps {
  title: string;
  versionBadge?: string;
  colorScheme?: 'blue' | 'cyan' | 'amber' | 'emerald';
}

export const ToolCardBanner: React.FC<ToolCardBannerProps> = ({
  title,
  versionBadge,
  colorScheme = 'blue',
}) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#040c1b] border border-sky-600/30 group-hover:border-sky-400/60 transition-all select-none flex items-center justify-center p-3 shadow-inner">
      {/* Background glow & grid */}
      <div className="absolute inset-0 bg-radial from-sky-900/30 via-[#050f24] to-[#030814] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* SVG Cyber Banner Illustration */}
      <svg
        viewBox="0 0 420 220"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#091428" />
            <stop offset="100%" stopColor="#020610" />
          </linearGradient>

          <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="badgePlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1b36" />
            <stop offset="100%" stopColor="#050e1f" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= LEFT: ROBOT MASCOT ================= */}
        <g transform="translate(18, 12)">
          {/* Outer glowing halo ring */}
          <circle
            cx="80"
            cy="95"
            r="65"
            stroke="#00f2fe"
            strokeWidth="3.5"
            strokeDasharray="16 8 4 8"
            filter="url(#ringGlow)"
            opacity="0.85"
          />

          {/* Golden accent arc */}
          <path
            d="M 35 60 A 65 65 0 0 1 125 60"
            stroke="#facc15"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />

          {/* Ears / Side audio pods */}
          <rect x="18" y="76" width="12" height="38" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="130" y="76" width="12" height="38" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Robot Head Body */}
          <rect
            x="26"
            y="48"
            width="108"
            height="94"
            rx="30"
            fill="url(#headGrad)"
            stroke="#38bdf8"
            strokeWidth="3"
          />

          {/* Visor Screen */}
          <rect
            x="36"
            y="62"
            width="88"
            height="62"
            rx="20"
            fill="url(#visorGrad)"
            stroke="#00f2fe"
            strokeWidth="2.5"
            filter="url(#neonGlow)"
          />

          {/* Glowing Eyes */}
          <ellipse cx="60" cy="90" rx="9" ry="11" fill="#00f2fe" filter="url(#neonGlow)" />
          <ellipse cx="100" cy="90" rx="9" ry="11" fill="#00f2fe" filter="url(#neonGlow)" />
          {/* Eye inner pupils */}
          <ellipse cx="61" cy="88" rx="4" ry="5" fill="#ffffff" />
          <ellipse cx="101" cy="88" rx="4" ry="5" fill="#ffffff" />

          {/* Smile line */}
          <path
            d="M 68 110 Q 80 116 92 110"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Chin plate */}
          <rect x="62" y="132" width="36" height="8" rx="4" fill="#0284c7" />
        </g>

        {/* ================= RIGHT: 3D CYBER BADGE ================= */}
        <g transform="translate(165, 24)">
          {/* Badge Outer Glowing Border */}
          <polygon
            points="15,0 225,0 240,30 240,135 225,165 15,165 0,135 0,30"
            fill="url(#badgePlate)"
            stroke="#00f2fe"
            strokeWidth="3"
            filter="url(#neonGlow)"
          />

          {/* Inner Accent Line */}
          <polygon
            points="22,8 218,8 232,34 232,130 218,157 22,157 8,130 8,34"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="6 3"
            opacity="0.7"
          />

          {/* Corner tech details */}
          <line x1="0" y1="30" x2="15" y2="0" stroke="#facc15" strokeWidth="3" />
          <line x1="225" y1="165" x2="240" y2="135" stroke="#facc15" strokeWidth="3" />

          {/* Brand Row 1: SAUNG DIGITAL */}
          <text
            x="120"
            y="42"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="18"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2.5"
            filter="url(#neonGlow)"
          >
            SAUNG
          </text>

          {/* Main Title Row 2: ULTIMATE */}
          <text
            x="120"
            y="88"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="950"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2"
            style={{ textShadow: '0 0 15px rgba(255,255,255,0.6)' }}
          >
            ULTIMATE
          </text>

          {/* Version Badge Row 3: WEB V.1 / WEB V.2 / POSTER UMKM */}
          <g transform="translate(35, 102)">
            {/* Version pill background */}
            <rect
              x="0"
              y="0"
              width="170"
              height="40"
              rx="8"
              fill="#061226"
              stroke="#facc15"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />
            <text
              x="85"
              y="28"
              textAnchor="middle"
              fill="url(#goldText)"
              fontSize="20"
              fontWeight="950"
              fontFamily="system-ui, sans-serif"
              letterSpacing="2.5"
            >
              {versionBadge || title}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
