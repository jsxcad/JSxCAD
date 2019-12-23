import Shape from './Shape';
import { canonicalize as canonicalizeGeometry } from '@jsxcad/geometry-tagged';

export const canonicalize = (shape) => Shape.fromGeometry(canonicalizeGeometry(shape.toGeometry()));

const canonicalizeMethod = function () { return canonicalize(this); }
Shape.prototype.canonicalize = canonicalizeMethod;

export default canonicalize;
