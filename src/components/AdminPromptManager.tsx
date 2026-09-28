import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  Sparkles,
  Sliders,
  RotateCcw,
  Play,
  X,
  Check,
  ChevronDown,
  Tag,
  Code,
  Layers,
  HelpCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { PromptItem, PromptLibraryConfig } from '../types';
import { LivePreviewModal } from './LivePreviewModal';

interface AdminPromptManagerProps {
  prompts: PromptItem[];
  promptConfig?: PromptLibraryConfig;
  onSavePrompt: (prompt: PromptItem) => void;
  onDeletePrompt: (promptId: string) => void;
  onResetPrompts: () => void;
  onUpdateConfig: (config: PromptLibraryConfig) => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminPromptManager: React.FC<AdminPromptManagerProps> = ({
  prompts,
  promptConfig,
  onSavePrompt,
  onDeletePrompt,
  onResetPrompts,
  onUpdateConfig,
  onRequestConfirmDelete,
  showToast,
}) => {
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA KATEGORI');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<PromptItem | null>(null);

  // Editing state
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [formNumberTag, setFormNumberTag] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTargetRole, setFormTargetRole] = useState('Creative Developer');
  const [formDescription, setFormDescription] = useState('');
  const [formPromptText, setFormPromptText] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formPreviewType, setFormPreviewType] = useState<
    'matrix' | 'grid' | 'starfield' | 'particles' | 'glow-card' | 'generic'
  >('matrix');
  const [formVariables, setFormVariables] = useState<
    { name: string; defaultValue: string; description: string }[]
  >([]);

  // Config Form State
  const [configHeaderTitle, setConfigHeaderTitle] = useState(
    promptConfig?.headerTitle || 'Prompt UI & Web Interaktif'
  );
  const [configHeaderSubtitle, setConfigHeaderSubtitle] = useState(
    promptConfig?.headerSubtitle ||
      'Koleksi prompt spesifik dan siap copy untuk ChatGPT, Gemini, Claude, Antigravity, serta AI coding lainnya.'
  );
  const [configBadgeText, setConfigBadgeText] = useState(
    promptConfig?.badgeText || 'SAUNG DIGITAL UI PROMPT LIBRARY'
  );
  const [configCategories, setConfigCategories] = useState<string[]>(() => {
    const raw =
      promptConfig?.categories && promptConfig.categories.length > 0
        ? promptConfig.categories
        : [
            'SEMUA KATEGORI',
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
          ];
    const withoutAll = raw.filter((c) => c.trim().toUpperCase() !== 'SEMUA KATEGORI');
    return ['SEMUA KATEGORI', ...withoutAll];
  });
  const [newCatInput, setNewCatInput] = useState('');

  // Categories list for filter & select - SEMUA KATEGORI always at the top
  const availableCategories = useMemo(() => {
    const withoutAll = configCategories.filter((c) => c.trim().toUpperCase() !== 'SEMUA KATEGORI');
    return ['SEMUA KATEGORI', ...withoutAll];
  }, [configCategories]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Category filter
      if (selectedCategory !== 'SEMUA KATEGORI') {
        const catA = p.category.toLowerCase().trim();
        const catB = selectedCategory.toLowerCase().trim();
        if (catA !== catB && !catA.includes(catB) && !catB.includes(catA)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchNum = p.numberTag?.toLowerCase().includes(q) || false;
        const matchCat = p.category.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchTag || matchNum || matchCat;
      }

      return true;
    });
  }, [prompts, selectedCategory, searchQuery]);

  // Open modal to add prompt
  const handleOpenAddPrompt = () => {
    setEditingPromptId(null);
    const nextNumber = `#${String(prompts.length + 21).padStart(3, '0')}`;
    setFormNumberTag(nextNumber);
    setFormTitle('');
    const firstRealCategory =
      configCategories.find((c) => c.toUpperCase() !== 'SEMUA KATEGORI') || 'INTERACTIVE BACKGROUND';
    setFormCategory(firstRealCategory);
    setFormTargetRole('Creative Developer');
    setFormDescription('');
    setFormPromptText('');
    setFormTags('UI, Web, AI');
    setFormPreviewType('matrix');
    setFormVariables([]);
    setIsEditorOpen(true);
  };

  // Open modal to edit prompt
  const handleOpenEditPrompt = (prompt: PromptItem) => {
    setEditingPromptId(prompt.id);
    setFormNumberTag(prompt.numberTag || '');
    setFormTitle(prompt.title);
    setFormCategory(prompt.category);
    setFormTargetRole(prompt.targetRole || 'Creative Developer');
    setFormDescription(prompt.description);
    setFormPromptText(prompt.promptText);
    setFormTags(prompt.tags.join(', '));
    setFormPreviewType(prompt.previewType || 'matrix');
    setFormVariables(prompt.variables ? [...prompt.variables] : []);
    setIsEditorOpen(true);
  };

  // Duplicate prompt
  const handleDuplicatePrompt = (prompt: PromptItem) => {
    const newId = `pr-${Date.now().toString(36)}`;
    const duplicated: PromptItem = {
      ...prompt,
      id: newId,
      numberTag: `#${String(prompts.length + 21).padStart(3, '0')}`,
      title: `${prompt.title} (Salinan)`,
      isCustom: true,
    };
    onSavePrompt(duplicated);
    showToast?.('success', `Prompt "${duplicated.title}" berhasil disalin.`);
  };

  // Save prompt
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast?.('error', 'Judul prompt wajib diisi.');
      return;
    }
    if (!formPromptText.trim()) {
      showToast?.('error', 'Isi prompt template wajib diisi.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const promptData: PromptItem = {
      id: editingPromptId || `pr-${Date.now().toString(36)}`,
      numberTag: formNumberTag.trim() || undefined,
      title: formTitle.trim(),
      category: formCategory.trim() || 'INTERACTIVE BACKGROUND',
      targetRole: formTargetRole.trim() || 'Creative Developer',
      description: formDescription.trim(),
      promptText: formPromptText.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['UI/UX', 'AI'],
      previewType: formPreviewType,
      variables: formVariables.length > 0 ? formVariables : undefined,
      isCustom: true,
    };

    onSavePrompt(promptData);
    setIsEditorOpen(false);
    showToast?.(
      'success',
      editingPromptId
        ? `Prompt "${promptData.title}" berhasil diperbarui.`
        : `Prompt baru "${promptData.title}" berhasil ditambahkan.`
    );
  };

  // Delete prompt handler
  const handleDeleteClick = (prompt: PromptItem) => {
    onRequestConfirmDelete(
      'Hapus Item Prompt',
      `Apakah Anda yakin ingin menghapus prompt "${prompt.title}" (${prompt.numberTag || prompt.id}) dari koleksi member?`,
      () => {
        onDeletePrompt(prompt.id);
        showToast?.('info', `Prompt "${prompt.title}" telah dihapus.`);
      }
    );
  };

  // Add variable in editor
  const handleAddVariable = () => {
    setFormVariables((prev) => [
      ...prev,
      { name: `Var${prev.length + 1}`, defaultValue: '', description: '' },
    ]);
  };

  // Remove variable
  const handleRemoveVariable = (index: number) => {
    setFormVariables((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Config
  const handleSaveConfig = () => {
    const withoutAll = configCategories.filter((c) => c.trim().toUpperCase() !== 'SEMUA KATEGORI');
    const updated: PromptLibraryConfig = {
      headerTitle: configHeaderTitle.trim() || 'Prompt UI & Web Interaktif',
      headerSubtitle: configHeaderSubtitle.trim(),
      badgeText: configBadgeText.trim() || 'SAUNG DIGITAL UI PROMPT LIBRARY',
      categories: ['SEMUA KATEGORI', ...withoutAll],
    };
    onUpdateConfig(updated);
    setIsConfigOpen(false);
    showToast?.('success', 'Konfigurasi UI Prompt Library berhasil disimpan.');
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const catUpper = newCatInput.trim().toUpperCase();
    if (configCategories.includes(catUpper)) {
      showToast?.('info', 'Kategori tersebut sudah ada.');
      return;
    }
    setConfigCategories((prev) => [...prev, catUpper]);
    setNewCatInput('');
  };

  const handleRemoveCategory = (cat: string) => {
    if (configCategories.length <= 1) {
      showToast?.('error', 'Minimal harus ada 1 kategori.');
      return;
    }
    setConfigCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="p-5 rounded-2xl bg-[#09172f]/80 border border-sky-800/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Manajemen UI Prompt Library Member
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kelola template prompt rekayasa AI, kategori visual, target peran developer, dan kustomisasi antarmuka library yang dapat diakses oleh member.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold border border-sky-800/40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Kustomisasi UI &amp; Kategori</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onRequestConfirmDelete(
                'Reset Koleksi Prompt',
                'Apakah Anda yakin ingin mengatur ulang seluruh prompt ke 10+ prompt template bawaan Saung Digital? Seluruh prompt kustom yang ditambahkan akan dihapus.',
                () => {
                  onResetPrompts();
                  showToast?.('info', 'Koleksi prompt telah dikembalikan ke bawaan.');
                }
              );
            }}
            className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddPrompt}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prompt Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prompt berdasarkan judul, tag, nomor #021, atau deskripsi..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#061021] border border-sky-800/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-[240px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#061021] border border-sky-800/60 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-sky-400 cursor-pointer uppercase appearance-none pr-9 tracking-wide"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#071326] text-white">
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Prompts Counter & Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Menampilkan <strong className="text-white font-bold">{filteredPrompts.length}</strong> dari{' '}
          <strong className="text-amber-400 font-bold">{prompts.length}</strong> total prompt di library
        </div>
        <div className="text-[11px] text-slate-500">
          Klik tombol Preview (<Play className="w-2.5 h-2.5 inline text-amber-400" />) untuk menguji animasi visual
        </div>
      </div>

      {/* Prompts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-[#08152b] border border-sky-900/40 hover:border-sky-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all shadow-lg hover:shadow-sky-950/40 group relative"
          >
            {/* Header of Card */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {prompt.numberTag && (
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {prompt.numberTag}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                    {prompt.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {prompt.targetRole}
                  </span>
                  {prompt.previewType && (
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>{prompt.previewType}</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors pt-1">
                  {prompt.title}
                </h4>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewPrompt(prompt)}
                  title="Uji Live Preview"
                  className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicatePrompt(prompt)}
                  title="Duplikasi Prompt"
                  className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/40 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditPrompt(prompt)}
                  title="Edit Prompt"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(prompt)}
                  title="Hapus Prompt"
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {prompt.description}
            </p>

            {/* Prompt snippet preview */}
            <div className="bg-[#050c18] border border-sky-950 rounded-xl p-2.5 font-mono text-[11px] text-slate-400 line-clamp-2 whitespace-pre-wrap select-none">
              {prompt.promptText}
            </div>

            {/* Tags & Variables Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-sky-950/80 text-[11px] text-slate-500">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-500" />
                {prompt.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
                    #{tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="text-[10px] text-slate-600">+{prompt.tags.length - 3}</span>
                )}
              </div>

              {prompt.variables && prompt.variables.length > 0 && (
                <div className="text-amber-400/80 font-mono text-[10px]">
                  {prompt.variables.length} variabel kustom
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12 bg-[#08152b]/50 border border-sky-900/30 rounded-2xl space-y-3">
          <p className="text-slate-400 text-sm">Tidak ada prompt yang cocok dengan filter atau kata kunci.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('SEMUA KATEGORI');
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL: EDIT / TAMBAH PROMPT                                            */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#08152b] border border-sky-600/40 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 relative">
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingPromptId ? 'Edit Prompt Template' : 'Tambah Prompt Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPrompt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Nomor / Tag ID</label>
                  <input
                    type="text"
                    value={formNumberTag}
                    onChange={(e) => setFormNumberTag(e.target.value)}
                    placeholder="#021"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300">
                    Judul Prompt <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="misal: Matrix Digital Rain Effect"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    {configCategories
                      .filter((c) => c.trim().toUpperCase() !== 'SEMUA KATEGORI')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Target Role</label>
                  <input
                    type="text"
                    value={formTargetRole}
                    onChange={(e) => setFormTargetRole(e.target.value)}
                    placeholder="Creative Developer"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tipe Visual Preview</label>
                  <select
                    value={formPreviewType}
                    onChange={(e) =>
                      setFormPreviewType(
                        e.target.value as
                          | 'matrix'
                          | 'grid'
                          | 'starfield'
                          | 'particles'
                          | 'glow-card'
                          | 'generic'
                      )
                    }
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="matrix">Matrix Rain</option>
                    <option value="grid">Cyber Grid</option>
                    <option value="starfield">Starfield 3D</option>
                    <option value="particles">Neon Particles</option>
                    <option value="glow-card">Glow Card UI</option>
                    <option value="generic">Generic Code</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ringkasan tentang kegunaan prompt ini..."
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>
                    Template Isi Prompt Lengkap <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Gunakan placeholder format {'{NamaVariabel}'}
                  </span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formPromptText}
                  onChange={(e) => setFormPromptText(e.target.value)}
                  placeholder="Act as a Principal Engineer...&#10;Create a component with requirements:&#10;1. Visual: ...&#10;2. Integration: ..."
                  className="w-full px-3.5 py-2.5 bg-[#040914] border border-sky-800/60 rounded-xl text-xs font-mono text-sky-200 focus:outline-none focus:border-sky-400 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Tag Pencarian (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Canvas, Animation, 3D, Cyberpunk"
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Dynamic Variables Section */}
              <div className="space-y-2 pt-2 border-t border-sky-950">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Variabel Pengubah Prompt (Opsional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariable}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Variabel</span>
                  </button>
                </div>

                {formVariables.map((variable, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#050c18] rounded-xl border border-sky-950">
                    <input
                      type="text"
                      placeholder="Nama: misal GlowColor"
                      value={variable.name}
                      onChange={(e) => {
                        const updated = [...formVariables];
                        updated[idx].name = e.target.value;
                        setFormVariables(updated);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#08152b] border border-sky-800/40 rounded-lg text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Nilai Awal: #00ff66"
                      value={variable.defaultValue}
                      onChange={(e) => {
                        const updated = [...formVariables];
                        updated[idx].defaultValue = e.target.value;
                        setFormVariables(updated);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#08152b] border border-sky-800/40 rounded-lg text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-sky-900/40">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingPromptId ? 'Simpan Perubahan' : 'Tambahkan ke Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: KUSTOMISASI UI & KATEGORI                                       */}
      {/* ========================================================================= */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#08152b] border border-sky-600/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 relative">
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  Kustomisasi UI &amp; Kategori Prompt Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Judul Header Banner (Hero Title)
                </label>
                <input
                  type="text"
                  value={configHeaderTitle}
                  onChange={(e) => setConfigHeaderTitle(e.target.value)}
                  placeholder="Prompt UI & Web Interaktif"
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Badge Text (Atas Judul)
                </label>
                <input
                  type="text"
                  value={configBadgeText}
                  onChange={(e) => setConfigBadgeText(e.target.value)}
                  placeholder="SAUNG DIGITAL UI PROMPT LIBRARY"
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Deskripsi / Subtitle Hero Banner
                </label>
                <textarea
                  rows={2}
                  value={configHeaderSubtitle}
                  onChange={(e) => setConfigHeaderSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Category Management */}
              <div className="space-y-2 pt-2 border-t border-sky-950">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Daftar Kategori Prompt ({configCategories.length})
                </label>

                {/* Add new category inline */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                    placeholder="Tambah kategori baru (misal: THREE.JS 3D)"
                    className="flex-1 px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Categories pills */}
                <div className="max-h-48 overflow-y-auto p-2 bg-[#050c18] rounded-xl border border-sky-950 flex flex-wrap gap-1.5">
                  {configCategories.map((cat) => (
                    <div
                      key={cat}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-medium border ${
                        cat === 'SEMUA KATEGORI'
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 font-bold'
                          : 'bg-sky-950/80 border-sky-800/40 text-sky-200'
                      }`}
                    >
                      <span>{cat}</span>
                      {cat === 'SEMUA KATEGORI' ? (
                        <span className="text-[9px] text-amber-400/80 uppercase font-sans">(Atas)</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat)}
                          className="text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                          title="Hapus Kategori"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-sky-900/40">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: LIVE PREVIEW PROMPT                                             */}
      {/* ========================================================================= */}
      {previewPrompt && (
        <LivePreviewModal
          prompt={previewPrompt}
          onClose={() => setPreviewPrompt(null)}
        />
      )}
    </div>
  );
};
