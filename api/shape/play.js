import Shape from './Shape.js';

export const play =
  (amount = 0.1) =>
  (shape) =>
    shape.grow(amount).void().and(shape);

Shape.registerMethod('play', play);
