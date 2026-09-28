import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  Wrench,
  Sliders,
  RotateCcw,
  Play,
  X,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import { ToolItem, MemberToolsConfig } from '../types';
import { ToolCardBanner } from './ToolCardBanner';
import { ToolViewerModal } from './ToolViewerModal';

interface AdminToolsManagerProps {
  tools: ToolItem[];
  toolsConfig?: MemberToolsConfig;
  onSaveTool: (tool: ToolItem) => void;
  onDeleteTool: (toolId: string) => void;
  onResetTools: () => void;
  onReorderTools?: (tools: ToolItem[]) => void;
  onUpdateConfig: (config: MemberToolsConfig) => void;
  onRequestConfirmDelete: (title: string, message: string, onConfirm: () => void) => void;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminToolsManager: React.FC<AdminToolsManagerProps> = ({
  tools,
  toolsConfig,
  onSaveTool,
  onDeleteTool,
  onResetTools,
  onReorderTools,
  onUpdateConfig,
  onRequestConfirmDelete,
  showToast,
}) => {
  // Search & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [testingTool, setTestingTool] = useState<ToolItem | null>(null);

  // Form State
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formBadge, setFormBadge] = useState('SAUNG ULTIMATE');
  const [formVersionBadge, setFormVersionBadge] = useState('WEB V.1');
  const [formTag, setFormTag] = useState('TOOL / GEMINI GEM');
  const [formCategory, setFormCategory] = useState('Google Apps Script');
  const [formDate, setFormDate] = useState(() => {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  });
  const [formDescription, setFormDescription] = useState('');
  const [formRequiresAdmin, setFormRequiresAdmin] = useState(false);
  const [formToolUrl, setFormToolUrl] = useState('');

  // Config State
  const [configTitle, setConfigTitle] = useState(toolsConfig?.headerTitle || 'Tools');
  const [configSubtitle, setConfigSubtitle] = useState(
    toolsConfig?.headerSubtitle ||
      'Kumpulan tools pendukung yang telah dipublikasikan oleh Admin.'
  );
  const [configBadgeIcon, setConfigBadgeIcon] = useState(toolsConfig?.badgeIcon || '🧰');

  // Filtered tools
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q) ||
        t.versionBadge.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }, [tools, searchQuery]);

  // Open add tool modal
  const handleOpenAddTool = () => {
    setEditingToolId(null);
    setFormTitle('');
    setFormBadge('SAUNG ULTIMATE');
    setFormVersionBadge(`WEB V.${tools.length + 1}`);
    setFormTag('TOOL / GEMINI GEM');
    setFormCategory('AI Utility');
    setFormDate(
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
    setFormDescription('');
    setFormRequiresAdmin(false);
    setFormToolUrl('');
    setIsEditorOpen(true);
  };

  // Open edit tool modal
  const handleOpenEditTool = (tool: ToolItem) => {
    setEditingToolId(tool.id);
    setFormTitle(tool.title);
    setFormBadge(tool.badge);
    setFormVersionBadge(tool.versionBadge);
    setFormTag(tool.tag);
    setFormCategory(tool.category || 'AI Utility');
    setFormDate(tool.date);
    setFormDescription(tool.description);
    setFormRequiresAdmin(Boolean(tool.requiresAdminAccess));
    setFormToolUrl(tool.toolUrl || '');
    setIsEditorOpen(true);
  };

  // Duplicate tool
  const handleDuplicateTool = (tool: ToolItem) => {
    const newId = `tool-${Date.now().toString(36)}`;
    const duplicated: ToolItem = {
      ...tool,
      id: newId,
      title: `${tool.title} (Salinan)`,
      versionBadge: `${tool.versionBadge} COPY`,
    };
    onSaveTool(duplicated);
    showToast?.('success', `Tool "${duplicated.title}" berhasil disalin.`);
  };

  // Submit Tool Form
  const handleSubmitTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast?.('error', 'Nama/Judul tool wajib diisi.');
      return;
    }
    if (!formDescription.trim()) {
      showToast?.('error', 'Deskripsi tool wajib diisi.');
      return;
    }

    const toolData: ToolItem = {
      id: editingToolId || `tool-${Date.now().toString(36)}`,
      title: formTitle.trim(),
      badge: formBadge.trim() || 'SAUNG ULTIMATE',
      versionBadge: formVersionBadge.trim() || 'WEB V.1',
      tag: formTag.trim() || 'TOOL / GEMINI GEM',
      category: formCategory.trim() || 'Tool',
      date: formDate.trim() || '2026',
      description: formDescription.trim(),
      requiresAdminAccess: formRequiresAdmin,
      toolUrl: formToolUrl.trim() || undefined,
    };

    onSaveTool(toolData);
    setIsEditorOpen(false);
    showToast?.(
      'success',
      editingToolId
        ? `Tool "${toolData.title}" berhasil diperbarui.`
        : `Tool baru "${toolData.title}" berhasil ditambahkan.`
    );
  };

  // Delete Tool
  const handleDeleteToolClick = (tool: ToolItem) => {
    onRequestConfirmDelete(
      'Hapus Tool Member',
      `Apakah Anda yakin ingin menghapus tool "${tool.title}" (${tool.versionBadge}) dari portal member?`,
      () => {
        onDeleteTool(tool.id);
        showToast?.('info', `Tool "${tool.title}" telah dihapus.`);
      }
    );
  };

  // Move Tool Up / Down
  const handleMoveTool = (index: number, direction: 'up' | 'down') => {
    if (!onReorderTools) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tools.length) return;

    const updated = [...tools];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onReorderTools(updated);
    showToast?.('success', 'Urutan tool berhasil diperbarui.');
  };

  // Save UI Config
  const handleSaveConfig = () => {
    const updated: MemberToolsConfig = {
      headerTitle: configTitle.trim() || 'Tools',
      headerSubtitle:
        configSubtitle.trim() ||
        'Kumpulan tools pendukung yang telah dipublikasikan oleh Admin.',
      badgeIcon: configBadgeIcon.trim() || '🧰',
    };
    onUpdateConfig(updated);
    setIsConfigOpen(false);
    showToast?.('success', 'Konfigurasi UI Member Tools berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="p-5 rounded-2xl bg-[#09172f]/80 border border-sky-800/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Wrench className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Manajemen UI Member Tools
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kelola aplikasi interaktif, generator Apps Script, studio kode, dan utilitas developer yang dapat dibuka oleh member di portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold border border-sky-800/40 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-pink-400" />
            <span>Kustomisasi Header UI</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onRequestConfirmDelete(
                'Reset Koleksi Tools',
                'Apakah Anda yakin ingin mengatur ulang seluruh tool ke 6 tool bawaan Saung Digital? Seluruh perubahan atau tool kustom akan dikembalikan.',
                () => {
                  onResetTools();
                  showToast?.('info', 'Koleksi tools telah dikembalikan ke bawaan.');
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
            onClick={handleOpenAddTool}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tool Baru</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Mode Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tool berdasarkan nama, badge, versi, atau deskripsi..."
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

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#061021] p-1 rounded-xl border border-sky-900/60">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            title="Tampilan Kartu Visual"
            className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Visual Kartu</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            title="Tampilan Tabel"
            className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Tabel</span>
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Menampilkan <strong className="text-white font-bold">{filteredTools.length}</strong> dari{' '}
          <strong className="text-pink-400 font-bold">{tools.length}</strong> total tools yang aktif
        </div>
        <div className="text-[11px] text-slate-500">
          Gunakan panah (↑ / ↓) untuk mengatur urutan tampilan kartu pada member
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool, idx) => (
            <div
              key={tool.id}
              className="bg-[#08152b] border border-sky-900/50 hover:border-pink-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all relative group"
            >
              {/* Graphic Banner */}
              <ToolCardBanner
                title={tool.badge}
                versionBadge={tool.versionBadge}
              />

              {/* Tool Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-pink-400 font-extrabold text-[11px] uppercase tracking-wider">
                    <span>🧰</span>
                    <span>{tool.tag}</span>
                  </div>
                  {tool.requiresAdminAccess && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 border border-amber-600/40 text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Admin Only</span>
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  <span className="text-amber-400">⚡</span>
                  <span>{tool.title}</span>
                  <span className="text-amber-400">⚡</span>
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[38px] line-clamp-3">
                  {tool.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{tool.date}</span>
                  </span>
                  {tool.category && (
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      {tool.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-sky-950/80 flex items-center justify-between gap-2">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveTool(idx, 'up')}
                    title="Geser ke Atas"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === tools.length - 1}
                    onClick={() => handleMoveTool(idx, 'down')}
                    title="Geser ke Bawah"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTestingTool(tool)}
                    title="Buka & Uji Modal Tool"
                    className="px-2.5 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Uji Tool</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateTool(tool)}
                    title="Duplikasi Tool"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditTool(tool)}
                    title="Edit Tool"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteToolClick(tool)}
                    title="Hapus Tool"
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-[#08152b] border border-sky-900/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#061021] text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-sky-950">
                <tr>
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className="p-3.5">Nama &amp; Versi</th>
                  <th className="p-3.5">Badge Banner</th>
                  <th className="p-3.5">Kategori / Tag</th>
                  <th className="p-3.5">Tanggal</th>
                  <th className="p-3.5 text-center">Akses Admin</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950">
                {filteredTools.map((tool, idx) => (
                  <tr key={tool.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">⚡</span>
                        <span>{tool.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal pt-0.5 line-clamp-1">
                        {tool.description}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[11px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800/40">
                        {tool.badge} / {tool.versionBadge}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-pink-400 font-bold text-[11px]">{tool.tag}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{tool.date}</td>
                    <td className="p-3.5 text-center">
                      {tool.requiresAdminAccess ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40">
                          Ya
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Semua Member</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTestingTool(tool)}
                          title="Uji Tool"
                          className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/40 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditTool(tool)}
                          title="Edit Tool"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteToolClick(tool)}
                          title="Hapus Tool"
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL: EDIT / TAMBAH TOOL                                              */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#08152b] border border-pink-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 relative">
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingToolId ? 'Edit Tool Member' : 'Tambah Tool Baru'}
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

            <form onSubmit={handleSubmitTool} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Judul Tool <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="misal: ULTIMATE WEB V.1"
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 font-bold tracking-wide"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    Badge Banner Atas (Header Banner)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="SAUNG ULTIMATE"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    Version Badge
                  </label>
                  <input
                    type="text"
                    value={formVersionBadge}
                    onChange={(e) => setFormVersionBadge(e.target.value)}
                    placeholder="WEB V.1 / POSTER UMKM"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tag Sub-header</label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="TOOL / GEMINI GEM"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Tanggal Rilis</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="20 Sep 2026"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Deskripsi Tool <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan fungsi utama tool ini untuk member..."
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Tautan Eksternal / URL Aplikasi (Opsional)
                </label>
                <input
                  type="url"
                  value={formToolUrl}
                  onChange={(e) => setFormToolUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 font-mono"
                />
              </div>

              {/* Checkbox Admin Access */}
              <div className="p-3 rounded-xl bg-[#050c18] border border-sky-950 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Wajib Izin Admin</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Jika diaktifkan, tool ini menampilkan status &quot;Minta Izin ke Admin jika belum dapat Akses&quot;.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formRequiresAdmin}
                  onChange={(e) => setFormRequiresAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-500 focus:ring-0 cursor-pointer"
                />
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
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-600/30 cursor-pointer"
                >
                  {editingToolId ? 'Simpan Perubahan' : 'Tambahkan Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: KUSTOMISASI HEADER UI TOOLS                                     */}
      {/* ========================================================================= */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#08152b] border border-pink-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">
                  Kustomisasi Header UI Member Tools
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Emoji Ikon</label>
                  <input
                    type="text"
                    value={configBadgeIcon}
                    onChange={(e) => setConfigBadgeIcon(e.target.value)}
                    placeholder="🧰"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-center text-lg text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-[11px] font-bold text-slate-300">Judul Header</label>
                  <input
                    type="text"
                    value={configTitle}
                    onChange={(e) => setConfigTitle(e.target.value)}
                    placeholder="Tools"
                    className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">
                  Deskripsi / Subtitle Header
                </label>
                <textarea
                  rows={3}
                  value={configSubtitle}
                  onChange={(e) => setConfigSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050c18] border border-sky-800/60 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400 leading-relaxed"
                />
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
      {/* 3. MODAL: TEST TOOL VIEWER                                                */}
      {/* ========================================================================= */}
      {testingTool && (
        <ToolViewerModal
          tool={testingTool}
          onClose={() => setTestingTool(null)}
        />
      )}
    </div>
  );
};
