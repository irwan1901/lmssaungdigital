import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Copy,
  Calendar,
  Info,
} from 'lucide-react';
import { ToolCardBanner } from './ToolCardBanner';
import { ToolViewerModal } from './ToolViewerModal';
import { ToolItem, MemberToolsConfig } from '../types';
import { DEFAULT_TOOLS } from '../data/defaultTools';
import { loadSyncConfig } from '../services/googleSheetsSync';

export const MEMBER_TOOLS_LIST = DEFAULT_TOOLS;

interface MemberToolsProps {
  tools?: ToolItem[];
  config?: MemberToolsConfig;
}

const formatUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const MemberTools: React.FC<MemberToolsProps> = ({ tools, config }) => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  const activeTools = tools && tools.length > 0 ? tools : DEFAULT_TOOLS;
  const headerTitle = config?.headerTitle || 'Tools';
  const headerSubtitle =
    config?.headerSubtitle || 'Kumpulan tools pendukung yang telah dipublikasikan oleh Admin.';
  const badgeIcon = config?.badgeIcon || '🧰';

  // Admin uploaded Web App URL or environment fallback
  const adminUploadedUrl =
    (typeof window !== 'undefined' ? loadSyncConfig().appsScriptUrl : '') ||
    (import.meta.env.VITE_GAS_API_URL as string) ||
    'https://script.google.com/macros/s/AKfycbwOfuFCKuCUrBC34EJmCkw7ZlbwHcCkqhbgQXjQ4Gk9t8vW8KfQpGbsPKMq3hU7WzAW/exec';

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
        {activeTools.map((tool) => {
          // Determine direct URL for this tool (custom toolUrl or admin uploaded URL)
          const targetUrl = formatUrl(tool.toolUrl || adminUploadedUrl);

          return (
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
                {/* Tag / Category & Petunjuk button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-pink-400 font-extrabold text-[11px] uppercase tracking-wider">
                    <span>🧰</span>
                    <span>{tool.tag}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    title="Lihat Petunjuk & Detail"
                    className="text-[10px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition px-1.5 py-0.5 rounded hover:bg-sky-950/60 cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-sky-400" />
                    <span>Petunjuk</span>
                  </button>
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
                <div className="pt-1 text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>{tool.date}</span>
                  {tool.category && (
                    <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 border border-sky-950">
                      {tool.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: Buka Tool (Direct Link for all tools) */}
              <div className="pt-2">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-600/30 hover:shadow-sky-500/40 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer no-underline group/btn"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  <span>Buka Tool</span>
                </a>
              </div>
            </div>
          );
        })}
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
