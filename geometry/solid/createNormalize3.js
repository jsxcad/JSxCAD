// The resolution is 1 / multiplier.
const multiplier = 1e5;

const X = 0;
const Y = 1;
const Z = 2;

export const createNormalize3New = () => {
  const map = new Map();
  const normalize3 = (coordinate) => {
    // Apply a spatial quantization to the 4 dimensional coordinate.
    const nx = Math.round(coordinate[X] * multiplier);
    const ny = Math.round(coordinate[Y] * multiplier);
    const nz = Math.round(coordinate[Z] * multiplier);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = Math.floor(coordinate[X] * multiplier);
    const ny0 = Math.floor(coordinate[Y] * multiplier);
    const nz0 = Math.floor(coordinate[Z] * multiplier);
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    const normalized = coordinate;
    map.set(`${nx0}/${ny0}/${nz0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize3;
};

export const createNormalize3 = () => {
  const map = new Map();
  const normalize3 = (coordinate) => {
    // Apply a spatial quantization to the 3 dimensional coordinate.
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
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    // Populate the space of the quantized coordinate and its adjacencies.
    // const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier];
    const normalized = coordinate;
    map.set(`${nx0}/${ny0}/${nz0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}`, normalized);
    // This is now the normalized coordinate for this region.
    return normalized;
  };
  return normalize3;
};
