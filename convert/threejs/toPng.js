import * as THREE from 'three';

import GL from 'gl';
import { buildMeshes } from './mesh';
import { encode } from 'fast-png';
import { toKeptGeometry } from '@jsxcad/geometry-tagged';
import { toThreejsGeometry } from './toThreejsGeometry';

export const toPng = async ({ view = {}, pageSize = [256, 256], grid = false }, geometry) => {
  const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 1, 1], near = 1, far = 3500 } = view;
  const [width, height] = pageSize;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(13, width / height, near, far);
  [camera.position.x, camera.position.y, camera.position.z] = position;
  camera.up = new THREE.Vector3(...up);
  camera.lookAt(...target);
  scene.add(camera);

  const canvas = {};
  canvas.addEventListener = () => undefined;

  const renderer = new THREE.WebGLRenderer({ antialias: true, width, height, canvas, context: GL(width, height) });

  const threejsGeometry = toThreejsGeometry(toKeptGeometry(geometry));
  const datasets = [];
  buildMeshes({ datasets, threejsGeometry, scene });

  renderer.render(scene, camera);
  const gl = renderer.getContext();

  const data = new Uint8Array(4 * width * height);

  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

  const pngData = encode({ width, height, data, depth: 8, channels: 4 });

  return pngData;
};
