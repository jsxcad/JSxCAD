import { toDisjointGeometry } from './toDisjointGeometry';

export const toComponents = (options = {}, geometry) => {
  throw Error('die');
  const components = [];
  const walk = (item) => {
    if (item.assembly) {
      item.assembly.map(walk);
    } else if (item.disjointAssembly) {
      item.disjointAssembly.map(walk);
    } else {
      components.push(item);
    }
  };
  walk(toDisjointGeometry(geometry));
  return components;
};
