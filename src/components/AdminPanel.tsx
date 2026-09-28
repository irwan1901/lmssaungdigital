import React, { useState, useRef, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Database,
  ExternalLink,
  Settings,
  Sliders,
  Palette,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Globe,
  Mail,
  Save,
  Check,
  Shield,
  Layers,
  HelpCircle,
  Image as ImageIcon,
  LogOut,
  KeyRound,
  AlertTriangle,
  X,
  Wrench,
} from 'lucide-react';
import {
  LearningMaterial,
  MemberUser,
  MaterialCategory,
  MaterialType,
  PlatformSettings,
  PromptItem,
  ToolItem,
} from '../types';
import { DEFAULT_PLATFORM_SETTINGS, deduplicateMembers } from '../services/googleSheetsSync';
import { optimizeImageFile, saveAssetToIndexedDB, cleanupStorageQuota } from '../services/storageHelper';
import { SpotlightGlowCard } from './SpotlightGlowCard';
import { AdminPromptManager } from './AdminPromptManager';
import { AdminToolsManager } from './AdminToolsManager';

interface AdminPanelProps {
  materials: LearningMaterial[];
  members: MemberUser[];
  settings: PlatformSettings;
  prompts: PromptItem[];
  tools: ToolItem[];
  onSaveMaterial: (material: LearningMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
  onSaveMember: (member: MemberUser) => void;
  onDeleteMember: (memberId: string) => void;
  onSavePrompt: (prompt: PromptItem) => void;
  onDeletePrompt: (promptId: string) => void;
  onResetPrompts: () => void;
  onSaveTool: (tool: ToolItem) => void;
  onDeleteTool: (toolId: string) => void;
  onResetTools: () => void;
  onReorderTools?: (tools: ToolItem[]) => void;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
  onResetAllData: () => void;
  onImportBackup: (importedData: {
    materials?: LearningMaterial[];
    members?: MemberUser[];
    settings?: PlatformSettings;
    prompts?: PromptItem[];
    tools?: ToolItem[];
  }) => void;
  onNavigateSync: () => void;
  onLogout?: () => void;
  showToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  materials,
  members,
  settings,
  prompts,
  tools,
  onSaveMaterial,
  onDeleteMaterial,
  onSaveMember,
  onDeleteMember,
  onSavePrompt,
  onDeletePrompt,
  onResetPrompts,
  onSaveTool,
  onDeleteTool,
  onResetTools,
  onReorderTools,
  onUpdateSettings,
  onResetAllData,
  onImportBackup,
  onNavigateSync,
  onLogout,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'members' | 'prompts' | 'tools' | 'settings'>('materials');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings form states
  const [tempSettings, setTempSettings] = useState<PlatformSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Material Modal state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);

  // Member Modal state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberUser | null>(null);
  const [memberFormName, setMemberFormName] = useState('');
  const [memberFormEmail, setMemberFormEmail] = useState('');
  const [memberFormPassword, setMemberFormPassword] = useState('member123');
  const [memberFormRole, setMemberFormRole] = useState<'member' | 'admin'>('member');
  const [memberFormStatus, setMemberFormStatus] = useState<'active' | 'suspended'>('active');

  // Delete Confirmation Dialog state ("Apakah Anda yakin?")
  const [confirmDelete, setConfirmDelete] = useState<{
    title?: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Image Upload for Settings
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [customBannerPreview, setCustomBannerPreview] = useState<string>(() => {
    try {
      return localStorage.getItem('saung_digital_hero_image') || '';
    } catch {
      return '';
    }
  });

  // Form states for material
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MaterialCategory>('Tutorial Video');
  const [formType, setFormType] = useState<MaterialType>('video');
  const [formDescription, setFormDescription] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formHtmlCode, setFormHtmlCode] = useState('');
  const [formAttachmentUrl, setFormAttachmentUrl] = useState('');
  const [formAttachmentName, setFormAttachmentName] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDuration, setFormDuration] = useState('15 Menit');
  const [formLevel, setFormLevel] = useState<LearningMaterial['level']>('Semua Level');
  const [formPublished, setFormPublished] = useState(true);

  // Material Actions
  const openCreateMaterialModal = () => {
    setEditingMaterial(null);
    setFormTitle('');
    setFormCategory('Tutorial Video');
    setFormType('video');
    setFormDescription('');
    setFormVideoUrl('');
    setFormContent('');
    setFormHtmlCode('');
    setFormAttachmentUrl('');
    setFormAttachmentName('');
    setFormTags('Android, Kotlin, Web, Tutorial');
    setFormDuration('15 Menit');
    setFormLevel('Semua Level');
    setFormPublished(true);
    setIsMaterialModalOpen(true);
  };

  const openEditMaterialModal = (m: LearningMaterial) => {
    setEditingMaterial(m);
    setFormTitle(m.title);
    setFormCategory(m.category);
    setFormType(m.type);
    setFormDescription(m.description);
    setFormVideoUrl(m.videoUrl || '');
    setFormContent(m.content || '');
    setFormHtmlCode(m.htmlCode || '');
    setFormAttachmentUrl(m.attachmentUrl || '');
    setFormAttachmentName(m.attachmentName || '');
    setFormTags(m.tags.join(', '));
    setFormDuration(m.duration || '15 Menit');
    setFormLevel(m.level);
    setFormPublished(m.isPublished);
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let ytId: string | undefined = undefined;
    if (formVideoUrl) {
      const match = formVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
    }

    const materialData: LearningMaterial = {
      id: editingMaterial ? editingMaterial.id : 'mat-' + Date.now().toString(36),
      title: formTitle.trim(),
      category: formCategory,
      type: formType,
      description: formDescription.trim(),
      videoUrl: formVideoUrl.trim() || undefined,
      youtubeId: ytId,
      content: formContent.trim() || undefined,
      htmlCode: formHtmlCode.trim() || undefined,
      attachmentUrl: formAttachmentUrl.trim() || undefined,
      attachmentName: formAttachmentName.trim() || undefined,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      duration: formDuration.trim() || '10 Menit',
      level: formLevel,
      author: editingMaterial ? editingMaterial.author : 'Admin SAUNG DIGITAL',
      isPublished: formPublished,
      order: editingMaterial ? editingMaterial.order : materials.length + 1,
      createdAt: editingMaterial ? editingMaterial.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: editingMaterial ? editingMaterial.views || 0 : 0,
    };

    onSaveMaterial(materialData);
    setIsMaterialModalOpen(false);
  };

  const openCreateMemberModal = () => {
    setEditingMember(null);
    setMemberFormName('');
    setMemberFormEmail('');
    setMemberFormPassword('member123');
    setMemberFormRole('member');
    setMemberFormStatus('active');
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (mem: MemberUser) => {
    setEditingMember(mem);
    setMemberFormName(mem.name);
    setMemberFormEmail(mem.email);
    setMemberFormPassword(mem.password || 'member123');
    setMemberFormRole(mem.role);
    setMemberFormStatus(mem.status);
    setIsMemberModalOpen(true);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFormName.trim() || !memberFormEmail.trim()) return;

    if (editingMember) {
      const updated: MemberUser = {
        ...editingMember,
        name: memberFormName.trim(),
        email: memberFormEmail.trim(),
        password: memberFormPassword.trim() || 'member123',
        role: memberFormRole,
        status: memberFormStatus,
      };
      onSaveMember(updated);
    } else {
      const newMember: MemberUser = {
        id: 'mem-' + Date.now().toString(36),
        name: memberFormName.trim(),
        email: memberFormEmail.trim(),
        password: memberFormPassword.trim() || 'member123',
        role: memberFormRole,
        status: memberFormStatus,
        joinedAt: new Date().toISOString(),
        completedMaterials: [],
        bookmarkedMaterials: [],
        notes: {},
      };
      onSaveMember(newMember);
    }

    setIsMemberModalOpen(false);
  };

  // Banner image upload handlers for Settings
  const [isOptimizingBanner, setIsOptimizingBanner] = useState(false);

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast?.('error', 'Ukuran berkas gambar maksimal 15 MB.');
      return;
    }

    try {
      setIsOptimizingBanner(true);
      // Automatically compress and resize to ~30-70 KB to completely avoid localStorage quota errors
      const optimizedDataUrl = await optimizeImageFile(file, 960, 540, 0.82);

      const updated = { ...tempSettings, bannerImageUrl: optimizedDataUrl };
      setTempSettings(updated);
      setCustomBannerPreview(optimizedDataUrl);

      // Save to IndexedDB for backup
      saveAssetToIndexedDB('banner_image', optimizedDataUrl);

      // Clean up legacy keys
      cleanupStorageQuota();

      // Immediately sync to platformSettings so home page updates in real-time
      onUpdateSettings(updated);
    } catch (err) {
      console.error('Gagal mengoptimalkan gambar:', err);
    } finally {
      setIsOptimizingBanner(false);
      e.target.value = '';
    }
  };

  const handleRemoveBannerImage = () => {
    const updated = { ...tempSettings, bannerImageUrl: '' };
    setTempSettings(updated);
    setCustomBannerPreview('');
    cleanupStorageQuota();
    saveAssetToIndexedDB('banner_image', '');
    onUpdateSettings(updated);
    showToast?.('info', 'Gambar banner berhasil dihapus.');
  };

  // Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    cleanupStorageQuota();
    if (tempSettings.bannerImageUrl) {
      saveAssetToIndexedDB('banner_image', tempSettings.bannerImageUrl);
    }
    onUpdateSettings(tempSettings);
    showToast?.('success', 'Pengaturan berhasil disimpan!');
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleExportJSON = () => {
    const backupData = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      platform: tempSettings.platformName,
      settings: tempSettings,
      materials,
      members,
      prompts,
      tools,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaungDigital-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.('success', 'Berkas cadangan JSON berhasil diunduh.');
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        onImportBackup(parsed);
        if (parsed.settings) {
          setTempSettings(parsed.settings);
          onUpdateSettings(parsed.settings);
        }
        showToast?.(
          'success',
          `Cadangan data (${parsed.materials?.length || 0} materi, ${parsed.members?.length || 0} member, ${parsed.prompts?.length || 0} prompt, ${parsed.tools?.length || 0} tools) berhasil diimpor.`
        );
      } catch (err) {
        console.error('Format berkas JSON tidak valid atau rusak.', err);
        showToast?.('error', 'Gagal membaca berkas cadangan JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sanitizedMembers = useMemo(() => deduplicateMembers(members), [members]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#112344] via-[#0d1c38] to-[#081224] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-sky-950/20">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>ADMINISTRATOR CENTER</span>
          </span>
          <h2 className="text-2xl font-extrabold text-white">Pusat Kelola &amp; Pengaturan</h2>
          <p className="text-xs text-slate-300 mt-1">
            Manajemen modul materi, data member, konfigurasi sistem, dan integrasi Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateSync}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold border border-sky-800/40 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Koneksi Google Sheets</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-sky-900/40 pb-2 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab 1: Materials */}
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Katalog Materi ({materials.length})</span>
          </button>

          {/* Tab 2: Members */}
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data Member ({members.length})</span>
          </button>

          {/* Tab 3: UI Prompt Library */}
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>UI Prompt Library ({prompts.length})</span>
          </button>

          {/* Tab 4: UI Member Tools */}
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-pink-400" />
            <span>UI Member Tools ({tools.length})</span>
          </button>

          {/* Tab 5: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pengaturan</span>
          </button>
        </div>

        {/* Tab Specific Action Buttons */}
        {activeTab === 'materials' && (
          <button
            onClick={openCreateMaterialModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Materi Baru</span>
          </button>
        )}

        {activeTab === 'members' && (
          <button
            onClick={openCreateMemberModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Member</span>
          </button>
        )}

        {activeTab === 'settings' && (
          <button
            onClick={handleSaveSettings}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              tempSettings.accentColor === 'amber'
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                : tempSettings.accentColor === 'cyan'
                ? 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {settingsSavedToast ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
            <span>{settingsSavedToast ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MATERIALS TABLE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi dalam tabel..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#081224] border border-sky-800/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-sky-900/30 bg-[#081224]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0b172e] border-b border-sky-900/40 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Urutan</th>
                  <th className="p-3.5">Judul Materi</th>
                  <th className="p-3.5">Kategori &amp; Tipe</th>
                  <th className="p-3.5">Level &amp; Durasi</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950">
                {filteredMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 text-slate-400 font-mono">#{m.order}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white max-w-xs truncate">{m.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{m.description}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 font-medium">
                        {m.category}
                      </span>
                      <span className="ml-1 text-[11px] text-slate-400 capitalize">({m.type})</span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div>{m.level}</div>
                      <div className="text-[11px] text-slate-500">{m.duration || '-'}</div>
                    </td>
                    <td className="p-3.5">
                      {m.isPublished ? (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                          Publish
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditMaterialModal(m)}
                        title="Edit Materi"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete({
                            title: 'Hapus Materi Pembelajaran',
                            message: `Apakah Anda yakin ingin menghapus materi "${m.title}"?`,
                            onConfirm: () => {
                              onDeleteMaterial(m.id);
                              showToast?.('info', `Materi "${m.title}" berhasil dihapus.`);
                            },
                          });
                        }}
                        title="Hapus Materi"
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MEMBERS TABLE                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-sky-900/30 bg-[#081224]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0b172e] border-b border-sky-900/40 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Nama Member</th>
                  <th className="p-3.5">Email Akses</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Progress Selesai</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950">
                {sanitizedMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-semibold text-white">{mem.name}</td>
                    <td className="p-3.5 text-slate-300 font-mono">{mem.email}</td>
                    <td className="p-3.5">
                      <span className="capitalize px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                        {mem.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                        {mem.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 tabular-nums">
                      {mem.completedMaterials.length} Materi
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditMemberModal(mem)}
                          title="Edit Data Member"
                          className="p-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-800/40 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {mem.role !== 'admin' && (
                          <button
                            onClick={() => {
                              setConfirmDelete({
                                title: 'Hapus Akun Member',
                                message: `Apakah Anda yakin ingin menghapus akun member "${mem.name}" (${mem.email})?`,
                                onConfirm: () => {
                                  onDeleteMember(mem.id);
                                  showToast?.('info', `Akun member "${mem.name}" berhasil dihapus.`);
                                },
                              });
                            }}
                            title="Hapus Member"
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
      {/* TAB 3: UI PROMPT LIBRARY                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'prompts' && (
        <AdminPromptManager
          prompts={prompts}
          promptConfig={settings.promptLibraryConfig}
          onSavePrompt={onSavePrompt}
          onDeletePrompt={onDeletePrompt}
          onResetPrompts={onResetPrompts}
          onUpdateConfig={(config) => {
            const updated: PlatformSettings = { ...settings, promptLibraryConfig: config };
            onUpdateSettings(updated);
          }}
          onRequestConfirmDelete={(title, message, onConfirm) => {
            setConfirmDelete({ title, message, onConfirm });
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: UI MEMBER TOOLS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'tools' && (
        <AdminToolsManager
          tools={tools}
          toolsConfig={settings.memberToolsConfig}
          onSaveTool={onSaveTool}
          onDeleteTool={onDeleteTool}
          onResetTools={onResetTools}
          onReorderTools={onReorderTools}
          onUpdateConfig={(config) => {
            const updated: PlatformSettings = { ...settings, memberToolsConfig: config };
            onUpdateSettings(updated);
          }}
          onRequestConfirmDelete={(title, message, onConfirm) => {
            setConfirmDelete({ title, message, onConfirm });
          }}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PENGATURAN (SETTINGS) SECTION                                     */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Notification feedback if saved */}
          {settingsSavedToast && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Pengaturan sistem berhasil disimpan dan diterapkan!</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Setting Card 1: Identitas & Branding */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-800/30 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-sky-900/40">
                <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Identitas &amp; Branding Portal</h3>
                  <p className="text-[11px] text-slate-400">Atur nama, slogan, dan kontak resmi platform</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nama Platform / Komunitas</label>
                  <input
                    type="text"
                    value={tempSettings.platformName}
                    onChange={(e) => setTempSettings({ ...tempSettings, platformName: e.target.value })}
                    placeholder="SAUNG DIGITAL"
                    className="w-full px-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tagline / Slogan Resmi</label>
                  <input
                    type="text"
                    value={tempSettings.tagline}
                    onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                    placeholder="KOLABORASI • INOVASI • TEKNOLOGI • MASA DEPAN"
                    className="w-full px-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Deskripsi Singkat Hero</label>
                  <textarea
                    rows={2}
                    value={tempSettings.portalDescription}
                    onChange={(e) => setTempSettings({ ...tempSettings, portalDescription: e.target.value })}
                    placeholder="Koleksi materi, video YouTube, modul Android, Coding..."
                    className="w-full px-3.5 py-2 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Kontak Administrator</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={tempSettings.adminContactEmail}
                      onChange={(e) => setTempSettings({ ...tempSettings, adminContactEmail: e.target.value })}
                      placeholder="admin@saungdigital.id"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Password Administrator</label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tempSettings.adminPassword || 'admin2026'}
                      onChange={(e) => setTempSettings({ ...tempSettings, adminPassword: e.target.value })}
                      placeholder="admin2026"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Password resmi untuk login Administrator (default: admin2026).</p>
                </div>
              </div>
            </div>

            {/* Setting Card: Gambar Banner & Logo Portal (Upload Gambar) */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-800/30 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-sky-900/40">
                <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Unggah Gambar Banner &amp; Logo</h3>
                  <p className="text-[11px] text-slate-400">Ganti atau pasang gambar logo / artwork portal Saung Digital</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Preview Box */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-sky-700/50 bg-[#050c18] p-4 flex flex-col items-center justify-center min-h-[160px] group">
                  {tempSettings.bannerImageUrl || customBannerPreview ? (
                    <div className="relative w-full aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-sky-500/40 shadow-inner">
                      <img
                        src={tempSettings.bannerImageUrl || customBannerPreview}
                        alt="Preview Banner Portal"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Ganti Gambar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDelete({
                              title: 'Hapus Gambar Banner',
                              message: 'Apakah Anda yakin ingin menghapus gambar banner kustom dan kembali ke banner bawaan?',
                              onConfirm: handleRemoveBannerImage,
                            });
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-800/40 text-sky-400 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">Pilih Gambar dari Perangkat</span>
                        <span className="text-[11px] text-slate-400">Format yang didukung: PNG, JPG, WebP, SVG (Maksimal 5 MB)</span>
                      </div>
                      <button
                        type="button"
                        disabled={isOptimizingBanner}
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-sky-500/20 cursor-pointer mt-1"
                      >
                        <Upload className={`w-3.5 h-3.5 ${isOptimizingBanner ? 'animate-spin' : ''}`} />
                        <span>{isOptimizingBanner ? 'Mengoptimalkan Gambar...' : 'Unggah Gambar Baru'}</span>
                      </button>
                    </div>
                  )}

                  {/* Hidden Input File */}
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Direct image URL input option */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Atau Masukkan Tautan / URL Gambar</label>
                  <input
                    type="url"
                    value={tempSettings.bannerImageUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = { ...tempSettings, bannerImageUrl: val };
                      setTempSettings(updated);
                      setCustomBannerPreview(val);
                      cleanupStorageQuota();
                      onUpdateSettings(updated);
                    }}
                    placeholder="https://domain.com/gambar-saung-digital.png"
                    className="w-full px-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Setting Card 2: Tampilan, Akses & Kursor */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-800/30 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-sky-900/40">
                <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/40">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Tampilan &amp; Akses Pengguna</h3>
                  <p className="text-[11px] text-slate-400">Preferensi interaktivitas, tema, dan izin pratinjau tamu</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Accent Color Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium">Warna Aksen Sorotan Utama</label>
                    <span className="text-[11px] text-slate-400">
                      Aktif:{' '}
                      <strong className={
                        tempSettings.accentColor === 'amber'
                          ? 'text-amber-400'
                          : tempSettings.accentColor === 'cyan'
                          ? 'text-sky-400'
                          : 'text-emerald-400'
                      }>
                        {tempSettings.accentColor === 'amber' ? 'Amber Gold' : tempSettings.accentColor === 'cyan' ? 'Cyber Cyan' : 'Neon Saung'}
                      </strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...tempSettings, accentColor: 'emerald' as const };
                        setTempSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        tempSettings.accentColor === 'emerald'
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                          : 'bg-[#060c18] border-slate-700 text-slate-400 hover:text-white hover:border-emerald-500/40'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block mr-1.5 shadow-sm shadow-emerald-400" />
                      Neon Saung
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...tempSettings, accentColor: 'cyan' as const };
                        setTempSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        tempSettings.accentColor === 'cyan'
                          ? 'bg-sky-950/80 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20 ring-1 ring-sky-400/50'
                          : 'bg-[#060c18] border-slate-700 text-slate-400 hover:text-white hover:border-sky-500/40'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block mr-1.5 shadow-sm shadow-sky-400" />
                      Cyber Cyan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...tempSettings, accentColor: 'amber' as const };
                        setTempSettings(updated);
                        onUpdateSettings(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        tempSettings.accentColor === 'amber'
                          ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                          : 'bg-[#060c18] border-slate-700 text-slate-400 hover:text-white hover:border-amber-500/40'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block mr-1.5 shadow-sm shadow-amber-400" />
                      Amber Gold
                    </button>
                  </div>
                  {/* Live preview chip */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060c18] border border-slate-700/60 mt-1">
                    <span className="text-[11px] text-slate-400">Efek sorotan:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tempSettings.accentColor === 'amber'
                        ? 'bg-amber-400 text-slate-950'
                        : tempSettings.accentColor === 'cyan'
                        ? 'bg-sky-400 text-slate-950'
                        : 'bg-emerald-400 text-slate-950'
                    }`}>
                      Tombol &amp; Badge
                    </span>
                    <span className={`text-[11px] font-semibold ${
                      tempSettings.accentColor === 'amber'
                        ? 'text-amber-300'
                        : tempSettings.accentColor === 'cyan'
                        ? 'text-sky-300'
                        : 'text-emerald-300'
                    }`}>
                      Kursor Spotlight &amp; Glow Card
                    </span>
                  </div>
                </div>

                {/* Cursor Glow Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060c18] border border-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">Efek Sorotan Kursor (Dynamic Border Glow)</span>
                    <p className="text-[11px] text-slate-400">
                      Border card paling terang mengikuti koordinat pergerakan kursor mouse.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempSettings.enableSpotlightGlow}
                    onChange={(e) => setTempSettings({ ...tempSettings, enableSpotlightGlow: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Guest Preview Mode Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060c18] border border-slate-700">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">Pratinjau Pengunjung (Guest Preview)</span>
                    <p className="text-[11px] text-slate-400">
                      Pengunjung umum dapat menjelajahi dan melihat materi tanpa harus login terlebih dahulu.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempSettings.allowGuestPreview}
                    onChange={(e) => setTempSettings({ ...tempSettings, allowGuestPreview: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Setting Card 3: Pesan Pengumuman & Broadcast Banner */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-800/30 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-sky-900/40">
                <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Pengumuman &amp; Broadcast Banner</h3>
                  <p className="text-[11px] text-slate-400">Siarkan pesan notifikasi penting kepada seluruh member</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#060c18] border border-slate-700">
                  <div>
                    <span className="font-semibold text-white">Tampilkan Banner Pengumuman</span>
                    <p className="text-[11px] text-slate-400">Tampilkan pita pesan di bagian atas halaman website</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempSettings.isBroadcastActive}
                    onChange={(e) => setTempSettings({ ...tempSettings, isBroadcastActive: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Teks Pesan Pengumuman</label>
                  <textarea
                    rows={2}
                    value={tempSettings.broadcastMessage}
                    onChange={(e) => setTempSettings({ ...tempSettings, broadcastMessage: e.target.value })}
                    placeholder="Contoh: Modul baru Android & IoT telah dirilis. Silakan simak di katalog!"
                    className="w-full px-3.5 py-2.5 bg-[#060c18] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Setting Card 4: Cadangan & Pemulihan Database (Backup & Maintenance) */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-800/30 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-sky-900/40">
                <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadangan &amp; Pemulihan Data</h3>
                  <p className="text-[11px] text-slate-400">Ekspor/impor cadangan JSON dan pemulihan data bawaan</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Anda dapat mengunduh seluruh materi ({materials.length}) dan member ({members.length}) dalam berkas JSON untuk dicadangkan di komputer lokal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Cadangan (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pulihkan dari File JSON</span>
                  </button>
                  <input
                    type="file"
                    ref={importFileRef}
                    onChange={handleImportFileChange}
                    accept=".json"
                    className="hidden"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Kembalikan ke data awal bawaan</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete({
                        title: 'Reset Semua Data',
                        message: 'Apakah Anda yakin ingin mengatur ulang semua materi dan pengaturan ke kondisi awal bawaan? Seluruh perubahan lokal akan dikembalikan.',
                        onConfirm: () => {
                          onResetAllData();
                          setTempSettings(DEFAULT_PLATFORM_SETTINGS);
                          showToast?.('info', 'Semua data dan pengaturan telah di-reset ke kondisi awal.');
                        },
                      });
                    }}
                    className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-[11px] font-semibold rounded-lg border border-rose-800/40 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Data Bawaan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="p-4 rounded-2xl bg-[#09172e] border border-sky-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Pengaturan disimpan ke penyimpanan sistem dan langsung diterapkan pada portal.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTempSettings(DEFAULT_PLATFORM_SETTINGS)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Reset Nilai Form
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT MATERI                                              */}
      {/* ========================================================================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#09152b] border border-sky-600/30 rounded-2xl shadow-2xl p-6 my-auto max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingMaterial ? 'Edit Materi Pembelajaran' : 'Tambah Materi Baru'}
            </h3>

            <form onSubmit={handleSaveMaterialSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Judul Materi *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Tutorial Video Android Kotlin Jetpack Compose"
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Tutorial Video">Tutorial Video</option>
                    <option value="Artikel & Modul">Artikel &amp; Modul</option>
                    <option value="HTML & Kode">HTML &amp; Kode</option>
                    <option value="Grafis & Desain">Grafis &amp; Desain</option>
                    <option value="File Pendukung">File Pendukung</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tipe Konten</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="video">Video (YouTube / Direct)</option>
                    <option value="article">Artikel / Panduan Teks</option>
                    <option value="html">HTML &amp; CSS Interactive Runner</option>
                    <option value="image">Gambar / Diagram Infografis</option>
                    <option value="file">File Dokumen / Spreadsheet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ringkasan penjelasan modul yang tampil di kartu katalog..."
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {formType === 'video' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">URL Video YouTube</label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {formType === 'html' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kode HTML / CSS / JS</label>
                  <textarea
                    rows={5}
                    value={formHtmlCode}
                    onChange={(e) => setFormHtmlCode(e.target.value)}
                    placeholder="<div>Snippet HTML interaktif...</div>"
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg font-mono text-xs text-sky-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Isi Modul / Teks Rangkuman</label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Teks materi pembelajaran atau catatan panduan..."
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">URL Lampiran / File Unduhan</label>
                  <input
                    type="url"
                    value={formAttachmentUrl}
                    onChange={(e) => setFormAttachmentUrl(e.target.value)}
                    placeholder="https://drive.google.com/... atau tautan file"
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nama Berkas</label>
                  <input
                    type="text"
                    value={formAttachmentName}
                    onChange={(e) => setFormAttachmentName(e.target.value)}
                    placeholder="Modul-Saung-Digital.pdf"
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tingkat Kesulitan</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Semua Level">Semua Level</option>
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Durasi / Halaman</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="15 Menit"
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tags (pisahkan koma)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Android, Kotlin, Jetpack"
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="pubCheck" className="text-slate-300 cursor-pointer">
                  Langsung Publikasikan (Publish) ke Katalog Member
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT MEMBER                                               */}
      {/* ========================================================================= */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#09152b] border border-sky-600/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>{editingMember ? 'Edit Data Member' : 'Tambah Member Baru'}</span>
            </h3>

            <form onSubmit={handleMemberSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={memberFormName}
                  onChange={(e) => setMemberFormName(e.target.value)}
                  placeholder="Misal: Andi Prasetyo"
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Email Member *</label>
                <input
                  type="email"
                  required
                  value={memberFormEmail}
                  onChange={(e) => setMemberFormEmail(e.target.value)}
                  placeholder="andi@gmail.com"
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Password Member</label>
                <input
                  type="text"
                  value={memberFormPassword}
                  onChange={(e) => setMemberFormPassword(e.target.value)}
                  placeholder="member123"
                  className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-400 font-mono"
                />
                <p className="text-[10px] text-slate-400">Password untuk member login (default: member123)</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Peran (Role)</label>
                  <select
                    value={memberFormRole}
                    onChange={(e) => setMemberFormRole(e.target.value as 'member' | 'admin')}
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="member">Member Standar</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Status Akun</label>
                  <select
                    value={memberFormStatus}
                    onChange={(e) => setMemberFormStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full px-3 py-2 bg-[#060c18] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="active">Aktif</option>
                    <option value="suspended">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  {editingMember ? 'Simpan Perubahan' : 'Tambah Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL ("Apakah Anda Yakin?")                          */}
      {/* ========================================================================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b172e] border border-rose-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setConfirmDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Tutup dialog konfirmasi"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div className="space-y-1 pr-6">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                  {confirmDelete.title || 'Konfirmasi Penghapusan'}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Apakah Anda yakin?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {confirmDelete.message}
                </p>
              </div>
            </div>

            <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-3 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Tindakan ini permanen dan tidak dapat dibatalkan.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDelete.onConfirm;
                  setConfirmDelete(null);
                  action();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-950/50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
