# Repository Assets and Implementation Inventory
## SHADOWLINE 4.0

This inventory describes the principal source files and capabilities present in the public repository. It does not treat local machine paths, untracked working files or planned integrations as publicly available deliverables.

## 1. Application source

| Path | Purpose |
|---|---|
| `src/App.tsx` | Main React application and primary workspace composition. |
| `src/engine/decisionSensitivityEngine.ts` | PASS / FAIL / UNKNOWN decision classification and comparison logic. |
| `src/components/DualHorizonPanorama.tsx` | Canvas-based dual horizon visualisation. |
| `src/components/TerrainDiffInspector.tsx` | Terrain-difference grid visualisation. |
| `src/components/TimelineComparison.tsx` | Scenario timeline comparison. |
| `src/components/ProvenanceValidateView.tsx` | Provenance and methodological information view. |
| `src/types/shadowline.ts` | TypeScript data and application type definitions. |
| `public/data/shadowline_v4_bundle.json` | Precomputed scenario data consumed by the frontend. |

## 2. Scientific processing and tests

| Path | Purpose |
|---|---|
| `scripts/build_paired_ldem_sdem.py` | Builds the deterministic synthetic paired-terrain benchmark and precomputed scenario bundle. |
| `scripts/test_scientific_pipeline.py` | Four pytest test functions for analytical properties of the synthetic pipeline. |
| `scripts/requirements.txt` | Python dependency declarations for the processing environment. |

**Data limitation:** The current builder constructs parameterised synthetic terrain. It does not directly ingest the original NASA Product 78 or Product 104 GeoTIFF rasters. The generated bundle should therefore be understood as a synthetic demonstration dataset.

## 3. Presentation and documentation

The repository includes project documentation and presentation-related source assets. Consult the repository tree for the exact files currently committed. Local file-system paths and files not present in the public repository are not public deliverables.

## 4. Implemented technology

- React 18
- TypeScript 5
- Vite 5
- Python
- NumPy and SciPy
- HTML Canvas 2D and CSS
- JSON scenario data
- Pytest

The current application does not implement a Three.js/WebGL rendering engine, live JPL Horizons queries or a NAIF SPICE ephemeris pipeline.

## 5. Verification scope

The included pytest module contains four test functions covering synthetic horizon geometry, ridge-obstruction behaviour, azimuthal sampling and bundle structure. These tests are scoped to the synthetic benchmark and do not constitute validation against original NASA rasters or mission-grade ephemerides.

## 6. Future development

Planned technical extensions include direct ingestion of NASA terrain rasters, independent ephemeris integration, explicit uncertainty propagation and validation against external lunar observations. These are future objectives, not claims about the current implementation.
