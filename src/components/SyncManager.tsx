import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  UploadCloud,
  DownloadCloud,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { SyncConfig, SyncLog, LearningMaterial, MemberUser, PlatformSettings } from '../types';
import { generateAppsScriptCode } from '../services/googleSheetsSync';

interface SyncManagerProps {
  syncConfig: SyncConfig;
  onUpdateConfig: (config: SyncConfig) => void;
  onTestConnection: () => Promise<void>;
  onPullFromSheet: () => Promise<void>;
  onPushToSheet: () => Promise<void>;
  syncLogs: SyncLog[];
  materialsCount: number;
  membersCount: number;
  promptsCount?: number;
  toolsCount?: number;
  settings?: PlatformSettings;
  isSyncing: boolean;
}

export const SyncManager: React.FC<SyncManagerProps> = ({
  syncConfig,
  onUpdateConfig,
  onTestConnection,
  onPullFromSheet,
  onPushToSheet,
  syncLogs,
  materialsCount,
  membersCount,
  promptsCount = 0,
  toolsCount = 0,
  settings,
  isSyncing,
}) => {
  const envGasUrl = (import.meta.env.VITE_GAS_API_URL as string) || '';
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'code' | 'logs'>('config');
  const [tempUrl, setTempUrl] = useState(syncConfig.appsScriptUrl || envGasUrl);

  const appsScriptCode = generateAppsScriptCode();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(appsScriptCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSaveUrl = () => {
    onUpdateConfig({
      ...syncConfig,
      appsScriptUrl: tempUrl.trim(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#09172e] via-[#0b1c3a] to-[#071326] border border-sky-600/30 shadow-xl shadow-sky-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Integrasi Database No-Cost
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Google Sheets &amp; Apps Script Sync
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sinkronkan koleksi materi pembelajaran, video, tautan file, dan status member secara real-time langsung ke spreadsheet Google Sheets pribadi Anda tanpa biaya server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onPullFromSheet}
              disabled={isSyncing || !syncConfig.appsScriptUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <DownloadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Tarik dari Sheets</span>
            </button>
            <button
              onClick={onPushToSheet}
              disabled={isSyncing || !syncConfig.appsScriptUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>Simpan ke Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-900/40 pb-2">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'config'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Konfigurasi Endpoint URL
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'code'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Salin Kode Apps Script (Code.gs)</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Riwayat Log Sinkronisasi ({syncLogs.length})
        </button>
      </div>

      {/* Tab 1: Config */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-700/20 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>URL Web App Google Apps Script</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Masukkan URL Web App hasil deploy dari Google Apps Script spreadsheet Anda. Format URL biasanya berakhiran <code className="text-sky-300 bg-sky-950 px-1 py-0.5 rounded">/exec</code>.
              </p>

              <div className="space-y-2">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#060c18] border border-sky-800/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />

                {envGasUrl && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="px-1.5 py-0.5 rounded bg-sky-900 text-sky-300 font-mono font-bold text-[10px] shrink-0">
                        VITE_GAS_API_URL
                      </span>
                      <span className="truncate text-slate-300">
                        Default Env: {envGasUrl}
                      </span>
                    </div>
                    {tempUrl !== envGasUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempUrl(envGasUrl);
                          onUpdateConfig({
                            ...syncConfig,
                            appsScriptUrl: envGasUrl,
                          });
                        }}
                        className="px-2 py-1 rounded bg-sky-600/80 hover:bg-sky-600 text-white font-semibold cursor-pointer shrink-0 transition text-[10px]"
                      >
                        Pakai URL Env
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Simpan URL Endpoint
                  </button>

                  <button
                    onClick={onTestConnection}
                    disabled={isSyncing || !tempUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi (Ping)</span>
                  </button>
                </div>
              </div>

              {/* Status indicator */}
              <div className="pt-2">
                {syncConfig.syncStatus === 'success' && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Terkoneksi dengan lancar ke Google Sheets &amp; Apps Script.</span>
                  </div>
                )}
                {syncConfig.syncStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{syncConfig.lastError || 'Koneksi gagal atau URL belum valid.'}</span>
                  </div>
                )}
                {!syncConfig.appsScriptUrl && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Saat ini aplikasi menggunakan database lokal (localStorage) dengan data bawaan Saung Digital. Tempel URL Apps Script Anda untuk sinkronisasi cloud Google Sheets.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick 5-Step Tutorial */}
            <div className="p-6 rounded-2xl bg-[#081224] border border-sky-700/20 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Panduan 5 Langkah Membuat Database Google Sheets</span>
              </h3>

              <ol className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-700/40 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-sky-400 underline font-medium">sheets.new</a> untuk membuat spreadsheet Google Sheets kosong baru di akun Google Anda. Beri nama misal <strong>"Saung Digital Database"</strong>.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-700/40 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    Di menu atas Google Sheets, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-700/40 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    Buka tab <strong>"Salin Kode Apps Script"</strong> di halaman ini, klik tombol <strong>"Salin Seluruh Kode"</strong>, lalu hapus semua kode di editor Apps Script dan tempelkan. Simpan (Ctrl+S).
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-700/40 font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    Klik tombol biru <strong>Deploy (Terapkan)</strong> &gt; <strong>New deployment (Penerapan baru)</strong>. Pilih tipe roda gigi: <strong>Web app</strong>. Atur:
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                      <li><strong>Execute as:</strong> Me (Akun Anda)</li>
                      <li><strong>Who has access:</strong> <strong className="text-amber-300">Anyone (Siapa saja)</strong></li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-700/40 font-bold flex items-center justify-center shrink-0">5</span>
                  <div>
                    Klik <strong>Deploy</strong>, lakukan Authorize access (klik Advanced &gt; Go to ...), lalu salin <strong>Web app URL</strong> dan tempel di formulir di atas!
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#081224] border border-sky-700/20 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status 5 Database Terpadu
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">1. Materi Belajar:</span>
                  <span className="text-white font-semibold tabular-nums">{materialsCount} Modul</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">2. Member &amp; Akun:</span>
                  <span className="text-white font-semibold tabular-nums">{membersCount} Akun</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">3. UI Prompt Library:</span>
                  <span className="text-purple-300 font-semibold tabular-nums">{promptsCount} Prompt</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">4. UI Member Tools:</span>
                  <span className="text-emerald-300 font-semibold tabular-nums">{toolsCount} Alat</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">5. Pengaturan &amp; Logo:</span>
                  <span className="text-amber-300 font-semibold">
                    {settings?.bannerImageUrl ? 'Logo Kustom Aktif' : 'Tersinkron'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Mode Penyimpanan:</span>
                  <span className="text-sky-300 font-semibold">
                    {syncConfig.appsScriptUrl ? 'Cloud Google Sheets (5 Tab)' : 'Local Storage Cache'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Terakhir Sync:</span>
                  <span className="text-slate-300">
                    {syncConfig.lastSyncTimestamp || 'Belum pernah'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#09172e] border border-sky-600/30 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Multi-Tab Google Sheets
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Skrip Apps Script otomatis menginisialisasi 5 tab terpisah di Google Spreadsheet: <code className="text-sky-300">Materi</code>, <code className="text-yellow-300">Members</code>, <code className="text-purple-300">Prompts</code>, <code className="text-emerald-300">Tools</code>, dan <code className="text-amber-300">Pengaturan</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Code Viewer */}
      {activeTab === 'code' && (
        <div className="p-6 rounded-2xl bg-[#081224] border border-sky-700/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Kode Google Apps Script (Code.gs) - Versi 5 Database</h3>
              <p className="text-xs text-slate-400">
                Skrip ini otomatis membuat dan mengelola 5 tab spreadsheet ("Materi", "Members", "Prompts", "Tools", dan "Pengaturan") lengkap dengan skema kolom terstruktur.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode'}</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-[#040812] border border-sky-900/40 p-4 font-mono text-xs text-sky-200 overflow-x-auto max-h-[500px]">
            <pre>{appsScriptCode}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-[#081224] border border-sky-700/20 space-y-4">
          <h3 className="text-base font-bold text-white">Riwayat Log Sinkronisasi</h3>
          {syncLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada riwayat aktivitas sinkronisasi. Klik "Tarik dari Sheets" atau "Uji Koneksi" untuk memulai.
            </div>
          ) : (
            <div className="space-y-2">
              {syncLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#060c18] border border-slate-800 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
