export interface ObserverPinData {
  id: string;
  name: string;
  lat_deg: number;
  lon_deg: number;
  x_m: number;
  y_m: number;
  elev_ldem_m: number;
  elev_sdem_m: number | null;
  slope_ldem_deg: number;
  slope_sdem_deg: number | null;
  has_sdem_coverage: boolean;
  convergence_passed: boolean;
  convergence_rel_diff_pct: number;
  clone_sunlit_pct_p10_p50_p90: [number, number, number];
  ldem_horizon: HorizonProfile;
  sdem_horizon?: HorizonProfile | null;
}

export type VerdictState = 'PASS' | 'FAIL' | 'UNKNOWN';
export type PanelOrientation = 'VERTICAL_POLAR' | 'HORIZONTAL_FLAT';

export interface HorizonProfile {
  az_deg: number[];
  horizon_el_deg: number[];
  obstruction_dist_m: number[];
  obstruction_elev_m: number[];
  obstruction_ldec: number[];
}

export interface EphemerisPoint {
  utc: string;
  sun_az_deg: number;
  sun_el_deg: number;
  sun_semi_diam_deg: number;
  sun_dist_au: number;
  earth_az_deg: number;
  earth_el_deg: number;
}

export interface CausalReversalAttribution {
  criticalAzimuthDeg: number;
  obstructionDistanceM: number;
  sdemRidgeElevM: number;
  ldemRidgeElevM: number;
  elevationDeltaM: number;
  horizonAngleDeltaDeg: number;
  lolaSpotCountLdec: number;
  disagreementHoursCount: number;
}

export interface PairedDecisionReport {
  ldemVerdict: VerdictState;
  sdemVerdict: VerdictState;
  decisionReversed: boolean | null; // null if either verdict is UNKNOWN
  unknownReason: string | null;
  ldemSunlitFractionPct: number;
  sdemSunlitFractionPct: number;
  ldemMaxDarkHours: number;
  sdemMaxDarkHours: number;
  ldemTimeToSunsetHours: number | null;
  sdemTimeToSunsetHours: number | null;
  timeToEarthsetHours: number | null;
  causalAttribution: CausalReversalAttribution | null;
}

/**
 * Mode A: Uniform-disc circular-segment visible solar fraction across locally straight horizon.
 */
export function computeCircularSegmentDiscFraction(
  sunElDeg: number,
  horizonElDeg: number,
  semiDiamDeg = 0.2665
): number {
  const g = sunElDeg - horizonElDeg;
  if (g >= semiDiamDeg) return 1.0;
  if (g <= -semiDiamDeg) return 0.0;
  const x = g / semiDiamDeg;
  return Math.max(
    0.0,
    Math.min(1.0, 0.5 + (1.0 / Math.PI) * (x * Math.sqrt(Math.max(0.0, 1.0 - x * x)) + Math.asin(x)))
  );
}

export function sampleHorizonAtAzimuth(profile: HorizonProfile, azDeg: number): {
  elDeg: number;
  distM: number;
  zM: number;
  ldec: number;
  binIdx: number;
} {
  const n = profile.horizon_el_deg.length;
  const normAz = ((azDeg % 360) + 360) % 360;
  const exactIdx = (normAz / 360.0) * n;
  const i0 = Math.floor(exactIdx) % n;
  const i1 = (i0 + 1) % n;
  const frac = exactIdx - Math.floor(exactIdx);
  return {
    elDeg: profile.horizon_el_deg[i0] * (1.0 - frac) + profile.horizon_el_deg[i1] * frac,
    distM: profile.obstruction_dist_m[i0],
    zM: profile.obstruction_elev_m[i0],
    ldec: profile.obstruction_ldec[i0],
    binIdx: i0,
  };
}

/**
 * Evaluates Normalized Geometric Solar Incidence Potential P_norm(t)
 * without fabricating spacecraft battery or heater parameters.
 */
export function computeNormalizedPowerPotential(
  discFraction: number,
  sunElDeg: number,
  sunDistAu: number,
  orientation: PanelOrientation
): number {
  const elRad = (sunElDeg * Math.PI) / 180.0;
  const cosIncidence =
    orientation === 'VERTICAL_POLAR' ? Math.max(0.0, Math.cos(elRad)) : Math.max(0.0, Math.sin(elRad));
  const invSq = 1.0 / Math.max(0.95, sunDistAu * sunDistAu);
  return Number((invSq * discFraction * cosIncidence).toFixed(4));
}

export function evaluatePairedDecisionSensitivity(
  ldemProfile: HorizonProfile | null,
  sdemProfile: HorizonProfile | null,
  convergencePassed: boolean,
  ephemerisWindow: EphemerisPoint[],
  minSunlitFractionPctThreshold: number,
  maxAllowedDarkHoursThreshold: number
): PairedDecisionReport {
  if (!ldemProfile || !sdemProfile) {
    return {
      ldemVerdict: ldemProfile ? 'PASS' : 'UNKNOWN',
      sdemVerdict: sdemProfile ? 'PASS' : 'UNKNOWN',
      decisionReversed: null,
      unknownReason: 'Coordinate falls outside verified LROC SDEM (PGDA Product 104) overlap extent.',
      ldemSunlitFractionPct: 0,
      sdemSunlitFractionPct: 0,
      ldemMaxDarkHours: 0,
      sdemMaxDarkHours: 0,
      ldemTimeToSunsetHours: null,
      sdemTimeToSunsetHours: null,
      timeToEarthsetHours: null,
      causalAttribution: null,
    };
  }

  if (!convergencePassed) {
    return {
      ldemVerdict: 'UNKNOWN',
      sdemVerdict: 'UNKNOWN',
      decisionReversed: null,
      unknownReason: 'Horizon azimuth convergence tolerance (>1% divergence between 720 and 1440 rays) exceeded.',
      ldemSunlitFractionPct: 0,
      sdemSunlitFractionPct: 0,
      ldemMaxDarkHours: 0,
      sdemMaxDarkHours: 0,
      ldemTimeToSunsetHours: null,
      sdemTimeToSunsetHours: null,
      timeToEarthsetHours: null,
      causalAttribution: null,
    };
  }

  let ldemSunHours = 0;
  let sdemSunHours = 0;
  let ldemCurDark = 0;
  let sdemCurDark = 0;
  let ldemMaxDark = 0;
  let sdemMaxDark = 0;
  let ldemSunsetH: number | null = null;
  let sdemSunsetH: number | null = null;
  let earthsetH: number | null = null;

  let disagreementHours = 0;
  let worstBinIdx = 0;
  let maxAbsHorizonDiff = -1.0;

  for (let i = 0; i < ephemerisWindow.length; i++) {
    const pt = ephemerisWindow[i];
    const hL = sampleHorizonAtAzimuth(ldemProfile, pt.sun_az_deg);
    const hS = sampleHorizonAtAzimuth(sdemProfile, pt.sun_az_deg);
    const fL = computeCircularSegmentDiscFraction(pt.sun_el_deg, hL.elDeg, pt.sun_semi_diam_deg);
    const fS = computeCircularSegmentDiscFraction(pt.sun_el_deg, hS.elDeg, pt.sun_semi_diam_deg);

    const litL = fL >= 0.5;
    const litS = fS >= 0.5;

    if (litL) {
      ldemSunHours++;
      ldemCurDark = 0;
    } else {
      ldemCurDark++;
      if (ldemCurDark > ldemMaxDark) ldemMaxDark = ldemCurDark;
      if (ldemSunsetH === null && i > 0) ldemSunsetH = i;
    }

    if (litS) {
      sdemSunHours++;
      sdemCurDark = 0;
    } else {
      sdemCurDark++;
      if (sdemCurDark > sdemMaxDark) sdemMaxDark = sdemCurDark;
      if (sdemSunsetH === null && i > 0) sdemSunsetH = i;
    }

    if (litL !== litS) {
      disagreementHours++;
      const diff = Math.abs(hS.elDeg - hL.elDeg);
      if (diff > maxAbsHorizonDiff) {
        maxAbsHorizonDiff = diff;
        worstBinIdx = hS.binIdx;
      }
    }

    const hEarth = sampleHorizonAtAzimuth(sdemProfile, pt.earth_az_deg);
    if (pt.earth_el_deg <= hEarth.elDeg && earthsetH === null && i > 0) {
      earthsetH = i;
    }
  }

  const totalH = Math.max(1, ephemerisWindow.length);
  const ldemPct = Number(((ldemSunHours / totalH) * 100.0).toFixed(1));
  const sdemPct = Number(((sdemSunHours / totalH) * 100.0).toFixed(1));

  const ldemPass = ldemPct >= minSunlitFractionPctThreshold && ldemMaxDark <= maxAllowedDarkHoursThreshold;
  const sdemPass = sdemPct >= minSunlitFractionPctThreshold && sdemMaxDark <= maxAllowedDarkHoursThreshold;

  const ldemVerdict: VerdictState = ldemPass ? 'PASS' : 'FAIL';
  const sdemVerdict: VerdictState = sdemPass ? 'PASS' : 'FAIL';
  const reversed = ldemVerdict !== sdemVerdict;

  const causalAttribution: CausalReversalAttribution | null =
    disagreementHours > 0
      ? {
          criticalAzimuthDeg: sdemProfile.az_deg[worstBinIdx],
          obstructionDistanceM: sdemProfile.obstruction_dist_m[worstBinIdx],
          sdemRidgeElevM: sdemProfile.obstruction_elev_m[worstBinIdx],
          ldemRidgeElevM: ldemProfile.obstruction_elev_m[worstBinIdx],
          elevationDeltaM: Number(
            (sdemProfile.obstruction_elev_m[worstBinIdx] - ldemProfile.obstruction_elev_m[worstBinIdx]).toFixed(2)
          ),
          horizonAngleDeltaDeg: Number(
            (sdemProfile.horizon_el_deg[worstBinIdx] - ldemProfile.horizon_el_deg[worstBinIdx]).toFixed(3)
          ),
          lolaSpotCountLdec: ldemProfile.obstruction_ldec[worstBinIdx],
          disagreementHoursCount: disagreementHours,
        }
      : null;

  return {
    ldemVerdict,
    sdemVerdict,
    decisionReversed: reversed,
    unknownReason: null,
    ldemSunlitFractionPct: ldemPct,
    sdemSunlitFractionPct: sdemPct,
    ldemMaxDarkHours: ldemMaxDark,
    sdemMaxDarkHours: sdemMaxDark,
    ldemTimeToSunsetHours: ldemSunsetH,
    sdemTimeToSunsetHours: sdemSunsetH,
    timeToEarthsetHours: earthsetH,
    causalAttribution,
  };
}
