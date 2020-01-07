const X = 0;
const Y = 1;
const Z = 2;

// The resolution is 1 / multiplier.
export const createNormalize3 = (multiplier = 1e5) => {
  const map = new Map();
  const update = (key, value) => {
    if (!map.has(key)) {
      map.set(key, value);
    }
  };
  const normalize3 = (coordinate) => {
    // Apply a spatial quantization to the 2 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nz0 = nz;
    const nx1 = nx + 1;
    const ny1 = ny + 1;
    const nz1 = nz + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    // const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier];
    normalized = coordinate;
    update(`${nx0}/${ny0}/${nz0}`, normalized);
    update(`${nx0}/${ny0}/${nz1}`, normalized);
    update(`${nx0}/${ny1}/${nz0}`, normalized);
    update(`${nx0}/${ny1}/${nz1}`, normalized);
    update(`${nx1}/${ny0}/${nz0}`, normalized);
    update(`${nx1}/${ny0}/${nz1}`, normalized);
    update(`${nx1}/${ny1}/${nz0}`, normalized);
    update(`${nx1}/${ny1}/${nz1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize3;
};
