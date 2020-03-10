import { Shape } from './Shape';
import { cacheShape } from './writeShape';
import { readFile } from '@jsxcad/sys';

export const readShape = async (path, build, { ephemeral = false, src } = {}) => {
  let data = await readFile({ as: 'utf8', ephemeral }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ as: 'utf8', sources: [src], ephemeral }, `cache/${path}`);
  }
  if (data === undefined && build !== undefined) {
    const shape = await build();
    if (!ephemeral) {
      await cacheShape(shape, `cache/${path}`);
    }
    return shape;
  }
  const geometry = JSON.parse(data);
  return Shape.fromGeometry(geometry);
};

export default readShape;
