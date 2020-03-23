import { Shape } from './Shape';
import { cacheShape } from './writeShape';
import { readFile } from '@jsxcad/sys';

export const readShape = async (path, build, { ephemeral = false, src } = {}) => {
  let data = await readFile({ ephemeral }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ sources: [src], ephemeral }, `cache/${path}`);
  }
  if (data === undefined && build !== undefined) {
    const shape = await build();
    if (!ephemeral) {
      await cacheShape(shape, `cache/${path}`);
    }
    return shape;
  }
  return Shape.fromGeometry(data);
};

export default readShape;
