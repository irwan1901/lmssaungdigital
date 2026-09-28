import React, { useState, useEffect } from 'react';
import { HeroReference } from './components/HeroReference';
import { MaterialCatalog } from './components/MaterialCatalog';
import { MaterialViewerModal } from './components/MaterialViewerModal';
import { SyncManager } from './components/SyncManager';
import { AdminPanel } from './components/AdminPanel';
import { MemberPortal } from './components/MemberPortal';
import { AuthModals } from './components/AuthModals';
import { Footer } from './components/Footer';
import {
  loadMaterials,
  saveMaterials,
  loadMembers,
  saveMembers,
  loadSyncConfig,
  saveSyncConfig,
  loadSyncLogs,
  addSyncLog,
  testAppsScriptConnection,
  fetchFromGoogleSheet,
  pushToGoogleSheet,
  loadPlatformSettings,
  savePlatformSettings,
  loadPrompts,
  savePrompts,
  loadTools,
  saveTools,
  DEFAULT_PLATFORM_SETTINGS,
  DEFAULT_PROMPTS,
  DEFAULT_TOOLS,
  INITIAL_MATERIALS,
  INITIAL_MEMBERS,
  deduplicateMembers,
  deduplicateMaterials,
  deduplicatePrompts,
  deduplicateTools,
} from './services/googleSheetsSync';
import { cleanupStorageQuota } from './services/storageHelper';
import {
  LearningMaterial,
  MemberUser,
  SyncConfig,
  SyncLog,
  PlatformSettings,
  PromptItem,
  ToolItem,
} from './types';
import { CheckCircle2, AlertCircle, Info, Sparkles, Bell, X, ArrowLeft, LogOut } from 'lucide-react';

export default function App() {
  // Core state
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => loadMaterials());
  const [members, setMembers] = useState<MemberUser[]>(() => loadMembers());
  const [prompts, setPrompts] = useState<PromptItem[]>(() => loadPrompts());
  const [tools, setTools] = useState<ToolItem[]>(() => loadTools());
  const [syncConfig, setSyncConfig] = useState<SyncConfig>(() => loadSyncConfig());
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => loadSyncLogs());
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => loadPlatformSettings());
  const [dismissBroadcast, setDismissBroadcast] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<MemberUser | null>(() => {
    try {
      const saved = localStorage.getItem('saungdigital_current_user') || localStorage.getItem('samadigi_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'sync' | 'admin' | 'member'>('home');
  const [memberActiveTab, setMemberActiveTab] = useState<'learning' | 'prompts' | 'tools'>('learning');
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const [isMemberLoginOpen, setIsMemberLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Cleanup old duplicate or bloated localStorage keys on initial mount
  useEffect(() => {
    cleanupStorageQuota();
  }, []);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    saveMaterials(materials);
  }, [materials]);

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveSyncConfig(syncConfig);
  }, [syncConfig]);

  useEffect(() => {
    savePlatformSettings(platformSettings);
  }, [platformSettings]);

  useEffect(() => {
    savePrompts(prompts);
  }, [prompts]);

  useEffect(() => {
    saveTools(tools);
  }, [tools]);

  // Sync active accent color and spotlight glow to document root for real-time reactive theme
  useEffect(() => {
    const accent = platformSettings.accentColor || 'emerald';
    document.documentElement.setAttribute('data-accent', accent);
    document.body.setAttribute('data-accent', accent);
    document.documentElement.setAttribute(
      'data-glow',
      platformSettings.enableSpotlightGlow !== false ? 'enabled' : 'disabled'
    );
  }, [platformSettings.accentColor, platformSettings.enableSpotlightGlow]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('saungdigital_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('saungdigital_current_user');
      localStorage.removeItem('samadigi_current_user');
    }
  }, [currentUser]);

  const handleResetAllData = () => {
    setMaterials(INITIAL_MATERIALS);
    setMembers(INITIAL_MEMBERS);
    setPrompts(DEFAULT_PROMPTS);
    setTools(DEFAULT_TOOLS);
    setPlatformSettings(DEFAULT_PLATFORM_SETTINGS);
    saveMaterials(INITIAL_MATERIALS);
    saveMembers(INITIAL_MEMBERS);
    savePrompts(DEFAULT_PROMPTS);
    saveTools(DEFAULT_TOOLS);
    savePlatformSettings(DEFAULT_PLATFORM_SETTINGS);
    showToast('info', 'Semua data dan pengaturan telah di-reset ke kondisi awal.');
  };

  const handleImportBackup = (importedData: {
    materials?: LearningMaterial[];
    members?: MemberUser[];
    settings?: PlatformSettings;
    prompts?: PromptItem[];
    tools?: ToolItem[];
  }) => {
    if (importedData.materials && Array.isArray(importedData.materials)) {
      const sanitizedMats = deduplicateMaterials(importedData.materials);
      setMaterials(sanitizedMats);
      saveMaterials(sanitizedMats);
    }
    if (importedData.members && Array.isArray(importedData.members)) {
      const sanitizedMems = deduplicateMembers(importedData.members);
      setMembers(sanitizedMems);
      saveMembers(sanitizedMems);
    }
    if (importedData.prompts && Array.isArray(importedData.prompts)) {
      const sanitizedPrompts = deduplicatePrompts(importedData.prompts);
      setPrompts(sanitizedPrompts);
      savePrompts(sanitizedPrompts);
    }
    if (importedData.tools && Array.isArray(importedData.tools)) {
      const sanitizedTools = deduplicateTools(importedData.tools);
      setTools(sanitizedTools);
      saveTools(sanitizedTools);
    }
    if (importedData.settings) {
      setPlatformSettings(importedData.settings);
      savePlatformSettings(importedData.settings);
    }
    showToast('success', 'Cadangan data berhasil dipulihkan.');
  };

  // Prompts Handlers
  const handleSavePrompt = (newPrompt: PromptItem) => {
    setPrompts((prev) => {
      const idx = prev.findIndex((p) => p.id === newPrompt.id);
      let updated: PromptItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = newPrompt;
      } else {
        updated = [newPrompt, ...prev];
      }
      savePrompts(updated);
      return updated;
    });
  };

  const handleDeletePrompt = (promptId: string) => {
    setPrompts((prev) => {
      const updated = prev.filter((p) => p.id !== promptId);
      savePrompts(updated);
      return updated;
    });
  };

  const handleResetPrompts = () => {
    setPrompts(DEFAULT_PROMPTS);
    savePrompts(DEFAULT_PROMPTS);
  };

  // Tools Handlers
  const handleSaveTool = (newTool: ToolItem) => {
    setTools((prev) => {
      const idx = prev.findIndex((t) => t.id === newTool.id);
      let updated: ToolItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = newTool;
      } else {
        updated = [...prev, newTool];
      }
      saveTools(updated);
      return updated;
    });
  };

  const handleDeleteTool = (toolId: string) => {
    setTools((prev) => {
      const updated = prev.filter((t) => t.id !== toolId);
      saveTools(updated);
      return updated;
    });
  };

  const handleResetTools = () => {
    setTools(DEFAULT_TOOLS);
    saveTools(DEFAULT_TOOLS);
  };

  const handleReorderTools = (reordered: ToolItem[]) => {
    setTools(reordered);
    saveTools(reordered);
  };


  // Navigation helper for Member Portal & sub-menus
  const handleNavigateMember = (tab: 'learning' | 'prompts' | 'tools' = 'learning') => {
    setMemberActiveTab(tab);
    setCurrentView('member');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (user: MemberUser) => {
    setCurrentUser(user);
    showToast('success', `Selamat datang kembali, ${user.name}!`);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      handleNavigateMember('learning');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    showToast('info', 'Anda telah keluar dari akun.');
  };

  // Member Bookmark & Completion Handlers
  const handleToggleCompleted = (materialId: string) => {
    if (!currentUser) {
      setIsMemberLoginOpen(true);
      return;
    }

    const alreadyDone = currentUser.completedMaterials.includes(materialId);
    const updatedCompleted = alreadyDone
      ? currentUser.completedMaterials.filter((id) => id !== materialId)
      : [...currentUser.completedMaterials, materialId];

    const updatedUser: MemberUser = {
      ...currentUser,
      completedMaterials: updatedCompleted,
    };

    setCurrentUser(updatedUser);
    setMembers((prev) => prev.map((m) => (m.id === updatedUser.id ? updatedUser : m)));
    showToast(
      'success',
      alreadyDone ? 'Status selesai dibatalkan.' : 'Materi ditandai sudah selesai dipelajari!'
    );
  };

  const handleToggleBookmark = (materialId: string) => {
    if (!currentUser) {
      setIsMemberLoginOpen(true);
      return;
    }

    const alreadyBookmarked = currentUser.bookmarkedMaterials.includes(materialId);
    const updatedBookmarks = alreadyBookmarked
      ? currentUser.bookmarkedMaterials.filter((id) => id !== materialId)
      : [...currentUser.bookmarkedMaterials, materialId];

    const updatedUser: MemberUser = {
      ...currentUser,
      bookmarkedMaterials: updatedBookmarks,
    };

    setCurrentUser(updatedUser);
    setMembers((prev) => prev.map((m) => (m.id === updatedUser.id ? updatedUser : m)));
    showToast(
      'info',
      alreadyBookmarked ? 'Dihapus dari bookmark' : 'Materi disimpan ke bookmark!'
    );
  };

  const handleSaveNote = (materialId: string, note: string) => {
    if (!currentUser) return;
    const updatedUser: MemberUser = {
      ...currentUser,
      notes: {
        ...(currentUser.notes || {}),
        [materialId]: note,
      },
    };
    setCurrentUser(updatedUser);
    setMembers((prev) => prev.map((m) => (m.id === updatedUser.id ? updatedUser : m)));
  };

  // Admin Material Handlers
  const handleSaveMaterial = (material: LearningMaterial) => {
    setMaterials((prev) => {
      const idx = prev.findIndex((m) => m.id === material.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = material;
        return copy;
      }
      return [material, ...prev];
    });
    showToast('success', `Materi "${material.title}" berhasil disimpan.`);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== materialId);
      saveMaterials(updated);
      return updated;
    });
  };

  const handleSaveMember = (newMem: MemberUser) => {
    setMembers((prev) => [newMem, ...prev.filter((m) => m.id !== newMem.id)]);
    showToast('success', `Member ${newMem.name} berhasil disimpan.`);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== memberId);
      saveMembers(updated);
      return updated;
    });
  };

  // Google Sheets & Apps Script Sync Handlers
  const handleTestConnection = async () => {
    if (!syncConfig.appsScriptUrl) {
      showToast('error', 'Masukkan URL Google Apps Script terlebih dahulu.');
      return;
    }

    setIsSyncing(true);
    const result = await testAppsScriptConnection(syncConfig.appsScriptUrl);
    setIsSyncing(false);

    if (result.success) {
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'success',
        lastError: undefined,
      }));
      const updatedLogs = addSyncLog({
        type: 'ping',
        status: 'success',
        message: 'Koneksi ke Google Apps Script berhasil diverifikasi.',
      });
      setSyncLogs(updatedLogs);
      showToast('success', result.message);
    } else {
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'error',
        lastError: result.message,
      }));
      const updatedLogs = addSyncLog({
        type: 'ping',
        status: 'error',
        message: result.message,
      });
      setSyncLogs(updatedLogs);
      showToast('error', result.message);
    }
  };

  const handlePullFromSheet = async () => {
    if (!syncConfig.appsScriptUrl) {
      showToast('error', 'URL Apps Script belum diatur.');
      return;
    }

    setIsSyncing(true);
    const result = await fetchFromGoogleSheet(syncConfig.appsScriptUrl);
    setIsSyncing(false);

    if (result.success) {
      if (result.materials && result.materials.length > 0) {
        setMaterials(deduplicateMaterials(result.materials));
      }
      if (result.members && result.members.length > 0) {
        setMembers(deduplicateMembers(result.members));
      }

      const timestamp = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'success',
        lastSyncTimestamp: timestamp,
        lastError: undefined,
      }));

      const updatedLogs = addSyncLog({
        type: 'pull',
        status: 'success',
        message: `Menarik data sukses: ${result.materials?.length || 0} materi dari Google Sheets.`,
        itemsCount: result.materials?.length,
      });
      setSyncLogs(updatedLogs);
      showToast('success', result.message);
    } else {
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'error',
        lastError: result.message,
      }));
      const updatedLogs = addSyncLog({
        type: 'pull',
        status: 'error',
        message: result.message,
      });
      setSyncLogs(updatedLogs);
      showToast('error', result.message);
    }
  };

  const handlePushToSheet = async () => {
    if (!syncConfig.appsScriptUrl) {
      showToast('error', 'URL Apps Script belum diatur.');
      return;
    }

    setIsSyncing(true);
    const result = await pushToGoogleSheet(syncConfig.appsScriptUrl, materials, members);
    setIsSyncing(false);

    if (result.success) {
      const timestamp = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'success',
        lastSyncTimestamp: timestamp,
        lastError: undefined,
      }));

      const updatedLogs = addSyncLog({
        type: 'push',
        status: 'success',
        message: `Menyimpan ${materials.length} materi ke Google Sheets.`,
        itemsCount: materials.length,
      });
      setSyncLogs(updatedLogs);
      showToast('success', result.message);
    } else {
      setSyncConfig((prev) => ({
        ...prev,
        syncStatus: 'error',
        lastError: result.message,
      }));
      const updatedLogs = addSyncLog({
        type: 'push',
        status: 'error',
        message: result.message,
      });
      setSyncLogs(updatedLogs);
      showToast('error', result.message);
    }
  };

  const handleTriggerSync = async () => {
    if (!syncConfig.appsScriptUrl) {
      setCurrentView('sync');
      showToast('info', 'Silakan masukkan URL Google Apps Script Anda untuk memulai sinkronisasi.');
      return;
    }
    await handlePullFromSheet();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050b17] text-slate-100 cyber-grid-pattern selection:bg-sky-500/30 selection:text-sky-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-8 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 max-w-sm">
          <div
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-200 border-rose-500/50 shadow-rose-950/50'
                : 'bg-sky-950/95 text-sky-200 border-sky-500/50 shadow-sky-950/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-sky-400" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Bar if active */}
      {platformSettings.isBroadcastActive && platformSettings.broadcastMessage && !dismissBroadcast && (
        <div className={`border-b px-4 py-2 text-xs flex items-center justify-between ${
          platformSettings.accentColor === 'amber'
            ? 'bg-gradient-to-r from-amber-950 via-[#261506] to-[#09152b] border-amber-500/40 text-amber-200'
            : platformSettings.accentColor === 'cyan'
            ? 'bg-gradient-to-r from-sky-950 via-[#071d36] to-[#09152b] border-sky-500/40 text-sky-200'
            : 'bg-gradient-to-r from-emerald-950 via-[#06241a] to-[#09152b] border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <span className={`p-1 rounded-md ${
              platformSettings.accentColor === 'amber'
                ? 'bg-amber-500/20 text-amber-400'
                : platformSettings.accentColor === 'cyan'
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Bell className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className={`font-semibold ${
              platformSettings.accentColor === 'amber'
                ? 'text-amber-300'
                : platformSettings.accentColor === 'cyan'
                ? 'text-sky-300'
                : 'text-emerald-300'
            }`}>Pengumuman:</span>
            <span>{platformSettings.broadcastMessage}</span>
          </div>
          <button
            onClick={() => setDismissBroadcast(true)}
            className="p-1 hover:text-white opacity-70 hover:opacity-100 rounded transition-colors cursor-pointer"
            title="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: HOME (Exact match with user's reference Screenshot 11) */}
        {currentView === 'home' && (
          <HeroReference
            onOpenLoginModal={() => setIsMemberLoginOpen(true)}
            onOpenAdminModal={() => setIsAdminLoginOpen(true)}
            currentUser={currentUser}
            onNavigateCatalog={() => setCurrentView('catalog')}
            onNavigateMember={handleNavigateMember}
            materialsCount={materials.length}
            bannerImageUrl={platformSettings.bannerImageUrl}
            accentColor={platformSettings.accentColor}
            platformSettings={platformSettings}
          />
        )}

        {/* VIEW 2: FULL CATALOG */}
        {currentView === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-800/40 text-sky-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Katalog Materi Pembelajaran
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Jelajahi seluruh video tutorial, snippet HTML, gambar diagram, dan file pendukung dari Saung Digital.
              </p>
            </div>

            <MaterialCatalog
              materials={materials}
              currentUser={currentUser}
              onSelectMaterial={(mat) => setSelectedMaterial(mat)}
              onToggleBookmark={handleToggleBookmark}
              onToggleCompleted={handleToggleCompleted}
              accentColor={platformSettings.accentColor}
            />
          </div>
        )}

        {/* VIEW 3: GOOGLE SHEETS & APPS SCRIPT SYNC */}
        {currentView === 'sync' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-800/40 text-sky-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
            <SyncManager
              syncConfig={syncConfig}
              onUpdateConfig={setSyncConfig}
              onTestConnection={handleTestConnection}
              onPullFromSheet={handlePullFromSheet}
              onPushToSheet={handlePushToSheet}
              syncLogs={syncLogs}
              materialsCount={materials.length}
              membersCount={members.length}
              isSyncing={isSyncing}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN PANEL */}
        {currentView === 'admin' && (
          <div className="space-y-6">
            <AdminPanel
              materials={materials}
              members={members}
              settings={platformSettings}
              prompts={prompts}
              tools={tools}
              onSaveMaterial={handleSaveMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
              onSavePrompt={handleSavePrompt}
              onDeletePrompt={handleDeletePrompt}
              onResetPrompts={handleResetPrompts}
              onSaveTool={handleSaveTool}
              onDeleteTool={handleDeleteTool}
              onResetTools={handleResetTools}
              onReorderTools={handleReorderTools}
              onUpdateSettings={(newSettings) => {
                setPlatformSettings(newSettings);
                showToast('success', 'Pengaturan berhasil diperbarui!');
              }}
              onResetAllData={handleResetAllData}
              onImportBackup={handleImportBackup}
              onNavigateSync={() => setCurrentView('sync')}
              onLogout={handleLogout}
              showToast={showToast}
            />
          </div>
        )}
        {/* VIEW 5: MEMBER PORTAL (Halaman Member with Learning Progress, UI Prompt Library & Tools) */}
        {currentView === 'member' && (
          <MemberPortal
            currentUser={currentUser}
            materials={materials}
            activeTab={memberActiveTab}
            onTabChange={setMemberActiveTab}
            onSelectMaterial={(mat) => setSelectedMaterial(mat)}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompleted={handleToggleCompleted}
            onOpenLoginModal={() => setIsMemberLoginOpen(true)}
            onNavigateCatalog={() => setCurrentView('catalog')}
            onLogout={handleLogout}
            bannerImageUrl={platformSettings.bannerImageUrl}
            accentColor={platformSettings.accentColor}
            prompts={prompts}
            tools={tools}
            settings={platformSettings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateSync={() => setCurrentView('sync')}
        onNavigateCatalog={() => setCurrentView('catalog')}
        onNavigateMember={handleNavigateMember}
      />

      {/* Material Detail Modal Viewer */}
      {selectedMaterial && (
        <MaterialViewerModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          currentUser={currentUser}
          isCompleted={currentUser?.completedMaterials.includes(selectedMaterial.id) || false}
          isBookmarked={currentUser?.bookmarkedMaterials.includes(selectedMaterial.id) || false}
          onToggleCompleted={handleToggleCompleted}
          onToggleBookmarked={handleToggleBookmark}
          onSaveNote={handleSaveNote}
          initialNote={currentUser?.notes?.[selectedMaterial.id] || ''}
        />
      )}

      {/* Authentication Modals */}
      <AuthModals
        isMemberLoginOpen={isMemberLoginOpen}
        isAdminLoginOpen={isAdminLoginOpen}
        onClose={() => {
          setIsMemberLoginOpen(false);
          setIsAdminLoginOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        members={members}
        settings={platformSettings}
      />
    </div>
  );
}
