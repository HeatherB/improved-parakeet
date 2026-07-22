/**
 * Coloring Canvas Web Component
 * Displays an interactive coloring page background for the great_outdoors theme
 */

const templateColoringCanvas = document.createElement("template");
templateColoringCanvas.innerHTML = `
  <style>
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    :host(.active) {
      display: block;
    }

    .coloring-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 300vh; /* Tall enough for scrolling scene */
      opacity: 0.35;
      pointer-events: auto;
    }

    .coloring-container svg {
      width: 100%;
      height: 100%;
    }

    /* Filled regions pop at full opacity */
    .coloring-container [data-colorable="true"].filled {
      opacity: 1 !important;
    }

    /* Color palette */
    .palette {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      pointer-events: auto;
    }

    .palette-colors {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: 120px;
    }

    .color-swatch {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .color-swatch:hover {
      transform: scale(1.15);
    }

    .color-swatch.active {
      border-color: #333;
      transform: scale(1.1);
    }

    .palette-actions {
      display: flex;
      gap: 6px;
    }

    .palette-btn {
      flex: 1;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .reset-btn {
      background: #f0f0f0;
      color: #666;
    }

    .reset-btn:hover {
      background: #e0e0e0;
    }

    .eraser-btn {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }

    .eraser-btn:hover {
      background: #f5f5f5;
    }

    .eraser-btn.active {
      background: #333;
      color: #fff;
    }

    /* Hide palette when not in great_outdoors theme */
    :host(:not(.active)) .palette {
      display: none;
    }
  </style>

  <div class="coloring-container">
    <!-- SVG will be loaded here -->
  </div>

  <div class="palette">
    <div class="palette-colors"></div>
    <div class="palette-actions">
      <button class="palette-btn eraser-btn" title="Eraser">✕</button>
      <button class="palette-btn reset-btn" title="Clear all colors">Reset</button>
    </div>
  </div>
`;

class ColoringCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateColoringCanvas.content.cloneNode(true));

    // State
    this.activeColor = null;
    this.isEraser = false;
    this.coloredRegions = {};
    this.scrollOffset = 0;

    // Tropical color palette
    this.colors = [
      { name: 'ocean-deep', hex: '#1a5f7a' },
      { name: 'ocean-light', hex: '#57c5b6' },
      { name: 'sand', hex: '#f5deb3' },
      { name: 'coral', hex: '#ff6b6b' },
      { name: 'palm-green', hex: '#2d5a27' },
      { name: 'sunset-orange', hex: '#ff8c42' },
      { name: 'sunset-pink', hex: '#ffaaa5' },
      { name: 'sky-blue', hex: '#87ceeb' },
    ];

    // Elements
    this.container = this.shadowRoot.querySelector('.coloring-container');
    this.paletteColors = this.shadowRoot.querySelector('.palette-colors');
    this.resetBtn = this.shadowRoot.querySelector('.reset-btn');
    this.eraserBtn = this.shadowRoot.querySelector('.eraser-btn');

    this._init();
  }

  _init() {
    this._renderPalette();
    this._loadSavedState();
    this._setupEventListeners();
    this._loadSVG();
  }

  _renderPalette() {
    this.colors.forEach((color, index) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color.hex;
      swatch.dataset.color = color.hex;
      swatch.title = color.name;

      // Select first color by default
      if (index === 0) {
        swatch.classList.add('active');
        this.activeColor = color.hex;
      }

      swatch.addEventListener('click', () => this._selectColor(color.hex, swatch));
      this.paletteColors.appendChild(swatch);
    });
  }

  _selectColor(hex, swatch) {
    // Deselect eraser
    this.isEraser = false;
    this.eraserBtn.classList.remove('active');

    // Update active color
    this.activeColor = hex;
    this.shadowRoot.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
  }

  _setupEventListeners() {
    // Eraser button
    this.eraserBtn.addEventListener('click', () => {
      this.isEraser = !this.isEraser;
      this.eraserBtn.classList.toggle('active', this.isEraser);
      if (this.isEraser) {
        this.shadowRoot.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      }
    });

    // Reset button
    this.resetBtn.addEventListener('click', () => {
      this._resetColors();
    });

    // Click on colorable regions
    this.container.addEventListener('click', (e) => {
      const target = e.target.closest('[data-colorable="true"]');
      if (!target) return;

      if (this.isEraser) {
        this._eraseRegion(target);
      } else if (this.activeColor) {
        this._fillRegion(target, this.activeColor);
      }
    });

    // Scroll sync - move coloring page with scroll
    this._setupScrollSync();

    // Listen for theme changes
    document.addEventListener('theme-change', (e) => {
      this._handleThemeChange(e.detail.theme);
    });

    // Check initial theme on load
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme') || 'downtown';
      this._handleThemeChange(savedTheme);
    });

    // Also check immediately in case DOMContentLoaded already fired
    if (document.readyState !== 'loading') {
      const savedTheme = localStorage.getItem('theme') || 'downtown';
      this._handleThemeChange(savedTheme);
    }
  }

  _setupScrollSync() {
    // Find the scroll container
    const scrollContainer = document.querySelector('.container');
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercent = scrollTop / scrollHeight;

      // Move the coloring page to reveal different sections
      // Container is 300vh, viewport is 100vh, so max offset is -200vh
      const maxOffset = this.container.offsetHeight - window.innerHeight;
      const offset = scrollPercent * maxOffset;

      this.container.style.transform = `translateY(-${offset}px)`;
    });
  }

  _handleThemeChange(theme) {
    if (theme === 'great_outdoors') {
      this.classList.add('active');
    } else {
      this.classList.remove('active');
    }
  }

  _loadSVG() {
    // Inline SVG to avoid CORS issues with file:// protocol
    this.container.innerHTML = this._getTropicalSceneSVG();
    this._applySavedColors();
  }

  _getTropicalSceneSVG() {
    return `<svg viewBox="0 0 400 1400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <style>
    [data-colorable="true"] { cursor: pointer; transition: fill 0.2s ease; }
    [data-colorable="true"]:hover { filter: brightness(0.95); }
  </style>
  
  <!-- ========== SKY SECTION (0-250) ========== -->
  <rect id="sky" data-colorable="true" x="0" y="0" width="400" height="250" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Sun -->
  <circle id="sun" data-colorable="true" cx="320" cy="60" r="45" fill="white" stroke="#333" stroke-width="2"/>
  
  <!-- Clouds -->
  <g id="cloud-left">
    <ellipse id="cloud1-a" data-colorable="true" cx="60" cy="50" rx="25" ry="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="cloud1-b" data-colorable="true" cx="85" cy="45" rx="30" ry="18" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="cloud1-c" data-colorable="true" cx="115" cy="50" rx="25" ry="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="cloud1-d" data-colorable="true" cx="80" cy="60" rx="35" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <g id="cloud-right">
    <ellipse id="cloud2-a" data-colorable="true" cx="250" cy="80" rx="20" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="cloud2-b" data-colorable="true" cx="270" cy="75" rx="25" ry="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="cloud2-c" data-colorable="true" cx="295" cy="82" rx="22" ry="13" fill="white" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- ========== ISLAND SECTION ========== -->
  <!-- Volcano -->
  <path id="volcano" data-colorable="true" d="M150,200 L180,110 Q200,95 220,110 L250,200 Q200,210 150,200" fill="white" stroke="#333" stroke-width="2"/>
  <path id="volcano-crater" data-colorable="true" d="M180,110 Q200,120 220,110" fill="none" stroke="#333" stroke-width="2"/>
  
  <!-- Island base -->
  <ellipse id="island-base" data-colorable="true" cx="200" cy="220" rx="160" ry="35" fill="white" stroke="#333" stroke-width="2"/>
  
  <!-- Palm trees -->
  <!-- Left palm -->
  <path id="palm1-trunk" data-colorable="true" d="M80,220 Q75,180 85,140" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <path id="palm1-leaf1" data-colorable="true" d="M85,140 Q50,130 20,150 Q55,145 85,140" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm1-leaf2" data-colorable="true" d="M85,140 Q60,110 40,100 Q65,115 85,140" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm1-leaf3" data-colorable="true" d="M85,140 Q100,110 130,105 Q105,115 85,140" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm1-leaf4" data-colorable="true" d="M85,140 Q120,130 150,145 Q115,140 85,140" fill="white" stroke="#333" stroke-width="1.5"/>
  
  <!-- Center palm -->
  <path id="palm2-trunk" data-colorable="true" d="M280,220 Q290,170 275,120" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <path id="palm2-leaf1" data-colorable="true" d="M275,120 Q240,100 210,110 Q245,105 275,120" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm2-leaf2" data-colorable="true" d="M275,120 Q250,90 230,75 Q255,90 275,120" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm2-leaf3" data-colorable="true" d="M275,120 Q300,90 330,85 Q305,95 275,120" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm2-leaf4" data-colorable="true" d="M275,120 Q310,110 345,120 Q310,115 275,120" fill="white" stroke="#333" stroke-width="1.5"/>
  
  <!-- Right small palm -->
  <path id="palm3-trunk" data-colorable="true" d="M340,225 Q350,195 340,165" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
  <path id="palm3-leaf1" data-colorable="true" d="M340,165 Q320,155 300,160" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm3-leaf2" data-colorable="true" d="M340,165 Q360,150 380,155" fill="white" stroke="#333" stroke-width="1.5"/>
  <path id="palm3-leaf3" data-colorable="true" d="M340,165 Q340,145 345,130" fill="white" stroke="#333" stroke-width="1.5"/>
  
  <!-- Bushes on island -->
  <ellipse id="bush1" data-colorable="true" cx="120" cy="210" rx="20" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse id="bush2" data-colorable="true" cx="180" cy="215" rx="15" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse id="bush3" data-colorable="true" cx="230" cy="212" rx="18" ry="11" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse id="bush4" data-colorable="true" cx="310" cy="218" rx="16" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
  
  <!-- ========== WATER SURFACE (250-350) ========== -->
  <rect id="water-surface" data-colorable="true" x="0" y="250" width="400" height="100" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Waves -->
  <path id="wave1" d="M0,270 Q25,260 50,270 Q75,280 100,270 Q125,260 150,270 Q175,280 200,270 Q225,260 250,270 Q275,280 300,270 Q325,260 350,270 Q375,280 400,270" fill="none" stroke="#333" stroke-width="1.5"/>
  <path id="wave2" d="M0,295 Q30,285 60,295 Q90,305 120,295 Q150,285 180,295 Q210,305 240,295 Q270,285 300,295 Q330,305 360,295 Q390,285 400,295" fill="none" stroke="#333" stroke-width="1.5"/>
  <path id="wave3" d="M0,320 Q20,310 40,320 Q60,330 80,320 Q100,310 120,320 Q140,330 160,320 Q180,310 200,320 Q220,330 240,320 Q260,310 280,320 Q300,330 320,320 Q340,310 360,320 Q380,330 400,320" fill="none" stroke="#333" stroke-width="1"/>
  
  <!-- ========== UPPER WATER WITH FISH (350-650) ========== -->
  <rect id="upper-water" data-colorable="true" x="0" y="350" width="400" height="300" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Fish 1: Striped oval fish (top left) -->
  <g id="fish1-group" transform="translate(50, 380)">
    <ellipse id="fish1-body" data-colorable="true" cx="40" cy="25" rx="35" ry="20" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish1-tail" data-colorable="true" d="M75,25 L100,10 L100,40 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish1-fin-top" data-colorable="true" d="M30,5 Q40,0 50,5" fill="white" stroke="#333" stroke-width="1.5"/>
    <line x1="25" y1="15" x2="25" y2="35" stroke="#333" stroke-width="1"/>
    <line x1="35" y1="12" x2="35" y2="38" stroke="#333" stroke-width="1"/>
    <line x1="45" y1="12" x2="45" y2="38" stroke="#333" stroke-width="1"/>
    <line x1="55" y1="15" x2="55" y2="35" stroke="#333" stroke-width="1"/>
    <circle cx="18" cy="23" r="4" fill="#333"/>
  </g>
  
  <!-- Fish 2: Scaly round fish (top right) -->
  <g id="fish2-group" transform="translate(280, 370)">
    <ellipse id="fish2-body" data-colorable="true" cx="35" cy="30" rx="30" ry="28" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish2-tail" data-colorable="true" d="M65,30 L90,15 L90,45 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish2-fin-top" data-colorable="true" d="M25,2 Q35,-5 45,2" fill="white" stroke="#333" stroke-width="1.5"/>
    <!-- Scale pattern -->
    <path d="M20,20 Q25,18 30,20 Q25,22 20,20" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M30,18 Q35,16 40,18 Q35,20 30,18" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M40,20 Q45,18 50,20 Q45,22 40,20" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M15,30 Q20,28 25,30 Q20,32 15,30" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M25,28 Q30,26 35,28 Q30,30 25,28" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M35,30 Q40,28 45,30 Q40,32 35,30" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M45,28 Q50,26 55,28 Q50,30 45,28" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M20,40 Q25,38 30,40 Q25,42 20,40" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M30,38 Q35,36 40,38 Q35,40 30,38" fill="none" stroke="#333" stroke-width="0.8"/>
    <path d="M40,40 Q45,38 50,40 Q45,42 40,40" fill="none" stroke="#333" stroke-width="0.8"/>
    <circle cx="20" cy="28" r="5" fill="#333"/>
  </g>
  
  <!-- Fish 3: Angelfish with circles (center) -->
  <g id="fish3-group" transform="translate(160, 440)">
    <path id="fish3-body" data-colorable="true" d="M40,0 Q70,25 40,50 Q10,25 40,0" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish3-tail" data-colorable="true" d="M65,25 L90,10 L90,40 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish3-fin-top" data-colorable="true" d="M30,-10 Q40,-20 50,-10" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="fish3-fin-bottom" data-colorable="true" d="M30,60 Q40,70 50,60" fill="white" stroke="#333" stroke-width="1.5"/>
    <circle id="fish3-circle1" data-colorable="true" cx="30" cy="20" r="6" fill="white" stroke="#333" stroke-width="1"/>
    <circle id="fish3-circle2" data-colorable="true" cx="45" cy="30" r="8" fill="white" stroke="#333" stroke-width="1"/>
    <circle id="fish3-circle3" data-colorable="true" cx="30" cy="35" r="5" fill="white" stroke="#333" stroke-width="1"/>
    <circle cx="22" cy="22" r="3" fill="#333"/>
  </g>
  
  <!-- Fish 4: Long striped fish (left side) -->
  <g id="fish4-group" transform="translate(20, 520)">
    <ellipse id="fish4-body" data-colorable="true" cx="50" cy="18" rx="45" ry="15" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish4-tail" data-colorable="true" d="M95,18 L120,5 L120,31 Z" fill="white" stroke="#333" stroke-width="2"/>
    <line x1="30" y1="8" x2="30" y2="28" stroke="#333" stroke-width="1"/>
    <line x1="45" y1="5" x2="45" y2="31" stroke="#333" stroke-width="1"/>
    <line x1="60" y1="5" x2="60" y2="31" stroke="#333" stroke-width="1"/>
    <line x1="75" y1="8" x2="75" y2="28" stroke="#333" stroke-width="1"/>
    <circle cx="15" cy="16" r="3" fill="#333"/>
  </g>
  
  <!-- Fish 5: Clownfish style (right side) -->
  <g id="fish5-group" transform="translate(290, 500)">
    <ellipse id="fish5-body" data-colorable="true" cx="35" cy="22" rx="30" ry="18" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish5-tail" data-colorable="true" d="M65,22 L85,8 L85,36 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish5-fin-top" data-colorable="true" d="M25,4 Q35,-2 45,4" fill="white" stroke="#333" stroke-width="1.5"/>
    <!-- Clown stripes -->
    <path id="fish5-stripe1" data-colorable="true" d="M20,8 Q18,22 20,36" fill="none" stroke="#333" stroke-width="4"/>
    <path id="fish5-stripe2" data-colorable="true" d="M45,10 Q48,22 45,34" fill="none" stroke="#333" stroke-width="4"/>
    <circle cx="12" cy="20" r="3" fill="#333"/>
  </g>
  
  <!-- Fish 6: Wavy pattern fish (center bottom) -->
  <g id="fish6-group" transform="translate(150, 580)">
    <ellipse id="fish6-body" data-colorable="true" cx="40" cy="20" rx="35" ry="18" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish6-tail" data-colorable="true" d="M75,20 L100,5 L100,35 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path d="M20,12 Q30,8 40,12 Q50,16 60,12" fill="none" stroke="#333" stroke-width="1"/>
    <path d="M18,20 Q30,16 42,20 Q54,24 66,20" fill="none" stroke="#333" stroke-width="1"/>
    <path d="M20,28 Q30,24 40,28 Q50,32 60,28" fill="none" stroke="#333" stroke-width="1"/>
    <circle cx="12" cy="18" r="3" fill="#333"/>
  </g>
  
  <!-- ========== MIDDLE WATER WITH MORE FISH (650-900) ========== -->
  <rect id="middle-water" data-colorable="true" x="0" y="650" width="400" height="250" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Fish 7: Diamond fish (top left) -->
  <g id="fish7-group" transform="translate(30, 680)">
    <path id="fish7-body" data-colorable="true" d="M35,0 L70,25 L35,50 L0,25 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish7-tail" data-colorable="true" d="M70,25 L95,10 L95,40 Z" fill="white" stroke="#333" stroke-width="2"/>
    <!-- Crosshatch pattern -->
    <line x1="20" y1="15" x2="50" y2="15" stroke="#333" stroke-width="0.8"/>
    <line x1="15" y1="25" x2="55" y2="25" stroke="#333" stroke-width="0.8"/>
    <line x1="20" y1="35" x2="50" y2="35" stroke="#333" stroke-width="0.8"/>
    <line x1="25" y1="10" x2="25" y2="40" stroke="#333" stroke-width="0.8"/>
    <line x1="35" y1="5" x2="35" y2="45" stroke="#333" stroke-width="0.8"/>
    <line x1="45" y1="10" x2="45" y2="40" stroke="#333" stroke-width="0.8"/>
    <circle cx="18" cy="23" r="3" fill="#333"/>
  </g>
  
  <!-- Fish 8: Tropical with spots (right) -->
  <g id="fish8-group" transform="translate(280, 700)">
    <ellipse id="fish8-body" data-colorable="true" cx="40" cy="28" rx="35" ry="25" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish8-tail" data-colorable="true" d="M75,28 L105,10 L105,46 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish8-fin-top" data-colorable="true" d="M30,3 L40,-10 L50,3" fill="white" stroke="#333" stroke-width="1.5"/>
    <circle id="fish8-spot1" data-colorable="true" cx="30" cy="20" r="5" fill="white" stroke="#333" stroke-width="1"/>
    <circle id="fish8-spot2" data-colorable="true" cx="50" cy="25" r="6" fill="white" stroke="#333" stroke-width="1"/>
    <circle id="fish8-spot3" data-colorable="true" cx="35" cy="38" r="4" fill="white" stroke="#333" stroke-width="1"/>
    <circle id="fish8-spot4" data-colorable="true" cx="55" cy="35" r="3" fill="white" stroke="#333" stroke-width="1"/>
    <circle cx="15" cy="26" r="4" fill="#333"/>
  </g>
  
  <!-- Fish 9: Pufferfish style (center) -->
  <g id="fish9-group" transform="translate(160, 760)">
    <circle id="fish9-body" data-colorable="true" cx="30" cy="30" r="28" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish9-tail" data-colorable="true" d="M58,30 L80,15 L80,45 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish9-fin-top" data-colorable="true" d="M20,2 Q30,-8 40,2" fill="white" stroke="#333" stroke-width="1.5"/>
    <!-- Spiky details -->
    <line x1="10" y1="15" x2="5" y2="10" stroke="#333" stroke-width="1.5"/>
    <line x1="15" y1="8" x2="12" y2="2" stroke="#333" stroke-width="1.5"/>
    <line x1="10" y1="45" x2="5" y2="50" stroke="#333" stroke-width="1.5"/>
    <line x1="15" y1="52" x2="12" y2="58" stroke="#333" stroke-width="1.5"/>
    <circle cx="20" cy="25" r="5" fill="#333"/>
    <ellipse cx="20" cy="40" rx="8" ry="4" fill="none" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- Fish 10: Sleek fish (bottom left) -->
  <g id="fish10-group" transform="translate(40, 850)">
    <path id="fish10-body" data-colorable="true" d="M0,20 Q40,0 80,20 Q40,40 0,20" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish10-tail" data-colorable="true" d="M80,20 L105,5 L105,35 Z" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish10-fin" data-colorable="true" d="M35,0 Q45,-10 55,0" fill="white" stroke="#333" stroke-width="1.5"/>
    <line x1="25" y1="12" x2="25" y2="28" stroke="#333" stroke-width="1"/>
    <line x1="45" y1="10" x2="45" y2="30" stroke="#333" stroke-width="1"/>
    <line x1="65" y1="14" x2="65" y2="26" stroke="#333" stroke-width="1"/>
    <circle cx="12" cy="18" r="3" fill="#333"/>
  </g>
  
  <!-- Fish 11: Fancy goldfish (right bottom) -->
  <g id="fish11-group" transform="translate(270, 830)">
    <ellipse id="fish11-body" data-colorable="true" cx="35" cy="30" rx="30" ry="25" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish11-tail" data-colorable="true" d="M65,30 Q85,10 95,15 Q80,30 95,45 Q85,50 65,30" fill="white" stroke="#333" stroke-width="2"/>
    <path id="fish11-fin-top" data-colorable="true" d="M20,5 Q35,-10 50,5" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="fish11-fin-side" data-colorable="true" d="M25,55 Q35,70 45,55" fill="white" stroke="#333" stroke-width="1.5"/>
    <circle cx="20" cy="28" r="4" fill="#333"/>
  </g>
  
  <!-- Bubbles scattered -->
  <circle id="bubble1" data-colorable="true" cx="380" cy="400" r="6" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble2" data-colorable="true" cx="375" cy="450" r="4" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble3" data-colorable="true" cx="385" cy="500" r="5" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble4" data-colorable="true" cx="25" cy="600" r="7" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble5" data-colorable="true" cx="35" cy="650" r="4" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble6" data-colorable="true" cx="20" cy="700" r="5" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble7" data-colorable="true" cx="200" cy="720" r="6" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble8" data-colorable="true" cx="195" cy="680" r="4" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble9" data-colorable="true" cx="350" cy="800" r="5" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble10" data-colorable="true" cx="360" cy="850" r="7" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- ========== SEA FLOOR SECTION (900-1400) ========== -->
  <rect id="deep-water" data-colorable="true" x="0" y="900" width="400" height="500" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Sandy floor line -->
  <path id="sand-floor" data-colorable="true" d="M0,1050 Q50,1040 100,1050 Q150,1060 200,1050 Q250,1040 300,1050 Q350,1060 400,1050 L400,1400 L0,1400 Z" fill="white" stroke="#333" stroke-width="2"/>
  
  <!-- Left seaweed cluster -->
  <path id="seaweed1" data-colorable="true" d="M30,1050 Q20,1000 35,950 Q50,900 30,850" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
  <path id="seaweed2" data-colorable="true" d="M50,1050 Q60,990 45,930 Q30,870 55,820" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
  <path id="seaweed3" data-colorable="true" d="M70,1055 Q80,1010 65,965" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Left coral cluster -->
  <g id="coral-left" transform="translate(20, 1060)">
    <ellipse id="coral1-base" data-colorable="true" cx="40" cy="30" rx="35" ry="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="coral1-branch1" data-colorable="true" d="M25,30 Q20,10 25,-10 Q30,0 35,-15 Q35,5 40,10" fill="white" stroke="#333" stroke-width="2"/>
    <path id="coral1-branch2" data-colorable="true" d="M50,30 Q55,15 50,0 Q45,10 40,-5" fill="white" stroke="#333" stroke-width="2"/>
  </g>
  
  <!-- Anemone (left side) -->
  <g id="anemone1" transform="translate(100, 1020)">
    <ellipse id="anemone1-base" data-colorable="true" cx="25" cy="50" rx="20" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="anemone1-tentacle1" data-colorable="true" d="M10,50 Q5,30 15,10" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path id="anemone1-tentacle2" data-colorable="true" d="M20,50 Q18,25 25,5" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path id="anemone1-tentacle3" data-colorable="true" d="M30,50 Q32,25 28,5" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path id="anemone1-tentacle4" data-colorable="true" d="M40,50 Q45,30 35,10" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
  </g>
  
  <!-- Center shells and rocks -->
  <ellipse id="shell1" data-colorable="true" cx="180" cy="1080" rx="20" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
  <path d="M165,1080 Q180,1070 195,1080" fill="none" stroke="#333" stroke-width="1"/>
  <path d="M168,1080 Q180,1073 192,1080" fill="none" stroke="#333" stroke-width="1"/>
  
  <ellipse id="shell2" data-colorable="true" cx="220" cy="1090" rx="15" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
  <path d="M208,1090 Q220,1082 232,1090" fill="none" stroke="#333" stroke-width="1"/>
  
  <!-- Spiral shell -->
  <g id="spiral-shell" transform="translate(250, 1070)">
    <path id="shell3" data-colorable="true" d="M20,25 Q25,20 25,15 Q25,10 20,8 Q15,6 12,10 Q10,15 13,18 Q16,20 18,18" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse cx="20" cy="25" rx="12" ry="8" fill="white" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- Rocks -->
  <ellipse id="rock1" data-colorable="true" cx="150" cy="1100" rx="25" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse id="rock2" data-colorable="true" cx="300" cy="1095" rx="20" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse id="rock3" data-colorable="true" cx="330" cy="1105" rx="15" ry="8" fill="white" stroke="#333" stroke-width="1.5"/>
  
  <!-- Right seaweed cluster -->
  <path id="seaweed4" data-colorable="true" d="M350,1050 Q365,1000 345,950 Q325,900 355,860" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
  <path id="seaweed5" data-colorable="true" d="M375,1055 Q360,1000 380,950 Q400,900 370,850" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Right coral cluster -->
  <g id="coral-right" transform="translate(300, 1050)">
    <ellipse id="coral2-base" data-colorable="true" cx="45" cy="40" rx="40" ry="18" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="coral2-tube1" data-colorable="true" d="M20,40 L20,10 Q20,5 25,5 Q30,5 30,10 L30,40" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="coral2-tube2" data-colorable="true" d="M40,40 L40,0 Q40,-5 45,-5 Q50,-5 50,0 L50,40" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="coral2-tube3" data-colorable="true" d="M60,40 L60,15 Q60,10 65,10 Q70,10 70,15 L70,40" fill="white" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- Flower coral -->
  <g id="flower-coral" transform="translate(160, 1100)">
    <ellipse id="flower-coral-base" data-colorable="true" cx="30" cy="50" rx="25" ry="12" fill="white" stroke="#333" stroke-width="1.5"/>
    <circle id="flower-coral-center" data-colorable="true" cx="30" cy="25" r="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <ellipse id="flower-coral-petal1" data-colorable="true" cx="30" cy="5" rx="8" ry="12" fill="white" stroke="#333" stroke-width="1"/>
    <ellipse id="flower-coral-petal2" data-colorable="true" cx="50" cy="20" rx="12" ry="8" fill="white" stroke="#333" stroke-width="1"/>
    <ellipse id="flower-coral-petal3" data-colorable="true" cx="45" cy="40" rx="10" ry="7" fill="white" stroke="#333" stroke-width="1"/>
    <ellipse id="flower-coral-petal4" data-colorable="true" cx="15" cy="40" rx="10" ry="7" fill="white" stroke="#333" stroke-width="1"/>
    <ellipse id="flower-coral-petal5" data-colorable="true" cx="10" cy="20" rx="12" ry="8" fill="white" stroke="#333" stroke-width="1"/>
  </g>
  
  <!-- Jellyfish -->
  <g id="jellyfish1" transform="translate(80, 920)">
    <path id="jelly1-body" data-colorable="true" d="M0,30 Q25,0 50,30 Q40,35 25,35 Q10,35 0,30" fill="white" stroke="#333" stroke-width="2"/>
    <path id="jelly1-tentacle1" data-colorable="true" d="M10,35 Q5,50 15,70 Q10,85 20,100" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    <path id="jelly1-tentacle2" data-colorable="true" d="M25,35 Q30,55 20,75 Q25,90 20,105" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
    <path id="jelly1-tentacle3" data-colorable="true" d="M40,35 Q45,50 35,70 Q40,85 30,100" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  
  <!-- Small fish near sea floor -->
  <g id="fish12-group" transform="translate(220, 980)">
    <ellipse id="fish12-body" data-colorable="true" cx="20" cy="12" rx="18" ry="10" fill="white" stroke="#333" stroke-width="1.5"/>
    <path id="fish12-tail" data-colorable="true" d="M38,12 L52,5 L52,19 Z" fill="white" stroke="#333" stroke-width="1.5"/>
    <circle cx="10" cy="10" r="2" fill="#333"/>
  </g>
  
  <!-- Starfish -->
  <g id="starfish1" transform="translate(270, 1120)">
    <path id="starfish1-body" data-colorable="true" d="M25,0 L28,18 L45,20 L32,30 L38,48 L25,38 L12,48 L18,30 L5,20 L22,18 Z" fill="white" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- Sea urchin -->
  <g id="urchin1" transform="translate(120, 1130)">
    <circle id="urchin1-body" data-colorable="true" cx="20" cy="20" r="15" fill="white" stroke="#333" stroke-width="1.5"/>
    <line x1="20" y1="5" x2="20" y2="-5" stroke="#333" stroke-width="1.5"/>
    <line x1="35" y1="20" x2="45" y2="20" stroke="#333" stroke-width="1.5"/>
    <line x1="20" y1="35" x2="20" y2="45" stroke="#333" stroke-width="1.5"/>
    <line x1="5" y1="20" x2="-5" y2="20" stroke="#333" stroke-width="1.5"/>
    <line x1="30" y1="10" x2="38" y2="2" stroke="#333" stroke-width="1.5"/>
    <line x1="30" y1="30" x2="38" y2="38" stroke="#333" stroke-width="1.5"/>
    <line x1="10" y1="30" x2="2" y2="38" stroke="#333" stroke-width="1.5"/>
    <line x1="10" y1="10" x2="2" y2="2" stroke="#333" stroke-width="1.5"/>
  </g>
  
  <!-- More bubbles near bottom -->
  <circle id="bubble11" data-colorable="true" cx="100" cy="950" r="5" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble12" data-colorable="true" cx="95" cy="920" r="3" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble13" data-colorable="true" cx="250" cy="1000" r="6" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble14" data-colorable="true" cx="260" cy="960" r="4" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble15" data-colorable="true" cx="380" cy="950" r="5" fill="white" stroke="#333" stroke-width="1"/>
  <circle id="bubble16" data-colorable="true" cx="370" cy="920" r="3" fill="white" stroke="#333" stroke-width="1"/>
  
  <!-- Pebbles on sea floor -->
  <ellipse id="pebble1" data-colorable="true" cx="140" cy="1110" rx="6" ry="4" fill="white" stroke="#333" stroke-width="1"/>
  <ellipse id="pebble2" data-colorable="true" cx="200" cy="1105" rx="5" ry="3" fill="white" stroke="#333" stroke-width="1"/>
  <ellipse id="pebble3" data-colorable="true" cx="280" cy="1108" rx="7" ry="4" fill="white" stroke="#333" stroke-width="1"/>
  <ellipse id="pebble4" data-colorable="true" cx="350" cy="1115" rx="4" ry="3" fill="white" stroke="#333" stroke-width="1"/>
  <ellipse id="pebble5" data-colorable="true" cx="60" cy="1115" rx="5" ry="3" fill="white" stroke="#333" stroke-width="1"/>
  
</svg>`;
  }

  _loadPlaceholderSVG() {
    // Fallback - same as main SVG
    this._loadSVG();
  }

  _fillRegion(element, color) {
    const id = element.id;
    if (!id) return;

    element.setAttribute('fill', color);
    element.classList.add('filled');
    this.coloredRegions[id] = color;
    this._saveState();
  }

  _eraseRegion(element) {
    const id = element.id;
    if (!id) return;

    element.setAttribute('fill', 'white');
    element.classList.remove('filled');
    delete this.coloredRegions[id];
    this._saveState();
  }

  _resetColors() {
    const colorables = this.container.querySelectorAll('[data-colorable="true"]');
    colorables.forEach(el => {
      el.setAttribute('fill', 'white');
      el.classList.remove('filled');
    });
    this.coloredRegions = {};
    this._saveState();
  }

  _applySavedColors() {
    Object.entries(this.coloredRegions).forEach(([id, color]) => {
      const element = this.container.querySelector(`#${id}`);
      if (element) {
        element.setAttribute('fill', color);
        element.classList.add('filled');
      }
    });
  }

  _saveState() {
    localStorage.setItem('coloring-canvas-state', JSON.stringify(this.coloredRegions));
  }

  _loadSavedState() {
    try {
      const saved = localStorage.getItem('coloring-canvas-state');
      if (saved) {
        this.coloredRegions = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load coloring canvas state:', e);
      this.coloredRegions = {};
    }
  }
}

customElements.define("coloring-canvas", ColoringCanvas);
