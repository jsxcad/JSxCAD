import { rewrite } from './visit.js';

const registry = new Map();

export const reify = (geometry) => {
  if (geometry.type === 'plan' && geometry.content.length > 0) {
    return geometry;
  }
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
      case 'triangles':
      case 'points':
      case 'paths':
        // No plan to realize.
        return geometry;
      case 'plan': {
        if (geometry.content.length === 0) {
          // This plan is not reified, generate content.
          const reifier = registry.get(geometry.plan.type);
          if (reifier === undefined) {
            throw Error(
              `Do not know how to reify plan: ${JSON.stringify(geometry.plan)}`
            );
          }
          const reified = reifier(geometry);
          geometry.content.push(reified);
          return descend();
        }
        return geometry;
      }
      case 'displayGeometry':
        // CHECK: Should this taint the results if there is a plan?
        return geometry;
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

  return rewrite(geometry, op);
};

// We expect the type to be uniquely qualified.
export const registerReifier = (type, reifier) => registry.set(type, reifier);
