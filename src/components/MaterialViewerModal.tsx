import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Download,
  Code2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Save,
  Eye,
  Calendar,
} from 'lucide-react';
import { LearningMaterial, MemberUser } from '../types';

interface MaterialViewerModalProps {
  material: LearningMaterial | null;
  onClose: () => void;
  currentUser: MemberUser | null;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleCompleted: (materialId: string) => void;
  onToggleBookmarked: (materialId: string) => void;
  onSaveNote: (materialId: string, note: string) => void;
  initialNote?: string;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({
  material,
  onClose,
  currentUser,
  isCompleted,
  isBookmarked,
  onToggleCompleted,
  onToggleBookmarked,
  onSaveNote,
  initialNote = '',
}) => {
  if (!material) return null;

  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'notes'>('content');
  const [userNote, setUserNote] = useState(initialNote);
  const [noteSaved, setNoteSaved] = useState(false);

  // Extract YouTube ID safely
  const getEmbedUrl = (url?: string, ytId?: string) => {
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  const handleSaveNote = () => {
    onSaveNote(material.id, userNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#081224] border border-sky-600/30 rounded-2xl shadow-2xl shadow-sky-950/60 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0a172e] border-b border-sky-900/40 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20 whitespace-nowrap">
              {material.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">·</span>
            <span className="text-xs text-sky-400 font-medium hidden sm:inline">
              {material.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                <button
                  onClick={() => onToggleBookmarked(material.id)}
                  title={isBookmarked ? 'Hapus dari bookmark' : 'Simpan bookmark'}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => onToggleCompleted(material.id)}
                  title={isCompleted ? 'Batalkan status selesai' : 'Tandai selesai'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Selesai' : 'Tandai Selesai'}</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Main Title & Metadata */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {material.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {material.duration || '5-10 Menit'}
              </span>
              <span>·</span>
              <span>Oleh: {material.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(material.updatedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-sm text-slate-300 pt-1 leading-relaxed">
              {material.description}
            </p>
          </div>

          {/* Video Player Display (if video material) */}
          {(material.type === 'video' || material.videoUrl) && (
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-sky-600/30 shadow-lg">
                <iframe
                  src={getEmbedUrl(material.videoUrl, material.youtubeId)}
                  title={material.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Interactive HTML Runner Display (if HTML material) */}
          {material.type === 'html' && material.htmlCode && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sky-900/40 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      activeTab === 'content'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Live Output Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 inline mr-1" />
                    Source Code
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">Sandboxed Environment</span>
              </div>

              {activeTab === 'content' ? (
                <div className="w-full h-[360px] rounded-xl overflow-hidden bg-[#060c18] border border-sky-600/30 shadow-inner">
                  <iframe
                    srcDoc={material.htmlCode}
                    title="Live Code Preview"
                    sandbox="allow-scripts allow-modals"
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-[#050b16] border border-slate-700/60 p-4 font-mono text-xs text-sky-200 overflow-x-auto max-h-[360px]">
                  <pre>{material.htmlCode}</pre>
                </div>
              )}
            </div>
          )}

          {/* Image Material Display */}
          {material.type === 'image' && material.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-sky-700/30 bg-[#060e1d]">
              <img
                src={material.imageUrl}
                alt={material.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          {/* Article & Text Content Reader */}
          {material.content && (
            <div className="prose prose-invert max-w-none p-5 rounded-xl bg-[#09152b] border border-sky-900/30 text-slate-200 text-sm leading-relaxed space-y-3 whitespace-pre-line">
              <div className="font-semibold text-sky-400 flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4" />
                <span>Rangkuman Materi &amp; Panduan</span>
              </div>
              {material.content}
            </div>
          )}

          {/* Downloadable Attachment (File/PDF/Excel) */}
          {material.attachmentUrl && (
            <div className="p-4 rounded-xl bg-[#0a1833] border border-sky-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/40">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {material.attachmentName || 'Berkas Pendukung Pembelajaran'}
                  </div>
                  <div className="text-xs text-slate-400">File materi siap diunduh</div>
                </div>
              </div>
              <a
                href={material.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Unduh File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Personal Member Notes Tab / Section */}
          {currentUser && (
            <div className="p-4 rounded-xl bg-[#071224] border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Catatan Pribadi Anda</span>
                </label>
                {noteSaved && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Tersimpan!
                  </span>
                )}
              </div>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Tulis ringkasan atau catatan poin penting dari materi ini untuk dibaca kembali nanti..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#0b162a] border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </div>
          )}

          {/* Tags Footer */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-slate-400 mr-1">Topik:</span>
              {material.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#0f2142] text-sky-300 border border-sky-800/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
