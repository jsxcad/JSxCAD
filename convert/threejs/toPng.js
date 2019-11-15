import * as THREE from 'three';

import GL from 'gl';
import { buildMeshes } from './mesh';
import { encode } from 'fast-png';
import { toKeptGeometry } from '@jsxcad/geometry-tagged';
import { toThreejsGeometry } from './toThreejsGeometry';

export const toPng = async ({ view = {}, pageSize = [256, 256], grid = false }, geometry) => {
  const { target = [0, 0, 0], position = [40, 40, 40], up = [0, 0, 1], near = 1, far = 3500 } = view;
  const [width, height] = pageSize;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(27, width / height, near, far);
  [camera.position.x, camera.position.y, camera.position.z] = position;
  camera.up = new THREE.Vector3(...up);
  camera.lookAt(...target);
  scene.add(camera);

  if (grid) {
    const grid = new THREE.GridHelper(100, 10, 'green', 'blue');
    grid.material = new THREE.LineBasicMaterial({ color: 0x000000 });
    grid.rotation.x = -Math.PI / 2;
    grid.position.x = 0;
    grid.position.y = 0;
    grid.position.z = 0;
    scene.add(grid);
  }

  const canvas = {};
  canvas.addEventListener = () => undefined;

  const renderer = new THREE.WebGLRenderer({ antialias: true, width, height, canvas, context: GL(width, height) });

  const threejsGeometry = toThreejsGeometry(toKeptGeometry(geometry));
  const datasets = [];
  await buildMeshes({ datasets, threejsGeometry, scene });

  renderer.render(scene, camera);
  const gl = renderer.getContext();

  const pixels = new Uint8Array(4 * width * height);

  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const data = new Uint8Array(4 * width * height);

  {
    let i, j, l, ref, ref1, n;
    for (j = l = 0, ref = height; ref >= 0 ? l < ref : l > ref; j = ref >= 0 ? ++l : --l) {
      for (i = n = 0, ref1 = width; ref1 >= 0 ? n < ref1 : n > ref1; i = ref1 >= 0 ? ++n : --n) {
        const k = j * width + i;
        const r = pixels[4 * k];
        const g = pixels[4 * k + 1];
        const b = pixels[4 * k + 2];
        const a = pixels[4 * k + 3];
        const m = (height - j + 1) * width + i;
        data[4 * m] = r;
        data[4 * m + 1] = g;
        data[4 * m + 2] = b;
        data[4 * m + 3] = a;
      }
    }
  }

  const pngData = encode({ width, height, data, depth: 8, channels: 4 });

  return pngData;
};
