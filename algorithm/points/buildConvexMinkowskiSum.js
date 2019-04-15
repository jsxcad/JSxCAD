import msum from 'convex-minkowski-sum';

export const buildConvexMinkowskiSum = (options = {}, a, b) => msum(a, b);
