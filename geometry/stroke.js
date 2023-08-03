import { Arc } from './Arc.js';
import { ConvexHull } from './convexHull.js';
import { Fuse } from './fuse.js';
import { Group } from './Group.js';
import { toCoordinatePairList } from './eachSegment.js';
import { translate } from './translate.js';

export const Stroke = (geometries, width) => {
  const arc = Arc([width, width, 0]);
  const hulls = [];
  for (const [source, target] of toCoordinatePairList(Group(geometries))) {
    hulls.push(ConvexHull([translate(arc, source), translate(arc, target)]));
  }
  return Fuse(hulls);
};
