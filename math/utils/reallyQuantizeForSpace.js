const spatialResolution = 1e5;

// Quantize values for use in spatial coordinates, and so on, even if the usual quantizeForSpace is disabled.
const reallyQuantizeForSpace = (value) => (Math.round(value * spatialResolution) / spatialResolution);

module.exports = reallyQuantizeForSpace;
