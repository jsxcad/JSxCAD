import Group from './Group.js';
import Shape from './Shape.js';
import { fuse } from '@jsxcad/geometry';

export const Join = Shape.registerShapeMethod('Join', async (...shapes) => {
  const group = await Group(...shapes);
  return Shape.fromGeometry(fuse(await group.toGeometry()));
});

export default Join;
