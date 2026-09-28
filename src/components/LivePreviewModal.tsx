import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Play, Maximize2, Sparkles, Code2 } from 'lucide-react';
import { PromptItem } from '../types';

interface LivePreviewModalProps {
  prompt: PromptItem;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ prompt, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas');

  // Matrix Rain or Cyber Grid animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'canvas') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    if (prompt.previewType === 'matrix') {
      // Matrix Digital Rain
      const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

      const render = () => {
        ctx.fillStyle = 'rgba(6, 12, 24, 0.12)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Glowing head character
          ctx.fillStyle = '#a7f3d0';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#10b981';
          ctx.fillText(text, x, y);

          // Body character
          ctx.fillStyle = '#059669';
          ctx.shadowBlur = 0;

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    } else if (prompt.previewType === 'grid') {
      // 3D Perspective Cyber Grid
      let offset = 0;
      const horizonY = height * 0.55;

      const render = () => {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        // Sky & Horizon gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, '#040914');
        skyGrad.addColorStop(1, '#0c2242');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Horizon glow
        const glow = ctx.createRadialGradient(width / 2, horizonY, 5, width / 2, horizonY, width * 0.6);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        glow.addColorStop(0.5, 'rgba(14, 165, 233, 0.15)');
        glow.addColorStop(1, 'rgba(6, 12, 24, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Perspective Ground Grid
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 5;

        // Vanishing point perspective lines
        const numLines = 26;
        for (let i = -numLines; i <= numLines; i++) {
          const xStart = width / 2 + i * 20;
          const xEnd = width / 2 + i * (width / 4);
          ctx.beginPath();
          ctx.moveTo(xStart, horizonY);
          ctx.lineTo(xEnd, height);
          ctx.stroke();
        }

        // Horizontal moving lines
        offset = (offset + 0.8) % 40;
        for (let y = horizonY; y < height; y += (y - horizonY + 5) * 0.18) {
          const currentY = y + (offset * ((y - horizonY) / height));
          if (currentY > horizonY && currentY < height) {
            ctx.beginPath();
            ctx.moveTo(0, currentY);
            ctx.lineTo(width, currentY);
            ctx.stroke();
          }
        }

        ctx.shadowBlur = 0;
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    } else if (prompt.previewType === 'starfield') {
      // 3D Starfield Warp
      const numStars = 400;
      const stars = Array.from({ length: numStars }, () => ({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
      }));

      const render = () => {
        ctx.fillStyle = 'rgba(6, 12, 24, 0.2)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.z -= 4;
          if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * width * 2;
            s.y = (Math.random() - 0.5) * height * 2;
            s.z = width;
          }

          const k = 250 / s.z;
          const px = s.x * k + cx;
          const py = s.y * k + cy;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const size = Math.min((1 - s.z / width) * 2.8, 3.5);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    } else {
      // Particle Network / Ambient Nodes
      const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1.5,
      }));

      const render = () => {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        // Update positions
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });

        // Draw connections
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 110})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw dots
        particles.forEach((p) => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
      };
      render();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prompt.previewType, viewMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#071326] border border-sky-600/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-900/40 flex items-center justify-between bg-[#08172e]/90">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                  {prompt.category} {prompt.numberTag}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  LIVE INTERACTIVE
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {prompt.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#050f1d] p-1 rounded-xl border border-sky-800/40 flex items-center text-xs">
              <button
                onClick={() => setViewMode('canvas')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'canvas' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Render
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'code' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Prompt Code
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040a14]">
          {viewMode === 'canvas' ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-sky-700/40 shadow-2xl bg-[#060c18] flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-[420px] block" />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-500/30 text-[10px] text-sky-300 font-mono">
                  60 FPS Canvas Simulation
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#08172e] p-3.5 rounded-xl border border-sky-900/40">
                <strong>Deskripsi:</strong> {prompt.description}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#020610] rounded-2xl p-5 border border-sky-900/60 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                {prompt.promptText}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-sky-900/40 bg-[#08172e]/90 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Siap disalin ke ChatGPT, Gemini, Claude, atau Cursor.
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Prompt Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Prompt Sekarang</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
