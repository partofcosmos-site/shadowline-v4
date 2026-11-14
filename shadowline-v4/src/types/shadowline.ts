import {
  EphemerisPoint,
  HorizonProfile,
  PairedDecisionReport,
  PanelOrientation,
  VerdictState,
} from '../engine/decisionSensitivityEngine';

export type {
  EphemerisPoint,
  HorizonProfile,
  PairedDecisionReport,
  PanelOrientation,
  VerdictState,
};

export interface MissionWindowOption {
  id: string;
  label: string;
  phase_deg: number;
}

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
  sdem_horizon: HorizonProfile | null;
}

export interface ValidationSummary {
  synthetic_flat_dip_expected_deg: number;
  synthetic_flat_dip_measured_deg: number;
  synthetic_ridge_50m_at_1km_expected_deg: number;
  synthetic_ridge_50m_at_1km_measured_deg: number;
  azimuth_convergence_720_vs_1440_max_diff_pct: number;
  jpl_horizons_rms_residual_deg: number;
}

export interface ShadowlineBundle {
  schema_version: string;
  generated_utc: string;
  region_id: string;
  region_name: string;
  reference_frame: string;
  provenance: {
    ldem_citation: string;
    ldem_url: string;
    sdem_citation: string;
    sdem_url: string;
    ephemeris_citation: string;
  };
  validation_summary: ValidationSummary;
  windows: MissionWindowOption[];
  ephemeris_by_window: Record<string, EphemerisPoint[]>;
  pins: ObserverPinData[];
  terrain_diff_grid_64x64: {
    extent_m: [number, number];
    sdem_minus_ldem_m: number[][];
    ldec_spot_count: number[][];
  };
}

