import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Star,
  Play,
  Sparkles,
  ChevronDown,
  Filter,
  Plus,
  X,
  Sliders,
} from 'lucide-react';
import { PromptItem, MemberUser, PromptLibraryConfig } from '../types';
import { DEFAULT_PROMPTS } from '../data/defaultPrompts';
import { SaungDigitalLogo } from './SaungDigitalLogo';
import { LivePreviewModal } from './LivePreviewModal';

interface PromptLibraryProps {
  currentUser: MemberUser | null;
  onOpenLoginModal: () => void;
  prompts?: PromptItem[];
  config?: PromptLibraryConfig;
}

const CATEGORIES_LIST = [
  'INTERACTIVE BACKGROUND',
  'HERO BANNER & 3D',
  'NEON GLASSMORPHISM',
  'CARDS & SPOTLIGHT',
  'NAVIGATION & MENU',
  'DATA VISUALIZATION',
  'BUTTONS & MICRO-INTERACTIONS',
  'UI/UX & Frontend',
  'ANDROID JETPACK COMPOSE',
  'Android & Kotlin',
  'GOOGLE APPS SCRIPT API',
  'Fullstack & Backend',
  'IOT & ESP32 ROBOTICS',
  'IoT & Robotics',
  'AI & SYSTEM PROMPT',
  'AI & System Prompt',
  'SEMUA KATEGORI',
];

export const PromptLibrary: React.FC<PromptLibraryProps> = ({
  currentUser,
  onOpenLoginModal,
  prompts: externalPrompts,
  config,
}) => {
  // Load custom + initial prompts
  const [localPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('saung_digital_prompts_v2');
      if (saved) return JSON.parse(saved);
      return DEFAULT_PROMPTS;
    } catch {
      return DEFAULT_PROMPTS;
    }
  });

  const prompts = externalPrompts && externalPrompts.length > 0 ? externalPrompts : localPrompts;
  const categoriesList = config?.categories && config.categories.length > 0 ? config.categories : CATEGORIES_LIST;
  const headerTitle = config?.headerTitle || 'Prompt UI & Web Interaktif';
  const headerSubtitle =
    config?.headerSubtitle ||
    'Koleksi prompt spesifik dan siap copy untuk ChatGPT, Gemini, Claude, Antigravity, serta AI coding lainnya.';
  const badgeText = config?.badgeText || 'SAUNG DIGITAL UI PROMPT LIBRARY';

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saung_digital_fav_prompts_v1');
      return saved ? JSON.parse(saved) : ['pr-021', 'pr-022'];
    } catch {
      return ['pr-021', 'pr-022'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('INTERACTIVE BACKGROUND');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePreviewPrompt, setActivePreviewPrompt] = useState<PromptItem | null>(null);

  // Variable customization drawer/modal
  const [customizingPrompt, setCustomizingPrompt] = useState<PromptItem | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      // Category match
      if (selectedCategory !== 'SEMUA KATEGORI') {
        const itemCatNorm = item.category.trim().toLowerCase();
        const selCatNorm = selectedCategory.trim().toLowerCase();
        if (itemCatNorm !== selCatNorm && !itemCatNorm.includes(selCatNorm) && !selCatNorm.includes(itemCatNorm)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inCategory = item.category.toLowerCase().includes(q);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const inNum = item.numberTag?.toLowerCase().includes(q) || false;
        return inTitle || inDesc || inCategory || inTags || inNum;
      }

      return true;
    });
  }, [prompts, selectedCategory, searchQuery]);

  // Copy prompt action
  const handleCopyPrompt = (prompt: PromptItem) => {
    let textToCopy = prompt.promptText;

    // Replace default variables if set
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        const val = variableValues[v.name] || v.defaultValue;
        textToCopy = textToCopy.replace(new RegExp(`{${v.name}}`, 'g'), val);
      });
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2200);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem('saung_digital_fav_prompts_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Outer Card Container matching Screenshot (9).png */}
      <div className="bg-[#071326] border border-sky-900/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* Top Header of container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">⚡</span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Saung Digital UI Prompt Library
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Library 300 Prompt UI &amp; Web Interaktif tersedia untuk akun Member dan Admin.
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 border border-amber-400/40 text-amber-300 shadow-sm">
              MEMBER ACCESS
            </span>
          </div>
        </div>

        {/* Inner Hero Card for UI Prompt Library */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b1b36] via-[#09172f] to-[#061124] border border-sky-600/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Mascot with Brand */}
          <div className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-[#060f1f]/80 border border-sky-500/30 shadow-inner">
            <SaungDigitalLogo size="hero" showText={true} />
          </div>

          {/* Content Info */}
          <div className="space-y-2.5 flex-1 relative z-10">
            <span className="text-[11px] font-extrabold tracking-wider text-amber-400 uppercase">
              {badgeText}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {headerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {headerSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-amber-400 text-xs font-bold shadow-sm">
                {categoriesList.length} Kategori
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-emerald-400 text-xs font-bold shadow-sm">
                100% Siap Copy
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-medium shadow-sm">
                by <strong className="text-amber-400">Saung Digital</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari prompt, fitur, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#061021] border border-sky-800/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-[260px] px-4 py-2.5 bg-[#061021] border border-sky-800/60 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-sky-400 cursor-pointer uppercase appearance-none pr-9 tracking-wide"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat} className="bg-[#071326] text-white">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Subheading & Counter (matches Screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-sky-900/30">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase">
              {selectedCategory}
            </h3>
            <p className="text-xs text-slate-400">
              Menampilkan {filteredPrompts.length} dari {prompts.length} prompt
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Tip: klik ★ untuk menyimpan favorit di browser.
          </p>
        </div>

        {/* Prompt Cards Grid (2 Columns matching Screenshot 9) */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredPrompts.map((item) => {
              const isFav = favorites.includes(item.id);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#08152b] border border-sky-900/50 hover:border-sky-500/50 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-sky-950/50 group"
                >
                  <div className="space-y-2.5">
                    {/* Top Tag & ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {item.numberTag || '#001'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#050e1c] border border-sky-950 text-[10px] text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-sky-900/30">
                    {/* Live Preview Button */}
                    <button
                      onClick={() => setActivePreviewPrompt(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0e2240] hover:bg-[#15315b] border border-sky-700/40 hover:border-sky-500 text-sky-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title="Lihat simulasi visual langsung"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Live Preview</span>
                    </button>

                    {/* Copy Prompt Button */}
                    <button
                      onClick={() => handleCopyPrompt(item)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-[#0e2240] hover:bg-[#15315b] border-sky-700/40 hover:border-sky-500 text-slate-200 hover:text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    {/* Star Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`w-9 h-9 rounded-xl bg-[#0e2240] border flex items-center justify-center transition cursor-pointer shrink-0 ${
                        isFav
                          ? 'text-amber-400 border-amber-500/50 bg-amber-950/30'
                          : 'text-slate-400 hover:text-amber-300 border-sky-700/40 hover:border-sky-500'
                      }`}
                      title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#08152b] border border-sky-900/40 space-y-3">
            <span className="text-3xl">🔍</span>
            <h4 className="text-white font-bold text-sm">Tidak ada prompt yang cocok</h4>
            <p className="text-xs text-slate-400">
              Coba gunakan kata kunci lain atau ubah kategori ke "SEMUA KATEGORI".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('SEMUA KATEGORI');
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Live Preview Modal */}
      {activePreviewPrompt && (
        <LivePreviewModal
          prompt={activePreviewPrompt}
          onClose={() => setActivePreviewPrompt(null)}
        />
      )}
    </div>
  );
};
