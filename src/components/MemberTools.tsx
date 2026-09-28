import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Copy,
  Calendar,
} from 'lucide-react';
import { ToolCardBanner } from './ToolCardBanner';
import { ToolViewerModal } from './ToolViewerModal';
import { ToolItem, MemberToolsConfig } from '../types';
import { DEFAULT_TOOLS } from '../data/defaultTools';

export const MEMBER_TOOLS_LIST = DEFAULT_TOOLS;

interface MemberToolsProps {
  tools?: ToolItem[];
  config?: MemberToolsConfig;
}

export const MemberTools: React.FC<MemberToolsProps> = ({ tools, config }) => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  const activeTools = tools && tools.length > 0 ? tools : DEFAULT_TOOLS;
  const headerTitle = config?.headerTitle || 'Tools';
  const headerSubtitle =
    config?.headerSubtitle || 'Kumpulan tools pendukung yang telah dipublikasikan oleh Admin.';
  const badgeIcon = config?.badgeIcon || '🧰';

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{badgeIcon}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {headerTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {headerSubtitle}
        </p>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {activeTools.map((tool) => (
          <div
            key={tool.id}
            className="group bg-[#08152b] border border-sky-900/50 hover:border-sky-500/50 rounded-3xl p-5 transition-all flex flex-col justify-between space-y-4 shadow-xl hover:shadow-sky-950/60"
          >
            {/* Top Cyberpunk Banner Graphic */}
            <ToolCardBanner
              title={tool.badge}
              versionBadge={tool.versionBadge}
            />

            {/* Content Details */}
            <div className="space-y-2.5 flex-1">
              {/* Tag / Category */}
              <div className="flex items-center gap-1.5 text-pink-400 font-extrabold text-[11px] uppercase tracking-wider">
                <span>🧰</span>
                <span>{tool.tag}</span>
              </div>

              {/* Title with glowing yellow lightning */}
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5 group-hover:text-sky-300 transition-colors">
                <span className="text-amber-400">⚡</span>
                <span>{tool.title}</span>
                <span className="text-amber-400">⚡</span>
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed min-h-[38px]">
                {tool.description}
              </p>

              {/* Published Date */}
              <div className="pt-1 text-[11px] text-slate-500 font-medium">
                {tool.date}
              </div>
            </div>

            {/* Action Button: Buka Tool */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedTool(tool)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-600/30 hover:shadow-sky-500/40 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>Buka Tool</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tool Viewer Modal */}
      {selectedTool && (
        <ToolViewerModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
};
