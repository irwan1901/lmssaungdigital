import {
  LearningMaterial,
  MemberUser,
  SyncConfig,
  SyncLog,
  PlatformSettings,
  PromptItem,
  ToolItem,
  PromptLibraryConfig,
  MemberToolsConfig,
} from '../types';
import { safeLocalStorageSet } from './storageHelper';
import { DEFAULT_PROMPTS } from '../data/defaultPrompts';
import { DEFAULT_TOOLS } from '../data/defaultTools';

export { DEFAULT_PROMPTS, DEFAULT_TOOLS };

const STORAGE_KEY_MATERIALS = 'saungdigital_materials_v1';
const STORAGE_KEY_MEMBERS = 'saungdigital_members_v1';
const STORAGE_KEY_CONFIG = 'saungdigital_sync_config_v1';
const STORAGE_KEY_LOGS = 'saungdigital_sync_logs_v1';
const STORAGE_KEY_SETTINGS = 'saungdigital_settings_v1';
export const STORAGE_KEY_PROMPTS = 'saung_digital_prompts_v2';
export const STORAGE_KEY_TOOLS = 'saung_digital_tools_v1';

export const DEFAULT_PROMPT_LIBRARY_CONFIG: PromptLibraryConfig = {
  headerTitle: 'Prompt Library',
  headerSubtitle:
    'Koleksi prompt engineering terkurasi untuk mempercepat workflow pengembangan, pembuatan kode interaktif, dan arsitektur aplikasi.',
  badgeText: 'Koleksi Terverifikasi AI Studio',
  categories: [
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
  ],
};

export const DEFAULT_MEMBER_TOOLS_CONFIG: MemberToolsConfig = {
  headerTitle: 'Tools',
  headerSubtitle: 'Kumpulan tools pendukung yang telah dipublikasikan oleh Admin.',
  badgeIcon: '🧰',
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'SAUNG DIGITAL',
  tagline: 'KOLABORASI • INOVASI • TEKNOLOGI • MASA DEPAN',
  portalDescription:
    'Koleksi materi, video YouTube, modul Android, Coding, Robotika, AI & IoT dalam satu ekosistem pembelajaran.',
  adminContactEmail: 'admin@saungdigital.id',
  adminPassword: 'admin2026',
  allowGuestPreview: true,
  enableSpotlightGlow: true,
  accentColor: 'emerald',
  broadcastMessage: 'Selamat datang di Portal Saung Digital! Modul baru Android & IoT telah aktif.',
  isBroadcastActive: false,
  bannerImageUrl: '/saung_digital_artwork.svg',
  promptLibraryConfig: DEFAULT_PROMPT_LIBRARY_CONFIG,
  memberToolsConfig: DEFAULT_MEMBER_TOOLS_CONFIG,
};

// Seed initial materials reflecting Saung Digital Learning Center
export const INITIAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-001',
    title: 'Pengenalan Ekosistem Web Modern & Responsive Design',
    category: 'Tutorial Video',
    type: 'video',
    description: 'Panduan fundamental arsitektur web modern, layout CSS flexbox/grid, dan prinsip responsive multi-device untuk developer & desainer pemula.',
    videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
    youtubeId: 'kUMe1FH4CHE',
    content: `# Pengenalan Ekosistem Web Modern

Materi ini membahas arsitektur web terkini yang cepat, responsif, dan mudah di-maintain.

### Poin Kunci Pembelajaran:
1. **Responsive Viewport Meta**: Memastikan ukuran website menyesuaikan dimensi layar ponsel maupun desktop.
2. **Fluid Typography & Spacing**: Menggunakan sistem unit relatif (\`rem\`, \`ch\`, \`%\`) daripada ukuran piksel statis.
3. **Mobile-First Paradigm**: Mendesain struktur layout dasar dari smartphone sebelum memperluas grid pada layar 1440px desktop.

Simak video tutorial di atas untuk demo langsung coding responsive design.`,
    tags: ['Web Development', 'Responsive', 'CSS', 'Pemula'],
    duration: '22 Menit',
    level: 'Pemula',
    author: 'Tim Saung Digital',
    isPublished: true,
    order: 1,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
    views: 418,
  },
  {
    id: 'mat-002',
    title: 'Template Kartu Interaktif Cyberpunk (Live HTML & CSS)',
    category: 'HTML & Kode',
    type: 'html',
    description: 'Snippet kode interaktif kartu bercahaya ala antarmuka Saung Digital dengan efek neon glow dan hover 3D transformation.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background: #060c18;
    color: #e2e8f0;
    font-family: system-ui, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }
  .cyber-card {
    background: linear-gradient(135deg, #0e192f 0%, #081122 100%);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 16px;
    padding: 24px;
    width: 320px;
    box-shadow: 0 10px 30px -10px rgba(14, 165, 233, 0.3);
    transition: all 0.3s ease;
  }
  .cyber-card:hover {
    transform: translateY(-6px);
    border-color: #38bdf8;
    box-shadow: 0 15px 40px -5px rgba(14, 165, 233, 0.4);
  }
  .tag {
    color: #facc15;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  h2 {
    margin: 10px 0;
    font-size: 18px;
    color: #ffffff;
  }
  p {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
  }
  .btn {
    display: inline-block;
    background: #2563eb;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    margin-top: 14px;
    transition: 0.2s;
  }
  .btn:hover {
    background: #1d4ed8;
  }
</style>
</head>
<body>
  <div class="cyber-card">
    <div class="tag">SAUNG DIGITAL CODE</div>
    <h2>Cyber Card Component</h2>
    <p>Komponen antarmuka modern dengan gradasi kontras tinggi, efek neon, dan responsivitas penuh.</p>
    <a href="#" class="btn" onclick="console.log('Halo dari Saung Digital!'); return false;">Klik Interaksi</a>
  </div>
</body>
</html>`,
    content: `Gunakan snippet di atas untuk menguji coba tampilan kartu interaktif secara live di dalam browser. Anda dapat menyalin kode ini untuk proyek website Anda.`,
    tags: ['HTML', 'CSS', 'Live Demo', 'UI Component'],
    duration: '10 Menit',
    level: 'Menengah',
    author: 'Instruktur Frontend Saung Digital',
    isPublished: true,
    order: 2,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-03-22T09:15:00Z',
    views: 295,
  },
  {
    id: 'mat-003',
    title: 'Panduan Lengkap Sinkronisasi Database Google Sheets & Apps Script',
    category: 'Artikel & Modul',
    type: 'article',
    description: 'Modul praktis memanfaatkan Google Sheets sebagai sistem backend no-cost gratis dengan REST API via Google Apps Script (Web App).',
    content: `# Panduan Integrasi Google Sheets API via Apps Script

Google Sheets adalah solusi database tabular yang sangat fleksibel untuk katalog materi, pendaftaran member, dan pencatatan data tanpa biaya server bulanan.

## Cara Kerja Integrasi:
1. **Google Sheets** bertindak sebagai *Database Storage*.
2. **Google Apps Script** bertindak sebagai *API Gateway / Serverless Engine* yang memproses request \`GET\` dan \`POST\`.
3. **Aplikasi Web Saung Digital** berkomunikasi menggunakan format JSON standar secara efisien.

## Keuntungan Menggunakan Metode Ini:
- **Gratis**: Tidak memerlukan server database berbayar.
- **Kolaboratif**: Admin dapat melihat dan mengedit data langsung di spreadsheet Google Sheets secara real-time.
- **Ringan**: Data di-cache di perangkat lokal member (\`localStorage\`) untuk performa instan tanpa loading lama.`,
    tags: ['Google Sheets', 'Apps Script', 'Database', 'API'],
    duration: '8 Halaman Bacaan',
    level: 'Menengah',
    author: 'Tim Backend Saung Digital',
    isPublished: true,
    order: 3,
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-24T16:00:00Z',
    views: 512,
  },
  {
    id: 'mat-004',
    title: 'Tutorial Video: Strategi SEO & Optimasi Kecepatan Web di Vercel',
    category: 'Tutorial Video',
    type: 'video',
    description: 'Trik optimasi Core Web Vitals, kompresi aset gambar, dan konfigurasi vercel.json untuk deployment kilat 100/100 Lighthouse.',
    videoUrl: 'https://www.youtube.com/watch?v=2otOErHqFmE',
    youtubeId: '2otOErHqFmE',
    content: `Video tutorial berdurasi 18 menit ini memandu Anda langkah demi langkah dalam mempersiapkan proyek Vite React agar siap di-deploy ke Vercel dengan performa super cepat.`,
    tags: ['Vercel', 'Performance', 'SEO', 'Deployment'],
    duration: '18 Menit',
    level: 'Lanjutan',
    author: 'DevOps Specialist Saung Digital',
    isPublished: true,
    order: 4,
    createdAt: '2026-03-15T09:30:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
    views: 380,
  },
  {
    id: 'mat-005',
    title: 'Aset Diagram Alur Kerja & Desain Grafis UI Saung Digital',
    category: 'Grafis & Desain',
    type: 'image',
    description: 'Bagan infografis alur akses pembelajaran digital, struktur token otentikasi member, dan panduan palet warna Saung Digital.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    content: `Infografis ini merangkum hierarki sistem pembelajaran:
- Tingkat 1: Akun Member terverifikasi
- Tingkat 2: Kurikulum Modul & Video
- Tingkat 3: Evaluasi & Sinkronisasi Progress Belajar`,
    attachmentUrl: 'https://example.com/assets/saung-digital-design-kit.pdf',
    attachmentName: 'Saung-Digital-Design-Kit-2026.pdf',
    tags: ['Design System', 'Infografis', 'Aset Grafis'],
    duration: '3 Diagram',
    level: 'Semua Level',
    author: 'Creative Lead Saung Digital',
    isPublished: true,
    order: 5,
    createdAt: '2026-03-18T14:00:00Z',
    updatedAt: '2026-03-26T15:20:00Z',
    views: 210,
  },
  {
    id: 'mat-006',
    title: 'Cheat Sheet Rumus & Skrip Ekstensi Google Sheets untuk Otomasi',
    category: 'File Pendukung',
    type: 'file',
    description: 'Kumpulan formula Google Sheets (QUERY, VLOOKUP, IMPORTRANGE) serta template spreadsheet siap pakai untuk inventaris materi.',
    attachmentUrl: 'https://docs.google.com/spreadsheets/d/sample-saung-digital-template',
    attachmentName: 'Template-Database-Materi-Saung-Digital.xlsx',
    content: `Gunakan file pendukung ini sebagai acuan saat menyusun struktur tabel materi pembelajaran di Google Sheets pribadi Anda. Kolom yang dibutuhkan sudah terformat secara otomatis.`,
    tags: ['Download', 'Excel', 'Spreadsheet', 'Template'],
    duration: 'File Unduhan (2.4 MB)',
    level: 'Semua Level',
    author: 'Tim Saung Digital',
    isPublished: true,
    order: 6,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-27T08:00:00Z',
    views: 340,
  },
  {
    id: 'mat-007',
    title: 'Android Development: Fundamental Kotlin & Modern Jetpack Compose',
    category: 'Tutorial Video',
    type: 'video',
    description: 'Panduan membangun aplikasi mobile modern dengan Kotlin dan Jetpack Compose sesuai kurikulum resmi Saung Digital.',
    videoUrl: 'https://www.youtube.com/watch?v=FjrKMcnKahY',
    youtubeId: 'FjrKMcnKahY',
    content: `# Android Development dengan Kotlin

Pelajari cara membuat antarmuka declarative Android menggunakan Jetpack Compose, state management, dan arsitektur MVVM.

### Kurikulum:
1. Setup Android Studio & Emulator
2. Sintaks Dasar Bahasa Kotlin
3. Membangun UI dengan Composable Functions
4. Integrasi REST API & Local Database Room`,
    tags: ['Android', 'Kotlin', 'Mobile', 'Jetpack Compose'],
    duration: '35 Menit',
    level: 'Menengah',
    author: 'Tim Android Saung Digital',
    isPublished: true,
    order: 7,
    createdAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-03-27T10:00:00Z',
    views: 620,
  },
  {
    id: 'mat-008',
    title: 'IoT & Robotics: Kontrol Robot Beroda dan Sensor Cerdas via ESP32',
    category: 'Artikel & Modul',
    type: 'article',
    description: 'Modul praktis merakit dan memprogram robot rover pintar dengan kendali WiFi/Bluetooth dan integrasi kecerdasan buatan.',
    content: `# IoT & Robotics: Panduan Robot Cerdas

Dalam modul Saung Digital ini, kita mengeksplorasi pembuatan robot otonom dan Internet of Things (IoT).

### Komponen Utama:
- Mikrokontroler ESP32 / Arduino
- Motor Driver L298N & Motor DC
- Sensor Ultrasonik HC-SR04 untuk deteksi rintangan
- Kamera ESP32-CAM untuk streaming & computer vision`,
    tags: ['Robotics', 'IoT', 'ESP32', 'Arduino', 'AI'],
    duration: '12 Halaman',
    level: 'Lanjutan',
    author: 'Lab Robotika Saung Digital',
    isPublished: true,
    order: 8,
    createdAt: '2026-03-24T09:00:00Z',
    updatedAt: '2026-03-27T11:30:00Z',
    views: 450,
  }
];

export const INITIAL_MEMBERS: MemberUser[] = [
  {
    id: 'mem-001',
    email: 'member@saungdigital.id',
    name: 'Budi Santoso',
    password: 'member123',
    role: 'member',
    status: 'active',
    joinedAt: '2026-02-15T00:00:00Z',
    completedMaterials: ['mat-001', 'mat-003'],
    bookmarkedMaterials: ['mat-002', 'mat-004'],
    notes: {
      'mat-001': 'Sudah mengerti flexbox dan grid. Perlu latihan responsive breakpoint.',
      'mat-003': 'Sangat berguna untuk Apps Script web app.'
    }
  },
  {
    id: 'mem-002',
    email: 'dewi.lestari@saungdigital.id',
    name: 'Dewi Lestari',
    password: 'member123',
    role: 'member',
    status: 'active',
    joinedAt: '2026-03-01T00:00:00Z',
    completedMaterials: ['mat-001'],
    bookmarkedMaterials: ['mat-003'],
    notes: {}
  }
];

export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  appsScriptUrl: (import.meta.env.VITE_GAS_API_URL as string) || '',
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  autoSync: true,
  lastSyncTimestamp: null,
  syncStatus: 'idle',
  sheetNameMaterials: 'Materi',
  sheetNameMembers: 'Members'
};

// Storage helpers
export function deduplicateMembers(list: MemberUser[]): MemberUser[] {
  if (!Array.isArray(list)) return [];
  const seenId = new Set<string>();
  const seenEmail = new Set<string>();
  const result: MemberUser[] = [];

  for (const m of list) {
    if (!m || !m.id) continue;
    const cleanEmail = (m.email || '').trim().toLowerCase();
    if (seenId.has(m.id) || (cleanEmail && seenEmail.has(cleanEmail))) {
      continue;
    }
    seenId.add(m.id);
    if (cleanEmail) seenEmail.add(cleanEmail);
    result.push(m);
  }
  return result;
}

export function deduplicateMaterials(list: LearningMaterial[]): LearningMaterial[] {
  if (!Array.isArray(list)) return [];
  const seenId = new Set<string>();
  const result: LearningMaterial[] = [];

  for (const m of list) {
    if (!m || !m.id) continue;
    if (seenId.has(m.id)) continue;
    seenId.add(m.id);
    result.push(m);
  }
  return result;
}

export function loadMaterials(): LearningMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MATERIALS) || localStorage.getItem('samadigi_materials_v1');
    if (!raw) {
      saveMaterials(INITIAL_MATERIALS);
      return INITIAL_MATERIALS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_MATERIALS;
    const unique = deduplicateMaterials(parsed);
    // If duplicates were present in localStorage, repair them immediately
    if (unique.length !== parsed.length) {
      saveMaterials(unique);
    }
    return unique.length > 0 ? unique : INITIAL_MATERIALS;
  } catch (e) {
    console.error('Error loading materials from localStorage', e);
    return INITIAL_MATERIALS;
  }
}

export function saveMaterials(materials: LearningMaterial[]) {
  const unique = deduplicateMaterials(materials);
  safeLocalStorageSet(STORAGE_KEY_MATERIALS, JSON.stringify(unique));
}

export function loadMembers(): MemberUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS) || localStorage.getItem('samadigi_members_v1');
    if (!raw) {
      saveMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_MEMBERS;
    const unique = deduplicateMembers(parsed);
    // If duplicates were present in localStorage, repair them immediately
    if (unique.length !== parsed.length) {
      saveMembers(unique);
    }
    return unique.length > 0 ? unique : INITIAL_MEMBERS;
  } catch (e) {
    console.error('Error loading members', e);
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: MemberUser[]) {
  const unique = deduplicateMembers(members);
  safeLocalStorageSet(STORAGE_KEY_MEMBERS, JSON.stringify(unique));
}

export function loadSyncConfig(): SyncConfig {
  try {
    const envUrl = (import.meta.env.VITE_GAS_API_URL as string) || '';
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG) || localStorage.getItem('samadigi_sync_config_v1');
    if (!raw) {
      return {
        ...DEFAULT_SYNC_CONFIG,
        appsScriptUrl: envUrl || DEFAULT_SYNC_CONFIG.appsScriptUrl,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SYNC_CONFIG,
      ...parsed,
      appsScriptUrl: parsed.appsScriptUrl || envUrl || DEFAULT_SYNC_CONFIG.appsScriptUrl,
    };
  } catch (e) {
    return DEFAULT_SYNC_CONFIG;
  }
}

export function saveSyncConfig(config: SyncConfig) {
  safeLocalStorageSet(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

export function loadPlatformSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem('samadigi_settings_v1');
    if (!raw) return DEFAULT_PLATFORM_SETTINGS;
    const parsed = JSON.parse(raw);
    const loadedPromptConfig = parsed.promptLibraryConfig;
    if (loadedPromptConfig?.categories && Array.isArray(loadedPromptConfig.categories)) {
      const withoutAll = loadedPromptConfig.categories.filter(
        (c: string) => typeof c === 'string' && c.trim().toUpperCase() !== 'SEMUA KATEGORI'
      );
      loadedPromptConfig.categories = ['SEMUA KATEGORI', ...withoutAll];
    }
    return {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...parsed,
      bannerImageUrl: parsed.bannerImageUrl || DEFAULT_PLATFORM_SETTINGS.bannerImageUrl,
    };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function savePlatformSettings(settings: PlatformSettings) {
  safeLocalStorageSet(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  // Asynchronously persist to server so other users and devices immediately receive changes
  saveServerSettings(settings).catch(() => {});
}

/**
 * Fetch settings from the backend server disk (/api/settings)
 */
export async function fetchServerSettings(): Promise<PlatformSettings | null> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.settings) {
      return json.settings as PlatformSettings;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save settings to the backend server disk (/api/settings)
 */
export async function saveServerSettings(settings: PlatformSettings): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Upload logo image file dataUrl to the backend server (/api/upload-logo)
 * Returns the persistent static public URL (e.g. /uploads/portal-logo.png?v=...)
 */
export async function uploadLogoToServer(imageDataUrl: string): Promise<string | null> {
  try {
    const res = await fetch('/api/upload-logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.url) {
      return json.url;
    }
    return null;
  } catch {
    return null;
  }
}


export function deduplicatePrompts(list: PromptItem[]): PromptItem[] {
  if (!Array.isArray(list)) return [];
  const seenId = new Set<string>();
  const result: PromptItem[] = [];
  for (const p of list) {
    if (!p || !p.id) continue;
    if (seenId.has(p.id)) continue;
    seenId.add(p.id);
    result.push(p);
  }
  return result;
}

export function deduplicateTools(list: ToolItem[]): ToolItem[] {
  if (!Array.isArray(list)) return [];
  const seenId = new Set<string>();
  const result: ToolItem[] = [];
  for (const t of list) {
    if (!t || !t.id) continue;
    if (seenId.has(t.id)) continue;
    seenId.add(t.id);
    result.push(t);
  }
  return result;
}

export function loadPrompts(): PromptItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROMPTS);
    if (!raw) {
      savePrompts(DEFAULT_PROMPTS);
      return DEFAULT_PROMPTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      savePrompts(DEFAULT_PROMPTS);
      return DEFAULT_PROMPTS;
    }

    // Merge default prompts with stored prompts so new prompts and updated previewTypes appear
    const map = new Map<string, PromptItem>();
    DEFAULT_PROMPTS.forEach((p) => map.set(p.id, p));

    parsed.forEach((stored: PromptItem) => {
      if (stored && stored.id) {
        const def = map.get(stored.id);
        if (def) {
          // If stored has generic/missing previewType, update to default unique previewType
          map.set(stored.id, {
            ...def,
            ...stored,
            previewType: def.previewType || stored.previewType,
          });
        } else {
          // User-created custom prompt
          map.set(stored.id, stored);
        }
      }
    });

    const merged = Array.from(map.values());
    const unique = deduplicatePrompts(merged);
    savePrompts(unique);
    return unique;
  } catch {
    return DEFAULT_PROMPTS;
  }
}

export function savePrompts(prompts: PromptItem[]) {
  const unique = deduplicatePrompts(prompts);
  safeLocalStorageSet(STORAGE_KEY_PROMPTS, JSON.stringify(unique));
}

export function loadTools(): ToolItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOOLS);
    if (!raw) {
      saveTools(DEFAULT_TOOLS);
      return DEFAULT_TOOLS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_TOOLS;
    const defaultUrl =
      (import.meta.env.VITE_GAS_API_URL as string) ||
      'https://script.google.com/macros/s/AKfycbwOfuFCKuCUrBC34EJmCkw7ZlbwHcCkqhbgQXjQ4Gk9t8vW8KfQpGbsPKMq3hU7WzAW/exec';
    const merged = parsed.map((item: ToolItem) => {
      const match = DEFAULT_TOOLS.find((d) => d.id === item.id);
      if (match && !item.toolUrl && match.toolUrl) {
        return { ...item, toolUrl: match.toolUrl };
      }
      if (!item.toolUrl) {
        return { ...item, toolUrl: defaultUrl };
      }
      return item;
    });
    return deduplicateTools(merged);
  } catch {
    return DEFAULT_TOOLS;
  }
}

export function saveTools(tools: ToolItem[]) {
  const unique = deduplicateTools(tools);
  safeLocalStorageSet(STORAGE_KEY_TOOLS, JSON.stringify(unique));
}

export function loadSyncLogs(): SyncLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addSyncLog(log: Omit<SyncLog, 'id' | 'timestamp'>) {
  try {
    const current = loadSyncLogs();
    const newEntry: SyncLog = {
      ...log,
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    const updated = [newEntry, ...current].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Test connectivity with Google Apps Script Web App
 */
export async function testAppsScriptConnection(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim().startsWith('http')) {
    return { success: false, message: 'URL Apps Script belum diisi dengan format valid (https://script.google.com/macros/s/.../exec)' };
  }

  try {
    // Add ping query
    const targetUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}: Periksa deployment Web App (Pastikan "Who has access" = "Anyone / Siapa saja")`
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Koneksi ke Google Sheets & Apps Script berhasil terhubung!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menghubungi Apps Script: ${err.message || 'CORS / Network Error'}. Pastikan Apps Script di-deploy sebagai Web App dengan akses "Anyone".`
    };
  }
}

/**
 * Fetch latest materials & members from Google Sheet via Apps Script
 */
export async function fetchFromGoogleSheet(url: string): Promise<{
  success: boolean;
  materials?: LearningMaterial[];
  members?: MemberUser[];
  message: string;
}> {
  if (!url || !url.trim().startsWith('http')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum dikonfigurasi.'
    };
  }

  try {
    const targetUrl = url.includes('?') ? `${url}&action=getAll` : `${url}?action=getAll`;
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal menarik data dari server`);
    }

    const data = await response.json();
    if (data.status === 'success' || data.materials) {
      const sanitizedMaterials = Array.isArray(data.materials) ? deduplicateMaterials(data.materials) : undefined;
      const sanitizedMembers = Array.isArray(data.members) ? deduplicateMembers(data.members) : undefined;
      return {
        success: true,
        materials: sanitizedMaterials,
        members: sanitizedMembers,
        message: `Sinkronisasi berhasil! Memuat ${sanitizedMaterials?.length || 0} materi.`
      };
    } else {
      return {
        success: false,
        message: data.message || 'Format respon Apps Script tidak sesuai.'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi kesalahan saat sinkronisasi Google Sheets.'
    };
  }
}

/**
 * Push current local materials & members to Google Sheet
 */
export async function pushToGoogleSheet(
  url: string,
  materials: LearningMaterial[],
  members: MemberUser[]
): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim().startsWith('http')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum dikonfigurasi.'
    };
  }

  try {
    // Send payload using text/plain to avoid browser CORS preflight blocks in Apps Script
    const payload = {
      action: 'syncAll',
      materials,
      members,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal mengirim data ke Google Sheets`);
    }

    const result = await response.json();
    return {
      success: true,
      message: result.message || 'Semua materi & data member berhasil disimpan ke Google Sheets!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal menyimpan data ke Google Sheets.'
    };
  }
}

/**
 * Generates ready-to-paste Google Apps Script code (Code.gs)
 */
export function generateAppsScriptCode(): string {
  return `/**
 * =========================================================================
 * SAUNG DIGITAL - LEARNING CENTER DATABASE BACKEND (GOOGLE APPS SCRIPT)
 * =========================================================================
 * Petunjuk Instalasi:
 * 1. Buat Google Sheet baru (misal: "Saung Digital Database").
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus kode bawaan, lalu tempel SELURUH KODE di bawah ini ke file Code.gs.
 * 4. Simpan proyek (Ctrl + S).
 * 5. Klik tombol biru "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 6. Pilih tipe: "Web app" (Aplikasi Web).
 * 7. Konfigurasi:
 *    - Description: "Saung Digital Sync API v1"
 *    - Execute as: "Me" (Saya)
 *    - Who has access: "Anyone" (Siapa saja)  <-- SANGAT PENTING!
 * 8. Klik "Deploy", beri izin akses (Authorize access), lalu salin "Web app URL".
 * 9. Tempel URL tersebut ke menu Admin > Integrasi Google Sheets di website Saung Digital.
 * =========================================================================
 */

var SHEET_NAME_MATERIALS = 'Materi';
var SHEET_NAME_MEMBERS = 'Members';

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  if (action === 'ping') {
    return createJsonResponse({
      status: 'success',
      message: 'Koneksi Google Apps Script Saung Digital Aktif & Berjalan Lancar!',
      timestamp: new Date().toISOString()
    });
  }
  
  if (action === 'getAll' || action === 'getMaterials') {
    initSheetsIfNeeded();
    var materials = getMaterialsFromSheet();
    var members = getMembersFromSheet();
    
    return createJsonResponse({
      status: 'success',
      materials: materials,
      members: members,
      timestamp: new Date().toISOString()
    });
  }
  
  return createJsonResponse({
    status: 'error',
    message: 'Action tidak dikenal: ' + action
  });
}

function doPost(e) {
  try {
    initSheetsIfNeeded();
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action || 'syncAll';
    
    if (action === 'syncAll' && postData.materials) {
      saveMaterialsToSheet(postData.materials);
      if (postData.members) {
        saveMembersToSheet(postData.members);
      }
      return createJsonResponse({
        status: 'success',
        message: 'Berhasil menyinkronkan ' + postData.materials.length + ' materi ke Google Sheets!',
        count: postData.materials.length
      });
    }
    
    if (action === 'saveMaterial' && postData.material) {
      upsertSingleMaterial(postData.material);
      return createJsonResponse({
        status: 'success',
        message: 'Materi berhasil disimpan ke Google Sheets.'
      });
    }
    
    return createJsonResponse({
      status: 'error',
      message: 'Aksi post tidak valid.'
    });
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Terjadi kesalahan server: ' + err.toString()
    });
  }
}

// Inisialisasi sheet dan header jika belum ada
function initSheetsIfNeeded() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet Materi
  var matSheet = ss.getSheetByName(SHEET_NAME_MATERIALS);
  if (!matSheet) {
    matSheet = ss.insertSheet(SHEET_NAME_MATERIALS);
    matSheet.appendRow([
      'ID', 'Judul', 'Kategori', 'Tipe', 'Deskripsi', 'VideoURL', 
      'YouTubeID', 'Konten', 'HTMLCode', 'AttachmentURL', 'Tags', 
      'Durasi', 'Level', 'Penulis', 'Status', 'Views', 'UpdatedAt'
    ]);
    matSheet.getRange(1, 1, 1, 17).setFontWeight('bold').setBackground('#0e192f').setFontColor('#38bdf8');
  }
  
  // Sheet Members
  var memSheet = ss.getSheetByName(SHEET_NAME_MEMBERS);
  if (!memSheet) {
    memSheet = ss.insertSheet(SHEET_NAME_MEMBERS);
    memSheet.appendRow(['ID', 'Nama', 'Email', 'Role', 'Status', 'SelesaiIDs', 'BookmarkIDs', 'JoinedAt']);
    memSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#0e192f').setFontColor('#facc15');
  }
}

function getMaterialsFromSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_MATERIALS);
  if (!sheet) return [];
  
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  var materials = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    materials.push({
      id: String(r[0]),
      title: String(r[1] || ''),
      category: String(r[2] || 'Tutorial Video'),
      type: String(r[3] || 'video'),
      description: String(r[4] || ''),
      videoUrl: String(r[5] || ''),
      youtubeId: String(r[6] || ''),
      content: String(r[7] || ''),
      htmlCode: String(r[8] || ''),
      attachmentUrl: String(r[9] || ''),
      tags: r[10] ? String(r[10]).split(',').map(function(t){ return t.trim(); }) : [],
      duration: String(r[11] || ''),
      level: String(r[12] || 'Semua Level'),
      author: String(r[13] || 'Saung Digital'),
      isPublished: String(r[14]).toLowerCase() !== 'draft',
      views: Number(r[15]) || 0,
      updatedAt: String(r[16] || new Date().toISOString()),
      order: i
    });
  }
  return materials;
}

function saveMaterialsToSheet(materials) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_MATERIALS);
  if (!sheet) {
    initSheetsIfNeeded();
    sheet = ss.getSheetByName(SHEET_NAME_MATERIALS);
  }
  
  // Bersihkan data lama kecuali header
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 17).clearContent();
  }
  
  if (materials.length === 0) return;
  
  var rows = materials.map(function(m) {
    return [
      m.id || '',
      m.title || '',
      m.category || 'Tutorial Video',
      m.type || 'video',
      m.description || '',
      m.videoUrl || '',
      m.youtubeId || '',
      m.content || '',
      m.htmlCode || '',
      m.attachmentUrl || '',
      (m.tags || []).join(', '),
      m.duration || '',
      m.level || 'Semua Level',
      m.author || 'Saung Digital',
      m.isPublished ? 'Publish' : 'Draft',
      m.views || 0,
      m.updatedAt || new Date().toISOString()
    ];
  });
  
  sheet.getRange(2, 1, rows.length, 17).setValues(rows);
}

function getMembersFromSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_MEMBERS);
  if (!sheet) return [];
  
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  
  var members = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    members.push({
      id: String(r[0]),
      name: String(r[1] || ''),
      email: String(r[2] || ''),
      role: String(r[3] || 'member'),
      status: String(r[4] || 'active'),
      completedMaterials: r[5] ? String(r[5]).split(',').map(function(s){ return s.trim(); }) : [],
      bookmarkedMaterials: r[6] ? String(r[6]).split(',').map(function(s){ return s.trim(); }) : [],
      joinedAt: String(r[7] || new Date().toISOString())
    });
  }
  return members;
}

function saveMembersToSheet(members) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_MEMBERS);
  if (!sheet) return;
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 8).clearContent();
  }
  
  if (members.length === 0) return;
  
  var rows = members.map(function(mem) {
    return [
      mem.id || '',
      mem.name || '',
      mem.email || '',
      mem.role || 'member',
      mem.status || 'active',
      (mem.completedMaterials || []).join(', '),
      (mem.bookmarkedMaterials || []).join(', '),
      mem.joinedAt || new Date().toISOString()
    ];
  });
  
  sheet.getRange(2, 1, rows.length, 8).setValues(rows);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}
