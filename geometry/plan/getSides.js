export const getSides = (plan) => {
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
