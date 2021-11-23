import { Raycaster, Vector2 } from 'three';

let raycaster = new Raycaster();

export const getRaycaster = () => raycaster;

export const raycast = (x, y, camera, objects) => {
  const raycaster = getRaycaster();
  const position = new Vector2(x, y);
  raycaster.setFromCamera(position, camera);
  const intersects = raycaster.intersectObjects(objects, true);

  for (const { face, object, point } of intersects) {
    if (!object.userData.tangible) {
      continue;
    }
    if (!face) {
      break;
    }
    const { normal } = face;
    const ray = [
      [point.x, point.y, point.z],
      [normal.x, normal.y, normal.z],
    ];
    return { ray, object };
  }

  return {};
};
