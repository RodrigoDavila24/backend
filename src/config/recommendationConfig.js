const { numberFromEnv } = require('./importConfig');
const { shadowConfig } = require('./shadowConfig');

// Thresholds of the recommended route (PBI-9.1). Every value is explained in ADR-029 (workspace
// docs/DECISIONS.md) and was confirmed by the product owner on 2026-11-12.
const recommendationConfig = {
  // Apparent temperature (or the air temperature if the provider does not send it), in °C. They are
  // the limits of the "no thermal stress" band of the UTCI (9 to 26 °C).
  hotApparentTemperatureC: numberFromEnv('RECOMMENDATION_HOT_APPARENT_TEMPERATURE_C', 26),
  coldApparentTemperatureC: numberFromEnv('RECOMMENDATION_COLD_APPARENT_TEMPERATURE_C', 9),
  // Strong wind: mean speed from Beaufort 5 or gusts, in km/h. Either of the two is enough.
  windSpeedKmh: numberFromEnv('RECOMMENDATION_WIND_SPEED_KMH', 30),
  windGustsKmh: numberFromEnv('RECOMMENDATION_WIND_GUSTS_KMH', 50),
  // Weight of wind when it is strong: there is no wind preset; 50 like the shade and sun presets.
  windWeight: numberFromEnv('RECOMMENDATION_WIND_WEIGHT', 50),
  // Directions (where the wind comes from) that the reason calls "cierzo". Only the text changes.
  cierzoFromDeg: numberFromEnv('RECOMMENDATION_CIERZO_FROM_DEG', 270),
  cierzoToDeg: numberFromEnv('RECOMMENDATION_CIERZO_TO_DEG', 340),
  // Below this solar elevation no shadows are projected (ADR-015): neither shade nor sun is sought.
  minSunElevationDeg: shadowConfig.minSunElevationDeg
};

module.exports = { recommendationConfig };
