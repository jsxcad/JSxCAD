import { Shape, fromGeometry, toGeometry } from './Shape';

import { nonNegative } from '@jsxcad/geometry-tagged';

/**
 *
 * # Mark an object as not to cut holes.
 *
 **/

export const nocut = (shape, ...tags) => fromGeometry(nonNegative(tags.map(tag => `user/${tag}`), toGeometry(shape)));

const nocutMethod = function (...tags) { return nocut(this, tags); };
Shape.prototype.nocut = nocutMethod;

export default nocut;

nocut.signature = 'nocut(shape:Shape, ...tag:string) -> Shape';
nocutMethod.signature = 'Shape -> nocut(...tag:string) -> Shape';
