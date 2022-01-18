import { rewrite } from './visit.js';

export const registry = new Map();

export const reify = (geometry) => {
  if (!geometry) {
    console.log(`Reifying undefined geometry`);
  }
  if (geometry.type === 'plan' && geometry.content.length > 0) {
    return geometry;
  }
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
      case 'triangles':
      case 'points':
      case 'segments':
      case 'paths':
      case 'polygonsWithHoles':
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
          // We can't share the reification since things like tags applied to the plan need to propagate separately.
          return descend({ content: [reified] });
        }
        return geometry;
      }
      case 'displayGeometry':
        // CHECK: Should this taint the results if there is a plan?
        return geometry;
      case 'item':
      case 'group':
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
