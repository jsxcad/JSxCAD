import { Layers } from 'three';
import { buildMeshes } from './mesh';
import { buildScene } from './scene';

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

export const staticDisplay = ({ view = {}, threejsGeometry } = {}, page) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(PLAN_LAYER);

  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view, geometryLayers, planLayers });

  const render = () => {
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };

  const updateHud = () => {
    const ctx = hudCanvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FF0000';
    ctx.fillText('HUD', 50, 50);
  };

  buildMeshes({ datasets, threejsGeometry, scene });

  updateHud();
  render();

  return { canvas: viewerElement, hudCanvas };
};
