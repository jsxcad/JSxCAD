import { Box3, Vector3 } from 'three';

export const moveToFit = ({
  view,
  camera,
  controls,
  scene,
  fitOffset = 1.2,
} = {}) => {
  const { fit = true } = view;

  if (!fit) {
    return;
  }

  const box = new Box3();
  box.setFromObject(scene);
  // for( const object of selection ) box.expandByObject( object );

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
