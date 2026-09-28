/**
 * Saung Digital - Learning Center Types
 * Supports modern learning material formats & Google Sheets synchronization
 */

export type MaterialType = 'video' | 'article' | 'html' | 'image' | 'file';

export type MaterialCategory = 
  | 'Tutorial Video'
  | 'Artikel & Modul'
  | 'HTML & Kode'
  | 'Grafis & Desain'
  | 'File Pendukung';

export interface LearningMaterial {
  id: string;
  title: string;
  category: MaterialCategory;
  type: MaterialType;
  description: string;
  videoUrl?: string; // YouTube or direct MP4 URL
  youtubeId?: string;
  content?: string; // Markdown or rich text article
  htmlCode?: string; // Interactive runnable HTML/CSS/JS snippet
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  tags: string[];
  duration?: string; // e.g. "15 Menit", "10 Halaman"
  level: 'Semua Level' | 'Pemula' | 'Menengah' | 'Lanjutan';
  author: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface MemberUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: 'member' | 'admin';
  status: 'active' | 'suspended';
  joinedAt: string;
  completedMaterials: string[]; // Material IDs
  bookmarkedMaterials: string[]; // Material IDs
  notes?: Record<string, string>; // materialId -> user personal note
}

export interface SyncConfig {
  appsScriptUrl: string;
  sheetId: string;
  autoSync: boolean;
  lastSyncTimestamp: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastError?: string;
  sheetNameMaterials: string;
  sheetNameMembers: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'pull' | 'push' | 'ping' | 'auth';
  status: 'success' | 'error' | 'pending';
  message: string;
  itemsCount?: number;
}

export interface PromptLibraryConfig {
  headerTitle: string;
  headerSubtitle: string;
  badgeText: string;
  categories: string[];
}

export interface MemberToolsConfig {
  headerTitle: string;
  headerSubtitle: string;
  badgeIcon: string;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  portalDescription: string;
  adminContactEmail: string;
  adminPassword?: string;
  allowGuestPreview: boolean;
  enableSpotlightGlow: boolean;
  accentColor: 'emerald' | 'cyan' | 'amber';
  broadcastMessage: string;
  isBroadcastActive: boolean;
  bannerImageUrl?: string;
  promptLibraryConfig?: PromptLibraryConfig;
  memberToolsConfig?: MemberToolsConfig;
}

export interface PromptItem {
  id: string;
  numberTag?: string;
  title: string;
  category: string;
  targetRole: string;
  description: string;
  promptText: string;
  tags: string[];
  variables?: { name: string; defaultValue: string; description: string }[];
  isCustom?: boolean;
  previewType?: 'matrix' | 'grid' | 'starfield' | 'particles' | 'glow-card' | 'generic';
}

export interface ToolItem {
  id: string;
  badge: string;
  versionBadge: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  requiresAdminAccess?: boolean;
  toolUrl?: string;
  category?: string;
}

