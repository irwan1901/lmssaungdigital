import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Play,
  FileText,
  Code2,
  Image,
  Download,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Eye,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { SpotlightGlowCard } from './SpotlightGlowCard';
import { LearningMaterial, MaterialCategory, MemberUser } from '../types';

interface MaterialCatalogProps {
  materials: LearningMaterial[];
  currentUser: MemberUser | null;
  onSelectMaterial: (material: LearningMaterial) => void;
  onToggleBookmark: (materialId: string) => void;
  onToggleCompleted: (materialId: string) => void;
  accentColor?: 'emerald' | 'cyan' | 'amber';
}

const CATEGORIES: ('Semua' | MaterialCategory)[] = [
  'Semua',
  'Tutorial Video',
  'Artikel & Modul',
  'HTML & Kode',
  'Grafis & Desain',
  'File Pendukung',
];

export const MaterialCatalog: React.FC<MaterialCatalogProps> = ({
  materials,
  currentUser,
  onSelectMaterial,
  onToggleBookmark,
  onToggleCompleted,
  accentColor = 'emerald',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | MaterialCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');
  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'order' | 'newest' | 'popular'>('order');

  const activeCategoryClasses = React.useMemo(() => {
    switch (accentColor) {
      case 'amber':
        return 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20';
      case 'cyan':
        return 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20';
      case 'emerald':
      default:
        return 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20';
    }
  }, [accentColor]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      // Must be published unless admin
      if (!m.isPublished && currentUser?.role !== 'admin') return false;

      // Category filter
      if (selectedCategory !== 'Semua' && m.category !== selectedCategory) return false;

      // Level filter
      if (selectedLevel !== 'Semua' && m.level !== selectedLevel) return false;

      // Bookmark filter
      if (filterBookmarkOnly && !currentUser?.bookmarkedMaterials.includes(m.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = m.title.toLowerCase().includes(query);
        const inDesc = m.description.toLowerCase().includes(query);
        const inTags = m.tags.some((t) => t.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      return a.order - b.order;
    });
  }, [materials, selectedCategory, selectedLevel, filterBookmarkOnly, searchQuery, sortBy, currentUser]);

  // Compute member learning progress
  const completedCount = currentUser
    ? materials.filter((m) => currentUser.completedMaterials.includes(m.id)).length
    : 0;
  const progressPercent = materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  // Icon helper per type
  const getTypeIcon = (type: LearningMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Play className="w-3.5 h-3.5 text-rose-400" />;
      case 'html':
        return <Code2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'article':
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-purple-400" />;
      case 'file':
        return <Download className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Member Progress Bar (if logged in) */}
      {currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#09152a] border border-sky-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-sky-950/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Progress Belajar Anda
              </span>
              <span className="text-xs text-slate-400">({currentUser.name})</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-white">
              {completedCount} dari {materials.length} materi telah dipelajari ({progressPercent}%)
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Mulai</span>
              <span>100% Selesai</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi berdasarkan judul, topik, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#09152b] border border-sky-800/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Bersihkan
              </button>
            )}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs bg-[#09152b] border border-sky-800/40 rounded-lg text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="Pemula">Pemula</option>
              <option value="Menengah">Menengah</option>
              <option value="Lanjutan">Lanjutan</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-[#09152b] border border-sky-800/40 rounded-lg text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="order">Urutan Kurikulum</option>
              <option value="newest">Terbaru</option>
              <option value="popular">Paling Populer</option>
            </select>

            {currentUser && (
              <button
                onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
                className={`px-3 py-2 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filterBookmarkOnly
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-[#09152b] text-slate-300 border-sky-800/40 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tersimpan</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs / Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? activeCategoryClasses
                  : 'bg-[#09152b] text-slate-300 hover:text-white border border-sky-900/30 hover:border-sky-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#081224] border border-dashed border-slate-700 space-y-3">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">Tidak ada materi yang cocok</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat modul lainnya.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setSelectedLevel('Semua');
              setFilterBookmarkOnly(false);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => {
            const isCompleted = currentUser?.completedMaterials.includes(mat.id) || false;
            const isBookmarked = currentUser?.bookmarkedMaterials.includes(mat.id) || false;

            return (
              <SpotlightGlowCard
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                glowColor={accentColor}
                spotlightSize={320}
                className="shadow-lg shadow-sky-950/30"
                innerClassName="flex flex-col justify-between bg-gradient-to-b from-[#0b172e] to-[#071122] p-5 h-full"
              >
                {/* Top Row: Category & Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f2142] text-amber-300 border border-amber-400/20">
                      {getTypeIcon(mat.type)}
                      <span>{mat.category}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <span
                          title="Materi Selesai Dipelajari"
                          className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}

                      {currentUser && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(mat.id);
                          }}
                          title={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                    {mat.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                {/* Bottom Row: Metadata & Action */}
                <div className="pt-4 mt-4 border-t border-sky-900/30 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-sky-400 font-medium">{mat.level}</span>
                    <span>·</span>
                    <span className="text-[11px]">{mat.duration || '5 Min'}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sky-400 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Buka Materi</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </SpotlightGlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
