import React, { useEffect, useRef } from 'react';
import { ObserverPinData, PairedDecisionReport } from '../types/shadowline';

interface TerrainDiffInspectorProps {
  diffGrid: number[][];
  ldecGrid: number[][];
  extentM: [number, number];
  pins: ObserverPinData[];
  selectedPin: ObserverPinData;
  onSelectPin: (pinId: string) => void;
  report: PairedDecisionReport;
}

export const TerrainDiffInspector: React.FC<TerrainDiffInspectorProps> = ({
  diffGrid,
  ldecGrid,
  extentM,
  pins,
  selectedPin,
  onSelectPin,
  report,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 340;
    canvas.width = size;
    canvas.height = size;

    const n = diffGrid.length;
    const cellPx = size / n;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const dz = diffGrid[r][c];
        const ldec = ldecGrid[r][c];
        // Diverging colormap: orange where SDEM > LDEM, blue where SDEM < LDEM
        if (dz > 0.4) {
          const alpha = Math.min(0.9, 0.2 + dz / 6.0);
          ctx.fillStyle = `rgba(234, 88, 12, ${alpha})`;
        } else if (dz < -0.4) {
          const alpha = Math.min(0.85, 0.2 + Math.abs(dz) / 4.0);
          ctx.fillStyle = `rgba(2, 132, 199, ${alpha})`;
        } else {
          ctx.fillStyle = ldec === 0 ? 'rgba(180, 83, 9, 0.14)' : 'rgba(120, 118, 110, 0.12)';
        }
        ctx.fillRect(c * cellPx, (n - 1 - r) * cellPx, Math.ceil(cellPx), Math.ceil(cellPx));
      }
    }

    const [minM, maxM] = extentM;
    const mToPxX = (x: number) => ((x - minM) / (maxM - minM)) * size;
    const mToPxY = (y: number) => (1.0 - (y - minM) / (maxM - minM)) * size;

    // Draw causal obstruction vector if present
    if (report.causalAttribution) {
      const azRad = (report.causalAttribution.criticalAzimuthDeg * Math.PI) / 180.0;
      const distM = report.causalAttribution.obstructionDistanceM;
      const x0 = mToPxX(selectedPin.x_m);
      const y0 = mToPxY(selectedPin.y_m);
      const x1 = mToPxX(selectedPin.x_m + distM * Math.sin(azRad));
      const y1 = mToPxY(selectedPin.y_m + distM * Math.cos(azRad));

      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x1, y1, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw observer pins
    pins.forEach((p) => {
      const px = mToPxX(p.x_m);
      const py = mToPxY(p.y_m);
      ctx.beginPath();
      ctx.arc(px, py, p.id === selectedPin.id ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = p.id === selectedPin.id ? '#141413' : '#71717a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, [diffGrid, ldecGrid, extentM, pins, selectedPin, report]);

  const attr = report.causalAttribution;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', padding: '16px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="section-header">
          <span className="section-index">MAP</span>
          <span>SDEM &minus; LDEM Elevation Difference (&Delta;<var>z</var>) &amp; Obstruction Ray</span>
        </div>
        <canvas
          ref={canvasRef}
          style={{ width: '340px', height: '340px', border: '1px solid var(--hairline-strong)', borderRadius: '4px' }}
        />
        <div className="sidebar-grid-2col">
          {pins.map((p) => (
            <button
              key={p.id}
              className={`control-btn ${p.id === selectedPin.id ? 'active' : ''}`}
              onClick={() => onSelectPin(p.id)}
            >
              {p.id} ({p.has_sdem_coverage ? 'Paired' : 'No SDEM'})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="section-header">
          <span className="section-index">CAUSE</span>
          <span>Causal Attribution of Terrain-Model Disagreement</span>
        </div>

        {report.unknownReason ? (
          <div style={{ padding: '12px', border: '1px solid var(--status-unknown)', borderRadius: '4px' }}>
            <div className="status-indicator" style={{ marginBottom: '6px' }}>
              <span className="status-dot unknown" />
              <span>VERDICT: UNKNOWN (COVERAGE OR CONVERGENCE GATE)</span>
            </div>
            <p style={{ color: 'var(--ink-secondary)' }}>{report.unknownReason}</p>
          </div>
        ) : attr ? (
          <>
            <div className="ledger-row">
              <span className="ledger-label">Decision Reversal Indicator <var>D</var>(<var>i</var>, <var>t</var>)</span>
              <span className="mono-num" style={{ color: report.decisionReversed ? 'var(--status-fail)' : 'var(--status-pass)' }}>
                {report.decisionReversed ? '1 (DECISION REVERSED: LDEM ≠ SDEM)' : '0 (VERDICT INVARIANT)'}
              </span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Critical Obstruction Azimuth (<var>&alpha;</var><sup>*</sup>)</span>
              <span className="mono-num">{attr.criticalAzimuthDeg.toFixed(1)}&thinsp;deg</span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Obstruction Distance (<var>s</var><sup>*</sup>)</span>
              <span className="mono-num">{attr.obstructionDistanceM.toFixed(0)}&thinsp;m</span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">SDEM vs. LDEM Ridge Height (&Delta;<var>z</var><sup>*</sup>)</span>
              <span className="mono-num">
                {attr.sdemRidgeElevM.toFixed(2)}&thinsp;m vs. {attr.ldemRidgeElevM.toFixed(2)}&thinsp;m ({attr.elevationDeltaM >= 0 ? '+' : ''}
                {attr.elevationDeltaM.toFixed(2)}&thinsp;m)
              </span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Apparent Horizon Angle Shift (&Delta;<var>H</var>)</span>
              <span className="mono-num">
                {attr.horizonAngleDeltaDeg >= 0 ? '+' : ''}
                {attr.horizonAngleDeltaDeg.toFixed(3)}&thinsp;deg
              </span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">LOLA Laser Spot Count at Ridge (LDEC)</span>
              <span className="mono-num">
                {attr.lolaSpotCountLdec} ({attr.lolaSpotCountLdec === 0 ? 'Interpolated Gap' : 'Direct Laser Track'})
              </span>
            </div>
            <div className="ledger-row">
              <span className="ledger-label">Hours of Illumination Disagreement</span>
              <span className="mono-num">{attr.disagreementHoursCount}&thinsp;h / 156&thinsp;h</span>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--ink-secondary)' }}>
            Both LDEM and SDEM horizon profiles agree across all solar azimuth steps during this epoch.
          </p>
        )}
      </div>
    </div>
  );
};

