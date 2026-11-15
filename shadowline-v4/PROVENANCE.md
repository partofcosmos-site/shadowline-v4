# Data Provenance and Scientific Scope
## SHADOWLINE 4.0 — Lunar South Pole Illumination & Decision-Sensitivity Navigator

This document distinguishes scientific reference resources from data and calculations actually used by the current public prototype.

## 1. NASA terrain reference products

### NASA GSFC PGDA Product 78 — LOLA South Pole Elevation Model

Official product page: https://pgda.gsfc.nasa.gov/products/78

Product 78 provides LOLA-derived lunar south-polar elevation products and associated ancillary layers. It is a principal reference for the project's intended laser-altimetry terrain workflow.

**Current implementation status:** The checked-in builder does not load the original Product 78 GeoTIFF files. Product 78 is cited as a scientific reference; the current scenario bundle is generated from parameterised synthetic terrain.

### NASA GSFC PGDA Product 104 — LROC NAC Shape-from-Shading Elevation Model

Official product page: https://pgda.gsfc.nasa.gov/products/104

Product 104 provides LROC NAC-derived south-polar Shape-from-Shading elevation products. Its processing is tied to an a priori LOLA terrain model and retains the LOLA geodetic reference. It should therefore be described as a complementary optical terrain reconstruction, not as a wholly independent measurement from LOLA.

Related archive: https://doi.org/10.5281/zenodo.17954508

**Current implementation status:** The checked-in builder does not load the original Product 104 GeoTIFF files. Product 104 is cited as a scientific reference; the current scenario bundle is generated from parameterised synthetic terrain.

## 2. Current computational data provenance

The current public application loads a precomputed JSON scenario bundle. The checked-in Python builder constructs deterministic, parameterised terrain surfaces and derives paired horizon and scenario data from those synthetic surfaces.

Accordingly:

- The terrain surfaces in the current demonstration are synthetic.
- The paired terrain comparison demonstrates a computational workflow; it is not a measured Product 78 versus Product 104 raster comparison.
- Scenario-specific terrain differences, horizon obstructions, illumination intervals and decision reversals are outputs of the synthetic benchmark.
- Such outputs must not be presented as empirical discoveries from NASA source rasters.

## 3. Ephemeris provenance

The checked-in scenario-generation code uses mathematical trajectories to populate the demonstration bundle. It does not currently issue live requests to the JPL Horizons API and does not demonstrate an integrated NAIF SPICE-kernel workflow.

Reference resources for future independently validated ephemeris integration:

- NASA JPL Horizons: https://ssd.jpl.nasa.gov/horizons/
- NASA Navigation and Ancillary Information Facility (NAIF): https://naif.jpl.nasa.gov/naif/

These are reference resources, not claims of current runtime integration.

## 4. Coordinate and geometry conventions

The prototype uses geometric terrain-horizon calculations, spherical geometry and local observer-relative coordinate transformations. Any future integration of source rasters or external ephemerides must explicitly document:

- Source coordinate reference systems and map projections.
- Lunar body-fixed frame and orientation model.
- Time scale and ephemeris version.
- Raster registration, pixel spacing, nodata treatment and interpolation.
- Observer location and height conventions.
- Solar-disc and surface-panel orientation assumptions.

No specific live ephemeris correction or external frame-conversion validation is claimed by the current synthetic benchmark.

## 5. Decision classifications

The application exposes PASS, FAIL and UNKNOWN states and identifies disagreement between paired model assessments. This is a three-state decision scheme. The implementation should not be described as a complete formal implementation of Strong Kleene three-valued logic unless that algebra is explicitly implemented and tested.

A model disagreement indicates sensitivity to the compared representations; it does not by itself establish which representation is more accurate or whether a site is operationally safe.

## 6. Validation status and limitations

The repository contains four pytest test functions addressing analytical properties of the synthetic pipeline, including spherical-horizon behaviour, synthetic ridge geometry, azimuthal sampling and JSON bundle structure.

These tests do not establish:

- Successful ingestion or validation of original NASA terrain rasters.
- Agreement with live JPL Horizons or NAIF SPICE outputs.
- Empirical confirmation of any specific lunar blackout duration or ridge measurement.
- Complete radio-frequency communications availability.
- Mission-grade landing-site safety.

## 7. Planned validation pathway

Future work should replace the synthetic benchmark with documented NASA raster inputs, preserve source metadata, validate coordinate transformations and independently reproduce ephemerides. Terrain-model uncertainty should then be propagated through horizon, illumination and visibility calculations before quantitative conclusions are described as empirical.

**Provenance principle:** SHADOWLINE distinguishes reference data, synthetic demonstration inputs, computed outputs and future integrations. This distinction is necessary for reproducible and scientifically responsible interpretation.
