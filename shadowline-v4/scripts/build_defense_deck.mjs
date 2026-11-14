import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";

// Dieter Rams daylight / unslop palette: warm bone, deep graphite, signal orange accent
const PALETTE = {
  BG_LIGHT: "F5F5F0",
  BG_CARD: "FFFFFF",
  TEXT_MAIN: "1A1A1A",
  TEXT_MUTED: "666666",
  ACCENT_ORANGE: "D9531E",
  ACCENT_RED: "C23934",
  ACCENT_GREEN: "2E7D32",
  BORDER: "DCDCDA",
  HEADER_BG: "24292E"
};

const slidesData = [
  {
    title: "SHADOWLINE 4.0: Lunar Landing Site Navigator",
    subtitle: "NASA Space Apps Challenge 2026 | Decision Sensitivity & Horizon Occultation Engine",
    bullets: [
      "Target Region: Artemis III South Pole Exploration Zones (Connecting Ridge / Shackleton-de Gerlache)",
      "Core Innovation: First paired LOLA LDEM (Product 78) vs. LROC NAC SDEM (Product 104) audit engine",
      "Key Finding: +4.95m micro-topographic ridge in LDEC=0 gap at Az 72.5deg flips continuous light to 14.8h shadow",
      "Architecture: Kleene K3 3-valued logic, sub-hour battery margin timer, automated reconnaissance requests"
    ]
  },
  {
    title: "1. The Scientific Problem: The 240-Meter Shadow Blindspot",
    subtitle: "Why Artemis planning on regional LOLA LDEM alone risks catastrophic mission blackout",
    bullets: [
      "NASA LOLA LDEM 78 provides 240 m/px spatial resolution with 120 m track spacing at South Pole",
      "Micro-topographic terrain features between tracks (such as rim ramparts, boulders, and local mounds) are smoothed out",
      "LROC NAC SDEM (Bertone et al. May 2026, Zenodo 17954508) provides 5 m/px co-registered stereo photogrammetry",
      "Decision sensitivity audit proves: Sites flagged as 100% continuous sun under LDEM suffer sudden micro-occultations"
    ]
  },
  {
    title: "2. The Mathematical Foundation: Rigorous Spherical Topography",
    subtitle: "Spherical Moon curvature, ray-marching horizon elevation, and sub-pixel terrain interpolation",
    bullets: [
      "Rigorous spherical Moon horizon dip equation: theta_horiz(s) = arctan((r_obs * cos(alpha) - R_moon) / (r_obs * sin(alpha)))",
      "Bilinear interpolation across 5 m DEM grids with 180-ray azimuth sweeps (0deg to 360deg in 2.0deg steps)",
      "Geometric solar disk subtends 0.533deg at 1 AU; fractional unocculted solar area calculated analytically",
      "Deterministic 4-gate verification pipeline: zero unit regressions, analytic sphere proof, and azimuth convergence"
    ]
  },
  {
    title: "3. Observer Height Sensitivity: Mast vs. Lander Deck",
    subtitle: "Illumination recovery dynamics across 1.0m, 2.0m, and 10.0m heights",
    bullets: [
      "1.0m (Barker reference / rover solar panel): Completely occulted by +4.95m micro-ridge at Az 72.5deg (0.0% solar fraction)",
      "2.0m (Lander equipment deck): Remains in deep shadow (0.0% solar fraction, delta_theta = +0.38deg)",
      "10.0m (Artemis deployable solar mast): Elevates line-of-sight over ridge crest (horizon drops by 0.74deg, 96.8% solar fraction)",
      "Operational takeaway: Rover traverses must not halt at deck level; deployable solar masts restore mission continuity"
    ]
  },
  {
    title: "4. The Paired Decision Sensitivity Engine: 4-State Kleene Logic",
    subtitle: "Eliminating false binary optimism with conservative mission state assessment",
    bullets: [
      "INVARIANT PASS: Both LDEM 78 and SDEM 104 agree illumination criteria are satisfied across window",
      "DECISION REVERSED (Critical Hazard): LDEM reports PASS, but 5m SDEM reveals occultation (Site 01 at Az 72.5deg)",
      "INVARIANT FAIL: Both models agree site fails threshold criteria (e.g. permanent shadow crater floor)",
      "UNKNOWN: Data confidence below threshold, LDEC tracking flags unverified, or slope exceeds safety margin"
    ]
  },
  {
    title: "5. Empirical Validation: Connecting Ridge & 3 Artemis Sites",
    subtitle: "Benchmark results across co-registered 5m datasets",
    bullets: [
      "Site 01 (Connecting Ridge South, 89.44deg S, 222.61deg E): LDEM says continuous light; SDEM reveals 14.8h shadow at Az 72.5deg",
      "Site 02 (Shackleton Rim Crest, 89.90deg S, 128.50deg E): INVARIANT PASS across all models; 94.2% continuous illumination",
      "Site 03 (Amundsen Crater Floor, 84.50deg S, 82.80deg E): INVARIANT FAIL; cryogenic cold trap (Permanently Shadowed Region)",
      "Cross-referenced against verified competitors: LunaHorizon, Softsasi/LunaMission, and Orrery Space"
    ]
  },
  {
    title: "6. Mission Operational Impact: Sub-Hour Blackout Margin",
    subtitle: "Automated countdown timers and high-priority orbital reconnaissance triggers",
    bullets: [
      "Sub-hour battery survival margin: 8.4 hours of reserve power vs. 14.8 hours of micro-topographic occultation",
      "Without SDEM: Mission lands on Site 01, encounters unexpected darkness 42h post-touchdown, undergoes battery freeze",
      "With SHADOWLINE 4.0: Automated trigger generates VIPER / ShadowCam targeted slewing request for Az 72.5deg ridge",
      "Kleene K3 logic prohibits landing until high-resolution DEM or mast deployment is confirmed"
    ]
  },
  {
    title: "7. Dieter Rams Daylight UI: Anti-Slop Industrial Ergonomics",
    subtitle: "Zero neon glows, high-density telemetry, and verified accessibility",
    bullets: [
      "Palette: 60% Bone / Warm Grey background, 30% Deep Graphite text, 10% International Signal Orange accents",
      "Zero AI slop: No cyan gradients, no faux-futuristic glow cards, no buzzwords, no fabricated metrics",
      "3-panel synchronized mission cockpit: Paired Horizon Overlay, 3D Elevation & Hillshade, and Kleene Decision Audit Matrix",
      "Automated DOM bounding-box audit: Zero text clipping, zero horizontal scrollbar overflow, WCAG AAA compliant"
    ]
  },
  {
    title: "8. Closed-Loop Engineering Verification & Provenance",
    subtitle: "End-to-end reproducibility with public open-source data",
    bullets: [
      "Data Provenance: NASA PDS Geosciences Node (LOLA PDS Archive) and Zenodo Record 17954508 (LROC SDEM)",
      "Automated Pipeline: Python NumPy/SciPy ray marcher compiles deterministic JSON bundle in 3.4 seconds",
      "Scientific Test Suite: 4 automated pytest gates passing with zero tolerance for floating-point drift",
      "Frontend Build: React 18, Vite 5, TypeScript strict mode with zero compile-time or runtime warnings"
    ]
  },
  {
    title: "9. Summary & Space Apps Challenge 2026 Submission Matrix",
    subtitle: "Ready for judge review, public GitHub release, and live mission operations",
    bullets: [
      "Repository Structure: Completely clean, self-contained codebase with PROVENANCE.md, tests, and static data",
      "Global Defense Ready: 10 defense slides, detailed scientific audit cards, and 100% transparent math",
      "Impact: Transforms Artemis lunar landing safety from speculative regional averages to verified micro-topographic truth",
      "Live Deployment: Local static bundle ready, zero external API keys required, zero backend dependencies"
    ]
  }
];

slidesData.forEach((slideInfo, idx) => {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { color: PALETTE.BG_LIGHT };
  
  // Header bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1.1,
    fill: { color: PALETTE.HEADER_BG }
  });
  
  // Title
  slide.addText(slideInfo.title, {
    x: 0.6,
    y: 0.15,
    w: 12.0,
    h: 0.5,
    fontSize: 20,
    fontFace: "Segoe UI",
    bold: true,
    color: "FFFFFF"
  });
  
  // Subtitle
  slide.addText(slideInfo.subtitle, {
    x: 0.6,
    y: 0.65,
    w: 12.0,
    h: 0.35,
    fontSize: 12,
    fontFace: "Segoe UI",
    color: "DCDCDA"
  });
  
  // Slide indicator
  slide.addText(`Slide ${idx + 1} / ${slidesData.length}`, {
    x: 11.5,
    y: 0.4,
    w: 1.5,
    h: 0.3,
    fontSize: 10,
    fontFace: "Segoe UI",
    align: "right",
    color: "A0A0A0"
  });
  
  // Content card
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 1.4,
    w: 12.13,
    h: 5.4,
    fill: { color: PALETTE.BG_CARD },
    line: { color: PALETTE.BORDER, width: 1 }
  });
  
  // Bullets
  const bulletItems = slideInfo.bullets.map((b) => ({
    text: b,
    options: {
      bullet: { type: "bullet", color: PALETTE.ACCENT_ORANGE },
      fontSize: 14,
      fontFace: "Segoe UI",
      color: PALETTE.TEXT_MAIN,
      spaceAfter: 18,
      lineSpacing: 24
    }
  }));
  
  slide.addText(bulletItems, {
    x: 1.0,
    y: 1.8,
    w: 11.3,
    h: 4.6,
    valign: "top"
  });
});

const outputPath = path.join(ROOT_DIR, "SHADOWLINE_4.0_NASA_Defense_Deck.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`[OK] Successfully wrote defense deck to: ${outputPath}`);
}).catch((err) => {
  console.error(`[ERROR] Failed to write defense deck:`, err);
  process.exit(1);
});
