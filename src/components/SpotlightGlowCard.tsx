import React, { useRef, useState, useCallback } from 'react';

export interface SpotlightGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'multi';
  spotlightSize?: number;
  onClick?: () => void;
}

export const SpotlightGlowCard: React.FC<SpotlightGlowCardProps> = ({
  children,
  className = '',
  innerClassName = 'bg-gradient-to-b from-[#0b172e] to-[#071122] p-5',
  glowColor,
  spotlightSize = 300,
  onClick,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic accent fallback from document attribute
  const activeGlowColor = React.useMemo(() => {
    if (glowColor) return glowColor;
    if (typeof document !== 'undefined') {
      const docAccent = document.documentElement.getAttribute('data-accent');
      if (docAccent === 'amber' || docAccent === 'emerald' || docAccent === 'cyan') {
        return docAccent;
      }
    }
    return 'emerald';
  }, [glowColor]);

  // Determine gradient color palette based on prop or active system accent
  const colorGradients = {
    cyan: {
      peak: 'rgba(56, 189, 248, 1)', // Brightest cyan at cursor point
      mid: 'rgba(14, 165, 233, 0.6)',
      low: 'rgba(2, 132, 199, 0.2)',
    },
    emerald: {
      peak: 'rgba(52, 211, 153, 1)', // Vibrant Saung Digital Neon Green
      mid: 'rgba(16, 185, 129, 0.65)',
      low: 'rgba(5, 150, 105, 0.2)',
    },
    amber: {
      peak: 'rgba(250, 204, 21, 1)', // Bright Amber
      mid: 'rgba(245, 158, 11, 0.65)',
      low: 'rgba(217, 119, 6, 0.2)',
    },
    multi: {
      peak: 'rgba(56, 189, 248, 1)',
      mid: 'rgba(52, 211, 153, 0.7)',
      low: 'rgba(245, 158, 11, 0.25)',
    },
  }[activeGlowColor] || {
    peak: 'rgba(52, 211, 153, 1)',
    mid: 'rgba(16, 185, 129, 0.65)',
    low: 'rgba(5, 150, 105, 0.2)',
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {/* 1. Dynamic Cursor Spotlight Border: Brightest on the exact side closest to the cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            ${spotlightSize}px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
            ${colorGradients.peak} 0%,
            ${colorGradients.mid} 35%,
            ${colorGradients.low} 65%,
            transparent 80%
          )`,
        }}
      />

      {/* 2. Static Ambient Border for when cursor is not hovering */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-sky-800/25 transition-colors group-hover:border-transparent" />

      {/* 3. Subtle Inner Surface Glow tracking cursor near edges */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 z-10"
        style={{
          opacity: isHovered ? 0.07 : 0,
          background: `radial-gradient(
            ${spotlightSize * 1.3}px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
            ${colorGradients.peak} 0%,
            transparent 70%
          )`,
        }}
      />

      {/* 4. Card Content Container (Offset by 1.5px to reveal the dynamic border) */}
      <div className={`relative h-full w-full rounded-[15px] z-20 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
