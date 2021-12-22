import { logInfo, writeNonblocking } from '@jsxcad/sys';

export const writeShapeCache = (name, args, shape) => {
  const key = `${name}/${JSON.stringify(args)}`;
  writeNonblocking(key, shape.toGeometry());
  logInfo('api/shape/writeShapeCache', key);
  return shape;
};
