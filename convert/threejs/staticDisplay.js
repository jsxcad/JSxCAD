/* global OffscreenCanvas */

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';

import { Layers } from '@jsxcad/algorithm-threejs';
import { buildMeshes } from './mesh.js';
import { buildScene } from './scene.js';
import { moveToFit } from './moveToFit.js';

let locked = false;
const pending = [];

export const staticDisplay = async (
  {
    view = {},
    canvas,
    context,
    geometry,
    withAxes = false,
    withGrid = false,
    definitions,
    renderer,
  } = {},
  page
) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  if (!canvas) {
    canvas = new OffscreenCanvas(width, height);
  }

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const {
    camera: displayCamera,
    canvas: displayCanvas,
    renderer: displayRenderer,
    scene,
  } = buildScene({
    canvas,
    context,
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes,
    preserveDrawingBuffer: true,
    renderer,
  });

  const render = () => {
    displayRenderer.clear();
    displayCamera.layers.set(GEOMETRY_LAYER);
    displayRenderer.render(scene, displayCamera);
    displayRenderer.clearDepth();
    displayCamera.layers.set(SKETCH_LAYER);
    displayRenderer.render(scene, displayCamera);
  };

  const pageSize = [];

  try {
    await buildMeshes({ datasets, geometry, scene, definitions, pageSize });
  } catch (e) {
    console.log(e.stack);
    throw e;
  }

  moveToFit({ datasets, view, camera: displayCamera, scene, withGrid, pageSize });

  render();

  return { canvas: displayCanvas, renderer: displayRenderer };
};

export default staticDisplay;
