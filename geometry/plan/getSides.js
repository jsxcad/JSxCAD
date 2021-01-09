export const getSides = (plan, value = 32) => {
  switch (plan.type) {
    case 'edge':
    case 'radius':
    case 'apothem':
    case 'diameter':
      return plan._sides;
    default: {
      const { sides = value } = plan;
      return sides;
    }
  }
};
