import { Raycaster, Vector2 } from 'three';

let raycaster = new Raycaster();

export const raycast = (x, y, camera, scene) => {
  if (!raycaster) {
    raycaster = new Raycaster();
  }
  const position = new Vector2(x, y);
  raycaster.setFromCamera(position, camera);
  const intersects = raycaster.intersectObjects(
    scene.children.filter((item) => !item.userData.intangible)
  );

  for (const { face, object, point } of intersects) {
    const { userData } = object;
    const { normal } = face;
    const ray = [
      [point.x, point.y, point.z],
      [normal.x, normal.y, normal.z],
    ];
    return { ray, userData };
  }

  return {};
};
