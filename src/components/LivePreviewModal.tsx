import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Play, Eye, Sparkles, RefreshCw } from 'lucide-react';
import { PromptItem } from '../types';

interface LivePreviewModalProps {
  prompt: PromptItem;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ prompt, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas');
  const [fps, setFps] = useState(60);

  // Mouse coordinate tracker for interactive effects
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; clickTime: number }>({
    x: 350,
    y: 210,
    isDown: false,
    clickTime: 0,
  });

  const pType = prompt.previewType || 'matrix';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== 'canvas') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 720);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
      mouseRef.current.clickTime = Date.now();
    };
    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let tick = 0;

    // --- EFFECT ENGINES ---

    // 1. Matrix Rain
    const katakana =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matrixFontSize = 14;
    const matrixCols = Math.max(10, Math.floor(width / matrixFontSize));
    const matrixDrops: number[] = Array.from({ length: matrixCols }, () => Math.floor(Math.random() * -50));

    // 2. Cyber Grid
    let gridOffset = 0;

    // 3. Starfield Warp
    const stars = Array.from({ length: 450 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
    }));

    // 4. Constellation Nodes
    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      r: Math.random() * 2 + 1.5,
    }));

    // 5. Neon Tunnel
    let tunnelAngle = 0;

    // 6. Audio Equalizer
    const eqBarsCount = 42;
    const eqHeights = Array.from({ length: eqBarsCount }, () => Math.random() * 80 + 20);
    const eqPeaks = Array.from({ length: eqBarsCount }, () => 100);

    // 7. Aurora Waves
    let auroraPhase = 0;

    // 8. Laser Scanner
    let laserY = 0;
    let laserDir = 1;

    // 9. DNA Double Helix
    let dnaAngle = 0;

    // 10. Liquid Blob
    let blobPhase = 0;

    // 11. HUD Radar
    let radarAngle = 0;
    const blips = [
      { r: 70, a: 1.2, life: 1 },
      { r: 130, a: 3.4, life: 0.8 },
      { r: 160, a: 5.1, life: 0.5 },
      { r: 90, a: 4.2, life: 0.9 },
    ];

    // 12. Particle Vortex
    const vortexParticles = Array.from({ length: 280 }, () => ({
      dist: Math.random() * 180 + 20,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : 1),
      size: Math.random() * 2.2 + 0.8,
      hue: Math.random() * 60 + 170, // cyan to violet
    }));

    // 13. Spotlight Card
    let spotlightTiltX = 0;
    let spotlightTiltY = 0;

    // 14. Glitch Terminal
    const terminalLines = [
      'SYS_INIT: Booting Neural Engine v4.2.0...',
      'MEM_ALLOC: 4096MB DMA Buffer mapped.',
      'NETWORK: Connecting to saungdigital://core...',
      'AUTH: Handshake verified [RSA-4096 OK]',
      'READY: Type "help" or run diagnostic.',
    ];
    let terminalCursorBlink = 0;

    // 15. Isometric City
    const cityBlocks = Array.from({ length: 36 }, (_, i) => ({
      gx: (i % 6) - 3,
      gy: Math.floor(i / 6) - 3,
      h: Math.floor(Math.sin(i * 1.8) * 35 + 50),
    }));

    // 16. Magnetic Button
    let btnX = width / 2;
    let btnY = height / 2;
    let btnVx = 0;
    let btnVy = 0;
    const btnSparks: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    // 17. Tesseract Hypercube
    let tessAngle = 0;

    // 18. Firefly Forest
    const fireflies = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      blinkRate: Math.random() * 0.04 + 0.02,
      blinkPhase: Math.random() * Math.PI * 2,
      radius: Math.random() * 3 + 2,
      color: Math.random() > 0.4 ? '#f59e0b' : '#10b981',
    }));

    // 19. Nixie Clock
    // 20. Sonic Ripples
    const ripples: { x: number; y: number; r: number; maxR: number; alpha: number; color: string }[] = [];

    // 21. Circuit Board
    const circuits = Array.from({ length: 18 }, (_, i) => ({
      startX: 30 + (i * 38) % width,
      startY: (i * 30) % height,
      progress: Math.random(),
      speed: Math.random() * 0.01 + 0.005,
      color: i % 2 === 0 ? '#00f2fe' : '#10b981',
    }));

    // 22. Energy Shield
    const hexRadius = 24;
    const hexHeight = Math.sqrt(3) * hexRadius;

    // 23. Quantum Strings
    let stringPhase = 0;

    // 24. Orbital Rings
    let orbitRoll = 0;

    // MAIN RENDER LOOP
    const render = () => {
      tick++;
      frameCount++;
      const now = performance.now();
      if (now - lastFpsUpdate >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // --- 1. MATRIX RAIN ---
      if (pType === 'matrix') {
        ctx.fillStyle = 'rgba(6, 12, 24, 0.12)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${matrixFontSize}px monospace`;

        for (let i = 0; i < matrixDrops.length; i++) {
          const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
          const x = i * matrixFontSize;
          const y = matrixDrops[i] * matrixFontSize;

          ctx.fillStyle = '#a7f3d0';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#10b981';
          ctx.fillText(char, x, y);

          ctx.fillStyle = '#059669';
          ctx.shadowBlur = 0;

          if (y > height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        }
      }

      // --- 2. CYBER GRID ---
      else if (pType === 'cyber-grid' || pType === 'grid') {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        const horizonY = height * 0.52;
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(1, '#0e2348');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Horizon glow
        const glow = ctx.createRadialGradient(width / 2, horizonY, 5, width / 2, horizonY, width * 0.6);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        glow.addColorStop(0.5, 'rgba(14, 165, 233, 0.15)');
        glow.addColorStop(1, 'rgba(6, 12, 24, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Vanishing lines
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 6;

        const numLines = 28;
        for (let i = -numLines; i <= numLines; i++) {
          const xStart = width / 2 + i * 18;
          const xEnd = width / 2 + i * (width / 3.8);
          ctx.beginPath();
          ctx.moveTo(xStart, horizonY);
          ctx.lineTo(xEnd, height);
          ctx.stroke();
        }

        // Horizontal moving lines
        gridOffset = (gridOffset + 0.9) % 36;
        for (let y = horizonY; y < height; y += (y - horizonY + 6) * 0.19) {
          const currentY = y + (gridOffset * ((y - horizonY) / height));
          if (currentY > horizonY && currentY < height) {
            ctx.beginPath();
            ctx.moveTo(0, currentY);
            ctx.lineTo(width, currentY);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      }

      // --- 3. STARFIELD WARP SPEED ---
      else if (pType === 'starfield-warp' || pType === 'starfield') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.22)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const speed = mouseRef.current.isDown ? 12 : 5;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.z -= speed;
          if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * width * 2;
            s.y = (Math.random() - 0.5) * height * 2;
            s.z = width;
          }

          const k = 260 / s.z;
          const px = s.x * k + cx;
          const py = s.y * k + cy;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const size = Math.min((1 - s.z / width) * 3.2, 4);
            ctx.fillStyle = s.z < width * 0.3 ? '#ec4899' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Warp tail
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - s.z / width)})`;
            ctx.lineWidth = size * 0.8;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - (s.x / width) * 22, py - (s.y / height) * 22);
            ctx.stroke();
          }
        }
      }

      // --- 4. CONSTELLATION NODES ---
      else if (pType === 'constellation-nodes' || pType === 'particles') {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          // Mouse attractor
          const dxm = mouseRef.current.x - n.x;
          const dym = mouseRef.current.y - n.y;
          const dm = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < 140) {
            n.x += (dxm / dm) * 0.8;
            n.y += (dym / dm) * 0.8;
          }
        });

        // Connecting lines
        ctx.lineWidth = 0.9;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 115) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 115) * 0.8})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        nodes.forEach((n) => {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f2fe';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // --- 5. NEON HEX TUNNEL ---
      else if (pType === 'neon-tunnel') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.25)';
        ctx.fillRect(0, 0, width, height);

        tunnelAngle += 0.015;
        const cx = width / 2;
        const cy = height / 2;
        const hexCount = 18;

        for (let i = 0; i < hexCount; i++) {
          const depth = (i + (tick * 0.05) % 1) / hexCount;
          const radius = Math.pow(depth, 2.2) * (width * 0.65) + 12;
          const angle = tunnelAngle + depth * 0.8;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);

          const hue = (depth * 240 + tick * 0.8) % 360;
          ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
          ctx.lineWidth = 1.8 + depth * 2.5;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 8 * depth;

          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const a = (s * Math.PI) / 3;
            const px = Math.cos(a) * radius;
            const py = Math.sin(a) * radius;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
      }

      // --- 6. AUDIO EQUALIZER ---
      else if (pType === 'audio-equalizer') {
        ctx.fillStyle = '#050c19';
        ctx.fillRect(0, 0, width, height);

        const barWidth = width / (eqBarsCount * 1.5);
        const gap = barWidth * 0.4;
        const startX = (width - eqBarsCount * (barWidth + gap)) / 2;
        const baseY = height * 0.72;

        for (let i = 0; i < eqBarsCount; i++) {
          // Dynamic oscillation
          const target =
            Math.sin(tick * 0.08 + i * 0.2) * 55 +
            Math.cos(tick * 0.04 + i * 0.15) * 40 +
            60 +
            (mouseRef.current.isDown ? Math.random() * 40 : 0);
          eqHeights[i] += (target - eqHeights[i]) * 0.2;

          if (eqHeights[i] > eqPeaks[i]) {
            eqPeaks[i] = eqHeights[i];
          } else {
            eqPeaks[i] -= 0.8;
          }

          const x = startX + i * (barWidth + gap);
          const barH = eqHeights[i];

          // Bar gradient
          const grad = ctx.createLinearGradient(x, baseY, x, baseY - barH);
          grad.addColorStop(0, '#00f2fe');
          grad.addColorStop(0.6, '#8b5cf6');
          grad.addColorStop(1, '#f43f5e');

          ctx.fillStyle = grad;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 8;
          ctx.fillRect(x, baseY - barH, barWidth, barH);

          // Peak dot
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f43f5e';
          ctx.fillRect(x, baseY - eqPeaks[i] - 4, barWidth, 3);

          // Mirror reflection
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.22;
          ctx.fillRect(x, baseY + 6, barWidth, barH * 0.4);
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }

        // Base line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(width, baseY);
        ctx.stroke();
      }

      // --- 7. AURORA WAVES ---
      else if (pType === 'aurora-waves') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);

        auroraPhase += 0.02;
        const waveLayers = [
          { color: 'rgba(16, 185, 129, 0.35)', amp: 55, freq: 0.008, speed: 0.025, base: height * 0.45 },
          { color: 'rgba(6, 182, 212, 0.35)', amp: 45, freq: 0.012, speed: 0.018, base: height * 0.52 },
          { color: 'rgba(139, 92, 246, 0.3)', amp: 65, freq: 0.006, speed: 0.012, base: height * 0.6 },
        ];

        waveLayers.forEach((w) => {
          ctx.fillStyle = w.color;
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 8) {
            const y =
              w.base +
              Math.sin(x * w.freq + auroraPhase * w.speed * 40) * w.amp +
              Math.cos(x * 0.004 + auroraPhase) * 20;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        });
      }

      // --- 8. LASER SCANNER ---
      else if (pType === 'laser-scanner') {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        laserY += 2.5 * laserDir;
        if (laserY > height - 30 || laserY < 30) laserDir *= -1;

        // Background grid dots
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        for (let x = 40; x < width; x += 40) {
          for (let y = 30; y < height; y += 30) {
            ctx.fillRect(x, y, 2, 2);
          }
        }

        // Radar Target Box in center
        const cx = width / 2;
        const cy = height / 2;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 60, cy - 60, 120, 120);

        // Crosshairs
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - 80, cy);
        ctx.lineTo(cx + 80, cy);
        ctx.moveTo(cx, cy - 80);
        ctx.lineTo(cx, cy + 80);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Lock Ring
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.stroke();

        // Scanning Laser Beam
        const beamGrad = ctx.createLinearGradient(0, laserY - 30, 0, laserY + 30);
        beamGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        beamGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.6)');
        beamGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, laserY - 30, width, 60);

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(0, laserY);
        ctx.lineTo(width, laserY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Telemetry Text
        ctx.font = '11px monospace';
        ctx.fillStyle = '#00f2fe';
        ctx.fillText(`SCAN_Y: ${Math.round(laserY)} px  LOCK: ACTIVE  BEAM: 100%`, 24, 30);
      }

      // --- 9. DNA DOUBLE HELIX ---
      else if (pType === 'dna-helix') {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        dnaAngle += 0.025;
        const numPairs = 28;
        const cx = width / 2;
        const cy = height / 2;
        const strandLength = width * 0.75;
        const startX = cx - strandLength / 2;

        for (let i = 0; i < numPairs; i++) {
          const x = startX + (i / numPairs) * strandLength;
          const angle = dnaAngle + i * 0.35;
          const y1 = cy + Math.sin(angle) * 75;
          const z1 = Math.cos(angle);
          const y2 = cy + Math.sin(angle + Math.PI) * 75;
          const z2 = Math.cos(angle + Math.PI);

          // Connecting rung
          const rungAlpha = (z1 + 1.2) / 2.4;
          ctx.strokeStyle = `rgba(56, 189, 248, ${rungAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();

          // Sphere 1 (Cyan)
          const r1 = 4.5 + z1 * 2;
          ctx.fillStyle = '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = z1 > 0 ? 8 : 0;
          ctx.beginPath();
          ctx.arc(x, y1, r1, 0, Math.PI * 2);
          ctx.fill();

          // Sphere 2 (Amber)
          const r2 = 4.5 + z2 * 2;
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = z2 > 0 ? 8 : 0;
          ctx.beginPath();
          ctx.arc(x, y2, r2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // --- 10. LIQUID METABALL ---
      else if (pType === 'liquid-blob') {
        ctx.fillStyle = '#050b17';
        ctx.fillRect(0, 0, width, height);

        blobPhase += 0.03;
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = 90;
        const points = 16;

        ctx.save();
        ctx.translate(cx, cy);

        // Blob path
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const rOffset =
            Math.sin(angle * 3 + blobPhase) * 20 +
            Math.cos(angle * 2 - blobPhase * 1.5) * 15;
          const r = baseRadius + rOffset;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(-20, -20, 10, 0, 0, baseRadius * 1.2);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.5, '#ec4899');
        grad.addColorStop(1, '#8b5cf6');

        ctx.fillStyle = grad;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 24;
        ctx.fill();

        // Inner specular highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-30, -35, 30, 15, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;
      }

      // --- 11. HUD RADAR ---
      else if (pType === 'hud-radar') {
        ctx.fillStyle = '#040a16';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const maxR = 170;

        // Concentric range rings
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1.2;
        [40, 80, 120, 160].forEach((r) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        // Sweep Arm
        radarAngle = (radarAngle + 0.035) % (Math.PI * 2);
        const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(radarAngle);
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxR, -0.4, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxR, 0);
        ctx.stroke();
        ctx.restore();

        // Target Blips
        blips.forEach((b) => {
          const bx = cx + Math.cos(b.a) * b.r;
          const by = cy + Math.sin(b.a) * b.r;
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }

      // --- 12. PARTICLE VORTEX ---
      else if (pType === 'particle-vortex') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        vortexParticles.forEach((p) => {
          p.angle += p.speed;
          p.dist -= 0.15;
          if (p.dist < 8) {
            p.dist = 180 + Math.random() * 40;
          }

          const px = cx + Math.cos(p.angle) * p.dist;
          const py = cy + Math.sin(p.angle) * p.dist * 0.65; // ellipse perspective

          ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Glowing core
        const coreGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 35);
        coreGlow.addColorStop(0, '#ffffff');
        coreGlow.addColorStop(0.3, '#38bdf8');
        coreGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 13. SPOTLIGHT GLASS CARD ---
      else if (pType === 'spotlight-card' || pType === 'glow-card') {
        ctx.fillStyle = '#060d1b';
        ctx.fillRect(0, 0, width, height);

        const cardW = 380;
        const cardH = 240;
        const cardX = (width - cardW) / 2;
        const cardY = (height - cardH) / 2;

        // Smooth tilt
        spotlightTiltX += (mouseRef.current.x - (cardX + cardW / 2) - spotlightTiltX) * 0.1;
        spotlightTiltY += (mouseRef.current.y - (cardY + cardH / 2) - spotlightTiltY) * 0.1;

        // Card background
        ctx.fillStyle = '#0c1b33';
        ctx.strokeStyle = '#1e3a66';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();

        // Spotlight Radial Glow tracking mouse
        const spotGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          10,
          mouseRef.current.x,
          mouseRef.current.y,
          160
        );
        spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        spotGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.1)');
        spotGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 20);
        ctx.clip();
        ctx.fillStyle = spotGrad;
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // Dummy UI layout on card
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('ANALYTICS SPOTLIGHT CARD', cardX + 24, cardY + 45);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Dynamic Cursor Proximity Field', cardX + 24, cardY + 70);

        // Metric badge
        ctx.fillStyle = '#059669';
        ctx.fillRect(cardX + 24, cardY + 95, 75, 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('+98.4% FPS', cardX + 32, cardY + 111);

        // Mini bar chart
        for (let b = 0; b < 10; b++) {
          const bh = 25 + Math.sin(b * 0.8 + tick * 0.05) * 20;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(cardX + 24 + b * 16, cardY + 200 - bh, 10, bh);
        }
        ctx.restore();
      }

      // --- 14. GLITCH TERMINAL ---
      else if (pType === 'glitch-terminal') {
        ctx.fillStyle = '#030811';
        ctx.fillRect(0, 0, width, height);

        // CRT horizontal scanlines
        ctx.fillStyle = 'rgba(0, 255, 100, 0.03)';
        for (let y = 0; y < height; y += 3) {
          ctx.fillRect(0, y, width, 1.5);
        }

        // Terminal text
        ctx.font = '13px monospace';
        ctx.fillStyle = '#10b981';
        terminalLines.forEach((line, idx) => {
          ctx.fillText(`> ${line}`, 30, 60 + idx * 30);
        });

        // Blinking prompt cursor
        terminalCursorBlink = (terminalCursorBlink + 0.05) % 1;
        if (terminalCursorBlink > 0.5) {
          ctx.fillRect(30 + terminalLines.length * 0, 60 + terminalLines.length * 30, 10, 15);
        }

        // Periodic RGB Glitch slice
        if (Math.random() > 0.88) {
          const glitchY = Math.random() * height;
          const glitchH = Math.random() * 25 + 5;
          ctx.fillStyle = 'rgba(236, 72, 153, 0.3)';
          ctx.fillRect(0, glitchY, width, glitchH);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.fillRect(10, glitchY + 3, width, glitchH);
        }
      }

      // --- 15. ISOMETRIC CITY ---
      else if (pType === 'isometric-city') {
        ctx.fillStyle = '#060c18';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height * 0.65;
        const tileW = 55;
        const tileH = 28;

        cityBlocks.forEach((b) => {
          const screenX = cx + (b.gx - b.gy) * tileW;
          const screenY = cy + (b.gx + b.gy) * (tileH * 0.5);
          const topY = screenY - b.h;

          // Building Top Face
          ctx.fillStyle = '#0c284d';
          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(screenX, topY);
          ctx.lineTo(screenX + tileW, topY + tileH * 0.5);
          ctx.lineTo(screenX, topY + tileH);
          ctx.lineTo(screenX - tileW, topY + tileH * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Left Face
          ctx.fillStyle = '#07162c';
          ctx.beginPath();
          ctx.moveTo(screenX - tileW, topY + tileH * 0.5);
          ctx.lineTo(screenX, topY + tileH);
          ctx.lineTo(screenX, screenY + tileH);
          ctx.lineTo(screenX - tileW, screenY + tileH * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right Face
          ctx.fillStyle = '#0a1d38';
          ctx.beginPath();
          ctx.moveTo(screenX, topY + tileH);
          ctx.lineTo(screenX + tileW, topY + tileH * 0.5);
          ctx.lineTo(screenX + tileW, screenY + tileH * 0.5);
          ctx.lineTo(screenX, screenY + tileH);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }

      // --- 16. MAGNETIC BUTTON ---
      else if (pType === 'magnetic-button') {
        ctx.fillStyle = '#060d1b';
        ctx.fillRect(0, 0, width, height);

        // Spring physics
        const targetX = width / 2;
        const targetY = height / 2;
        const dx = mouseRef.current.x - btnX;
        const dy = mouseRef.current.y - btnY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let pullX = targetX;
        let pullY = targetY;
        if (dist < 140) {
          pullX = targetX + dx * 0.45;
          pullY = targetY + dy * 0.45;
        }

        btnVx += (pullX - btnX) * 0.12;
        btnVy += (pullY - btnY) * 0.12;
        btnVx *= 0.78;
        btnVy *= 0.78;
        btnX += btnVx;
        btnY += btnVy;

        // Spawn sparks on click
        if (mouseRef.current.isDown && Date.now() - mouseRef.current.clickTime < 60) {
          for (let s = 0; s < 4; s++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 5 + 3;
            btnSparks.push({
              x: btnX,
              y: btnY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              life: 1.0,
              color: Math.random() > 0.5 ? '#ec4899' : '#00f2fe',
            });
          }
        }

        // Render sparks
        for (let i = btnSparks.length - 1; i >= 0; i--) {
          const sp = btnSparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life -= 0.035;
          if (sp.life <= 0) {
            btnSparks.splice(i, 1);
            continue;
          }
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.life * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Button Body
        const btnW = 190;
        const btnH = 55;
        ctx.fillStyle = '#0284c7';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 16);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MAGNETIC PULL', btnX, btnY);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }

      // --- 17. TESSERACT HYPERCUBE ---
      else if (pType === 'tesseract-cube') {
        ctx.fillStyle = '#050a16';
        ctx.fillRect(0, 0, width, height);

        tessAngle += 0.02;
        const cx = width / 2;
        const cy = height / 2;
        const size1 = 70;
        const size2 = 130;

        const cosA = Math.cos(tessAngle);
        const sinA = Math.sin(tessAngle);

        const project = (x: number, y: number, z: number, scale: number) => {
          const rx = x * cosA - z * sinA;
          const rz = x * sinA + z * cosA;
          return { px: cx + rx * scale, py: cy + y * scale };
        };

        const corners = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ];

        const inner = corners.map(([x, y, z]) => project(x, y, z, size1));
        const outer = corners.map(([x, y, z]) => project(x, y, z, size2));

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 8;

        // Connect inner & outer
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(inner[i].px, inner[i].py);
          ctx.lineTo(outer[i].px, outer[i].py);
          ctx.stroke();
        }

        // Draw cubes
        const drawCubeEdges = (pts: { px: number; py: number }[]) => {
          const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
          ];
          edges.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(pts[a].px, pts[a].py);
            ctx.lineTo(pts[b].px, pts[b].py);
            ctx.stroke();
          });
        };

        drawCubeEdges(inner);
        ctx.strokeStyle = '#ec4899';
        drawCubeEdges(outer);
        ctx.shadowBlur = 0;
      }

      // --- 18. FIREFLY FOREST ---
      else if (pType === 'firefly-forest') {
        ctx.fillStyle = '#030811';
        ctx.fillRect(0, 0, width, height);

        fireflies.forEach((f) => {
          f.x += f.vx;
          f.y += f.vy;
          if (f.x < 0) f.x = width;
          if (f.x > width) f.x = 0;
          if (f.y < 0) f.y = height;
          if (f.y > height) f.y = 0;

          f.blinkPhase += f.blinkRate;
          const alpha = (Math.sin(f.blinkPhase) + 1) / 2;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = f.color;
          ctx.shadowColor = f.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // --- 19. NIXIE TUBE CLOCK ---
      else if (pType === 'nixie-clock') {
        ctx.fillStyle = '#050a14';
        ctx.fillRect(0, 0, width, height);

        const d = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, '0');
        const timeStr = `${hh}:${mm}:${ss}.${ms}`;

        const cx = width / 2;
        const cy = height / 2;

        // Tube frame
        ctx.fillStyle = '#081426';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - 240, cy - 65, 480, 130, 24);
        ctx.fill();
        ctx.stroke();

        // Neon Glow Text
        ctx.font = 'bold 54px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ff7700';
        ctx.shadowColor = '#ff5500';
        ctx.shadowBlur = 24;
        ctx.fillText(timeStr, cx, cy);

        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }

      // --- 20. SONIC RIPPLES ---
      else if (pType === 'sonic-ripples') {
        ctx.fillStyle = '#040915';
        ctx.fillRect(0, 0, width, height);

        // Spawn periodic ripple
        if (tick % 45 === 0) {
          ripples.push({
            x: width / 2,
            y: height / 2,
            r: 5,
            maxR: Math.max(width, height) * 0.7,
            alpha: 1.0,
            color: tick % 90 === 0 ? '#00f2fe' : '#a855f7',
          });
        }

        // Render ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.r += 2.2;
          rp.alpha = 1 - rp.r / rp.maxR;
          if (rp.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = rp.color;
          ctx.globalAlpha = rp.alpha;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      // --- 21. CIRCUIT BOARD ---
      else if (pType === 'circuit-board') {
        ctx.fillStyle = '#040b17';
        ctx.fillRect(0, 0, width, height);

        // Base circuit traces
        ctx.strokeStyle = '#0b264a';
        ctx.lineWidth = 2;
        circuits.forEach((c) => {
          ctx.beginPath();
          ctx.moveTo(c.startX, c.startY);
          ctx.lineTo(c.startX + 80, c.startY);
          ctx.lineTo(c.startX + 120, c.startY + 40);
          ctx.lineTo(c.startX + 220, c.startY + 40);
          ctx.stroke();

          // Solder pad
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(c.startX, c.startY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Electron packet
          c.progress = (c.progress + c.speed) % 1;
          const px = c.startX + c.progress * 220;
          const py = c.progress < 0.36 ? c.startY : c.progress < 0.54 ? c.startY + 40 * ((c.progress - 0.36) / 0.18) : c.startY + 40;

          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // --- 22. ENERGY SHIELD ---
      else if (pType === 'energy-shield') {
        ctx.fillStyle = '#030813';
        ctx.fillRect(0, 0, width, height);

        const rows = Math.ceil(height / (hexHeight * 0.75)) + 1;
        const cols = Math.ceil(width / (hexRadius * 3)) + 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const hx = c * (hexRadius * 3) + ((r % 2) * (hexRadius * 1.5));
            const hy = r * (hexHeight * 0.5);

            const dx = mouseRef.current.x - hx;
            const dy = mouseRef.current.y - hy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const intensity = Math.max(0, 1 - dist / 160);
            ctx.strokeStyle = intensity > 0.1 ? `rgba(0, 242, 254, ${intensity})` : 'rgba(14, 165, 233, 0.12)';
            ctx.lineWidth = intensity > 0.1 ? 2 : 1;

            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const px = hx + Math.cos(angle) * (hexRadius - 2);
              const py = hy + Math.sin(angle) * (hexRadius - 2);
              if (a === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }

      // --- 23. QUANTUM STRINGS ---
      else if (pType === 'quantum-strings') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);

        stringPhase += 0.03;
        const numStrings = 9;

        for (let s = 0; s < numStrings; s++) {
          const cy = height * 0.25 + s * 24;
          const hue = (s * 30 + tick * 0.5) % 360;

          ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();

          for (let x = 0; x <= width; x += 12) {
            const y =
              cy +
              Math.sin(x * 0.015 + stringPhase + s * 0.4) * 28 +
              Math.cos(x * 0.008 - stringPhase) * 18;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // --- 24. ORBITAL RINGS ---
      else if (pType === 'orbital-rings') {
        ctx.fillStyle = '#040a16';
        ctx.fillRect(0, 0, width, height);

        orbitRoll += 0.02;
        const cx = width / 2;
        const cy = height / 2;

        // Plasma Core
        const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#38bdf8');
        coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();

        // 3 Tilted Rings
        const ringConfigs = [
          { rx: 160, ry: 45, angle: orbitRoll * 1.2, color: '#00f2fe' },
          { rx: 140, ry: 50, angle: -orbitRoll * 0.9 + 1.2, color: '#ec4899' },
          { rx: 175, ry: 40, angle: orbitRoll * 0.7 - 0.8, color: '#fbbf24' },
        ];

        ringConfigs.forEach((rc) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rc.angle);

          ctx.strokeStyle = rc.color;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, rc.rx, rc.ry, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Satellite node
          const satAngle = tick * 0.04;
          const sx = Math.cos(satAngle) * rc.rx;
          const sy = Math.sin(satAngle) * rc.ry;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = rc.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pType, viewMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#071326] border border-sky-600/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
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
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                  SIMULASI: {prompt.previewType?.replace('-', ' ') || 'CANVAS'}
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
                <canvas ref={canvasRef} className="w-full h-[420px] block cursor-crosshair" />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-500/30 text-[10px] text-sky-300 font-mono">
                  {fps} FPS · Real-Time Canvas
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-sm border border-slate-700/40 text-[10px] text-slate-300 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Arahkan kursor atau klik kanvas</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#08172e] p-3.5 rounded-xl border border-sky-900/40">
                <strong>Deskripsi Visual:</strong> {prompt.description}
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
            Siap disalin ke ChatGPT, Gemini, Claude, Cursor, atau v0.
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
