import { build } from './build';
import { create } from './create';

export const fromPolygons = (options = {}, polygons) => {
  const bsp = create();
  // Build is destructive.
  build(bsp, polygons.map(polygon => polygon.slice()));
  return bsp;
};
