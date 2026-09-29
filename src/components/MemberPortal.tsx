import React, { useState } from 'react';
import {
  User,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Wrench,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Award,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { LearningMaterial, MemberUser } from '../types';
import { PromptLibrary } from './PromptLibrary';
import { MemberTools } from './MemberTools';
import { SpotlightGlowCard } from './SpotlightGlowCard';
import { SaungDigitalLogo } from './SaungDigitalLogo';
import { loadAssetFromIndexedDB } from '../services/storageHelper';
import { PromptItem, ToolItem, PlatformSettings } from '../types';

interface MemberPortalProps {
  currentUser: MemberUser | null;
  materials: LearningMaterial[];
  activeTab: 'learning' | 'prompts' | 'tools';
  onTabChange: (tab: 'learning' | 'prompts' | 'tools') => void;
  onSelectMaterial: (material: LearningMaterial) => void;
  onToggleBookmark: (materialId: string) => void;
  onToggleCompleted: (materialId: string) => void;
  onOpenLoginModal: () => void;
  onNavigateCatalog: () => void;
  onLogout?: () => void;
  bannerImageUrl?: string;
  accentColor?: 'emerald' | 'cyan' | 'amber';
  prompts?: PromptItem[];
  tools?: ToolItem[];
  settings?: PlatformSettings;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  currentUser,
  materials,
  activeTab,
  onTabChange,
  onSelectMaterial,
  onToggleBookmark,
  onToggleCompleted,
  onOpenLoginModal,
  onNavigateCatalog,
  onLogout,
  bannerImageUrl,
  accentColor = 'emerald',
  prompts,
  tools,
  settings,
}) => {
  const [imageError, setImageError] = useState(false);
  const [dbBanner, setDbBanner] = useState<string>('');

  const activeTabClasses = React.useMemo(() => {
    switch (accentColor) {
      case 'amber':
        return 'bg-amber-950/60 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10';
      case 'cyan':
        return 'bg-sky-950/60 text-sky-300 border border-sky-500/50 shadow-md shadow-sky-500/10';
      case 'emerald':
      default:
        return 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/10';
    }
  }, [accentColor]);

  React.useEffect(() => {
    let isMounted = true;
    if (bannerImageUrl === '__indexeddb_banner__') {
      loadAssetFromIndexedDB('banner_image').then((val) => {
        if (isMounted && val) setDbBanner(val);
      });
    } else {
      setDbBanner('');
    }
    return () => {
      isMounted = false;
    };
  }, [bannerImageUrl]);

  // Active banner from prop or IndexedDB with default artwork fallback
  const activeBanner = React.useMemo(() => {
    if (bannerImageUrl === '__indexeddb_banner__') return dbBanner || '/saung_digital_artwork.svg';
    if (bannerImageUrl && bannerImageUrl.trim() !== '') return bannerImageUrl;
    return dbBanner || '/saung_digital_artwork.svg';
  }, [bannerImageUrl, dbBanner]);

  React.useEffect(() => {
    setImageError(false);
  }, [activeBanner]);
  // Local state for the learning sub-tab
  const [learningFilter, setLearningFilter] = useState<'all' | 'bookmarks' | 'completed' | 'notes'>('all');
  const [learningSearch, setLearningSearch] = useState('');

  // Default display user matching screenshot if guest
  const userName = currentUser ? currentUser.name : 'irwan ahmad';
  const userHandle = currentUser ? currentUser.email.split('@')[0] : 'irwanahmad19';
  const userInitial = userName.charAt(0).toUpperCase();

  // Calculate statistics
  const completedIds = currentUser?.completedMaterials || [];
  const bookmarkIds = currentUser?.bookmarkedMaterials || [];
  const notesMap = currentUser?.notes || {};

  const completedMaterials = materials.filter((m) => completedIds.includes(m.id));
  const bookmarkedMaterials = materials.filter((m) => bookmarkIds.includes(m.id));
  const notedMaterials = materials.filter((m) => !!notesMap[m.id]);

  const completionPercentage = materials.length > 0
    ? Math.round((completedMaterials.length / materials.length) * 100)
    : 0;

  // Filtered materials for "Materi & Progres Belajar" tab
  const displayedMaterials = materials.filter((m) => {
    if (learningFilter === 'bookmarks' && !bookmarkIds.includes(m.id)) return false;
    if (learningFilter === 'completed' && !completedIds.includes(m.id)) return false;
    if (learningFilter === 'notes' && !notesMap[m.id]) return false;

    if (learningSearch.trim()) {
      const q = learningSearch.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchCategory = m.category.toLowerCase().includes(q);
      const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCategory || matchTags;
    }

    return true;
  });

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* ======================================================== */}
      {/* 1. TOP HERO CARD: Matches Screenshot (9).png exactly      */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172f] via-[#091f3d] to-[#061427] border border-sky-600/30 p-6 sm:p-8 shadow-2xl shadow-sky-950/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-stretch gap-6">
          {/* Brand Logo Mascot or Uploaded Custom Image from Settings */}
          <div className="shrink-0 flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#061021]/90 border border-sky-500/40 shadow-inner w-full md:w-56 lg:w-64 md:self-stretch min-h-[140px] md:min-h-[180px]">
            {activeBanner && !imageError ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={activeBanner}
                  alt="Logo Saung Digital"
                  className="w-full h-full max-h-48 object-contain rounded-xl drop-shadow-md"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <SaungDigitalLogo size="hero" showText={true} />
              </div>
            )}
          </div>

          {/* Titles & Badges */}
          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-extrabold tracking-wider text-amber-400 uppercase">
              SAUNG DIGITAL LEARNING CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Materi &amp; Video Pembelajaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Koleksi materi, video YouTube, gambar, dan artikel pembelajaran dalam satu tempat.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-sm">
                Member Access
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-semibold shadow-sm">
                by <strong className="text-amber-400">Saung Digital</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MEMBER ACTION BAR: Tabs on left, User on right        */}
      {/* ======================================================== */}
      <div className="bg-[#091528] border border-sky-900/50 rounded-2xl p-2 sm:p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        {/* Left Side: 3 Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          {/* Tab 1: Materi */}
          <button
            onClick={() => onTabChange('learning')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'learning'
                ? activeTabClasses
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="text-sm">📚</span>
            <span>Materi</span>
            {currentUser && completedMaterials.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
                {completedMaterials.length}
              </span>
            )}
          </button>

          {/* Tab 2: UI Prompt Library */}
          <button
            onClick={() => onTabChange('prompts')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prompts'
                ? activeTabClasses
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="text-amber-400 text-sm">⚡</span>
            <span>UI Prompt Library</span>
          </button>

          {/* Tab 3: Tools */}
          <button
            onClick={() => onTabChange('tools')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tools'
                ? activeTabClasses
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="text-rose-400 text-sm">🧰</span>
            <span>Tools</span>
          </button>
        </div>

        {/* Right Side: User profile info badge & Keluar button */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-sky-900/30">
          <div className="flex items-center gap-2.5">
            {/* Avatar circle with initial (default: 'I' for irwan ahmad) */}
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-black flex items-center justify-center text-xs shadow-sm ring-2 ring-sky-500/20 shrink-0">
              {userInitial}
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white leading-tight">
                  {userName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                  MEMBER
                </span>
              </div>
              <span className="text-[10px] text-slate-400 leading-tight">
                {userHandle}
              </span>
            </div>
          </div>

          {/* Keluar Button */}
          <button
            onClick={handleLogoutClick}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition cursor-pointer"
            title="Keluar dari sesi akun"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TAB 1: MATERI & PROGRES BELAJAR                        */}
      {/* ======================================================== */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          {/* Learning Progress Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#08152b] border border-sky-900/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{completedMaterials.length}</span>
                <p className="text-[11px] text-slate-400 font-medium">Selesai Dipelajari</p>
              </div>
            </div>

            <div className="bg-[#08152b] border border-sky-900/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{bookmarkedMaterials.length}</span>
                <p className="text-[11px] text-slate-400 font-medium">Bookmark Tersimpan</p>
              </div>
            </div>

            <div className="bg-[#08152b] border border-sky-900/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{notedMaterials.length}</span>
                <p className="text-[11px] text-slate-400 font-medium">Catatan Pribadi</p>
              </div>
            </div>

            <div className="bg-[#08152b] border border-sky-900/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{completionPercentage}%</span>
                <p className="text-[11px] text-slate-400 font-medium">Progres Kurikulum</p>
              </div>
            </div>
          </div>

          {/* Sub-Filters and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#08152b] border border-sky-900/40 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                onClick={() => setLearningFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  learningFilter === 'all'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Semua Materi ({materials.length})
              </button>
              <button
                onClick={() => setLearningFilter('bookmarks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  learningFilter === 'bookmarks'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Bookmark ({bookmarkedMaterials.length})
              </button>
              <button
                onClick={() => setLearningFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  learningFilter === 'completed'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Selesai ({completedMaterials.length})
              </button>
              <button
                onClick={() => setLearningFilter('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  learningFilter === 'notes'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Catatan ({notedMaterials.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={learningSearch}
                onChange={(e) => setLearningSearch(e.target.value)}
                placeholder="Cari materi belajar..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#050f1d] border border-sky-800/40 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Materials List */}
          {displayedMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedMaterials.map((mat) => {
                const isCompleted = completedIds.includes(mat.id);
                const isBookmarked = bookmarkIds.includes(mat.id);
                const userNote = notesMap[mat.id];

                return (
                  <SpotlightGlowCard
                    key={mat.id}
                    glowColor="cyan"
                    className="flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
                          {mat.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleBookmark(mat.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isBookmarked
                                ? 'text-amber-400 bg-amber-950/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => onToggleCompleted(mat.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isCompleted
                                ? 'text-emerald-400 bg-emerald-950/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title={isCompleted ? 'Tandai belum selesai' : 'Tandai sudah selesai'}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                        {mat.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {mat.description}
                      </p>

                      {userNote && (
                        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                          <strong className="block text-amber-300 font-semibold mb-0.5">Catatan Saya:</strong>
                          <span className="line-clamp-2">{userNote}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 pt-0 border-t border-sky-900/30 mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Durasi: {mat.duration}
                      </span>
                      <button
                        onClick={() => onSelectMaterial(mat)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Buka Materi</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </SpotlightGlowCard>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center rounded-2xl bg-[#08152b] border border-sky-900/40 space-y-3">
              <span className="text-3xl">📚</span>
              <h4 className="text-white font-bold text-sm">Tidak ada materi yang ditemukan</h4>
              <p className="text-xs text-slate-400">
                {learningFilter === 'bookmarks'
                  ? 'Anda belum menandai bookmark materi apapun.'
                  : learningFilter === 'completed'
                  ? 'Belum ada materi yang ditandai selesai.'
                  : 'Coba ubah kata kunci pencarian Anda.'}
              </p>
              <button
                onClick={onNavigateCatalog}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Jelajahi Katalog Lengkap
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 2: UI PROMPT LIBRARY (Exact Screenshot match)      */}
      {/* ======================================================== */}
      {activeTab === 'prompts' && (
        <PromptLibrary
          currentUser={currentUser}
          onOpenLoginModal={onOpenLoginModal}
          prompts={prompts}
          config={settings?.promptLibraryConfig}
          customLogoUrl={activeBanner}
        />
      )}

      {/* ======================================================== */}
      {/* 5. TAB 3: TOOLS                                          */}
      {/* ======================================================== */}
      {activeTab === 'tools' && (
        <MemberTools
          tools={tools}
          config={settings?.memberToolsConfig}
        />
      )}
    </div>
  );
};
