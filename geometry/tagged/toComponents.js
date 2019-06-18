import { toDisjointGeometry } from './toDisjointGeometry';

export const toComponents = (options = {}, geometry) => {
  const components = [];
  const walk = (item) => {
    if (item.assembly) {
      item.assembly.map(walk);
    } else {
      components.push(item);
    }
  };
  walk(toDisjointGeometry(geometry));
  return components;
};
