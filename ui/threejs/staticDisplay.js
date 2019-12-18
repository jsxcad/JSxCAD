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

  const { camera, canvas, hudCanvas, renderer, scene } = buildScene({ width, height, view, geometryLayers, planLayers });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };

  buildMeshes({ datasets, threejsGeometry, scene });

  render();

  return { canvas, hudCanvas };
};
