import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Play,
  Send,
  Sparkles,
  Download,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  Palette,
  Terminal,
} from 'lucide-react';
import { generateAppsScriptCode, loadSyncConfig } from '../services/googleSheetsSync';
import { ToolItem } from '../types';

interface ToolViewerModalProps {
  tool: ToolItem;
  onClose: () => void;
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

export const ToolViewerModal: React.FC<ToolViewerModalProps> = ({ tool, onClose }) => {
  // Tabs inside tool viewer
  const [activeTab, setActiveTab] = useState<'app' | 'guide'>('app');
  const [copied, setCopied] = useState(false);
  const [hasRequestedAccess, setHasRequestedAccess] = useState(false);

  // States for V1 Apps Script
  const [sheetName, setSheetName] = useState('DataSiswa_2026');
  const [columns, setColumns] = useState('ID, NamaLengkap, Email, WhatsApp, Kursus, Status, Tanggal');

  // States for V2 Neon Studio
  const [neonColor, setNeonColor] = useState('#00f2fe');
  const [neonBlur, setNeonBlur] = useState(25);
  const [neonText, setNeonText] = useState('SAUNG DIGITAL');

  // States for Poster UMKM
  const [umkmBrand, setUmkmBrand] = useState('Kopi Nusantara');
  const [umkmPromo, setUmkmPromo] = useState('Diskon 50% Semua Menu');
  const [umkmContact, setUmkmContact] = useState('WhatsApp: 0812-3456-7890');

  const adminUploadedUrl =
    (typeof window !== 'undefined' ? loadSyncConfig().appsScriptUrl : '') ||
    (import.meta.env.VITE_GAS_API_URL as string) ||
    'https://script.google.com/macros/s/AKfycbwOfuFCKuCUrBC34EJmCkw7ZlbwHcCkqhbgQXjQ4Gk9t8vW8KfQpGbsPKMq3hU7WzAW/exec';

  const directUrl = formatUrl(tool.toolUrl || adminUploadedUrl);

  // Generated code for V1
  const generatedCode = `/**
 * SAUNG DIGITAL - ULTIMATE WEB V.1 (GAS GENERATOR)
 * Target Sheet: ${sheetName}
 * Created: ${new Date().toLocaleDateString('id-ID')}
 */
var SHEET_NAME = '${sheetName}';
var COLUMN_HEADERS = [${columns.split(',').map((c) => `'${c.trim()}'`).join(', ')}];

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || initSheet(ss);
  
  if (action === 'getAll') {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    var result = rows.map(function(r) {
      var obj = {};
      headers.forEach(function(h, idx) { obj[h] = r[idx]; });
      return obj;
    });
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || initSheet(ss);
    
    var newRow = COLUMN_HEADERS.map(function(h) { return payload[h] || ''; });
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Data tersimpan!' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initSheet(ss) {
  var s = ss.insertSheet(SHEET_NAME);
  s.appendRow(COLUMN_HEADERS);
  return s;
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#071326] border border-sky-600/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-900/40 flex items-center justify-between bg-[#08172e]/90">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold text-sm">
              🧰
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                  {tool.tag}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {tool.versionBadge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {tool.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition no-underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Tool Asli</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040a14] space-y-5">
          {tool.requiresAdminAccess ? (
            /* Tool V.3 Permission Screen */
            <div className="p-8 text-center rounded-2xl bg-[#08152b] border border-sky-900/40 space-y-4 max-w-lg mx-auto my-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white">Akses Terproteksi</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tool.description}
                <br />
                <span className="text-slate-400 mt-2 block">
                  Silakan ajukan izin ke Administrator Saung Digital untuk mengaktifkan token akses tool ini pada akun Anda.
                </span>
              </p>
              <div className="pt-2">
                {hasRequestedAccess ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Permintaan akses telah terkirim ke Admin Saung Digital!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setHasRequestedAccess(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 transition cursor-pointer"
                  >
                    Ajukan Akses ke Admin
                  </button>
                )}
              </div>
            </div>
          ) : tool.id === 'tool-v1' ? (
            /* ULTIMATE WEB V.1 - GAS Generator */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#08172e] border border-sky-800/40 space-y-3">
                <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Konfigurasi Endpoint Google Apps Script
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Nama Tab Spreadsheet</label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Kolom (Pisahkan Koma)</label>
                    <input
                      type="text"
                      value={columns}
                      onChange={(e) => setColumns(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    Kode Siap Deploy (Code.gs)
                  </span>
                  <button
                    onClick={() => handleCopy(generatedCode)}
                    className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#020610] border border-sky-900/60 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[280px]">
                  {generatedCode}
                </pre>
              </div>
            </div>
          ) : tool.id === 'tool-v2' ? (
            /* ULTIMATE WEB V.2 - Neon UI Studio */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#08172e] border border-sky-800/40 space-y-3 text-xs">
                  <h4 className="font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    Pengaturan Tampilan Neon
                  </h4>
                  <div>
                    <label className="text-slate-400 block mb-1">Teks Komponen</label>
                    <input
                      type="text"
                      value={neonText}
                      onChange={(e) => setNeonText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Warna Cahaya Neon</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={neonColor}
                        onChange={(e) => setNeonColor(e.target.value)}
                        className="w-10 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={neonColor}
                        onChange={(e) => setNeonColor(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Radius Blur Pendaran</span>
                      <span>{neonBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={neonBlur}
                      onChange={(e) => setNeonBlur(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Preview Box */}
                <div className="rounded-xl bg-[#050c18] border border-sky-900/60 p-6 flex flex-col items-center justify-center min-h-[220px]">
                  <div
                    className="p-6 rounded-2xl border transition-all text-center"
                    style={{
                      borderColor: neonColor,
                      boxShadow: `0 0 ${neonBlur}px ${neonColor}88, inset 0 0 ${neonBlur / 2}px ${neonColor}33`,
                      background: 'rgba(9, 24, 48, 0.7)',
                    }}
                  >
                    <span
                      className="text-xl sm:text-2xl font-black uppercase tracking-wider block"
                      style={{
                        color: '#ffffff',
                        textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
                      }}
                    >
                      {neonText}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Live Neon Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* POSTER UMKM Tool */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#08172e] border border-sky-800/40 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Data Promosi UMKM
                  </h4>
                  <div>
                    <label className="text-slate-400 block mb-1">Nama Usaha / Brand</label>
                    <input
                      type="text"
                      value={umkmBrand}
                      onChange={(e) => setUmkmBrand(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Promo Utama</label>
                    <input
                      type="text"
                      value={umkmPromo}
                      onChange={(e) => setUmkmPromo(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Kontak Pemesanan</label>
                    <input
                      type="text"
                      value={umkmContact}
                      onChange={(e) => setUmkmContact(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050f1d] border border-sky-800/60 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Poster Canvas Preview */}
                <div className="rounded-xl bg-gradient-to-br from-amber-950/40 via-[#07152b] to-[#040c1b] border border-amber-500/40 p-6 flex flex-col justify-between min-h-[220px] text-center shadow-xl">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      SPECIAL PROMO
                    </span>
                    <h3 className="text-xl font-black text-white mt-2">{umkmBrand}</h3>
                  </div>

                  <div className="py-4">
                    <div className="inline-block p-3 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 font-extrabold text-lg">
                      {umkmPromo}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium">{umkmContact}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-sky-900/40 bg-[#08172e]/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Disediakan oleh Admin Saung Digital untuk seluruh member.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
