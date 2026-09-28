import { PromptItem } from '../types';

export const DEFAULT_PROMPTS: PromptItem[] = [
  // Interactive Backgrounds (Reference Match: Screenshot #021, #022, etc.)
  {
    id: 'pr-021',
    numberTag: '#021',
    title: 'Matrix Digital Rain',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: 'Buat background Matrix Digital Rain dengan karakter digital turun vertikal, beberapa layer kecepatan, trail, fade, dan glow ringan.',
    previewType: 'matrix',
    promptText: `Act as a Senior Creative Technologist and Canvas Animation Specialist.
Create a production-grade, high-performance HTML5 Canvas / WebGL background effect: "Matrix Digital Rain".
Requirements:
1. Visuals: Vertical streaming streams of katakana and alphanumeric glyphs in phosphor neon green (#00ff66) with subtle bright cyan heads.
2. Depth & Layers: 3 layers of rain with varying fall speeds, font sizes, and opacity to create realistic depth of field.
3. Trails & Fade: Smooth alpha fade trail (ctx.fillStyle = 'rgba(6, 12, 24, 0.08)') so characters leave luminous fading trails.
4. Performance: Lightweight requestAnimationFrame loop, window resize listener with debounce, zero lag on 60fps displays.
5. Integration: Self-contained React / pure JS component ready to mount as fixed background with z-index: -1.
Output complete executable code and responsive canvas initialization.`,
    tags: ['Canvas', 'Animation', 'Matrix Rain', 'Cyberpunk', 'Creative Coding'],
    variables: [
      { name: 'GlowColor', defaultValue: '#00ff66', description: 'Warna karakter matrix' },
      { name: 'FallSpeed', defaultValue: 'Normal (1.2x)', description: 'Kecepatan jatuhnya karakter' },
    ],
  },
  {
    id: 'pr-022',
    numberTag: '#022',
    title: 'Cyber Grid',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: 'Buat cyber grid perspektif menuju horizon dengan garis neon bergerak ke depan, pulse node, dan efek parallax terhadap mouse.',
    previewType: 'grid',
    promptText: `Act as a Principal Creative Frontend Engineer specializing in Retro-Futuristic Cyber Aesthetics.
Generate an interactive 3D perspective "Cyber Grid" background component in HTML5 Canvas and CSS.
Specifications:
1. Perspective: Vanishing point on the horizon at 55% canvas height with infinite forward moving neon blue/cyan grid lines.
2. Horizon Atmosphere: Radial neon glow and dark horizon fog that seamlessly blends the grid into the deep midnight blue background.
3. Interactivity: Mouse movement creates a subtle tilt/parallax perspective shift (gyro effect).
4. Pulse Nodes: Floating intersection nodes that pulse with soft light at periodic intervals.
5. Optimization: Uses integer rendering coordinates and requestAnimationFrame for flawless 60 FPS performance without memory leaks.
Provide clean, commented React TypeScript component with full Tailwind CSS styling.`,
    tags: ['Cyber Grid', 'Canvas 3D', 'Neon', 'Perspective', 'Interactive'],
    variables: [
      { name: 'GridColor', defaultValue: '#00f2fe', description: 'Warna garis neon grid' },
      { name: 'HorizonGlow', defaultValue: '#38bdf8', description: 'Warna pendaran cakrawala' },
    ],
  },
  {
    id: 'pr-023',
    numberTag: '#023',
    title: 'Starfield Warp Speed',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: 'Simulasi perjalanan antariksa dengan bintang 3D yang bergerak cepat keluar dari pusat layar (warp speed) dengan jejak cahaya.',
    previewType: 'starfield',
    promptText: `Create a 3D Canvas Starfield Warp Speed animation in React and TypeScript.
Features:
1. 800+ 3D star coordinates (x, y, z) projecting to 2D screen coordinates with perspective division.
2. Dynamic acceleration on hover/drag (normal cruise to hyperspace warp speed).
3. Star streaks with gradient opacity and speed-dependent tail length.
4. Auto-resizing canvas with device pixel ratio scaling for crisp Retina display rendering.`,
    tags: ['Starfield', 'Warp Speed', 'Canvas', '3D Space'],
  },
  {
    id: 'pr-024',
    numberTag: '#024',
    title: 'Particle Network Nodes',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Frontend Developer',
    description: 'Jaringan partikel konstelasi saling terhubung dengan garis dinamis ketika mendekati cursor mouse atau partikel lainnya.',
    previewType: 'particles',
    promptText: `Build a modern Particle Constellation Network in Canvas.
1. 100 floating ambient particles with soft neon glow.
2. Dynamic connecting lines drawn between particles within 120px proximity.
3. Interactive mouse attractor / repeller physics with smooth easing.
4. Low CPU consumption with spatial distance checks.`,
    tags: ['Particles', 'Network', 'Interactive', 'Constellation'],
  },

  // UI/UX & Frontend Components
  {
    id: 'pr-001',
    numberTag: '#001',
    title: 'Modern Cyberpunk Dashboard Component (React & Tailwind CSS)',
    category: 'UI/UX & Frontend',
    targetRole: 'Frontend Developer',
    description: 'Prompt untuk merancang komponen kartu dashboard bernuansa neon cyberpunk dengan dynamic cursor highlight dan glassmorphism.',
    previewType: 'glow-card',
    promptText: `Act as a Principal Frontend Engineer specializing in cutting-edge modern UI design.
Design a highly polished, responsive {ComponentType} in React 18+ and Tailwind CSS.
Requirements:
1. Theme: High-tech dark aesthetic (#060c18 background, neon {AccentColor} accents, subtle border glows).
2. Layout: Fluid responsive layout with clean hierarchy, proper typography scales, and subtle hover micro-interactions.
3. Features: Include interactive metric widgets, status badges with subtle pulse animation, and accessible keyboard navigation.
4. Clean Code: Provide clean, typed TypeScript code with proper component decomposition and zero external CSS files.
Output only the component code and clear integration steps.`,
    tags: ['TailwindCSS', 'React', 'Cyberpunk', 'UI/UX', 'Glassmorphism'],
    variables: [
      { name: 'ComponentType', defaultValue: 'Interactive Analytics Card', description: 'Tipe komponen UI yang ingin dibuat' },
      { name: 'AccentColor', defaultValue: 'emerald/cyan', description: 'Warna aksen neon (e.g. emerald, cyan, amber)' },
    ],
  },
  {
    id: 'pr-002',
    numberTag: '#002',
    title: 'Jetpack Compose Clean Architecture Screen (Android Kotlin)',
    category: 'Android & Kotlin',
    targetRole: 'Android Engineer',
    description: 'Prompt pembuatan screen Android modern menggunakan Kotlin, Jetpack Compose, ViewModel, dan UiState unidirectional flow.',
    previewType: 'generic',
    promptText: `You are an expert Android Staff Software Engineer.
Write a production-ready Android screen using Jetpack Compose and Material 3 for: {ScreenName}.
Specifications:
1. Architecture: MVVM with Unidirectional Data Flow (UDF).
2. State Management: Sealed interface {ScreenName}UiState (Loading, Success, Error).
3. ViewModel: Kotlin StateFlow with proper viewModelScope handling.
4. Compose UI: Reusable composable functions, Scaffold with TopAppBar, LazyColumn with animated item placement.
5. Error & Retry: Graceful error banner with retry action and shimmer loading placeholders.
Write idiomatic Kotlin code following Google's official Android Architecture Guide.`,
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'MVVM', 'Material 3'],
    variables: [
      { name: 'ScreenName', defaultValue: 'CourseCatalogScreen', description: 'Nama layar/screen Android' },
    ],
  },
  {
    id: 'pr-003',
    numberTag: '#003',
    title: 'Google Apps Script Serverless REST API with CRUD & Auth',
    category: 'Fullstack & Backend',
    targetRole: 'Backend Developer',
    description: 'Prompt membuat REST API serverless lengkap di Google Sheets menggunakan doGet dan doPost Google Apps Script.',
    previewType: 'generic',
    promptText: `Act as a Google Cloud & Apps Script Solutions Architect.
Create a Google Apps Script (Code.gs) script that acts as a robust serverless REST API connected to a Google Spreadsheet.
Target Sheet: "{SheetName}" with columns: {Columns}.
Functionalities required:
1. doGet(e): Supports action 'getAll', 'getById', and 'search' with query filtering and pagination.
2. doPost(e): Supports 'create', 'update', and 'delete' with payload validation and error responses.
3. CORS Safe: Return JSON MIME type with text/plain post-handling to prevent browser CORS blocks.
4. Auto-initialize: Automatically create the sheet and header row if not already present.
5. Provide complete, ready-to-deploy Code.gs with deployment instructions.`,
    tags: ['Google Sheets', 'Apps Script', 'REST API', 'Serverless', 'Backend'],
    variables: [
      { name: 'SheetName', defaultValue: 'LearningMaterials', description: 'Nama tab sheet' },
      { name: 'Columns', defaultValue: 'ID, Title, Category, Status, CreatedAt', description: 'Nama kolom-kolom tabel' },
    ],
  },
  {
    id: 'pr-004',
    numberTag: '#004',
    title: 'ESP32 IoT Sensor Telemetry & MQTT Publisher Firmware',
    category: 'IoT & Robotics',
    targetRole: 'Embedded Systems Specialist',
    description: 'Prompt firmware ESP32 untuk membaca sensor telemetry, koneksi WiFi tahan putus, dan publish data JSON ke broker MQTT.',
    previewType: 'generic',
    promptText: `You are a Senior Embedded Systems & IoT Firmware Engineer.
Write C++ Arduino firmware for an ESP32 board interfacing with: {SensorType}.
Requirements:
1. Connectivity: Robust auto-reconnecting WiFi manager and secure MQTT connection (PubSubClient).
2. Sampling: Non-blocking sampling using millis() timers every {IntervalSeconds} seconds.
3. Payload: Serialize sensor data into a structured JSON string (ArduinoJson library).
4. Edge Filtering: Simple moving average filter to remove sensor noise spikes.
5. Power & Diagnostics: Serial console telemetry logs and optional Deep Sleep state.
Provide complete Arduino IDE / PlatformIO compatible code with wiring diagram pins.`,
    tags: ['ESP32', 'IoT', 'MQTT', 'Arduino', 'Robotics'],
    variables: [
      { name: 'SensorType', defaultValue: 'DHT22 Temperature & Ultrasonic HC-SR04', description: 'Jenis sensor yang dipasang' },
      { name: 'IntervalSeconds', defaultValue: '5', description: 'Interval pengiriman data (detik)' },
    ],
  },
  {
    id: 'pr-005',
    numberTag: '#005',
    title: 'Obstacle Avoidance Autonomous Robot Rover (Arduino & Motor Driver)',
    category: 'IoT & Robotics',
    targetRole: 'Robotics Engineer',
    description: 'Prompt untuk sistem robot otonom beroda 4 dengan sensor ultrasonik servo radar dan driver motor L298N.',
    previewType: 'generic',
    promptText: `Act as a Senior Robotics Engineer.
Design the complete control firmware for a 4-wheel smart autonomous rover using Arduino Uno/ESP32 and L298N Motor Driver.
Hardware setup:
- 4 DC Gear Motors with L298N H-Bridge driver
- SG90 Micro Servo holding an HC-SR04 Ultrasonic Distance Sensor
Features:
1. State Machine: FORWARD, OBSTACLE_DETECTED, SCAN_SURROUNDINGS, TURN_LEFT, TURN_RIGHT, REVERSE.
2. Radar Sweep: When an obstacle closer than 25cm is detected, stop, sweep servo 45° left and 45° right, compare distances, and turn toward the clearer path.
3. Smooth Speed: PWM speed control for gentle acceleration and deceleration.
Provide well-commented code, state diagram description, and pin connection table.`,
    tags: ['Robotics', 'Arduino', 'L298N', 'Sensor', 'Autonomous'],
    variables: [],
  },
  {
    id: 'pr-006',
    numberTag: '#006',
    title: 'System Prompt: Senior Code Reviewer & Security Auditor',
    category: 'AI & System Prompt',
    targetRole: 'Tech Lead / Reviewer',
    description: 'System prompt untuk mengubah AI menjadi Senior Tech Lead yang mengaudit performa, clean code, dan celah keamanan sistem.',
    previewType: 'generic',
    promptText: `You are an elite Senior Staff Engineer and Application Security Auditor.
Your task is to review the code submitted by developers with uncompromising technical precision.
Audit criteria:
1. Security: Identify OWASP vulnerabilities, secret leaks, injection flaws, and unsafe state mutations.
2. Performance & Big-O: Highlight unindexed queries, re-render bottlenecks, and memory leaks.
3. Clean Code & Idempotency: Enforce single responsibility, readable naming, and idiomatic patterns for {LanguageOrFramework}.
Review format:
- Executive Summary (Score 1-10)
- Critical Issues (Severity: High/Medium/Low with specific line references)
- Refactored Clean Code Solution
- Key Learning Takeaways for the Developer`,
    tags: ['System Prompt', 'Code Review', 'Security', 'Architecture'],
    variables: [
      { name: 'LanguageOrFramework', defaultValue: 'React TypeScript & Node.js', description: 'Bahasa atau framework yang direview' },
    ],
  },
];
