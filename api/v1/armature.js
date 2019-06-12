import { addInertia,
         createAngleConstraint,
         createDistanceConstraint,
         createPinnedConstraint,
         positions,
         solve,
         verlet } from '@jsxcad/algorithm-verlet';

/**
 *
 * # Armature
 *
 * Armature builds a set of points based on constraints.
 *
 * ::: illustration
 * ```
 * const { angle, compute, distance, pinned } = armature();
 * angle('A', 'B', 'C', 90);
 * distance('B', 'A', 20);
 * distance('B', 'C', 10);
 * const { A, B, C } = compute();
 * polygon(A, B, C).center();
 * ```
 * :::
 *
 **/

export const armature = () => {
  const constraints = verlet();
  addInertia(constraints);
  const angle = createAngleConstraint(constraints);
  const distance = createDistanceConstraint(constraints);
  const pinned = createPinnedConstraint(constraints);

  const compute = () => {
    solve(constraints);
    return positions(constraints);
  };

  return {
    angle,
    compute,
    distance,
    pinned
  };
};
