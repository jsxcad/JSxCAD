import { rewrite } from './visit.js';

const reifiedGeometry = Symbol('reifiedGeometry');

// FIX: The reified geometry should be the content of the plan.
export const reify = (geometry) => {
  if (geometry[reifiedGeometry] === undefined) {
    const op = (geometry, descend) => {
      switch (geometry.type) {
        case 'graph':
        case 'solid':
        case 'z0Surface':
        case 'surface':
        case 'points':
        case 'paths':
          // No plan to realize.
          return geometry;
        case 'plan': {
          const reifier = reify[geometry.plan.type];
          if (reifier === undefined) {
            throw Error(
              `Do not know how to reify plan: ${JSON.stringify(geometry.plan)}`
            );
          }
          return reify(reifier(geometry));
        }
        case 'assembly':
        case 'item':
        case 'disjointAssembly':
        case 'layers':
        case 'layout':
        case 'sketch':
        case 'transform':
          return descend();
        default:
          throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
      }
    };

    geometry[reifiedGeometry] = rewrite(geometry, op);
  }
  return geometry[reifiedGeometry];
};
