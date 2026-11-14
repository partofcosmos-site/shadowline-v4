import React, { useEffect, useMemo, useState } from 'react';
import {
  evaluatePairedDecisionSensitivity,
  PanelOrientation,
  VerdictState,
} from './engine/decisionSensitivityEngine';
import { ShadowlineBundle } from './types/shadowline';
import { DualHorizonPanorama } from './components/DualHorizonPanorama';
import { TimelineComparison } from './components/TimelineComparison';
import { TerrainDiffInspector } from './components/TerrainDiffInspector';
import { ProvenanceValidateView } from './components/ProvenanceValidateView';

export const App: React.FC = () => {
  const [bundle, setBundle] = useState<ShadowlineBundle | null>(null);
  const [activeTab, setActiveTab] = useState<'COMPARE' | 'EXPLAIN' | 'VALIDATE'>('COMPARE');
  const [selectedPinId, setSelectedPinId] = useState<string>('CR-01');
  const [selectedWindowId, setSelectedWindowId] = useState<string>('WIN-SUMMER-A');
  const [activeHourIdx, setActiveHourIdx] = useState<number>(18);
  const [minSunlitPct, setMinSunlitPct] = useState<number>(85);
  const [maxDarkHours, setMaxDarkHours] = useState<number>(24);
  const [panelOrientation, setPanelOrientation] = useState<PanelOrientation>('VERTICAL_POLAR');
  const [educatorOverlay, setEducatorOverlay] = useState<boolean>(false);
  const [theme, setTheme] = useState<'graphite' | 'rams-daylight'>('rams-daylight');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/data/shadowline_v4_bundle.json')
      .then((res) => res.json())
      .then((data: ShadowlineBundle) => setBundle(data));
  }, []);

  const selectedPin = useMemo(() => {
    if (!bundle) return null;
    return bundle.pins.find((p) => p.id === selectedPinId) || bundle.pins[0];
  }, [bundle, selectedPinId]);

  const ephemeris = useMemo(() => {
    if (!bundle) return [];
    return bundle.ephemeris_by_window[selectedWindowId] || [];
  }, [bundle, selectedWindowId]);

  const report = useMemo(() => {
    if (!selectedPin) return null;
    return evaluatePairedDecisionSensitivity(
      selectedPin.ldem_horizon,
      selectedPin.sdem_horizon,
      selectedPin.convergence_passed,
      ephemeris,
      minSunlitPct,
      maxDarkHours
    );
  }, [selectedPin, ephemeris, minSunlitPct, maxDarkHours]);

  if (!bundle || !selectedPin || !report) {
    return <div style={{ padding: '24px' }}>Loading SHADOWLINE 4.0 verified bundle...</div>;
  }

  const renderVerdictBadge = (verdict: VerdictState) => {
    const dotClass = verdict === 'PASS' ? 'pass' : verdict === 'FAIL' ? 'fail' : 'unknown';
    return (
      <span className="status-indicator">
        <span className={`status-dot ${dotClass}`} />
        <span>{verdict}</span>
      </span>
    );
  };

  return (
    <div className="app-shell">
      {/* 40px Top Command Bar */}
      <header className="top-command-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '-0.01em' }}>
            SHADOWLINE 4.0
          </span>
          <div className="underline-tabs" style={{ paddingTop: 0, borderBottom: 'none' }}>
            <button
              className={`underline-tab ${activeTab === 'COMPARE' ? 'active' : ''}`}
              onClick={() => setActiveTab('COMPARE')}
            >
              01 Compare Navigator
            </button>
            <button
              className={`underline-tab ${activeTab === 'EXPLAIN' ? 'active' : ''}`}
              onClick={() => setActiveTab('EXPLAIN')}
            >
              02 Explain Reversal
            </button>
            <button
              className={`underline-tab ${activeTab === 'VALIDATE' ? 'active' : ''}`}
              onClick={() => setActiveTab('VALIDATE')}
            >
              03 Validate &amp; Provenance
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`control-btn ${educatorOverlay ? 'active' : ''}`}
            onClick={() => setEducatorOverlay(!educatorOverlay)}
          >
            {educatorOverlay ? 'Public Guide: ON' : 'Planner Mode'}
          </button>
          <button
            className="control-btn"
            onClick={() => setTheme(theme === 'rams-daylight' ? 'graphite' : 'rams-daylight')}
          >
            {theme === 'rams-daylight' ? 'Graphite Dark' : 'Rams Daylight'}
          </button>
        </div>
      </header>

      {/* Left Main Stage */}
      <main className="main-stage">
        {activeTab === 'COMPARE' && (
          <>
            <DualHorizonPanorama
              pin={selectedPin}
              ephemeris={ephemeris}
              activeHourIdx={activeHourIdx}
              report={report}
              theme={theme}
            />
            <TimelineComparison
              pin={selectedPin}
              ephemeris={ephemeris}
              activeHourIdx={activeHourIdx}
              onSelectHour={setActiveHourIdx}
              panelOrientation={panelOrientation}
            />
          </>
        )}
        {activeTab === 'EXPLAIN' && (
          <div style={{ gridRow: '1 / -1', overflowY: 'auto' }}>
            <TerrainDiffInspector
              diffGrid={bundle.terrain_diff_grid_64x64.sdem_minus_ldem_m}
              ldecGrid={bundle.terrain_diff_grid_64x64.ldec_spot_count}
              extentM={bundle.terrain_diff_grid_64x64.extent_m}
              pins={bundle.pins}
              selectedPin={selectedPin}
              onSelectPin={setSelectedPinId}
              report={report}
            />
          </div>
        )}
        {activeTab === 'VALIDATE' && (
          <div style={{ gridRow: '1 / -1', overflowY: 'auto' }}>
            <ProvenanceValidateView bundle={bundle} />
          </div>
        )}
      </main>

      {/* 360px Right Specification Sheet */}
      <aside className="right-spec-sheet">
        <section className="sheet-section">
          <div className="section-header">
            <span className="section-index">01</span>
            <span>Candidate Site &amp; Mission Window</span>
          </div>
          <div className="sidebar-grid-2col" style={{ marginBottom: '8px' }}>
            {bundle.pins.map((p) => (
              <button
                key={p.id}
                className={`control-btn ${p.id === selectedPin.id ? 'active' : ''}`}
                onClick={() => setSelectedPinId(p.id)}
              >
                {p.id}
              </button>
            ))}
          </div>
          <div className="sidebar-grid-2col">
            {bundle.windows.map((w, idx) => (
              <button
                key={w.id}
                className={`control-btn ${w.id === selectedWindowId ? 'active' : ''}`}
                onClick={() => setSelectedWindowId(w.id)}
              >
                Epoch {idx + 1}
              </button>
            ))}
          </div>
        </section>

        <section className="sheet-section">
          <div className="section-header">
            <span className="section-index">02</span>
            <span>Paired Terrain-Model Verdict Ledger</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">LOLA LDEM (PGDA 78) Verdict</span>
            {renderVerdictBadge(report.ldemVerdict)}
          </div>
          <div className="ledger-row">
            <span className="ledger-label">LROC SDEM (PGDA 104) Verdict</span>
            {renderVerdictBadge(report.sdemVerdict)}
          </div>
          <div className="ledger-row">
            <span className="ledger-label">Decision Reversal <var>D</var>(<var>i</var>, <var>t</var>)</span>
            <span
              className="mono-num"
              style={{
                color:
                  report.decisionReversed === null
                    ? 'var(--status-unknown)'
                    : report.decisionReversed
                    ? 'var(--status-fail)'
                    : 'var(--status-pass)',
              }}
            >
              {report.decisionReversed === null
                ? 'UNKNOWN'
                : report.decisionReversed
                ? 'REVERSED [D=1]'
                : 'INVARIANT [D=0]'}
            </span>
          </div>
          {report.decisionReversed && (
            <div style={{ marginTop: '8px' }}>
              <button
                className="control-btn primary-signal"
                style={{ width: '100%' }}
                onClick={() => setActiveTab('EXPLAIN')}
              >
                Inspect Ridge Reversal Cause
              </button>
            </div>
          )}
        </section>

        <section className="sheet-section">
          <div className="section-header">
            <span className="section-index">03</span>
            <span>Illumination &amp; Horizon Telemetry</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">LDEM vs. SDEM Sunlit Fraction</span>
            <span className="mono-num">
              {report.ldemSunlitFractionPct.toFixed(1)}% vs.{' '}
              {selectedPin.has_sdem_coverage ? `${report.sdemSunlitFractionPct.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">LDEM 100-Clone P10 / P50 / P90</span>
            <span className="mono-num">
              {selectedPin.clone_sunlit_pct_p10_p50_p90.map((v) => `${v.toFixed(1)}%`).join(' / ')}
            </span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">Time Until Sunset (LDEM / SDEM)</span>
            <span className="mono-num">
              {report.ldemTimeToSunsetHours !== null ? `${report.ldemTimeToSunsetHours}h` : '>156h'} /{' '}
              {!selectedPin.has_sdem_coverage
                ? 'N/A'
                : report.sdemTimeToSunsetHours !== null
                ? `${report.sdemTimeToSunsetHours}h`
                : '>156h'}
            </span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">Time Until Earthset (Geometric)</span>
            <span className="mono-num">
              {report.timeToEarthsetHours !== null ? `${report.timeToEarthsetHours}h` : 'Continuous (>156h)'}
            </span>
          </div>
        </section>

        <section className="sheet-section">
          <div className="section-header">
            <span className="section-index">04</span>
            <span>Decision Criterion &amp; Array Mode</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-label">Min Sunlit Threshold (&ge; {minSunlitPct}%)</span>
            <input
              type="range"
              min={60}
              max={95}
              value={minSunlitPct}
              onChange={(e) => setMinSunlitPct(Number(e.target.value))}
              style={{ width: '110px', accentColor: 'var(--accent-signal)' }}
            />
          </div>
          <div className="sidebar-grid-2col" style={{ marginTop: '8px' }}>
            <button
              className={`control-btn ${panelOrientation === 'VERTICAL_POLAR' ? 'active' : ''}`}
              onClick={() => setPanelOrientation('VERTICAL_POLAR')}
            >
              Vertical Array
            </button>
            <button
              className={`control-btn ${panelOrientation === 'HORIZONTAL_FLAT' ? 'active' : ''}`}
              onClick={() => setPanelOrientation('HORIZONTAL_FLAT')}
            >
              Horizontal Flat
            </button>
          </div>
          {educatorOverlay && (
            <p style={{ marginTop: '10px', color: 'var(--ink-secondary)', fontSize: '11.5px' }}>
              <strong>Public Guide:</strong> Because the Moon tilts only 1.54&deg;, sunlight skims sideways across South Pole craters. A 4.8&thinsp;m ridge missed between laser tracks can block the Sun and flip a mission from PASS to FAIL.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
};
