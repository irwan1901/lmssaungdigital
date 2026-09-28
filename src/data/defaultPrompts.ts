import { PromptItem } from '../types';

export const DEFAULT_PROMPTS: PromptItem[] = [
  // #021: Matrix Rain
  {
    id: 'pr-021',
    numberTag: '#021',
    title: 'Matrix Digital Rain (Canvas Stream)',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: 'Background Matrix Digital Rain dengan katakana & glif digital turun vertikal, multivelocity layers, glowing heads, dan trailing alpha fade.',
    previewType: 'matrix',
    promptText: `Act as a Senior Creative Technologist and Canvas Animation Specialist.
Create a production-grade, high-performance HTML5 Canvas / WebGL background effect: "Matrix Digital Rain".
Requirements:
1. Visuals: Vertical streaming columns of katakana and alphanumeric glyphs in phosphor neon green (#00ff66) with bright cyan glowing head glyphs.
2. Depth & Layers: 3 layers of rain with varying fall speeds, font sizes, and opacity to create realistic atmospheric depth of field.
3. Trails & Fade: Smooth alpha fade trail (ctx.fillStyle = 'rgba(6, 12, 24, 0.08)') so characters leave luminous fading trails.
4. Performance: Lightweight requestAnimationFrame loop, window resize listener with debounce, 60fps on all devices.
5. Integration: Self-contained React / pure JS component ready to mount as fixed background with z-index: -1.
Output complete executable code and responsive canvas initialization.`,
    tags: ['Canvas', 'Animation', 'Matrix Rain', 'Cyberpunk', 'Creative Coding'],
    variables: [
      { name: 'GlowColor', defaultValue: '#00ff66', description: 'Warna karakter matrix' },
      { name: 'FallSpeed', defaultValue: 'Normal (1.2x)', description: 'Kecepatan jatuhnya karakter' },
    ],
  },

  // #022: Cyber Grid
  {
    id: 'pr-022',
    numberTag: '#022',
    title: 'Cyber Grid 3D Horizon (Retro-Futuristic Tron)',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: '3D perspective cyber grid menuju horizon dengan garis neon bergerak ke depan, vanishing point, pendaran cakrawala, dan parallax mouse.',
    previewType: 'cyber-grid',
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

  // #023: Starfield Warp Speed
  {
    id: 'pr-023',
    numberTag: '#023',
    title: 'Starfield Warp Speed 3D (Hyperspace Jump)',
    category: 'HERO BANNER & 3D',
    targetRole: 'Creative Developer',
    description: 'Simulasi perjalanan antariksa kecepatan tinggi dengan bintang 3D yang melesat keluar dari pusat layar dengan jejak cahaya hyperspace.',
    previewType: 'starfield-warp',
    promptText: `Create a 3D Canvas Starfield Warp Speed animation in React and TypeScript.
Features:
1. 800+ 3D star coordinates (x, y, z) projecting to 2D screen coordinates with perspective division.
2. Dynamic acceleration on hover/drag (normal cruise to hyperspace warp speed).
3. Star streaks with gradient opacity and speed-dependent tail length.
4. Auto-resizing canvas with device pixel ratio scaling for crisp Retina display rendering.`,
    tags: ['Starfield', 'Warp Speed', 'Canvas', '3D Space', 'Hyperspace'],
  },

  // #024: Constellation Particle Network
  {
    id: 'pr-024',
    numberTag: '#024',
    title: 'Constellation Particle Network (Interactive Mesh)',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Frontend Developer',
    description: 'Jaringan partikel konstelasi saling terhubung dengan garis dinamis ketika mendekati cursor mouse atau partikel lainnya secara organik.',
    previewType: 'constellation-nodes',
    promptText: `Build a modern Particle Constellation Network in Canvas.
1. 100 floating ambient particles with soft neon glow.
2. Dynamic connecting lines drawn between particles within 120px proximity.
3. Interactive mouse attractor / repeller physics with smooth easing.
4. Low CPU consumption with spatial distance checks.`,
    tags: ['Particles', 'Network', 'Interactive', 'Constellation'],
  },

  // #025: Neon Hex Tunnel
  {
    id: 'pr-025',
    numberTag: '#025',
    title: 'Infinite Neon Hex Tunnel (3D Vortex Flight)',
    category: 'HERO BANNER & 3D',
    targetRole: '3D Web Artist',
    description: 'Terowongan heksagonal neon 3D tanpa batas dengan kecepatan tinggi, rotasi geometris, dan gradasi cahaya cyberpunk yang memukau.',
    previewType: 'neon-tunnel',
    promptText: `Design a high-speed 3D Hexagonal Neon Tunnel in Canvas/WebGL for a hero banner.
Requirements:
1. Geometry: Concentric 6-sided polygons expanding from center with logarithmic perspective scaling.
2. Speed & Rotation: Infinite forward flight with subtle camera roll oscillating smoothly.
3. Chromatic Glow: Neon magenta (#ec4899) transitioning to electric cyan (#06b6d4) with bloom shader effect.
4. Particle Sparks: Floating warp particles racing backwards along the tunnel walls.`,
    tags: ['3D Tunnel', 'Hexagon', 'Hero Banner', 'Cyberpunk', 'WebGL'],
  },

  // #026: Cyberpunk Audio Equalizer
  {
    id: 'pr-026',
    numberTag: '#026',
    title: 'Cyberpunk 3D Spectrum Audio Visualizer',
    category: 'DATA VISUALIZATION',
    targetRole: 'Frontend Creative',
    description: 'Visualizer audio spectrum 3D dengan bar frekuensi neon memantul, gradient dinamis, refleksi lantai basah, dan efek puncak gelombang.',
    previewType: 'audio-equalizer',
    promptText: `Create an interactive Cyberpunk Audio Spectrum Visualizer component.
1. Frequency Bars: 48 neon equalizer columns with dynamic bouncing heights using Perlin noise or Web Audio API.
2. Gradient Shading: Vertical gradient from cyan (#00f2fe) to violet (#8b5cf6) to neon pink (#f43f5e) at peak.
3. Mirror Reflection: Glossy dark floor mirror with smooth opacity falloff.
4. Peak Dots: Floating peak indicator caps that slowly descend with gravity.`,
    tags: ['Audio Visualizer', 'Spectrum', 'Music UI', 'Canvas', 'Cyberpunk'],
  },

  // #027: Aurora Waves
  {
    id: 'pr-027',
    numberTag: '#027',
    title: 'Aurora Borealis Fluid Wave Curtains',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Developer',
    description: 'Gelombang aurora borealis fluida berlapis dengan harmonik sinus organik, gradasi warna zamrud ke ungu, dan pendaran menenangkan.',
    previewType: 'aurora-waves',
    promptText: `Implement an organic Aurora Borealis wave background using HTML5 Canvas mathematical sine functions.
1. Waves: 5 layered ribbon wave ribbons oscillating with overlapping frequencies and amplitudes.
2. Color Palette: Ethereal emerald (#10b981), turquoise (#06b6d4), and deep ultraviolet (#7c3aed) with additive blending.
3. Flow Physics: Slow organic horizontal drift simulating high-altitude atmospheric ion lights.
4. Interactivity: Subtle cursor push displacement causing gentle ripples across the ribbon waves.`,
    tags: ['Aurora', 'Fluid Waves', 'Calm Background', 'Sine Physics', 'Generative Art'],
  },

  // #028: Laser Scanner
  {
    id: 'pr-028',
    numberTag: '#028',
    title: 'Holographic Laser Grid Scanner & Radar Target',
    category: 'HERO BANNER & 3D',
    targetRole: 'UI/UX Specialist',
    description: 'Laser beam pemindai holografik vertikal dengan target reticle berputar, crosshairs telemetry, dan efek scanner grid sci-fi.',
    previewType: 'laser-scanner',
    promptText: `Generate a high-tech Holographic Laser Scanner UI with Canvas and SVG overlays.
1. Scanning Beam: Bright cyan-blue horizontal laser bar sweeping up and down with glowing trailing beam falloff.
2. Target Reticles: Concentric rotating HUD lock circles with crosshairs and dynamic degree angles.
3. Point Cloud Points: Points lit up brightly when the laser line sweeps across their coordinate.
4. Soundwave & Data: Real-time telemetry readings, latitude/longitude tickers, and signal strength bars.`,
    tags: ['Laser Scanner', 'Hologram', 'Sci-Fi HUD', 'Radar', 'Cyber Security'],
  },

  // #029: DNA Double Helix
  {
    id: 'pr-029',
    numberTag: '#029',
    title: '3D Molecular DNA Double Helix Strand',
    category: 'DATA VISUALIZATION',
    targetRole: 'Scientific Visualization',
    description: 'Untaian molekul DNA heliks ganda 3D berputar di ruang angkasa dengan pasangan basa bercahaya, depth buffer z-sorting, dan shading bulat.',
    previewType: 'dna-helix',
    promptText: `Develop an interactive 3D DNA Double Helix visualization in Canvas.
1. Math: Two phase-shifted 3D sine/cosine spirals with connecting base-pair rungs.
2. Depth Sorting: Nodes sorted along Z-axis with radius scaling and brightness attenuation for authentic 3D depth.
3. Lighting: Phosphor blue (#38bdf8) and neon amber (#fbbf24) spheres with specular highlight reflections.
4. User Interaction: Click and drag rotation control with inertial damping.`,
    tags: ['DNA', 'Biotech', '3D Helix', 'Scientific', 'Data Viz'],
  },

  // #030: Liquid Metaball
  {
    id: 'pr-030',
    numberTag: '#030',
    title: 'Bioluminescent Fluid Liquid Blob & Glassmorphism',
    category: 'NEON GLASSMORPHISM',
    targetRole: 'Creative Developer',
    description: 'Gumpalan cairan bercahaya organik (metaball) yang bergerak dinamis dengan pergeseran bentuk fluida, specular glow, dan latar kaca buram.',
    previewType: 'liquid-blob',
    promptText: `Create an organic bioluminescent Liquid Metaball Blob background component.
1. Fluid Geometry: Dynamic perimeter control points oscillating with simplex/perlin noise for realistic amoeba fluidity.
2. Shading: Radial neon fluid gradient with soft inner lighting, deep edge shadows, and glossy specular highlights.
3. Glassmorphism: Backdrop blur overlay with high-end specular border reflection.
4. Cursor Magnetism: The liquid blob elastically pulls towards the user cursor.`,
    tags: ['Liquid Blob', 'Metaballs', 'Glassmorphism', 'Organic UI', 'Generative'],
  },

  // #031: HUD Radar
  {
    id: 'pr-031',
    numberTag: '#031',
    title: 'Tactical Sonar Radar & ESP32 Telemetry HUD',
    category: 'IOT & ESP32 ROBOTICS',
    targetRole: 'Robotics Engineer',
    description: 'Radar taktis 360 derajat dengan sapuan garis sweep berputar, blip objek terdeteksi dengan fade trail, dan grid derajat militer.',
    previewType: 'hud-radar',
    promptText: `Build a military-grade Sonar Radar HUD display in HTML5 Canvas.
1. Radial Sweep: 360-degree rotating phosphor beam with 45-degree fading decay trail.
2. Grid & Bearings: Concentric distance ranges (10m, 20m, 50m) and cardinal degree ticks (0°, 90°, 180°, 270°).
3. Target Blips: Interactive detected sensor obstacles that illuminate brightly upon contact and fade slowly.
4. Telemetry Overlay: Live bearing angle readout, detected target count, and ping frequency.`,
    tags: ['Radar', 'Sonar', 'IoT', 'Robotics', 'Military HUD'],
  },

  // #032: Particle Vortex
  {
    id: 'pr-032',
    numberTag: '#032',
    title: 'Cosmic Gravitational Particle Spiral Vortex',
    category: 'HERO BANNER & 3D',
    targetRole: 'Creative Developer',
    description: 'Vorteks spiral gravitasi galaksi dengan ribuan partikel debu kosmik berputar mengelilingi inti lubang hitam dengan fisika orbital nyata.',
    previewType: 'particle-vortex',
    promptText: `Design a Cosmic Gravitational Vortex Canvas animation.
1. Spiral Physics: 300+ particles orbiting with angular velocity inversely proportional to radius (Keplerian orbits).
2. Color Grading: Accretion disk palette transitioning from fiery amber core to violet and deep space cyan.
3. Gravitational Pulse: Core pulses with soft light wave shockwaves periodically.
4. Cursor Mass: User cursor acts as a secondary gravitational well pulling nearby dust particles.`,
    tags: ['Vortex', 'Black Hole', 'Cosmic', 'Physics', 'Galaxy'],
  },

  // #033: Spotlight Glass Card
  {
    id: 'pr-033',
    numberTag: '#033',
    title: 'Interactive Radial Spotlight & Prism Glass Card',
    category: 'CARDS & SPOTLIGHT',
    targetRole: 'UI/UX Specialist',
    description: 'Kartu UI glassmorphism modern dengan pendaran spotlight radial yang mengikuti kursor mouse, efek tilt 3D, dan border iridescent.',
    previewType: 'spotlight-card',
    promptText: `Act as a Staff UI Designer.
Create a set of Interactive Spotlight Glassmorphism Cards in React with Tailwind CSS.
Requirements:
1. Spotlight Glow: Subtle radial gradient (#38bdf8 at 15% opacity) tracking exact cursor coordinates on card surfaces.
2. 3D Tilt: Subtle gyroscope card rotation (max 10 deg) based on mouse offset from card center with smooth CSS transform.
3. Specular Border: Dynamic border illumination that only glints near the mouse pointer.
4. Content: Clean typographic hierarchy, unboxed metadata, and micro-interaction icon buttons.`,
    tags: ['Spotlight', 'Glassmorphism', '3D Tilt', 'Card UI', 'Micro-interactions'],
  },

  // #034: Glitch Terminal
  {
    id: 'pr-034',
    numberTag: '#034',
    title: 'Retro Cyberpunk CRT Terminal with Glitch Chromatic',
    category: 'AI & SYSTEM PROMPT',
    targetRole: 'Creative Developer',
    description: 'Terminal hacker retro dengan scanlines horizontal CRT, teks log sistem monospace hijau fosfor, dan glitch RGB chromatic aberration.',
    previewType: 'glitch-terminal',
    promptText: `Construct a retro Cyberpunk CRT Hacker Terminal in React and Canvas.
1. CRT Aesthetics: Subtle screen curvature, horizontal scanline stripes, and edge vignette shadows.
2. Glitch Effect: Periodic horizontal slice displacement and RGB chromatic channel splitting (red/cyan offset).
3. Streaming Text: Typing animation of system boot logs, memory dumps, and AI diagnostic telemetry.
4. Input Prompt: Interactive blinking block cursor accepting user terminal commands.`,
    tags: ['CRT', 'Terminal', 'Glitch', 'Cyberpunk', 'Hacker UI'],
  },

  // #035: Isometric Cyber City
  {
    id: 'pr-035',
    numberTag: '#035',
    title: '3D Isometric Cyber City Wireframe & Data Traffic',
    category: 'HERO BANNER & 3D',
    targetRole: '3D Web Artist',
    description: 'Pemandangan kota cyberpunk isometrik 3D dengan gedung-gedung neon wireframe dan partikel lalu lintas data bergerak di jalanan elevated.',
    previewType: 'isometric-city',
    promptText: `Build an Isometric 3D Cyber City wireframe generator using Canvas 2D isometric projection math.
1. Buildings: Procedural isometric cubes with varying heights, illuminated rooftop antennas, and neon window grids.
2. Highway Grid: Elevated glowing roads between blocks with pulses of light representing vehicle data packets.
3. Camera Panning: Gentle infinite isometric drift across the metropolis grid.
4. Color Theme: Deep obsidian (#040914) with electric cyan (#00f2fe) and hot pink (#ec4899) outlines.`,
    tags: ['Isometric', 'Cyber City', 'Wireframe', '3D Projection', 'Futuristic'],
  },

  // #036: Magnetic Spring Button
  {
    id: 'pr-036',
    numberTag: '#036',
    title: 'Magnetic Spring Physics Button & Shockwave Burst',
    category: 'BUTTONS & MICRO-INTERACTIONS',
    targetRole: 'Frontend Developer',
    description: 'Tombol dengan fisika pegas magnetik yang tertarik ke arah kursor mouse, pantulan elastis (damping spring), dan semburan partikel klik.',
    previewType: 'magnetic-button',
    promptText: `Develop a Magnetic Physics Button component in React and Framer Motion / Canvas.
1. Magnetic Pull: Button elastically shifts toward the mouse within an 80px attraction radius.
2. Spring Damping: On mouse leave, smoothly spring back to origin with realistic overshoot physics.
3. Ripple Shockwave: Clicking generates expanding neon shockwaves and a radial burst of 24 floating spark particles.
4. Sound FX / Haptic: Subtle visual click press state with luminous interior gradient shift.`,
    tags: ['Magnetic Button', 'Physics', 'Micro-interactions', 'Spring', 'Particles'],
  },

  // #037: Tesseract Hypercube
  {
    id: 'pr-037',
    numberTag: '#037',
    title: '4D Rotating Wireframe Tesseract (Hypercube Matrix)',
    category: 'HERO BANNER & 3D',
    targetRole: 'Math & 3D Specialist',
    description: 'Simulasi hypercube tesseract 4 dimensi berputar secara kontinu dengan proyeksi stereografik 4D ke 3D ke 2D, simpul bercahaya, dan garis vektor.',
    previewType: 'tesseract-cube',
    promptText: `Implement a mathematical 4D Tesseract (Hypercube) rotating in 4D space projected onto a 2D Canvas.
1. Mathematics: 16 4D vertices transformed via 4D rotation matrices (XW, YZ, ZW planes) projected to 3D and 2D.
2. Edges: 32 vector wireframe edges connecting vertices with distance-based thickness and neon luminescence.
3. Nodes: 16 glowing spherical vertices pulsing with soft cyan and magenta halos.
4. Interactive Controls: Drag mouse to manually spin the 4D rotation angles.`,
    tags: ['Tesseract', 'Hypercube', '4D Math', 'Geometry', '3D Wireframe'],
  },

  // #038: Firefly Forest
  {
    id: 'pr-038',
    numberTag: '#038',
    title: 'Bioluminescent Firefly Forest & Ethereal Bokeh Mist',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Creative Technologist',
    description: 'Kunang-kunang bioluminescence melayang anggun di hutan berkabut dengan ritme kedipan napas organik, efek bokeh lembut, dan respon angin.',
    previewType: 'firefly-forest',
    promptText: `Create an ethereal Bioluminescent Firefly Atmosphere background in Canvas.
1. Particles: 50 floating fireflies drifting along organic Perlin noise vector fields.
2. Luminescence: Smooth sinusoidal breathing light cycle (flicker) with warm amber-gold (#f59e0b) and mint emerald (#34d399) glow.
3. Bokeh Layers: Foreground and background fireflies with soft radial blur and depth-of-field attenuation.
4. Ambient Fog: Subtle volumetric fog gradients floating gently across the bottom canvas.`,
    tags: ['Fireflies', 'Atmosphere', 'Organic', 'Bokeh', 'Calm UI'],
  },

  // #039: Nixie Tube Clock
  {
    id: 'pr-039',
    numberTag: '#039',
    title: 'Cyberpunk Nixie Tube Digital HUD Clock & Telemetry',
    category: 'DATA VISUALIZATION',
    targetRole: 'Creative Developer',
    description: 'Jam digital tabung Nixie retro-futuristik bercahaya filamen gas neon oranye hangat, penghitung milidetik real-time, dan frame kaca vintage.',
    previewType: 'nixie-clock',
    promptText: `Design an authentic Cyberpunk Nixie Tube Clock display in Canvas and CSS.
1. Tube Graphics: Cylindrical glass enclosures with wire mesh anodes and interior filament reflections.
2. Filament Glow: Warm neon orange gas discharge (#ff7700) with characteristic corona bloom and inner wire shadows.
3. Real-Time Logic: Accurate local clock with Hours, Minutes, Seconds, and high-speed Milliseconds counter.
4. Cathode Poisoning Prevention: Periodic rapid slot-machine digit shuffle effect every minute.`,
    tags: ['Nixie Tube', 'Clock', 'Cyberpunk', 'Retro Sci-Fi', 'HUD'],
  },

  // #040: Sonic Ripples
  {
    id: 'pr-040',
    numberTag: '#040',
    title: 'Acoustic Shockwave Sonic Ripples & Wave Interference',
    category: 'INTERACTIVE BACKGROUND',
    targetRole: 'Audio & Visual Engineer',
    description: 'Gelombang kejut sonik melingkar konsentris memancar keluar dengan pola interferensi gelombang, dinamika frekuensi, dan pantulan batas.',
    previewType: 'sonic-ripples',
    promptText: `Build an Acoustic Shockwave Ripple animation in Canvas.
1. Wave Emitters: Concentric circular pressure wavefronts emanating outward from central or interactive points.
2. Wave Interference: Real-time constructive and destructive wave amplitude overlay where wave fronts intersect.
3. Palette: Deep oceanic sapphire (#0284c7) to ultraviolet (#a855f7) with luminous crests and dark troughs.
4. Click Pulse: Clicking anywhere on the canvas spawns a high-energy expanding acoustic impulse shockwave.`,
    tags: ['Sonic Ripples', 'Shockwaves', 'Interference', 'Acoustic', 'Canvas Wave'],
  },

  // #041: Circuit Board Currents
  {
    id: 'pr-041',
    numberTag: '#041',
    title: 'High-Tech PCB Circuit Board Electron Currents',
    category: 'IOT & ESP32 ROBOTICS',
    targetRole: 'Hardware & IoT UI',
    description: 'Jalur sirkuit PCB berteknologi tinggi dengan paket elektron cahaya neon bergerak cepat di sepanjang lintasan sudut 45 derajat menuju chip mikro.',
    previewType: 'circuit-board',
    promptText: `Create an animated High-Tech Printed Circuit Board (PCB) component in Canvas.
1. Bus Geometry: Realistic PCB traces with 45-degree chamfered bends, via solder pads, and integrated circuit chip footprint.
2. Electron Packets: Bright pulses of light (photons/electrons) travelling along traces at variable speeds.
3. Component Glow: Capacitors and microchip controller pins pulsing with status diagnostic LEDs.
4. Colors: Dark matte soldermask background with bright electric cyan and neon green data pulses.`,
    tags: ['PCB', 'Circuit Board', 'Hardware', 'IoT', 'Electronics'],
  },

  // #042: Honeycomb Energy Shield
  {
    id: 'pr-042',
    numberTag: '#042',
    title: 'Sci-Fi Hexagonal Honeycomb Forcefield Shield',
    category: 'CARDS & SPOTLIGHT',
    targetRole: 'Game & VFX UI',
    description: 'Perisai energi heksagonal sarang lebah sci-fi yang menyala terang saat terkena tumbukan kursor, dengan gelombang disipasi energi ke sel sekitarnya.',
    previewType: 'energy-shield',
    promptText: `Construct an interactive Sci-Fi Hexagonal Energy Shield in Canvas.
1. Hex Grid: Seamless mathematical tessellation of regular hexagons spanning the viewport.
2. Impact Illumination: Mouse cursor or click acts as an energy strike, lighting up adjacent hex tiles with high intensity.
3. Diffusion Ripple: Energy propagates outward to neighboring hexagonal cells with exponential decay.
4. Shield Ambient: Subtle idling grid line shimmer with occasional random micro-deflections.`,
    tags: ['Forcefield', 'Energy Shield', 'Hexagon', 'Sci-Fi', 'VFX UI'],
  },

  // #043: Quantum Strings
  {
    id: 'pr-043',
    numberTag: '#043',
    title: 'Quantum Harmonic String Waveforms & Silk Ribbon',
    category: 'NAVIGATION & MENU',
    targetRole: 'Creative Developer',
    description: 'Pita sutra gelombang harmonik kuantum berayun anggun di ruang angkasa dengan gradasi warna warni iridescent dan gerakan gelombang fluida.',
    previewType: 'quantum-strings',
    promptText: `Develop an elegant Quantum Harmonic Strings simulation in Canvas.
1. String Physics: 8 parallel oscillating wave ribbons governed by coupled harmonic oscillator equations.
2. Chromatic Sheen: Iridescent gradient mapping transitioning seamlessly across pink, turquoise, and electric violet.
3. Fluid Motion: Damped pendulum physics responding smoothly to cursor velocity and direction.
4. Performance: Optimized vertex rendering using quadratic Bezier curve interpolation.`,
    tags: ['Quantum Strings', 'Ribbon Waves', 'Harmonic', 'Generative', 'Luxury UI'],
  },

  // #044: Orbital Atom Gyroscope
  {
    id: 'pr-044',
    numberTag: '#044',
    title: 'Gyroscopic Orbital Core & Planetary Data Rings',
    category: 'UI/UX & FRONTEND',
    targetRole: '3D Web Specialist',
    description: 'Inti energi gyroskopik 3D dengan cincin orbital data berputar pada berbagai sudut sumbu Euler mengelilingi bola plasma berpendar di pusatnya.',
    previewType: 'orbital-rings',
    promptText: `Design a 3D Gyroscopic Orbital Core component in Canvas.
1. Core: Glowing central sphere with pulsating coronal aura and surface plasma flares.
2. Orbital Rings: 4 concentric elliptical data rings tilted at distinct 3D angles spinning at independent orbital rates.
3. Satellite Nodes: Data telemetry satellites orbiting on the ring paths leaving luminous trail sparks.
4. Perspective Depth: Front and back depth sorting where rings pass in front of and behind the core sphere.`,
    tags: ['Gyroscopic', 'Orbital Rings', 'Atom Core', '3D Science', 'Frontend'],
  },
];
