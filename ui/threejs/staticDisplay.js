import { Layers } from 'three';
import { buildMeshes } from './mesh';
import { buildScene } from './scene';
import { moveToFit } from './moveToFit';

const GEOMETRY_LAYER = 0;
const PLAN_LAYER = 1;

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

export const staticDisplay = async ({ view = {}, threejsGeometry } = {}, page) => {
  if (locked === true) await acquire();
  locked = true;

  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;

  const geometryLayers = new Layers();
  geometryLayers.set(GEOMETRY_LAYER);

  const planLayers = new Layers();
  planLayers.set(PLAN_LAYER);

  const { camera, canvas, renderer, scene } = buildScene({ width, height, view, geometryLayers, planLayers, withAxes: false });

  const render = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    camera.layers.set(PLAN_LAYER);
    renderer.render(scene, camera);
  };

  await buildMeshes({ datasets, threejsGeometry, scene });

  moveToFit({ view, camera, scene });

  render();

  await release();

  return { canvas, renderer };
};

export default staticDisplay;
