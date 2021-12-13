import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import { Raycaster, Vector2 } from 'three';

let geometryRaycaster = new Raycaster();
geometryRaycaster.layers.set(GEOMETRY_LAYER);
export const getGeometryRaycaster = () => geometryRaycaster;

let sketchRaycaster = new Raycaster();
sketchRaycaster.layers.set(SKETCH_LAYER);
export const getSketchRaycaster = () => sketchRaycaster;

const cast = (raycaster, position, camera, objects) => {
  raycaster.setFromCamera(position, camera);
  const intersects = raycaster.intersectObjects(objects, true);

  for (const { face, object, point } of intersects) {
    if (!object.userData.tangible) {
      continue;
    }
    if (face) {
      const { normal } = face;
      const ray = [
        [point.x, point.y, point.z],
        [normal.x, normal.y, normal.z],
      ];
      return { ray, object };
    } else {
      return { point, object };
    }
  }
};

export const raycast = (x, y, camera, objects) => {
  const position = new Vector2(x, y);
  return (
    cast(sketchRaycaster, position, camera, objects) ||
    cast(geometryRaycaster, position, camera, objects) ||
    {}
  );
};
