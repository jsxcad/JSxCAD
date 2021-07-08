/* global ResizeObserver */

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import { buildScene, createResizer } from './scene.js';

import { Layers } from 'three';
import { buildMeshes } from './mesh.js';
import {
  // buildGui,
  // buildGuiControls,
  buildTrackballControls,
} from './controls.js';

export const display = async ({ view = {}, geometry } = {}, page) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(SKETCH_LAYER);

  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({
    width,
    height,
    view,
    geometryLayers,
    planLayers,
  });

  // const { gui } = buildGui({ viewerElement });
  const render = () => {
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);
  };
  const updateHud = () => {
    const ctx = hudCanvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FF0000';
    ctx.fillText('HUD', 50, 50);
  };

  const container = document.body;
  container.appendChild(viewerElement);

  const { trackball } = buildTrackballControls({
    camera,
    render,
    view,
    viewerElement,
  });
  const { resize } = createResizer({
    camera,
    trackball,
    renderer,
    viewerElement,
  });

  resize();
  new ResizeObserver(resize).observe(container);

  await buildMeshes({ datasets, geometry, scene });
  // buildGuiControls({ datasets /*, gui */ });

  const animate = () => {
    updateHud();
    render();
    trackball.update();
    window.requestAnimationFrame(animate);
  };

  animate();

  return { canvas: viewerElement, hudCanvas };
};
