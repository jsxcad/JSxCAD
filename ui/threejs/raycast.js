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

  for (const { face, point } of intersects) {
    const { normal } = face;
    const segment = [
      [point.x, point.y, point.z],
      [point.x + normal.x, point.y + normal.y, point.z + normal.z],
    ];
    return { segment };
  }

  return {};
};
