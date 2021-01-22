import { visit } from './visit.js';

const registry = new Map();

// The plan is destructively updated with the reification as its content.
// This should be safe as reification is idempotent.
export const reify = (geometry) => {
  if (geometry.type === 'plan' && geometry.content.length > 0) {
    return geometry;
  }
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
        if (geometry.content.length === 0) {
          // This plan is not reified, generate content.
          const reifier = registry.get(geometry.plan.type);
          if (reifier === undefined) {
            throw Error(
              `Do not know how to reify plan: ${JSON.stringify(geometry.plan)}`
            );
          }
          geometry.content = [reifier(geometry)];
        }
        return descend();
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

  visit(geometry, op);

  return geometry;
};

// We expect the type to be uniquely qualified.
export const registerReifier = (type, reifier) => registry.set(type, reifier);
