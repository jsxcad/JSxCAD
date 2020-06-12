import { ensureParticle } from "./ensureParticle";
import { subtract } from "@jsxcad/math-vec3";

const angle = ([ax, ay], [bx, by]) =>
  Math.atan2(ax * by - ay * bx, ax * bx + ay * by);

const angle2 = (pivot, left, right) =>
  angle(subtract(left, pivot), subtract(right, pivot));

const rotate = ([pointX, pointY], [originX, originY], theta) => {
  const x = pointX - originX;
  const y = pointY - originY;
  return [
    x * Math.cos(theta) - y * Math.sin(theta) + originX,
    x * Math.sin(theta) + y * Math.cos(theta) + originY,
    0,
  ];
};

const relax = ({ pivot, left, right, radians, stiffness }, stepCoefficient) => {
  const currentRadians = angle2(pivot.position, left.position, right.position);
  let diff = currentRadians - radians;

  if (diff <= -Math.PI) {
    diff += 2 * Math.PI;
  } else if (diff >= Math.PI) {
    diff -= 2 * Math.PI;
  }

  diff *= stepCoefficient * stiffness;

  left.position = rotate(left.position, pivot.position, diff);
  right.position = rotate(right.position, pivot.position, -diff);
  pivot.position = rotate(pivot.position, left.position, diff);
  pivot.position = rotate(pivot.position, right.position, -diff);
};

export const create = ({ constraints, ids, particles }) => {
  const constrain = (left, pivot, right, angle, stiffness = 0.5) => {
    constraints.push({
      pivot: ensureParticle(ids, particles, pivot),
      left: ensureParticle(ids, particles, left),
      right: ensureParticle(ids, particles, right),
      stiffness,
      radians: (angle * Math.PI) / 180,
      relax,
    });
  };
  return constrain;
};
