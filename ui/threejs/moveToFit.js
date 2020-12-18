import { Box3, GridHelper, LineSegments, Mesh, Vector3 } from 'three';

export const moveToFit = ({
  view,
  camera,
  controls,
  scene,
  fitOffset = 1.2,
  withGrid = false,
} = {}) => {
  const { fit = true } = view;

  if (!fit) {
    return;
  }

  let box;

  scene.traverse((object) => {
    if (object instanceof GridHelper) {
      return;
    }
    if (object instanceof LineSegments || object instanceof Mesh) {
      const objectBox = new Box3();
      objectBox.setFromObject(object);
      if (box) {
        box = box.union(objectBox);
      } else {
        box = objectBox;
      }
    }
  });

  if (!box) {
    box = new Box3();
    box.setFromObject(scene);
  }

  if (withGrid) {
    const x = Math.max(Math.abs(box.min.x), Math.abs(box.max.x));
    const y = Math.max(Math.abs(box.min.y), Math.abs(box.max.y));
    const length = Math.max(x, y);
    // This is how large we want the smallest grid to be.
    const scale = Math.pow(10, Math.ceil(Math.log10(length)));
    const size = scale;
    {
      const grid = new GridHelper(size * 2, 200, 0x000080, 0xc0f0c0);
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.002);
      grid.layers.set(1);
      scene.add(grid);
    }
    {
      const grid = new GridHelper(size * 2, 20, 0x000080, 0xc0c0f0);
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.001);
      grid.layers.set(1);
      scene.add(grid);
    }
  }

  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / (camera.aspect || 1);
  const zoomOut = 1;
  const distance =
    fitOffset * Math.max(fitHeightDistance, fitWidthDistance) * zoomOut;

  // const target = controls ? controls.target.clone() : center.clone();
  const target = center;

  const direction = target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(center).sub(direction);

  if (controls) {
    controls.update();
  }
};
