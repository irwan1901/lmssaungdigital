import React from 'react';

interface SaungDigitalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  customLogoUrl?: string;
}

export const SaungDigitalLogo: React.FC<SaungDigitalLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  customLogoUrl,
}) => {
  const dimensions = {
    sm: { icon: 34, title: 'text-sm', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 46, title: 'text-lg', sub: 'text-[10px]', gap: 'gap-3' },
    lg: { icon: 64, title: 'text-2xl', sub: 'text-xs', gap: 'gap-3.5' },
    hero: { icon: 84, title: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm', gap: 'gap-4' },
  }[size];

  const iconDim = dimensions.icon;

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      {/* Custom Uploaded Logo or Neon Cyber Saung House Emblem */}
      {customLogoUrl ? (
        <div
          className="relative shrink-0 flex items-center justify-center rounded-2xl bg-[#071326] p-1 border border-sky-400/40 shadow-lg shadow-sky-500/20 overflow-hidden group hover:border-emerald-400 transition-colors"
          style={{ width: iconDim, height: iconDim }}
        >
          <img
            src={customLogoUrl}
            alt="Logo Portal"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      ) : (
        <div
          className="relative shrink-0 flex items-center justify-center rounded-2xl bg-[#071326] p-1.5 border border-sky-400/40 shadow-lg shadow-sky-500/20 group hover:border-emerald-400 transition-colors"
          style={{ width: iconDim, height: iconDim }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Saung House Gable / Roof Contour */}
            <path
              d="M50 12 L84 40 L84 84 L16 84 L16 40 Z"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinejoin="round"
              fill="#091830"
            />

            {/* Roof Ridge Accents */}
            <path
              d="M50 12 L16 40"
              stroke="#7dd3fc"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M50 12 L84 40"
              stroke="#7dd3fc"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cyber Circuit Tree / Wifi Signal inside house */}
            {/* Circuit trunk */}
            <path d="M50 74 V46" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="74" r="3" fill="#22c55e" />

            {/* Left Circuit Branch */}
            <path d="M50 56 H36 V42" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="42" r="3" fill="#4ade80" />

            {/* Right Circuit Branch */}
            <path d="M50 62 H64 V48" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="64" cy="48" r="3" fill="#4ade80" />

            {/* Wifi Broadcast Wave atop circuit */}
            <path
              d="M40 38 C45 34, 55 34, 60 38"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M44 42 C47 39, 53 39, 56 42"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="46" r="2.5" fill="#38bdf8" />
          </svg>
        </div>
      )}

      {/* Typography: SAUNG (White) DIGITAL (Neon Green) */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight text-white uppercase ${dimensions.title}`}
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
                letterSpacing: '-0.01em',
              }}
            >
              SAUNG
            </span>
            <span
              className={`font-black tracking-wider text-[#34d399] uppercase ${dimensions.title}`}
              style={{
                textShadow: '0 0 16px rgba(52, 211, 153, 0.7)',
                letterSpacing: '0.04em',
              }}
            >
              DIGITAL
            </span>
          </div>
          <span
            className={`font-semibold tracking-wider text-slate-300 uppercase mt-1 ${dimensions.sub}`}
          >
            KOLABORASI • INOVASI • TEKNOLOGI
          </span>
        </div>
      )}
    </div>
  );
};
