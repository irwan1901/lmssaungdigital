import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const settingsFile = path.join(dataDir, 'settings.json');
const publicSettingsFile = path.join(__dirname, 'public', 'settings.json');
const allDataFile = path.join(dataDir, 'app_data.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// API Route: GET /api/settings
app.get('/api/settings', (req, res) => {
  try {
    if (fs.existsSync(settingsFile)) {
      const content = fs.readFileSync(settingsFile, 'utf-8');
      const settings = JSON.parse(content);
      return res.json({ success: true, settings });
    }
    return res.json({ success: true, settings: null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: POST /api/settings
app.post('/api/settings', (req, res) => {
  try {
    const settings = req.body;
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
    try {
      fs.writeFileSync(publicSettingsFile, JSON.stringify(settings, null, 2), 'utf-8');
    } catch {}
    return res.json({ success: true, settings, message: 'Settings saved to server disk' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: POST /api/upload-logo
app.post('/api/upload-logo', (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'png';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const safeName = `portal-logo.${ext}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}?v=${Date.now()}`;

    // Auto update settings.json and public/settings.json
    let updatedSettings: any = { bannerImageUrl: publicUrl };
    if (fs.existsSync(settingsFile)) {
      try {
        const existing = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        existing.bannerImageUrl = publicUrl;
        updatedSettings = existing;
      } catch {
        // ignore
      }
    }
    fs.writeFileSync(settingsFile, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    try {
      fs.writeFileSync(publicSettingsFile, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    } catch {}

    return res.json({
      success: true,
      url: publicUrl,
      message: 'Logo uploaded and saved permanently to server disk',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: GET /api/data
app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(allDataFile)) {
      const content = fs.readFileSync(allDataFile, 'utf-8');
      return res.json({ success: true, data: JSON.parse(content) });
    }
    return res.json({ success: true, data: null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: POST /api/data
app.post('/api/data', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(allDataFile, JSON.stringify(data, null, 2), 'utf-8');
    return res.json({ success: true, message: 'All data saved to server disk' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
