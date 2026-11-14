# SHADOWLINE 4.0: Lunar Landing Site Navigator
**NASA Space Apps Challenge 2026**
*Connecting Ridge (Artemis III Candidate Region A3CLR22-#6)*

---

## Overview
SHADOWLINE 4.0 is a decision-sensitivity evaluation system for lunar South Pole landing site selection and surface stay planning. Rather than simulating battery state-of-charge or vehicle thermal degradation with invented constants, SHADOWLINE 4.0 directly evaluates **topographic model sensitivity**:

> **Does the landing site go/no-go recommendation reverse when moving from LOLA LDEM (Product 78, 20m) to high-resolution LROC SDEM (Product 104, 5m, Bertone et al. May 2026 / Zenodo 17954508)?**

## Architecture & Views
1. **01 Compare Navigator:**
   - 360° topocentric horizon panorama comparing LDEM dashed reference against SDEM filled skyline.
   - Dual Sun and Earth trajectories across 156-hour stay windows.
   - Paired verdict ledger ($V_{\text{LDEM}}$ vs $V_{\text{SDEM}}$) and reversal detector $\mathcal{D}(i, t)$.
   - 156-hour synchronized illumination barcode strips with interactive hour scrubbing.
2. **02 Explain Reversal:**
   - 64x64 terrain difference inspector ($\Delta z = z_{\text{SDEM}} - z_{\text{LDEM}}$).
   - Radial ray tracer identifying the specific micro-ridge or crater rim causing premature sunset or unexpected occultation.
   - LOLA along-track spot density (LDEC) validation showing data sparsity in laser altimetry.
3. **03 Validate & Provenance:**
   - Four mechanical verification gates:
     1. Flat spherical horizon dip verification ($h = 2\text{m}$, $-0.0869^\circ$).
     2. Analytic 50m ridge occultation test ($d = 1000\text{m}$, $2.7351^\circ$).
     3. 720 vs 1440 azimuth resolution convergence ($\Delta < 0.05^\circ$).
     4. Data bundle schema and provenance integrity check.
   - Full scientific receipts and DOI source citations.

## Scientific Verification
Run all scientific test gates:
```bash
python -m pytest scripts/test_scientific_pipeline.py -v
```

## Running the Web Application
```bash
npm install
npm run build
npm run dev
```
Open `http://localhost:5173` in your browser.

