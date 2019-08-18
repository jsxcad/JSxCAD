// The resolution is 1 / multiplier.
const multiplier = 1e5;

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

export const createNormalize4 = () => {
  const map = new Map();
  const normalize4 = (coordinate) => {
    // Apply a spatial quantization to the 4 dimensional coordinate.
    const nx = Math.floor(coordinate[X] * multiplier - 0.5);
    const ny = Math.floor(coordinate[Y] * multiplier - 0.5);
    const nz = Math.floor(coordinate[Z] * multiplier - 0.5);
    const nw = Math.floor(coordinate[W] * multiplier - 0.5);
    // Look for an existing inhabitant.
    const value = map.get(`${nx}/${ny}/${nz}/${nw}`);
    if (value !== undefined) {
      return value;
    }
    // One of the ~0 or ~1 values will match the rounded values above.
    // The other will match the adjacent cell.
    const nx0 = nx;
    const ny0 = ny;
    const nz0 = nz;
    const nw0 = nw;
    const nx1 = nx0 + 1;
    const ny1 = ny0 + 1;
    const nz1 = nz0 + 1;
    const nw1 = nw0 + 1;
    // Populate the space of the quantized value and its adjacencies.
    const normalized = [nx1 / multiplier, ny1 / multiplier, nz1 / multiplier, nw1 / multiplier];
    map.set(`${nx0}/${ny0}/${nz0}/${nw0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz0}/${nw1}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}/${nw0}`, normalized);
    map.set(`${nx0}/${ny0}/${nz1}/${nw1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}/${nw0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz0}/${nw1}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}/${nw0}`, normalized);
    map.set(`${nx0}/${ny1}/${nz1}/${nw1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}/${nw0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz0}/${nw1}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}/${nw0}`, normalized);
    map.set(`${nx1}/${ny0}/${nz1}/${nw1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}/${nw0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz0}/${nw1}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}/${nw0}`, normalized);
    map.set(`${nx1}/${ny1}/${nz1}/${nw1}`, normalized);
    // This is now the normalized value for this region.
    return normalized;
  };
  return normalize4;
};
