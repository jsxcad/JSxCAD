/* global ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from "./controls";
import { buildScene, createResizer } from "./scene";

import { Layers } from "three";
import { buildMeshes } from "./mesh";

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

export const display = async ({ view = {}, threejsGeometry } = {}, page) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(PLAN_LAYER);

  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({
    width,
    height,
    view,
    geometryLayers,
    planLayers,
  });

  const { gui } = buildGui({ viewerElement });
  const render = () => {
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };
  const updateHud = () => {
    const ctx = hudCanvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#FF0000";
    ctx.fillText("HUD", 50, 50);
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

  await buildMeshes({ datasets, threejsGeometry, scene });
  buildGuiControls({ datasets, gui });

  const animate = () => {
    updateHud();
    render();
    trackball.update();
    window.requestAnimationFrame(animate);
  };

  animate();

  return { canvas: viewerElement, hudCanvas };
};
