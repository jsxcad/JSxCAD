import {
  Box3,
  Frustum,
  GridHelper,
  LineSegments,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Shape,
  Vector3,
} from '@jsxcad/algorithm-threejs';
import { GEOMETRY_LAYER } from './layers.js';

export const moveToFit = ({
  view,
  camera,
  controls = [],
  scene,
  fitOffset = 1.2,
  withGrid = false,
  gridLayer = GEOMETRY_LAYER,
  pageSize = [],
  gridState = { objects: [], visible: withGrid },
} = {}) => {
  const { fit = true } = view;
  const [length = 100, width = 100] = pageSize;

  let box;

  scene.traverse((object) => {
    if (object instanceof GridHelper) {
      return;
    }
    if (object.userData.tags && object.userData.tags.includes('type:ghost')) {
      return;
    }
    if (
      object instanceof LineSegments ||
      object instanceof Mesh ||
      object instanceof Shape
    ) {
      const objectBox = new Box3();
      objectBox.setFromObject(object);
      if (
        !isFinite(objectBox.max.x) ||
        !isFinite(objectBox.max.y) ||
        !isFinite(objectBox.max.z) ||
        !isFinite(objectBox.min.x) ||
        !isFinite(objectBox.min.y) ||
        !isFinite(objectBox.min.z)
      ) {
        return;
      }
      if (box) {
        box = box.union(objectBox);
      } else {
        box = objectBox;
      }
    }
  });

  while (gridState.objects.length > 0) {
    const object = gridState.objects.pop();
    if (object.parent) {
      object.parent.remove(object);
    }
  }

  if (!box) {
    box = new Box3();
    box.setFromObject(scene);
  }

  if (withGrid) {
    const x = Math.max(Math.abs(box.min.x), Math.abs(box.max.x));
    const y = Math.max(Math.abs(box.min.y), Math.abs(box.max.y));
    const length = Math.max(x, y);
    const scale = Math.pow(10, Math.ceil(Math.log10(length)));
    const size = scale;
    {
      const grid = new GridHelper(size / 2, 50, 0x000040, 0x20a020);
      grid.material.transparent = true;
      grid.material.opacity = 0.5;
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.1);
      grid.layers.set(gridLayer);
      grid.userData.tangible = false;
      grid.userData.dressing = true;
      grid.userData.grid = true;
      scene.add(grid);
      gridState.objects.push(grid);
    }
    {
      const grid = new GridHelper(size * 2, 20, 0x000040, 0xf04040);
      grid.material.transparent = true;
      grid.material.opacity = 0.5;
      grid.rotation.x = -Math.PI / 2;
      grid.position.set(0, 0, -0.05);
      grid.layers.set(gridLayer);
      grid.userData.tangible = false;
      grid.userData.dressing = true;
      grid.userData.grid = true;
      scene.add(grid);
      gridState.objects.push(grid);
    }
  }
  if (withGrid) {
    const plane = new Mesh(
      new PlaneGeometry(length, width),
      new MeshStandardMaterial({
        color: 0x00ff00,
        // depthWrite: false,
        transparent: true,
        opacity: 0.25,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.position.set(0, 0, -0.05);
    plane.layers.set(gridLayer);
    plane.userData.tangible = false;
    plane.userData.dressing = true;
    plane.userData.grid = true;
    scene.add(plane);
    gridState.objects.push(plane);
  }

  if (!fit) {
    return;
  }

  for (const control of controls) {
    control.reset();
  }

  const target = new Vector3(0, 0, 0);

  const points = [
    new Vector3(box.min.x, box.min.y, box.min.z),
    new Vector3(box.max.x, box.min.y, box.min.z),
    new Vector3(box.min.x, box.max.y, box.min.z),
    new Vector3(box.max.x, box.max.y, box.min.z),
    new Vector3(box.min.x, box.min.y, box.max.z),
    new Vector3(box.max.x, box.min.y, box.max.z),
    new Vector3(box.min.x, box.max.y, box.max.z),
    new Vector3(box.max.x, box.max.y, box.max.z),
  ];

  // Back the camera off by 1mm at a time until the bounding box is contained by
  // the frustrum.
  // CHECK: Use a binary search if this becomes a latency problem.
  for (let distance = 1; ; distance += 1) {
    const direction = target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance);

    camera.position.copy(target).sub(direction);

    camera.near = distance / 100;
    camera.far = distance * 100;

    camera.updateMatrix();
    camera.updateMatrixWorld();

    const frustum = new Frustum();
    frustum.setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );

    if (points.every((point) => frustum.containsPoint(point))) {
      break;
    }
  }
};
