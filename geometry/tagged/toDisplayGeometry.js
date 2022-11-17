import { soup } from './soup.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const toDisplayGeometry = (
  geometry,
  { triangles, outline = true, skin, wireframe = false } = {}
) => {
  // console.log(`QQ/toDisplayGeometry: ${JSON.stringify(geometry)} ${geometry.isChain}`);
  if (!geometry) {
    throw Error('die');
  }
  if (skin === undefined) {
    skin = triangles;
  }
  if (skin === undefined) {
    skin = true;
  }
  console.log(`QQ/toDisplayGeometry: ${'' + geometry}`);
  return soup(toConcreteGeometry(geometry), {
    doTriangles: skin,
    doOutline: outline,
    doWireframe: wireframe,
  });
};
