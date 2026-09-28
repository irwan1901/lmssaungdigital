import React from 'react';
import { User, Settings, ArrowRight, BookOpen, Play, CheckCircle2, X } from 'lucide-react';
import { SaungDigitalLogo } from './SaungDigitalLogo';
import { SpotlightGlowCard } from './SpotlightGlowCard';
import { MemberUser, PlatformSettings } from '../types';
import { loadAssetFromIndexedDB } from '../services/storageHelper';

interface HeroReferenceProps {
  onOpenLoginModal: () => void;
  onOpenAdminModal: () => void;
  currentUser: MemberUser | null;
  onNavigateCatalog: () => void;
  onNavigateMember?: (tab: 'learning' | 'prompts' | 'tools') => void;
  materialsCount?: number;
  bannerImageUrl?: string;
  accentColor?: 'emerald' | 'cyan' | 'amber';
  platformSettings?: PlatformSettings;
}

export const HeroReference: React.FC<HeroReferenceProps> = ({
  onOpenLoginModal,
  onOpenAdminModal,
  currentUser,
  onNavigateCatalog,
  onNavigateMember,
  bannerImageUrl,
  accentColor = 'emerald',
  platformSettings,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [dbBanner, setDbBanner] = React.useState<string>('');

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

  // Pick up image from prop or IndexedDB fallback, defaulting to the Saung Digital artwork
  const activeBanner = React.useMemo(() => {
    if (bannerImageUrl === '__indexeddb_banner__') return dbBanner || '/saung_digital_artwork.svg';
    if (bannerImageUrl && bannerImageUrl.trim() !== '') return bannerImageUrl;
    return dbBanner || '/saung_digital_artwork.svg';
  }, [bannerImageUrl, dbBanner]);

  React.useEffect(() => {
    setImageError(false);
  }, [activeBanner]);

  const [showImageModal, setShowImageModal] = React.useState(false);

  // Dynamic theme styling matching the chosen accent color
  const theme = React.useMemo(() => {
    switch (accentColor) {
      case 'amber':
        return {
          glow: 'amber' as const,
          accentText: 'text-amber-400',
          accentTextLight: 'text-amber-300',
          badgeBg: 'bg-amber-400 text-slate-950 shadow-amber-400/20',
          ambientLight: 'bg-amber-500/10',
          heroBorder: 'border-amber-500/30',
          primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/25',
          stepBadge: 'bg-amber-400 text-slate-950 shadow-amber-400/20',
          catalogBtn: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/40 hover:border-amber-400',
        };
      case 'cyan':
        return {
          glow: 'cyan' as const,
          accentText: 'text-sky-400',
          accentTextLight: 'text-sky-300',
          badgeBg: 'bg-sky-400 text-slate-950 shadow-sky-400/20',
          ambientLight: 'bg-sky-500/10',
          heroBorder: 'border-sky-500/30',
          primaryBtn: 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25',
          stepBadge: 'bg-sky-400 text-slate-950 shadow-sky-400/20',
          catalogBtn: 'border-sky-500/40 text-sky-300 hover:bg-sky-950/40 hover:border-sky-400',
        };
      case 'emerald':
      default:
        return {
          glow: 'emerald' as const,
          accentText: 'text-emerald-400',
          accentTextLight: 'text-emerald-300',
          badgeBg: 'bg-emerald-400 text-slate-950 shadow-emerald-400/20',
          ambientLight: 'bg-emerald-500/10',
          heroBorder: 'border-emerald-500/30',
          primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25',
          stepBadge: 'bg-emerald-400 text-slate-950 shadow-emerald-400/20',
          catalogBtn: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-400',
        };
    }
  }, [accentColor]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. TOP HERO CARD (Matches Screenshot 11)                                  */}
      {/* ========================================================================= */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172f] via-[#091f3d] to-[#061427] border ${theme.heroBorder} p-6 sm:p-10 shadow-2xl shadow-sky-950/40 transition-colors duration-300`}>
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 ${theme.ambientLight} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-stretch gap-6 sm:gap-8">
          {/* Left: Mascot Logo or Uploaded Custom Image from Settings */}
          <div
            onClick={() => activeBanner && !imageError && setShowImageModal(true)}
            className={`shrink-0 flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#061021]/90 border border-sky-500/40 shadow-inner w-full md:w-72 lg:w-80 md:self-stretch min-h-[180px] md:min-h-[230px] group relative overflow-hidden ${
              activeBanner && !imageError ? 'cursor-pointer' : ''
            }`}
            title={activeBanner && !imageError ? 'Klik untuk memperbesar gambar' : undefined}
          >
            {activeBanner && !imageError ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={activeBanner}
                  alt="Artwork Saung Digital"
                  className="w-full h-full max-h-60 object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/60 text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md">
                  <span>Perbesar</span>
                  <span className="text-sky-400">🔍</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <SaungDigitalLogo size="hero" showText={true} />
              </div>
            )}
          </div>

          {/* Right: Titles, Badges, and Login Buttons */}
          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            <span className={`text-[11px] font-extrabold tracking-wider ${theme.accentText} uppercase transition-colors duration-300`}>
              {platformSettings?.platformName || 'SAUNG DIGITAL'} LEARNING CENTER
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Materi &amp; Video Pembelajaran
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {platformSettings?.portalDescription || 'Koleksi materi, video YouTube, gambar, dan artikel pembelajaran dalam satu tempat.'}
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className={`px-3.5 py-1 rounded-full font-black text-xs shadow-sm transition-colors duration-300 ${theme.badgeBg}`}>
                Member Access
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-semibold shadow-sm">
                by <strong className={`${theme.accentText} transition-colors duration-300`}>{platformSettings?.platformName || 'Saung Digital'}</strong>
              </span>
            </div>

            {/* Action Buttons Row matching Screenshot 11 */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenLoginModal}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${theme.primaryBtn}`}
              >
                <User className="w-4 h-4 fill-current" />
                <span>Login Member</span>
              </button>

              <button
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Login Admin</span>
              </button>

              <button
                onClick={onNavigateCatalog}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${theme.catalogBtn}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Katalog Materi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FLOW CARD: "SAUNG LEARNING FLOW" (Matches Screenshot 11)                */}
      {/* ========================================================================= */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07172f] via-[#091f3d] to-[#061427] border ${theme.heroBorder} p-6 sm:p-10 shadow-2xl shadow-sky-950/40 transition-colors duration-300`}>
        <div className="space-y-2 mb-6">
          <span className={`text-[11px] font-extrabold tracking-wider ${theme.accentText} uppercase transition-colors duration-300`}>
            SAUNG LEARNING FLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Belajar lebih terarah, semuanya dalam satu tempat.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Masuk sebagai member, pilih materi yang tersedia, lalu pelajari video, artikel, HTML, gambar, dan file pendukung sesuai kebutuhan.
          </p>
        </div>

        {/* 3 Connected Flow Steps in Landscape Layout with Dynamic Accent Spotlight Glow */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 pt-2">
          {/* Step 1 */}
          <SpotlightGlowCard
            glowColor={theme.glow}
            spotlightSize={260}
            className="flex-1 shadow-lg shadow-sky-950/30"
            innerClassName="bg-[#061224]/90 p-5 sm:p-6 flex items-center gap-4 select-none cursor-default h-full rounded-2xl"
          >
            <div className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-base shrink-0 shadow-md transition-colors duration-300 ${theme.stepBadge}`}>
              01
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Login Member
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Masuk menggunakan akun yang diberikan admin.
              </p>
            </div>
          </SpotlightGlowCard>

          {/* Arrow 1 */}
          <div className="hidden lg:flex items-center justify-center text-slate-500 font-bold text-xl px-1 select-none shrink-0">
            →
          </div>

          {/* Step 2 */}
          <SpotlightGlowCard
            glowColor={theme.glow}
            spotlightSize={260}
            className="flex-1 shadow-lg shadow-sky-950/30"
            innerClassName="bg-[#061224]/90 p-5 sm:p-6 flex items-center gap-4 select-none cursor-default h-full rounded-2xl"
          >
            <div className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-base shrink-0 shadow-md transition-colors duration-300 ${theme.stepBadge}`}>
              02
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Pilih Materi
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cari materi berdasarkan judul atau kategori.
              </p>
            </div>
          </SpotlightGlowCard>

          {/* Arrow 2 */}
          <div className="hidden lg:flex items-center justify-center text-slate-500 font-bold text-xl px-1 select-none shrink-0">
            →
          </div>

          {/* Step 3 */}
          <SpotlightGlowCard
            glowColor={theme.glow}
            spotlightSize={260}
            className="flex-1 shadow-lg shadow-sky-950/30"
            innerClassName="bg-[#061224]/90 p-5 sm:p-6 flex items-center gap-4 select-none cursor-default h-full rounded-2xl"
          >
            <div className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-base shrink-0 shadow-md transition-colors duration-300 ${theme.stepBadge}`}>
              03
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Mulai Belajar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tonton video, baca artikel, dan buka file pendukung.
              </p>
            </div>
          </SpotlightGlowCard>
        </div>
      </section>

      {/* Image Detail Lightbox Modal */}
      {showImageModal && activeBanner && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#071324] border border-sky-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-sky-950/80 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Artwork Resmi Saung Digital</h3>
                <p className="text-xs text-slate-400">Kolaborasi • Inovasi • Teknologi • Masa Depan</p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/50 border border-sky-900/30 flex items-center justify-center max-h-[70vh]">
              <img
                src={activeBanner}
                alt="Artwork Saung Digital"
                className="w-full h-auto max-h-[68vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
