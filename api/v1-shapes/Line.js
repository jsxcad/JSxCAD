import Path from './Path.js';

export const Line = (length) => Path([0, 0, length / -2], [0, 0, length / 2]);
export default Line;

Line.signature = 'Line(length:number) -> Shape';
