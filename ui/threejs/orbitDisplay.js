import { Layers } from 'three';
import { buildMeshes } from './mesh';
import { buildScene } from './scene';
import { buildTrackballControls } from './controls';

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

export const orbitDisplay = async ({ view = {}, threejsGeometry } = {}, page) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(PLAN_LAYER);

  const { camera, canvas, renderer, scene } = buildScene({ width, height, view, geometryLayers, planLayers });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };

  const { trackball } = buildTrackballControls({ camera, render, view, viewerElement: canvas });

  await buildMeshes({ datasets, threejsGeometry, scene });

  const track = () => {
    trackball.update();
    window.requestAnimationFrame(track);
  };

  render();
  track();

  return { canvas, renderer };
};

export default orbitDisplay;
