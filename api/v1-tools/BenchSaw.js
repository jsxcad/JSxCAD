import BenchPlane from './BenchPlane.js';

export const BenchSaw = (
  width,
  { toolDiameter, cutDepth, axialRate, millingStyle = 'any' } = {}
) => (length, depth) =>
  BenchPlane(length, { toolDiameter, cutDepth, axialRate, millingStyle })(
    width,
    depth
  ).moveX(-width);

export default BenchSaw;
