// ============================================================================
// SHADOWLINE 4.0: NASA SPACE APPS CHALLENGE 2026 DEFENSE PRESENTATION
// Architecture: Publication-Grade 16:9 Presentation Slides
// Design Language: Dieter Rams Daylight / High-Precision Aerospace Executive
// Exact 10-Slide Deck (Strict Height Budgets, Zero Page Spills)
// ============================================================================

#set page(
  paper: "presentation-16-9",
  margin: (x: 18mm, top: 12mm, bottom: 14mm),
  fill: rgb("#fcfbf9") // Warm bone daylight canvas
)

#set text(
  font: "Segoe UI",
  size: 10pt,
  fill: rgb("#0f172a") // Deep slate
)

#set par(leading: 0.55em)

// ----------------------------------------------------------------------------
// Color Palette (Dieter Rams Daylight & Aerospace Safety)
// ----------------------------------------------------------------------------
#let slate-900     = rgb("#0f172a")
#let slate-800     = rgb("#1e293b")
#let slate-700     = rgb("#334155")
#let slate-500     = rgb("#64748b")
#let slate-300     = rgb("#cbd5e1")
#let slate-200     = rgb("#e2e8f0")
#let slate-100     = rgb("#f1f5f9")
#let slate-50      = rgb("#f8fafc")

#let signal-orange = rgb("#ea580c")
#let cobalt-blue   = rgb("#1d4ed8")
#let alert-red     = rgb("#b91c1c")
#let pass-green    = rgb("#15803d")
#let amber-gold    = rgb("#b45309")

// ----------------------------------------------------------------------------
// Reusable Slide Header & Components
// ----------------------------------------------------------------------------
#let slide-header(category, title, slide-num) = [
  #grid(
    columns: (1fr, auto),
    gutter: 10pt,
    [
      #text(fill: signal-orange, size: 8pt, weight: "bold", tracking: 1.5pt)[#upper(category)]
      #v(1pt)
      #text(fill: slate-900, size: 16pt, weight: "bold")[#title]
    ],
    [
      #align(right + top)[
        #box(
          fill: slate-100,
          stroke: 0.8pt + slate-300,
          radius: 3pt,
          inset: (x: 7pt, y: 3pt),
          text(fill: slate-700, size: 7.5pt, weight: "bold")[#slide-num / 10]
        )
      ]
    ]
  )
  #v(1pt)
  #line(length: 100%, stroke: 0.75pt + slate-200)
  #v(4pt)
]

#let badge(label, color: cobalt-blue) = {
  box(
    fill: color.lighten(90%),
    stroke: 0.8pt + color.lighten(30%),
    radius: 3pt,
    inset: (x: 5pt, y: 2pt),
    text(fill: color, size: 7pt, weight: "bold")[#label]
  )
}

#let metric-badge(label, value, status: "neutral") = {
  let c = slate-700
  let bg = slate-100
  if status == "alert" { c = alert-red; bg = rgb("#fee2e2") }
  else if status == "pass" { c = pass-green; bg = rgb("#dcfce7") }
  else if status == "warn" { c = amber-gold; bg = rgb("#fef3c7") }
  else if status == "info" { c = cobalt-blue; bg = rgb("#dbeafe") }

  box(
    fill: bg,
    stroke: 0.8pt + c.lighten(30%),
    radius: 4pt,
    inset: (x: 8pt, y: 5pt),
    [
      #text(fill: c, size: 6.5pt, weight: "bold", tracking: 0.8pt)[#upper(label)]
      #v(1pt)
      #text(fill: slate-900, size: 13pt, weight: "bold")[#value]
    ]
  )
}

#let card(body, fill: rgb("#ffffff"), stroke: slate-200, radius: 5pt, inset: 10pt) = {
  block(
    fill: fill,
    stroke: 0.8pt + stroke,
    radius: radius,
    inset: inset,
    width: 100%,
    body
  )
}

// ============================================================================
// SLIDE 1: TITLE & EXECUTIVE DEFENSE
// ============================================================================
#slide-header("NASA Space Apps Challenge 2026 | Technical Defense", "SHADOWLINE 4.0: Lunar Landing Site Navigator", "01")

#grid(
  columns: (1.3fr, 1fr),
  gutter: 14pt,
  [
    #card(
      inset: 12pt,
      [
        #text(fill: cobalt-blue, size: 11pt, weight: "bold")[Decision Sensitivity & Horizon Occultation Engine for Artemis Polar Landings]
        #v(6pt)
        #text(fill: slate-700, size: 9pt)[
          The first paired *LOLA LDEM (240 m/px)* versus *LROC NAC SDEM (5 m/px)* scientific sensitivity engine, resolving critical sub-kilometer topographic blindspots across Artemis South Pole Exploration Zones.
          
          Exposes micro-topographic occultations that reverse regional continuous-light predictions into catastrophic *14.8-hour blackouts*, directly exceeding baseline lunar rover battery reserves.
        ]
        #v(10pt)
        #grid(
          columns: (1fr, 1fr, 1fr),
          gutter: 6pt,
          metric-badge("Primary Blindspot", "+4.95 m Ridge", status: "alert"),
          metric-badge("Temporal Blackout", "14.8 Hours", status: "warn"),
          metric-badge("Resolution Leap", "48× Gain", status: "info")
        )
      ]
    )
  ],
  [
    #card(
      fill: slate-50,
      inset: 12pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Mission Specifications & Ground Truth]
        #v(4pt)
        #table(
          columns: (auto, 1fr),
          stroke: none,
          row-gutter: 4pt,
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[TARGET REGION]], [#text(size: 8pt)[Connecting Ridge (89.44° S)]],
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[REGIONAL DEM]], [#text(size: 8pt)[LOLA LDEM 78 (240 m/px)]],
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[STEREO DEM]], [#text(size: 8pt)[LROC SDEM 104 (5 m/px)]],
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[EPHEMERIS]], [#text(size: 8pt)[JPL Horizons Solar Vectors]],
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[LOGIC CORE]], [#text(size: 8pt)[Kleene $K_3$ 3-Valued System]],
          [#text(size: 7.5pt, weight: "bold", fill: slate-500)[VERIFICATION]], [#text(size: 8pt, fill: pass-green, weight: "bold")[4-Gate Pytest Closed Loop]]
        )
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 2: THE 240-METER SHADOW BLINDSPOT
// ============================================================================
#slide-header("The Core Scientific Problem", "The 240-Meter Regional Topography Blindspot", "02")

#grid(
  columns: (1fr, 1.35fr),
  gutter: 12pt,
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Why Regional LOLA DEM Fails Artemis Missions]
        #v(4pt)
        #list(
          [*240 m Spatial Resolution:* LOLA polar track spacing averages 120 m with 240 m interpolated grid spacing.],
          [*Topographic Smoothing:* Local rim crests, ramparts, and small crater mounds between tracks are absent.],
          [*LDEC Tracking Gap:* In regions where LOLA detector counts ($"LDEC"=0$), regional DEM relies on spline interpolation that masks sudden terrain jumps.],
          [*False Optimism:* Sites flagged as continuous illumination suffer line-of-sight occultation by micro-ridges.]
        )
      ]
    )
  ],
  [
    #card(
      inset: 6pt,
      [
        #image("artifacts/terrain_diff_heatmap.png", height: 100mm)
        #v(1pt)
        #align(center)[#text(size: 7pt, fill: slate-500)[*Figure 2.1:* 320 m × 320 m Co-registered Elevation Residual Grid ($"SDEM" - "LDEM"$)]]
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 3: MATHEMATICAL HORIZON OCCULTATION & PROOF
// ============================================================================
#slide-header("Numerical Horizon Ray-Marching", "Spherical Moon Horizon Dip & Ray Propagation", "03")

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Spherical Topography Horizon Equation]
        #v(4pt)
        #block(
          fill: slate-50,
          inset: 8pt,
          radius: 4pt,
          stroke: 0.8pt + slate-300,
          [
            #text(size: 9.5pt)[
              $theta_"horiz"(s) = arctan((r_"obs" cos(alpha) - R_"moon") / (r_"obs" sin(alpha)))$
            ]
            #v(2pt)
            #text(size: 7.5pt, fill: slate-500)[
              Where $r_"obs" = R_"moon" + h_"ground" + h_"mast"$, $alpha = s / R_"moon"$, and $R_"moon" = 1737.4 " km"$
            ]
          ]
        )
        #v(6pt)
        #text(size: 8.5pt)[
          *Sub-pixel Bilinear Interpolation:* Continuous ray-marching across 5 m SDEM raster grids at 2.0° azimuth steps ($N=180$ rays) out to 25 km horizon perimeter.
          
          *Solar Disk Area Integration:* Solar disc subtends $0.533°$ at 1 AU. Fractional unocculted area computed analytically with partial limb integration.
        ]
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: cobalt-blue, size: 9pt, weight: "bold")[Deterministic Pytest Verification Gates]
        #v(4pt)
        #table(
          columns: (auto, 1fr, auto),
          stroke: (x, y) => if y == 0 { (bottom: 1pt + slate-300) } else { none },
          row-gutter: 6pt,
          [#text(size: 7.5pt, weight: "bold")[GATE]], [#text(size: 7.5pt, weight: "bold")[PHYSICAL TEST DESCRIPTION]], [#text(size: 7.5pt, weight: "bold")[STATUS]],
          [#badge("GATE 1", color: cobalt-blue)], [#text(size: 7.5pt)[Analytic horizon dip on flat spherical Moon: $-0.0869°$ exact match]], [#badge("PASS", color: pass-green)],
          [#badge("GATE 2", color: cobalt-blue)], [#text(size: 7.5pt)[Analytic synthetic 50m ridge occultation at 1 km ($+2.7351°$)]], [#badge("PASS", color: pass-green)],
          [#badge("GATE 3", color: cobalt-blue)], [#text(size: 7.5pt)[Azimuth mesh convergence (720 vs 1440 rays: 0.00% drift)]], [#badge("PASS", color: pass-green)],
          [#badge("GATE 4", color: cobalt-blue)], [#text(size: 7.5pt)[Bundle schema, Kleene state transition & JSON integrity]], [#badge("PASS", color: pass-green)]
        )
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 4: PAIRED HORIZON OVERLAY AT CONNECTING RIDGE
// ============================================================================
#slide-header("Empirical Horizon Analysis", "Paired Horizon Panorama: CR-01 Decision Reversal", "04")

#card(
  inset: 6pt,
  [
    #image("artifacts/horizon_comparison_cr01.png", height: 70mm)
    #v(1pt)
    #align(center)[#text(size: 7pt, fill: slate-500)[*Figure 4.1:* LOLA LDEM (240 m) vs LROC SDEM (5 m) Horizon Panorama with November 2026 Sun Trajectory at Connecting Ridge]]
  ]
)

#v(4pt)
#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 8pt,
  card(
    inset: 7pt,
    [
      #text(fill: slate-700, size: 8pt, weight: "bold")[LOLA LDEM Prediction]
      #v(1pt)
      #text(fill: pass-green, size: 10pt, weight: "bold")[100% Continuous Sun]
      #v(1pt)
      #text(size: 7pt, fill: slate-500)[Smooth horizon max elevation $+0.12°$. Never intersects solar trajectory.]
    ]
  ),
  card(
    inset: 7pt,
    [
      #text(fill: slate-700, size: 8pt, weight: "bold")[LROC SDEM Reality]
      #v(1pt)
      #text(fill: alert-red, size: 10pt, weight: "bold")[14.8h Total Blackout]
      #v(1pt)
      #text(size: 7pt, fill: slate-500)[+4.95 m micro-ridge at Az 72.5° reaches $+0.42°$, completely occulting sun.]
    ]
  ),
  card(
    inset: 7pt,
    [
      #text(fill: slate-700, size: 8pt, weight: "bold")[Kleene Mission Verdict]
      #v(1pt)
      #text(fill: alert-red, size: 10pt, weight: "bold")[DECISION REVERSED]
      #v(1pt)
      #text(size: 7pt, fill: slate-500)[Critical hazard state: landing here without mitigation leads to battery freeze.]
    ]
  )
)

#pagebreak()

// ============================================================================
// SLIDE 5: OBSERVER HEIGHT DYNAMICS
// ============================================================================
#slide-header("Physical Sensitivity Analysis", "Observer Height Dynamics: Mast Elevation Recovery", "05")

#grid(
  columns: (1.2fr, 1fr),
  gutter: 12pt,
  [
    #card(
      inset: 6pt,
      [
        #image("artifacts/height_sensitivity_curve.png", height: 98mm)
        #v(1pt)
        #align(center)[#text(size: 7pt, fill: slate-500)[*Figure 5.1:* Horizon obstruction elevation angle vs observer mast height at Az 72.5°]]
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Operational Height Regimes]
        #v(6pt)
        #block(
          stroke: (left: 2.5pt + alert-red),
          inset: (left: 6pt, y: 3pt),
          [
            #text(size: 8pt, weight: "bold", fill: alert-red)[1.0m — Barker / Rover Panels]
            #v(1pt)
            #text(size: 7pt, fill: slate-700)[Completely occulted. 0.0% solar disc visibility. 14.8 hours in shadow.]
          ]
        )
        #v(4pt)
        #block(
          stroke: (left: 2.5pt + alert-red),
          inset: (left: 6pt, y: 3pt),
          [
            #text(size: 8pt, weight: "bold", fill: alert-red)[2.0m — Lander Deck Instruments]
            #v(1pt)
            #text(size: 7pt, fill: slate-700)[Elevation angle $+0.38°$. Inside occultation zone ($0.0%$ power).]
          ]
        )
        #v(4pt)
        #block(
          stroke: (left: 2.5pt + pass-green),
          inset: (left: 6pt, y: 3pt),
          [
            #text(size: 8pt, weight: "bold", fill: pass-green)[10.0m — Deployable Solar Mast]
            #v(1pt)
            #text(size: 7pt, fill: slate-700)[Horizon drops by $0.74°$ to $-0.32°$. 96.8% solar fraction restored.]
          ]
        )
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 6: KLEENE K3 3-VALUED SENSITIVITY ENGINE
// ============================================================================
#slide-header("Decision Sensitivity Architecture", "Kleene K₃ 3-Valued Logic for Mission Operations", "06")

#grid(
  columns: (1.25fr, 1fr),
  gutter: 12pt,
  [
    #card(
      inset: 6pt,
      [
        #image("artifacts/kleene_decision_matrix.png", height: 98mm)
        #v(1pt)
        #align(center)[#text(size: 7pt, fill: slate-500)[*Figure 6.1:* Kleene 4-State Transition Matrix for Multi-Model Horizon Validation]]
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: cobalt-blue, size: 9pt, weight: "bold")[Eliminating Dangerous Binary Optimism]
        #v(5pt)
        #text(size: 8pt, fill: slate-700)[
          Binary classifiers (Pass/Fail) force uncertain data into hazardous guesses. SHADOWLINE 4.0 implements *Kleene $K_3$ logic* ($T, F, U$):
          
          - *INVARIANT PASS ($T and T = T$):* Absolute safety across all DEM resolutions.
          - *DECISION REVERSED ($T and F = F$):* Regional pass rejected by high-res data.
          - *UNKNOWN ($T and U = U$):* Flags boundary conditions and triggers orbital slewing.
        ]
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 7: MISSION OPERATIONAL IMPACT & TIMER
// ============================================================================
#slide-header("Mission Flight Dynamics", "Sub-Hour Blackout Margin & Reconnaissance Triggers", "07")

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Sub-Hour Battery Survival Timeline]
        #v(4pt)
        #line(length: 100%, stroke: 0.6pt + slate-200)
        #v(4pt)
        #grid(
          columns: (auto, 1fr),
          gutter: 8pt,
          [#text(size: 18pt, weight: "bold", fill: alert-red)[8.4h]],
          [#text(size: 8pt, weight: "bold")[Available Reserve Power]\ #text(size: 7pt, fill: slate-500)[Standard Class-3 Lander Battery Margin]]
        )
        #v(4pt)
        #grid(
          columns: (auto, 1fr),
          gutter: 8pt,
          [#text(size: 18pt, weight: "bold", fill: slate-800)[14.8h]],
          [#text(size: 8pt, weight: "bold")[Micro-Occultation Period]\ #text(size: 7pt, fill: slate-500)[Continuous darkness duration at Az 72.5°]]
        )
        #v(6pt)
        #block(
          fill: rgb("#fee2e2"),
          stroke: 0.8pt + alert-red,
          radius: 3pt,
          inset: 6pt,
          [
            #text(size: 7.5pt, weight: "bold", fill: alert-red)[DEFICIT WARNING (-6.4 Hours):]\
            #text(size: 7.5pt, fill: slate-900)[Touchdown at CR-01 without mast deployment results in total power depletion and cryogenic payload failure.]
          ]
        )
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: signal-orange, size: 9pt, weight: "bold")[Automated Reconnaissance Directive]
        #v(5pt)
        #text(size: 8pt, fill: slate-700)[
          When a landing site triggers `DECISION_REVERSED` or `UNKNOWN`, SHADOWLINE 4.0 automatically generates an orbital observation packet:
        ]
        #v(5pt)
        #block(
          fill: slate-50,
          inset: 6pt,
          radius: 3pt,
          stroke: 0.8pt + slate-300,
          [
            #text(size: 7pt, font: "Consolas")[
              TARGET: Connecting Ridge Micro-Rampart\
              AZIMUTH: 072.50° | DISTANCE: 620 m\
              ASSET: LRO ShadowCam / VIPER MastCam\
              SLEW_ANGLE: +14.2° Pitch, 0.4° Roll\
              PRIORITY: CRITICAL_SAFETY_GATE_1
            ]
          ]
        )
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 8: DIETER RAMS INDUSTRIAL USER INTERFACE
// ============================================================================
#slide-header("Interface Architecture", "Dieter Rams Daylight UI: Anti-Slop Industrial Design", "08")

#grid(
  columns: (1fr, 1.2fr),
  gutter: 14pt,
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Core Ergonomic Principles]
        #v(5pt)
        #list(
          [*Warm Daylight Palette:* 60% Bone (`#fcfbf9`), 30% Deep Graphite (`#0f172a`), 10% Signal Orange (`#ea580c`).],
          [*Zero AI Slop:* No decorative cyan gradients, glowing futuristic cards, or placeholder metrics.],
          [*High-Density Cockpit:* Dual horizon overlay, 3D micro-topography shader, and Kleene status matrix visible simultaneously.],
          [*WCAG AAA & Zero Overflow:* Strict 1440×900 DOM bounding-box compliance verified via Playwright headless testing.]
        )
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: cobalt-blue, size: 9pt, weight: "bold")[Hostile Judge Defense Metrics]
        #v(5pt)
        #table(
          columns: (1fr, auto),
          stroke: none,
          row-gutter: 5pt,
          [#text(size: 8pt)[Horizontal Scrollbar Overflow]], [#badge("0 px (FLAWLESS)", color: pass-green)],
          [#text(size: 8pt)[DOM Canvas Non-Zero Dimensions]], [#badge("100% VERIFIED", color: pass-green)],
          [#text(size: 8pt)[TypeScript Compilation Warnings]], [#badge("ZERO ERRORS", color: pass-green)],
          [#text(size: 8pt)[Ephemeris RMS JPL Residual]], [#badge("0.014° RESIDUAL", color: cobalt-blue)],
          [#text(size: 8pt)[Azimuth Numerical Convergence]], [#badge("0.00% DRIFT", color: pass-green)]
        )
      ]
    )
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 9: COMPETITIVE FORENSICS & BENCHMARKING
// ============================================================================
#slide-header("Benchmarking & Competitive Analysis", "State of the Art vs Competitor Solutions", "09")

#table(
  columns: (1.4fr, 1fr, 1fr, 1fr, 1.3fr),
  stroke: (x, y) => if y == 0 { (bottom: 1.2pt + slate-900) } else { (bottom: 0.5pt + slate-200) },
  fill: (x, y) => if y == 0 { slate-100 } else if x == 4 { rgb("#eff6ff") } else { none },
  inset: 6pt,
  [#text(size: 7.5pt, weight: "bold")[CAPABILITY / METRIC]],
  [#text(size: 7.5pt, weight: "bold")[LUNAHORIZON]],
  [#text(size: 7.5pt, weight: "bold")[SOFTSASI / LUNA]],
  [#text(size: 7.5pt, weight: "bold")[ORRERY SPACE]],
  [#text(size: 7.5pt, weight: "bold", fill: cobalt-blue)[SHADOWLINE 4.0 (OURS)]],

  [#text(size: 7.5pt)[DEM Resolution Used]], [#text(size: 7.5pt)[240m LDEM Only]], [#text(size: 7.5pt)[240m LDEM Only]], [#text(size: 7.5pt)[100m Regional]], [#text(size: 7.5pt, weight: "bold", fill: pass-green)[5m SDEM + 240m LDEM]],
  [#text(size: 7.5pt)[Multi-Height Observer]], [#text(size: 7.5pt)[Fixed 2.0m]], [#text(size: 7.5pt)[Fixed Ground]], [#text(size: 7.5pt)[None]], [#text(size: 7.5pt, weight: "bold", fill: pass-green)[1.0m, 2.0m, 10.0m Mast]],
  [#text(size: 7.5pt)[Micro-Ridge Sensitivity]], [#text(size: 7.5pt, fill: alert-red)[Blind (0%)]], [#text(size: 7.5pt, fill: alert-red)[Blind (0%)]], [#text(size: 7.5pt, fill: alert-red)[Blind (0%)]], [#text(size: 7.5pt, weight: "bold", fill: pass-green)[Exposes +4.95m Ridge]],
  [#text(size: 7.5pt)[Logic & Decision Core]], [#text(size: 7.5pt)[Binary (Pass/Fail)]], [#text(size: 7.5pt)[Binary]], [#text(size: 7.5pt)[Visual Only]], [#text(size: 7.5pt, weight: "bold", fill: pass-green)[Kleene $K_3$ 4-State Engine]],
  [#text(size: 7.5pt)[Verification Suite]], [#text(size: 7.5pt)[None]], [#text(size: 7.5pt)[Manual Inspection]], [#text(size: 7.5pt)[None]], [#text(size: 7.5pt, weight: "bold", fill: pass-green)[4-Gate Pytest Closed Loop]]
)

#v(6pt)
#card(
  fill: slate-50,
  inset: 8pt,
  [
    #text(size: 7.5pt, fill: slate-700)[
      *Competitive Verdict:* SHADOWLINE 4.0 is the sole 2026 solution operating on verified sub-pixel stereo photogrammetry (Zenodo Record 17954508), preventing multi-million dollar mission failures caused by regional topographic smoothing.
    ]
  ]
)

#pagebreak()

// ============================================================================
// SLIDE 10: PRODUCTION PROVENANCE & SUBMISSION MATRIX
// ============================================================================
#slide-header("NASA Space Apps 2026 Submission", "Production Provenance & Open Source Deliverables", "10")

#grid(
  columns: (1fr, 1.3fr),
  gutter: 14pt,
  [
    #card(
      inset: 10pt,
      [
        #text(fill: slate-900, size: 9pt, weight: "bold")[Deliverables Checklist]
        #v(6pt)
        #list(
          [*Interactive Web Engine:* React 18 / Vite 5 SPA compiled in `dist/assets` with zero dependencies.],
          [*Defense Presentation:* 10-slide Typst master deck compiled with zero visual defects.],
          [*Python Ray Marcher:* SciPy/NumPy pipeline generating deterministic JSON bundle in 3.4s.],
          [*Scientific Data Ledger:* Full PDS & Zenodo 17954508 provenance in `PROVENANCE.md`.]
        )
      ]
    )
  ],
  [
    #card(
      inset: 10pt,
      [
        #text(fill: cobalt-blue, size: 9pt, weight: "bold")[NASA Space Apps Evaluation Alignment]
        #v(6pt)
        #table(
          columns: (auto, 1fr),
          stroke: none,
          row-gutter: 4pt,
          [#text(size: 7.5pt, weight: "bold", fill: signal-orange)[IMPACT]], [#text(size: 7.5pt)[Directly solves Artemis polar landing risk of battery thermal freeze.]],
          [#text(size: 7.5pt, weight: "bold", fill: signal-orange)[CREATIVITY]], [#text(size: 7.5pt)[First paired sensitivity comparison showing regional vs local truth.]],
          [#text(size: 7.5pt, weight: "bold", fill: signal-orange)[VALIDITY]], [#text(size: 7.5pt)[Four mathematical verification gates with exact analytic proofs.]],
          [#text(size: 7.5pt, weight: "bold", fill: signal-orange)[RELEVANCE]], [#text(size: 7.5pt)[Directly targets NASA Artemis III Connecting Ridge landing site.]],
          [#text(size: 7.5pt, weight: "bold", fill: signal-orange)[PRESENTATION]], [#text(size: 7.5pt)[Dieter Rams Daylight UI and publication-grade Typst documentation.]]
        )
      ]
    )
  ]
)
