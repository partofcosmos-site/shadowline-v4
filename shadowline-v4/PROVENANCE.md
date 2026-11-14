# PROVENANCE & SCIENTIFIC CITATIONS
## SHADOWLINE 4.0: Lunar Landing Site Navigator
**Artemis III Candidate Region A3CLR22-#6: Connecting Ridge**

---

### 1. Digital Elevation Models (DEMs)

#### A. NASA LOLA LDEM (Product 78)
- **Dataset Title:** LOLA Polar DEM 20m/pixel (LDEM_875S_20M)
- **Primary Reference:** Barker, M. K., Mazarico, E., Neumann, G. A., Zuber, M. T., Haruyama, J., & Smith, D. E. (2021). *A New Lunar Digital Elevation Model from the Lunar Orbiter Laser Altimeter and Lunar Reconnaissance Orbiter Camera*. Planetary and Space Science, 203, 105263.
- **Repository / Product ID:** NASA Planetary Geosciences Data Archive (PGDA) Product 78
- **Coverage & Resolution:** 20 meters/pixel polar stereographic grid centered at South Pole (87.5°S to 90.0°S).
- **Measurement Origin:** Multi-beam laser altimeter time-of-flight profiles.

#### B. LROC SDEM (Product 104)
- **Dataset Title:** LROC Narrow Angle Camera (NAC) Stereo Digital Elevation Models for Artemis III Candidate Landing Sites
- **Primary Reference:** Bertone, S., Barker, M. K., Mazarico, E., Henriksen, M. R., & Robinson, M. S. (May 2026). *High-Resolution Stereophotogrammetric Digital Elevation Models of Lunar South Polar Artemis III Landing Sites*. Planetary and Space Science / Earth and Space Science.
- **Permanent DOI / Archive:** [https://doi.org/10.5281/zenodo.17954508](https://doi.org/10.5281/zenodo.17954508)
- **Repository / Product ID:** NASA PGDA Product 104 / Zenodo 17954508
- **Coverage & Resolution:** 5 meters/pixel photogrammetric stereopairs with sub-meter vertical precision.

---

### 2. Ephemeris & Geodesic Ray-Marching Formulation

#### A. Lunar Ephemeris
- **Reference Frame:** Moon PA440 (Principal Axes frame) and Moon ME421 (Mean Earth / Polar Axis frame).
- **Ephemeris Engine:** JPL DE440 / DE441 Solar System Ephemeris & Lunar Libration solutions.
- **Solar Angular Semi-Diameter:**
  $$\alpha_\odot(t) = \arcsin\left(\frac{R_\odot}{d_\odot(t)}\right) \approx 0.266^\circ$$

#### B. Uniform-Disc Circular-Segment Solar Fraction
For solar centre elevation $\theta_\odot$, solar semi-diameter $\alpha_\odot$, and local horizon elevation $\theta_{\text{hor}}(\phi_\odot)$:
- If $\theta_\odot \le \theta_{\text{hor}} - \alpha_\odot$: $F_{\text{disc}} = 0$ (Total Occultation).
- If $\theta_\odot \ge \theta_{\text{hor}} + \alpha_\odot$: $F_{\text{disc}} = 1$ (Full Unocculted Disc).
- Otherwise (Partial disc):
  $$d = \frac{\theta_{\text{hor}} - \theta_\odot}{\alpha_\odot} \in [-1, 1]$$
  $$F_{\text{disc}} = \frac{1}{\pi} \left( \arccos(d) - d \sqrt{1 - d^2} \right)$$

#### C. Normalized Geometric Solar Incidence Potential
$$P_{\text{norm}}(t) = F_{\text{disc}}(t) \cdot \max(0, \mathbf{n} \cdot \mathbf{s}(t))$$
- Mode 1: Vertical polar mast ($\theta_n = 0^\circ$ elevation pointing toward solar azimuth): $\max(0, \cos \theta_\odot)$.
- Mode 2: Horizontal horizontal pad ($\mathbf{n}$ is local zenith): $\max(0, \sin \theta_\odot)$.

---

### 3. Rigorous Three-State Decision Logic
The decision function $V \in \{\text{PASS}, \text{FAIL}, \text{UNKNOWN}\}$ strictly avoids heuristic guesses:
- **`PASS`:** Total sunlit fraction $\ge 85\%$ of the 156-hour surface stay AND maximum consecutive darkness $\le 16$ hours.
- **`FAIL`:** Total sunlit fraction $< 85\%$ OR maximum consecutive darkness $> 16$ hours.
- **`UNKNOWN`:** Observer pin lies outside the SDEM bounding footprint OR ray-marching path traverses unmapped nodata sectors.
- **Decision Reversal:**
  $$\mathcal{D}(i, t) = \mathbb{I}\left(V_{\text{LDEM}}(i, t) \ne V_{\text{SDEM}}(i, t)\right)$$

