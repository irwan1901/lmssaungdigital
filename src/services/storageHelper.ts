/**
 * Storage & Image Optimization Helper for Saung Digital
 * Prevents localStorage quota exceeded errors by optimizing image assets
 * and providing resilient storage mechanisms.
 */

const DB_NAME = 'SaungDigitalDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

/**
 * Open or create IndexedDB instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an asset (e.g., banner image) into IndexedDB
 */
export async function saveAssetToIndexedDB(key: string, value: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Load an asset from IndexedDB
 */
export async function loadAssetFromIndexedDB(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clean up legacy or duplicate keys that eat up localStorage quota
 */
export function cleanupStorageQuota(): void {
  try {
    // Remove obsolete duplicate keys
    localStorage.removeItem('saung_digital_hero_image');
    localStorage.removeItem('samadigi_materials_v1');
    localStorage.removeItem('samadigi_members_v1');
    localStorage.removeItem('samadigi_sync_config_v1');
    localStorage.removeItem('samadigi_settings_v1');
    localStorage.removeItem('samadigi_current_user');

    // Clean up duplicate members in localStorage if present
    const rawMembers = localStorage.getItem('saungdigital_members_v1');
    if (rawMembers) {
      try {
        const parsedM = JSON.parse(rawMembers);
        if (Array.isArray(parsedM)) {
          const seen = new Set<string>();
          const uniqueM = parsedM.filter((m: any) => {
            if (!m || !m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
          if (uniqueM.length !== parsedM.length) {
            localStorage.setItem('saungdigital_members_v1', JSON.stringify(uniqueM));
          }
        }
      } catch {
        // Ignore
      }
    }

    // Clean up duplicate materials in localStorage if present
    const rawMats = localStorage.getItem('saungdigital_materials_v1');
    if (rawMats) {
      try {
        const parsedMat = JSON.parse(rawMats);
        if (Array.isArray(parsedMat)) {
          const seen = new Set<string>();
          const uniqueMat = parsedMat.filter((m: any) => {
            if (!m || !m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
          if (uniqueMat.length !== parsedMat.length) {
            localStorage.setItem('saungdigital_materials_v1', JSON.stringify(uniqueMat));
          }
        }
      } catch {
        // Ignore
      }
    }

    // Trim logs if they are too large
    const logs = localStorage.getItem('saungdigital_sync_logs_v1');
    if (logs && logs.length > 50000) {
      try {
        const parsed = JSON.parse(logs);
        if (Array.isArray(parsed)) {
          localStorage.setItem('saungdigital_sync_logs_v1', JSON.stringify(parsed.slice(0, 10)));
        }
      } catch {
        localStorage.removeItem('saungdigital_sync_logs_v1');
      }
    }
  } catch {
    // Ignore error
  }
}

/**
 * Safely set an item in localStorage with quota recovery fallback
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[StorageHelper] Quota exceeded for "${key}", attempting cleanup...`);
    // Attempt 1: Clear obsolete / duplicate keys
    cleanupStorageQuota();

    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      // Attempt 2: If key is settings and contains a heavy image, offload to IndexedDB
      if (key === 'saungdigital_settings_v1') {
        try {
          const parsed = JSON.parse(value);
          if (parsed && parsed.bannerImageUrl && parsed.bannerImageUrl.length > 20000) {
            // Save full image to IndexedDB
            saveAssetToIndexedDB('banner_image', parsed.bannerImageUrl);
            // Save settings without giant dataUrl to keep localStorage healthy
            const sanitized = {
              ...parsed,
              bannerImageUrl: parsed.bannerImageUrl.startsWith('http') ? parsed.bannerImageUrl : '__indexeddb_banner__',
            };
            localStorage.setItem(key, JSON.stringify(sanitized));
            return true;
          }
        } catch {
          // Ignore
        }
      }
      console.warn(`[StorageHelper] Could not persist key "${key}" to localStorage. Graceful fallback active.`);
      return false;
    }
  }
}

/**
 * Resize and compress an image file before storing
 * Converts multi-megabyte PNG/JPEG files into crisp, web-optimized ~30-70 KB images.
 */
export function optimizeImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG, read text/dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw string if decoding fails
        resolve(e.target?.result as string);
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (supported by 97%+ of modern browsers, superior compression)
        let output = '';
        try {
          output = canvas.toDataURL('image/webp', quality);
        } catch {
          output = '';
        }

        // Fallback to JPEG if WebP produced nothing or is empty
        if (!output || !output.startsWith('data:image/webp')) {
          output = canvas.toDataURL('image/jpeg', quality);
        }

        // Check if still oversized (over 300KB), recompress with slightly lower quality
        if (output.length > 400000) {
          try {
            output = canvas.toDataURL('image/jpeg', 0.72);
          } catch {
            // Keep existing output
          }
        }

        resolve(output);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
