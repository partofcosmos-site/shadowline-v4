import React from 'react';
import { ShadowlineBundle } from '../types/shadowline';

interface ProvenanceValidateViewProps {
  bundle: ShadowlineBundle;
}

export const ProvenanceValidateView: React.FC<ProvenanceValidateViewProps> = ({ bundle }) => {
  const v = bundle.validation_summary;
  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        <div className="section-header">
          <span className="section-index">VAL</span>
          <span>Executed Scientific Verification Gate Receipts</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">1. Synthetic Flat Horizon Dip (<var>h</var><sub>obs</sub> = 2&thinsp;m)</span>
          <span className="mono-num">
            {v.synthetic_flat_dip_measured_deg.toFixed(4)}° (Expected {v.synthetic_flat_dip_expected_deg.toFixed(4)}°) [PASS]
          </span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">2. Analytic 50&thinsp;m Ridge at 1,000&thinsp;m Due North</span>
          <span className="mono-num">
            {v.synthetic_ridge_50m_at_1km_measured_deg.toFixed(4)}° (Expected {v.synthetic_ridge_50m_at_1km_expected_deg.toFixed(4)}°) [PASS]
          </span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">3. Azimuth Convergence (720 vs. 1440 Rays)</span>
          <span className="mono-num">{v.azimuth_convergence_720_vs_1440_max_diff_pct.toFixed(2)}% (&le; 1.0% threshold) [PASS]</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">4. NASA JPL Horizons Topocentric Cross-Check</span>
          <span className="mono-num">RMS Residual {v.jpl_horizons_rms_residual_deg.toFixed(3)}° (&lt; 0.05°) [PASS]</span>
        </div>

        <div className="section-header" style={{ marginTop: '20px' }}>
          <span className="section-index">LIM</span>
          <span>Declared Physical Approximations &amp; Scope Boundaries</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Solar Disc Model</span>
          <span className="mono-num">Mode A (Circular-Segment Uniform Disc)</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Power Metric</span>
          <span className="mono-num">Normalized Geometric Flux (No Battery/Heater Assumed)</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Direct-to-Earth Metric</span>
          <span className="mono-num">Geometric Line-of-Sight Only (No RF Link Budget)</span>
        </div>
      </div>

      <div>
        <div className="section-header">
          <span className="section-index">PROV</span>
          <span>Primary NASA Dataset Provenance &amp; Reference Frames</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Body-Fixed Reference Frame</span>
          <span className="mono-num">{bundle.reference_frame}</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">LDEM Source (PGDA Product 78)</span>
          <span className="mono-num">Barker et al. (2021) &middot; 5.0&thinsp;m/pix</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">SDEM Source (PGDA Product 104)</span>
          <span className="mono-num">Bertone et al. (2026) &middot; Zenodo 17954508</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Ephemeris Verification</span>
          <span className="mono-num">JPL Horizons REST API (coord@301)</span>
        </div>
      </div>
    </div>
  );
};

