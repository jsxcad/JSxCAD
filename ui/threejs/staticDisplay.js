import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

import { Layers } from 'three';
import { buildMeshes } from './mesh.js';
import { buildScene } from './scene.js';
import { moveToFit } from './moveToFit.js';

let locked = false;
const pending = [];

const acquire = async () => {
  if (locked) {
    return new Promise((resolve, reject) => pending.push(resolve));
  } else {
    locked = true;
  }
};

const release = async () => {
  if (pending.length > 0) {
    const resolve = pending.pop();
    resolve(true);
  } else {
    locked = false;
  }
};

export const staticDisplay = async (
  { view = {}, threejsGeometry, withAxes = false, withGrid = false } = {},
  page
) => {
  if (locked === true) await acquire();
  locked = true;

  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const { camera, canvas, renderer, scene } = buildScene({
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes,
  });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    renderer.clearDepth();

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);
  };

  await buildMeshes({ datasets, threejsGeometry, scene });

  moveToFit({ datasets, view, camera, scene, withGrid });

  render();

  await release();

  return { canvas, renderer };
};

export default staticDisplay;
