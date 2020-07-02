/* global ResizeObserver */

import { buildScene, createResizer } from './scene.js';

import { Layers } from 'three';
import { buildMeshes } from './mesh.js';
import { buildTrackballControls } from './controls.js';
import { moveToFit } from './moveToFit.js';
import { toThreejsGeometry } from './toThreejsGeometry.js';

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

export const orbitDisplay = async ({ view = {}, geometry } = {}, page) => {
  let datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(PLAN_LAYER);

  const { camera, canvas, renderer, scene } = buildScene({
    width,
    height,
    view,
    geometryLayers,
    planLayers,
    withAxes: false,
  });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };

  page.appendChild(canvas);

  const { trackball } = buildTrackballControls({
    camera,
    render,
    view,
    viewerElement: canvas,
  });

  const { resize } = createResizer({
    camera,
    trackball,
    renderer,
    viewerElement: page,
  });

  new ResizeObserver(() => {
    resize();
    render();
  }).observe(page);

  const updateGeometry = async (geometry) => {
    // Delete any previous dataset in the window.
    for (const { mesh } of datasets) {
      scene.remove(mesh);
    }

    const threejsGeometry = toThreejsGeometry(geometry);

    // Build new datasets from the written data, and display them.
    datasets = [];

    await buildMeshes({ datasets, threejsGeometry, scene, render });

    moveToFit({ view, camera, controls: trackball, scene });

    render();
  };

  if (geometry) {
    await updateGeometry(geometry);
    render();
  }

  return { canvas, render, updateGeometry };
};

export default orbitDisplay;
