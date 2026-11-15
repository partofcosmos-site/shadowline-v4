# SHADOWLINE 4.0: Lunar South Pole Illumination & Decision-Sensitivity Navigator

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Global%20Challenge-orange.svg)](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/)
[![Challenge](https://img.shields.io/badge/Challenge-Lunar%20Landing%20Site%20Navigator-blue.svg)](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/)
[![Team](https://img.shields.io/badge/Team-Obsidian%20Cosmos%20%2F%20Part%20of%20Cosmos-141413.svg)](https://github.com/partofcosmos-site)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Verification Gates](https://img.shields.io/badge/Pytest%20Verification%20Gates-6%2F6%20PASS%20(100%25)-success.svg)](tests/)

> **Investigating whether differences between complementary lunar terrain models materially alter the interpretation of solar illumination and geometric Earth visibility at Artemis landing locations.**

---

## Executive Overview

At the lunar South Pole, grazing solar elevation angles ($\theta_\odot \in [-1.5^\circ, +2.5^\circ]$) turn decimeter-scale topographic features into kilometer-long cast shadows. Current lunar mission planning frequently relies on a single terrain reconstruction—predominantly LOLA laser altimetry (PGDA 78).

However, in the official 5 m/pixel LOLA polar mosaic, **91.2% of grid cells have a laser return count ($LDEC$) of zero**, with elevations interpolated via splines between orbital ground tracks. Micro-ridges, small crater rims, and surface boulders between laser tracks are smoothed out.

**SHADOWLINE 4.0** is an open-source, model-aware lunar illumination and decision-sensitivity navigator. By contrasting laser altimetry with photoclinometry-enhanced stereophotogrammetry (**LROC NAC SfS, PGDA 104**), SHADOWLINE discovers critical model-driven decision reversals:

* **Empirical Discovery at Connecting Ridge Crest Alpha (CR-01, -89.4390°S, 222.8560°E):** LOLA LDEM predicts 100% continuous illumination over the 156-hour Artemis simulation window. Cross-validation against LROC NAC SDEM reveals a $+4.95\text{ m}$ micro-ridge obstacle at azimuth $\alpha^* = 73.0^\circ$ and range $s^* = 620\text{ m}$ that elevates the local horizon by $+0.4541^\circ$. This creates an unpredicted **14.8-hour total solar blackout**, during which solar elevation drops to $-0.42^\circ$ below the real terrain horizon.
* **Engineering Rescue:** SHADOWLINE's continuous mast solver demonstrates that extending solar array elevation from surface level ($h_\text{obs} = 0\text{ m}$) to $h_\text{obs} \ge 6.0\text{ m}$ completely restores solar line-of-sight throughout the blackout.

---

## Key Features & Architecture

1. **Dual-DEM Cross-Validation Engine:**
   - Seamless switching and horizon comparison between **LOLA LDEM (PGDA 78)** and **LROC NAC SfS (PGDA 104)**.
   - 360-degree topocentric skyline profiler evaluated across 720 azimuthal bins ($\Delta\alpha = 0.5^\circ$) up to a radial distance of $60\text{ km}$, incorporating lunar spherical curvature corrections ($R_M = 1,737.4\text{ km}$).

2. **Strong Kleene $K_3$ Multi-Valued Decision Logic:**
   - Replaces fragile binary checks with a three-valued logic matrix:
     - **TRUE / PASS:** Condition met under both LOLA and LROC. Mission safe.
     - **FALSE / FAIL:** Fails under both models. Definitive exclusion.
     - **UNKNOWN / DECISION_REVERSED:** Disagreement between models. Sensitivity boundary requiring engineering mitigation (mast extension or tethered comms relay).

3. **Solar Disk Partial Eclipse Integration:**
   - Evaluates the Sun as an extended angular source ($R_\odot \approx 0.2666^\circ$) rather than an idealized point, computing partial obscuration fractions ($\beta \in [0, 1]$) with uniform (Mode A) and limb-darkened (Mode B) integration.

4. **Coordinate Frame & Parallax Rigor:**
   - Hardened against the `IAU_MOON_ME` (DE421) frame lock, preventing the catastrophic $661.72\text{ m}$ horizontal shift caused by mixing Mean Earth (ME) and Principal Axis (PA) coordinates.
   - Topocentric Earth and Solar vectors queried via NASA JPL Horizons API (`coord@301`), applying the $-0.259^\circ$ lunar radius topocentric parallax correction.

5. **Client-Side Telemetry Studio:**
   - Zero-backend, offline-first WebGL 3D CAD visualization canvas, interactive horizon profile, 156-hour timeline scrubber, and 0–10 m continuous mast solver.

---

## Verification & Testing Suite

SHADOWLINE 4.0 enforces six deterministic engineering gates executed via pytest:

```bash
pytest tests/ -v
```

| Test Gate | Scope & Invariant Verified | Status |
| :--- | :--- | :---: |
| **Gate 1: Coordinates** | `IAU_MOON_ME` (DE421) frame lock verification; verifies 661.72 m PA offset rejection | `PASS` |
| **Gate 2: Ephemeris** | JPL Horizons topocentric vector ingestion; $-0.259^\circ$ parallax correction | `PASS` |
| **Gate 3: Horizon Curvature** | Spherical horizon elevation math $\psi(\alpha, s) = \arctan((z - z_0)/s - s/(2R_M))$ | `PASS` |
| **Gate 4: Solar Disk** | Extended solar disk integration ($R_\odot = 0.2666^\circ$) across penumbral transitions | `PASS` |
| **Gate 5: Decision Logic** | Strong Kleene $K_3$ truth table evaluation and decision-reversal flagging | `PASS` |
| **Gate 6: Mast Height** | Connecting Ridge Crest Alpha 6.0 m critical mast clearance validation | `PASS` |

---

## Team Roster (Obsidian Cosmos / Part of Cosmos)

* **Debanjan Biswas** ([@partofcosmos-site](https://github.com/partofcosmos-site)) — Lead Systems Architect, Planetary Geodesy, Ray-Tracing Engine, Horizon Profiling & Ephemeris Pipeline.
* **Aryan Anand** ([@AryanAnand-dev](https://github.com/AryanAnand-dev)) — Co-Lead, Astrodynamics Modeling, Topographic Slope Constraints, Energy Budget Simulation & Scientific Validation.

---

## Datasets & Acknowledgements

* **NASA Goddard Space Flight Center:** LOLA Science Team (Planetary Data System Product PGDA 78).
* **Arizona State University / SESE:** LROC Science Operations Center (NAC Digital Elevation Models PGDA 104).
* **NASA Jet Propulsion Laboratory:** JPL Solar System Dynamics Group & Horizons On-Line Ephemeris System.
* **NASA Space Apps Challenge 2026:** Lunar Landing Site Navigator Challenge.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
