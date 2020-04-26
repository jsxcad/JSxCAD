import toPolygons from './toPolygons';

// FIX: Coplanar surface coherence.
export const toSolid = (loops) => {
  const solid = [];
  for (const polygon of toPolygons(loops)) {
    solid.push([polygon]);
  }
  return solid;
};

export default toSolid;
