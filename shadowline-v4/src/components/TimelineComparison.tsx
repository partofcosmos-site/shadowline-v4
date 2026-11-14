import React from 'react';
import {
  computeCircularSegmentDiscFraction,
  computeNormalizedPowerPotential,
  EphemerisPoint,
  ObserverPinData,
  PanelOrientation,
  sampleHorizonAtAzimuth,
} from '../engine/decisionSensitivityEngine';

interface TimelineComparisonProps {
  pin: ObserverPinData;
  ephemeris: EphemerisPoint[];
  activeHourIdx: number;
  onSelectHour: (idx: number) => void;
  panelOrientation: PanelOrientation;
}

export const TimelineComparison: React.FC<TimelineComparisonProps> = ({
  pin,
  ephemeris,
  activeHourIdx,
  onSelectHour,
  panelOrientation,
}) => {
  const step = ephemeris[activeHourIdx] || ephemeris[0];
  const hL = step ? sampleHorizonAtAzimuth(pin.ldem_horizon, step.sun_az_deg).elDeg : 0;
  const hS = step && pin.sdem_horizon ? sampleHorizonAtAzimuth(pin.sdem_horizon, step.sun_az_deg).elDeg : null;
  const fL = step ? computeCircularSegmentDiscFraction(step.sun_el_deg, hL, step.sun_semi_diam_deg) : 0;
  const fS =
    step && hS !== null ? computeCircularSegmentDiscFraction(step.sun_el_deg, hS, step.sun_semi_diam_deg) : null;

  const pNormL = step
    ? computeNormalizedPowerPotential(fL, step.sun_el_deg, step.sun_dist_au, panelOrientation)
    : 0;
  const pNormS =
    step && fS !== null
      ? computeNormalizedPowerPotential(fS, step.sun_el_deg, step.sun_dist_au, panelOrientation)
      : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid var(--hairline-strong)',
        background: 'var(--bg-sheet)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 500, fontSize: '12px' }}>
            156&thinsp;h Surface Stay Timeline ({step?.utc})
          </span>
          <span className="math-expr" style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>
            <var>P</var><sub>norm,LDEM</sub> = <span className="mono-num">{pNormL.toFixed(3)}</span>
            {' '}&middot;{' '}
            <var>P</var><sub>norm,SDEM</sub> ={' '}
            <span className="mono-num">{pNormS !== null ? pNormS.toFixed(3) : 'UNKNOWN'}</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="mono-num" style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
            Hour {activeHourIdx + 1} / {ephemeris.length}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, ephemeris.length - 1)}
            value={activeHourIdx}
            onChange={(e) => onSelectHour(Number(e.target.value))}
            style={{ width: '160px', accentColor: 'var(--accent-signal)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Paired LDEM vs SDEM Barcode Strips */}
      <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', rowGap: '6px', alignItems: 'center' }}>
        <span className="mono-num" style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
          LDEM Sunlight
        </span>
        <div style={{ display: 'flex', height: '14px', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--hairline-subtle)' }}>
          {ephemeris.map((pt, idx) => {
            const hz = sampleHorizonAtAzimuth(pin.ldem_horizon, pt.sun_az_deg).elDeg;
            const f = computeCircularSegmentDiscFraction(pt.sun_el_deg, hz, pt.sun_semi_diam_deg);
            const bg = f >= 0.5 ? '#15803d' : '#b91c1c';
            return (
              <div
                key={idx}
                onClick={() => onSelectHour(idx)}
                style={{
                  flex: 1,
                  background: bg,
                  opacity: idx === activeHourIdx ? 1.0 : 0.72,
                  borderLeft: idx === activeHourIdx ? '1.5px solid #ffffff' : 'none',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>

        <span className="mono-num" style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
          SDEM Sunlight
        </span>
        <div style={{ display: 'flex', height: '14px', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--hairline-subtle)' }}>
          {ephemeris.map((pt, idx) => {
            if (!pin.sdem_horizon) {
              return <div key={idx} style={{ flex: 1, background: '#b45309', opacity: 0.45 }} />;
            }
            const hz = sampleHorizonAtAzimuth(pin.sdem_horizon, pt.sun_az_deg).elDeg;
            const f = computeCircularSegmentDiscFraction(pt.sun_el_deg, hz, pt.sun_semi_diam_deg);
            const bg = f >= 0.5 ? '#15803d' : '#b91c1c';
            return (
              <div
                key={idx}
                onClick={() => onSelectHour(idx)}
                style={{
                  flex: 1,
                  background: bg,
                  opacity: idx === activeHourIdx ? 1.0 : 0.72,
                  borderLeft: idx === activeHourIdx ? '1.5px solid #ffffff' : 'none',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>

        <span className="mono-num" style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
          Earth Geom.
        </span>
        <div style={{ display: 'flex', height: '10px', borderRadius: '2px', overflow: 'hidden', border: '1px solid var(--hairline-subtle)' }}>
          {ephemeris.map((pt, idx) => {
            const prof = pin.sdem_horizon || pin.ldem_horizon;
            const hzE = sampleHorizonAtAzimuth(prof, pt.earth_az_deg).elDeg;
            const ok = pt.earth_el_deg > hzE;
            return (
              <div
                key={idx}
                onClick={() => onSelectHour(idx)}
                style={{
                  flex: 1,
                  background: ok ? '#0284c7' : '#52525b',
                  opacity: idx === activeHourIdx ? 1.0 : 0.65,
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

