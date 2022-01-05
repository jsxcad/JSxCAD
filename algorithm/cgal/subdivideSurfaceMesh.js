import { getCgal } from './getCgal.js';

const toIndexFromMethod = (method) => {
  switch (method) {
    case 'CatmullClark':
      return 0;
    case 'DooSabin':
      return 1;
    case 'Loop':
      return 3;
    case 'Sqrt3':
      return 7;
    default:
      throw Error(`Unknown subdivision method ${method}`);
  }
};

export const subdivideSurfaceMesh = (mesh, options) => {
  try {
    const { method, iterations = 1 } = options;
    return getCgal().SubdivideSurfaceMesh(
      mesh,
      toIndexFromMethod(method),
      iterations
    );
  } catch (error) {
    throw Error(error);
  }
};
