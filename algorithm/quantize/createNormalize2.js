const X = 0;
const Y = 1;

// The resolution is 1 / multiplier.
export const createNormalize2 = (multiplier = 1e5) => {
  const map = new Map();
  const update = (key, value) => {
    if (!map.has(key)) {
      map.set(key, value);
    }
  };
  const normalize2 = (coordinate) => {
    // Apply a spatial quantization to the 2 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nx1 = nx + 1;
    const ny1 = ny + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    const normalized = coordinate;
    update(`${nx0}/${ny0}`, normalized);
    update(`${nx0}/${ny1}`, normalized);
    update(`${nx1}/${ny0}`, normalized);
    update(`${nx1}/${ny1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize2;
};
