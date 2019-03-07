import { transform as transformOfVec3 } from '@jsxcad/math-vec3';

export const transform = (matrix, path) =>
                         path.map((point, index) => (point === null) ? null : transformOfVec3(matrix, point));
