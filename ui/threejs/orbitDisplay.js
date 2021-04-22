/* global ResizeObserver, requestAnimationFrame */

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import { buildScene, createResizer } from './scene.js';

import { Layers } from 'three';
import { buildMeshes } from './mesh.js';
import { buildTrackballControls } from './controls.js';
import { moveToFit } from './moveToFit.js';

export const orbitDisplay = async (
  {
    view = {},
    geometry,
    path,
    canvas,
    withAxes = false,
    withGrid = false,
    gridLayer = SKETCH_LAYER,
    definitions,
  } = {},
  page
) => {
  let datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const { camera, canvas: displayCanvas, renderer, scene } = buildScene({
    canvas,
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

  if (!canvas) {
    page.appendChild(displayCanvas);
  }

  const { trackball } = buildTrackballControls({
    camera,
    render,
    view,
    viewerElement: displayCanvas,
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

    // Build new datasets from the written data, and display them.
    datasets = [];

    await buildMeshes({
      datasets,
      geometry,
      scene,
      render,
      definitions,
    });

    moveToFit({
      datasets,
      view,
      camera,
      controls: trackball,
      scene,
      withGrid,
      gridLayer,
    });

    render();
  };

  if (geometry) {
    await updateGeometry(geometry);
    render();
  }

  const animate = () => {
    requestAnimationFrame(animate);
    trackball.update();
    render();
  };

  animate();

  return { canvas: displayCanvas, render, updateGeometry, trackball };
};

export default orbitDisplay;
