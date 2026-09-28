import React from 'react';

interface FooterProps {
  onNavigateSync?: () => void;
  onNavigateCatalog?: () => void;
  onNavigateMember?: (tab: 'learning' | 'prompts' | 'tools') => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-20 sm:mt-28 border-t border-sky-950/60 bg-[#040812] text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="space-y-1.5">
            <h4 className="text-base font-black text-white tracking-wide uppercase">
              SAUNG DIGITAL
            </h4>
            <p className="text-xs text-slate-400">
              Platform materi pembelajaran digital.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-1.5 md:text-left">
            <h4 className="text-base font-black text-white tracking-wide">
              Information
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              © 2026 SAUNG DIGITAL. Seluruh materi digunakan untuk kebutuhan pembelajaran member.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-sky-950/40 text-xs text-slate-500">
          © 2026 SAUNG DIGITAL
        </div>
      </div>
    </footer>
  );
};
