import { Empty } from './Empty';
import Shape from '@jsxcad/api-v1-shape';

export const Union = (...args) => Empty().add(...args);

const UnionMethod = function (...args) { return Union(this, ...args); };
Shape.prototype.Union = UnionMethod;

export default Union;
