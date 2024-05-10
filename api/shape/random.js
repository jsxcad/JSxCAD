import Prando from 'prando';
import Shape from './Shape.js';

export const random = Shape.registerMethod3(
  'random',
  ['inputGeometry', 'function', 'number', 'number', 'number'],
  (geometry) => geometry,
  async (
    geometry,
    [_, op = () => (s) => s, count = 1, offset = 0, seed = 0xffff]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const values = [];
    const r = new Prando(seed);
    r.skip(offset * count);
    for (let nth = 0; nth < count; nth++) {
      values.push(r.next());
    }
    const result = await op(...values)(input);
    return result;
  }
);
