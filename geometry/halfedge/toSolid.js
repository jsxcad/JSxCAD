import eachLink from './eachLink';
import pushConvexPolygons from './pushConvexPolygons';

const walked = Symbol('walked');

/*
const pushPolygon = (polygons, loop) => {
  const polygon = [];
  eachLink(loop, link => polygon.push(link.start));
  polygons.push(polygon);
};
*/

// FIX: Coplanar surface coherence.
export const toSolid = (loops, selectJunction) => {
  const solid = [];

  const walk = (loop) => {
    if (loop === undefined || loop[walked] || loop.face === undefined) return;
    eachLink(loop, (link) => { link[walked] = true; });
    eachLink(loop, (link) => walk(link.twin));
    const polygons = [];
    pushConvexPolygons(polygons, loop, selectJunction);
    // pushPolygon(polygons, loop);
    solid.push(polygons);
  };

  walk(loops[0]);

  return solid;
};

export default toSolid;
