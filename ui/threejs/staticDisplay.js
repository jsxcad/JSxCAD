import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

import { Layers } from '@jsxcad/algorithm-threejs';
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
  {
    view = {},
    canvas,
    geometry,
    withAxes = false,
    withGrid = false,
    definitions,
  } = {},
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

  const {
    camera,
    canvas: displayCanvas,
    renderer,
    scene,
  } = buildScene({
    canvas,
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes,
    preserveDrawingBuffer: true,
  });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    renderer.clearDepth();

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);
  };

  const pageSize = [];

  await buildMeshes({ datasets, geometry, scene, definitions, pageSize });

  moveToFit({ datasets, view, camera, scene, withGrid, pageSize });

  render();

  await release();

  return { canvas: displayCanvas, renderer };
};

export default staticDisplay;
