import Spiral from './Spiral';

export const ofRadius = (radius, angle = 360, { start = 0, sides = 32 } = {}) =>
  Spiral(a => [[radius]], { from: start, to: start + angle, resolution: sides });

export const Arc = (...args) => ofRadius(...args);
Arc.ofRadius = ofRadius;

export default Arc;
