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
) => (length, depth) =>
  BenchPlane(length, {
    toolDiameter,
    cutDepth,
    axialRate,
    millingStyle,
    sweep,
  })(width, depth).moveX(-width);

export default BenchSaw;
