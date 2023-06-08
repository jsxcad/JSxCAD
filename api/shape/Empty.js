import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const Empty = Shape.registerMethod2('Empty', [], () =>
  Shape.fromGeometry(taggedGroup({}))
);

export default Empty;
