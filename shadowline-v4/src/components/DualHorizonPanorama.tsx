import React, { useEffect, useRef } from 'react';
import {
  EphemerisPoint,
  ObserverPinData,
  PairedDecisionReport,
  sampleHorizonAtAzimuth,
} from '../engine/decisionSensitivityEngine';

interface DualHorizonPanoramaProps {
  pin: ObserverPinData;
  ephemeris: EphemerisPoint[];
  activeHourIdx: number;
  report: PairedDecisionReport;
  theme: 'graphite' | 'rams-daylight';
}

export const DualHorizonPanorama: React.FC<DualHorizonPanoramaProps> = ({
  pin,
  ephemeris,
  activeHourIdx,
  report,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStep = ephemeris[activeHourIdx] || ephemeris[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const isLight = theme === 'rams-daylight';
    const bgSky = isLight ? '#eae8e1' : '#0d0d0f';
    const gridInk = isLight ? 'rgba(20, 20, 19, 0.12)' : 'rgba(255, 255, 255, 0.08)';
    const textInk = isLight ? '#575652' : '#a1a1aa';
    const ldemLineInk = isLight ? '#0284c7' : '#38bdf8';
    const sdemLineInk = '#ea580c';

    ctx.fillStyle = bgSky;
    ctx.fillRect(0, 0, width, height);

    const padL = 44;
    const padR = 18;
    const padT = 24;
    const padB = 28;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const minEl = -2.0;
    const maxEl = 8.0;
    const azToX = (az: number) => padL + ((az % 360) / 360.0) * plotW;
    const elToY = (el: number) => padT + (1.0 - (el - minEl) / (maxEl - minEl)) * plotH;

    // Elevation grid lines
    ctx.strokeStyle = gridInk;
    ctx.lineWidth = 1;
    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.fillStyle = textInk;
    for (let el = -2; el <= 8; el += 2) {
      const y = elToY(el);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.fillText(`${el > 0 ? '+' : ''}${el}°`, 8, y + 3);
    }

    // Azimuth grid lines
    for (let az = 0; az <= 360; az += 45) {
      const x = padL + (az / 360.0) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
      ctx.fillText(`${az}°`, x - 10, height - 8);
    }

    // Highlight causal obstruction azimuth band if present
    if (report.causalAttribution) {
      const critAz = report.causalAttribution.criticalAzimuthDeg;
      const cx = azToX(critAz);
      ctx.fillStyle = 'rgba(234, 88, 12, 0.14)';
      ctx.fillRect(Math.max(padL, cx - 14), padT, 28, plotH);
      ctx.strokeStyle = '#ea580c';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, padT);
      ctx.lineTo(cx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw SDEM terrain fill & skyline (if coverage exists)
    if (pin.sdem_horizon) {
      ctx.beginPath();
      pin.sdem_horizon.az_deg.forEach((az: number, idx: number) => {
        const x = azToX(az);
        const y = elToY(pin.sdem_horizon!.horizon_el_deg[idx]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(padL + plotW, padT + plotH);
      ctx.lineTo(padL, padT + plotH);
      ctx.closePath();
      ctx.fillStyle = isLight ? 'rgba(234, 88, 12, 0.16)' : 'rgba(234, 88, 12, 0.20)';
      ctx.fill();

      ctx.beginPath();
      pin.sdem_horizon.az_deg.forEach((az: number, idx: number) => {
        const x = azToX(az);
        const y = elToY(pin.sdem_horizon!.horizon_el_deg[idx]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = sdemLineInk;
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }

    // Draw LDEM skyline (dashed reference profile)
    ctx.beginPath();
    pin.ldem_horizon.az_deg.forEach((az: number, idx: number) => {
      const x = azToX(az);
      const y = elToY(pin.ldem_horizon.horizon_el_deg[idx]);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = ldemLineInk;
    ctx.lineWidth = 1.75;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw full 156h solar grazing trajectory
    ctx.beginPath();
    ephemeris.forEach((pt, idx) => {
      const x = azToX(pt.sun_az_deg);
      const y = elToY(pt.sun_el_deg);
      if (idx === 0 || Math.abs(pt.sun_az_deg - ephemeris[idx - 1].sun_az_deg) > 180) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.45)' : 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Draw active Sun disc and Earth marker
    if (currentStep) {
      const sx = azToX(currentStep.sun_az_deg);
      const sy = elToY(currentStep.sun_el_deg);
      const discRadiusPx = Math.max(6, (currentStep.sun_semi_diam_deg / (maxEl - minEl)) * plotH * 2.2);

      ctx.beginPath();
      ctx.arc(sx, sy, discRadiusPx, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = isLight ? '#141413' : '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const ex = azToX(currentStep.earth_az_deg);
      const ey = elToY(currentStep.earth_el_deg);
      ctx.beginPath();
      ctx.arc(ex, ey, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }, [pin, ephemeris, activeHourIdx, report, theme, currentStep]);

  const ldemAtSun = currentStep ? sampleHorizonAtAzimuth(pin.ldem_horizon, currentStep.sun_az_deg).elDeg : 0;
  const sdemAtSun =
    currentStep && pin.sdem_horizon ? sampleHorizonAtAzimuth(pin.sdem_horizon, currentStep.sun_az_deg).elDeg : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '12px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>
            360° Topocentric Horizon Panorama (<var>H</var><sub>LDEM</sub> vs. <var>H</var><sub>SDEM</sub>)
          </span>
          <span className="mono-num" style={{ color: 'var(--ink-secondary)', fontSize: '11px' }}>
            Sun Az {currentStep?.sun_az_deg.toFixed(1)}° &middot; El {currentStep?.sun_el_deg.toFixed(2)}°
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="mono-num" style={{ fontSize: '11px', color: '#0284c7' }}>
            --- LDEM Horizon ({ldemAtSun.toFixed(2)}°)
          </span>
          <span className="mono-num" style={{ fontSize: '11px', color: '#ea580c' }}>
            ─── SDEM Horizon ({sdemAtSun !== null ? `${sdemAtSun.toFixed(2)}°` : 'NO COVERAGE'})
          </span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', border: '1px solid var(--hairline-strong)', borderRadius: '4px', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </div>
  );
};
