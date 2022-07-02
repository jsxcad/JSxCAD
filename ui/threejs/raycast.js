import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import {
  LineSegments,
  Points,
  Raycaster,
  Shape,
  Vector2,
} from '@jsxcad/algorithm-threejs';

let geometryRaycaster = new Raycaster();
geometryRaycaster.layers.set(GEOMETRY_LAYER);
export const getGeometryRaycaster = () => geometryRaycaster;

let sketchRaycaster = new Raycaster();
sketchRaycaster.layers.set(SKETCH_LAYER);
sketchRaycaster.params.Line.threshold = 0.2;
sketchRaycaster.params.Points.threshold = 0.2;
export const getSketchRaycaster = () => sketchRaycaster;

const precedence = (a) => {
  if (a.object instanceof Points) {
    return 3;
  } else if (a.object instanceof LineSegments) {
    return 2;
  } else if (a.object instanceof Shape) {
    return 1;
  } else {
    return 0;
  }
};

const order = (a, b) => {
  const delta = a.distance - b.distance;
  if (delta !== 0) {
    return delta;
  }
  return precedence(b) - precedence(a);
};

const cast = (raycaster, position, camera, objects, filter = (s) => true) => {
  raycaster.setFromCamera(position, camera);
  const intersects = raycaster.intersectObjects(objects, true).filter(filter);

  intersects.sort(order);

  for (const { face, object, point } of intersects) {
    if (!object.userData.tangible) {
      continue;
    }
    if (face) {
      const { normal } = face;
      return { point, normal, object };
    } else {
      return { point, object };
    }
  }
};

export const raycast = (x, y, camera, objects, filter) => {
  const position = new Vector2(x, y);
  return (
    cast(sketchRaycaster, position, camera, objects, filter) ||
    cast(geometryRaycaster, position, camera, objects, filter) ||
    {}
  );
};
