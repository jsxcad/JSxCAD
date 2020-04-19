import toPolygons from './toPolygons';

const walked = Symbol('walked');

// FIX: Coplanar surface coherence.
export const toSolid = (loops) => {
  const solid = [];

  const walk = (loop) => {
    if (loop === undefined || loop[walked]) return;
    let link = loop;
    do {
      link[walked] = true;
      link = link.next;
    } while (link !== loop);
    const path = [];
    do {
      path.push(link.start);
      walk(link.twin);
      link = link.next;
    } while (link !== loop);
    solid.push([path]);
  }

  walk(loops[0]);

  return solid;
};

export default toSolid;
