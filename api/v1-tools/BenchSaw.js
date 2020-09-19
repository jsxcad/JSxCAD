import BenchPlane from './BenchPlane.js';

export const BenchSaw = (
  width,
  {
    toolDiameter,
    cutDepth,
    axialRate,
    millingStyle = 'any',
    sweep = 'cut',
  } = {}
) => (length, depth, { x = 0, y = 0, z = 0 }) =>
  BenchPlane(length, {
    toolDiameter,
    cutDepth,
    axialRate,
    millingStyle,
    sweep,
  })(width, depth, { x, y, z }).moveX(-width);

export default BenchSaw;
