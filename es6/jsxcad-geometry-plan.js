const apothem = (
  apothem = 1,
  { center = [0, 0, 0], sides = 32 } = {}
) => {
  return {
    type: 'apothem',
    center,
    apothem,
    sides,
  };
};

const corners = (right = 0, back = 0, left = 0, front = 0) => {
  if (left > right) [left, right] = [right, left];
  if (front > back) [front, back] = [back, front];
  const center = [(left + right) / 2, (front + back) / 2, 0];
  return {
    type: 'corners',
    left,
    right,
    back,
    front,
    center,
  };
};

const diameter = (
  diameter = 1,
  { center = [0, 0, 0], sides = 32 } = {}
) => {
  return {
    type: 'diameter',
    center,
    diameter,
    sides,
  };
};

const radius = (radius = 1, { center = [0, 0, 0], sides = 32 } = {}) => {
  return {
    type: 'radius',
    center,
    radius,
    sides,
  };
};

const getSides = (plan) => {
  switch (plan.type) {
    case 'radius':
    case 'apothem':
    case 'diameter':
      return plan.sides;
    default: {
      const { sides = 32 } = plan;
      return sides;
    }
  }
};

const toRadiusFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const getRadius = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'apothem':
      return toRadiusFromApothem(plan.apothem, getSides(plan));
    case 'diameter':
      return plan.diameter / 2;
    case 'radius':
      return plan.radius;
  }
};

const getBack = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.back;
    default:
      return -getRadius(plan);
  }
};

const getBottom = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    default:
      return -getRadius(plan);
  }
};

const getCenter = (plan) => {
  if (typeof plan === 'number') {
    return [0, 0, 0];
  }
  return plan.center || [0, 0, 0];
};

const getFront = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.front;
    default:
      return getRadius(plan);
  }
};

const getLeft = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.left;
    default:
      return -getRadius(plan);
  }
};

const getRight = (plan) => {
  if (typeof plan === 'number') {
    return plan;
  }
  switch (plan.type) {
    case 'corners':
      return plan.right;
    default:
      return getRadius(plan);
  }
};

const getTop = (plan) => {
  if (typeof plan === 'number') {
    return -plan;
  }
  switch (plan.type) {
    default:
      return -getRadius(plan);
  }
};

export { apothem, corners, diameter, getBack, getBottom, getCenter, getFront, getLeft, getRadius, getRight, getSides, getTop, radius };
