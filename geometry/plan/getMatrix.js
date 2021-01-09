import { identityMatrix } from '@jsxcad/math-mat4';

export const getMatrix = (plan) => plan.matrix || identityMatrix;
