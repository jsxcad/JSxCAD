import { BoxGeometry, Mesh } from 'three';

export const addVoxel = ({ editId, point, scene, threejsMesh }) => {
  const box = new BoxGeometry(1, 1, 1);
  const mesh = new Mesh(box, threejsMesh.material);
  mesh.userData.editId = editId;
  mesh.userData.ephemeral = true;
  mesh.userData.tangible = true;
  mesh.position.set(...point);
  scene.add(mesh);
};
