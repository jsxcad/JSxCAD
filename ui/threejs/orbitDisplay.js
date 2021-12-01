/* global ResizeObserver, requestAnimationFrame */

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import { buildScene, createResizer } from './scene.js';

import { AnchorControls } from './AnchorControls.js';
import { Layers } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { buildMeshes } from './mesh.js';
import { moveToFit } from './moveToFit.js';

const buildTrackballControls = ({
  camera,
  render,
  viewerElement,
  view = {},
}) => {
  const { target = [0, 0, 0] } = view;
  const trackballControls = new TrackballControls(camera, viewerElement);
  trackballControls.keys = [65, 83, 68];
  trackballControls.target.set(...target);
  trackballControls.update();
  trackballControls.zoomSpeed = 2.5;
  trackballControls.panSpeed = 1.25;
  trackballControls.rotateSpeed = 2.5;
  trackballControls.staticMoving = true;
  return { trackballControls };
};

const buildAnchorControls = ({
  camera,
  draggableObjects,
  endUpdating,
  scene,
  startUpdating,
  trackballControls,
  viewerElement,
}) => {
  const anchorControls = new AnchorControls(camera, viewerElement, scene);
  anchorControls.enable();
  return { anchorControls };
};

export const orbitDisplay = async (
  {
    view = {},
    geometry,
    path,
    canvas,
    withAxes = false,
    withGrid = true,
    gridLayer = GEOMETRY_LAYER,
    definitions,
  } = {},
  page
) => {
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
  });

  let isUpdating = false;

  let trackballControls;

  const update = () => {
    trackballControls.update();
    render();
    if (isUpdating) {
      requestAnimationFrame(update);
    }
  };

  const startUpdating = () => {
    if (!isUpdating) {
      isUpdating = true;
      update();
    }
  };

  const endUpdating = () => {
    isUpdating = false;
  };

  let isRendering = false;

  const doRender = () => {
    renderer.clear();
    camera.layers.set(GEOMETRY_LAYER);
    renderer.render(scene, camera);

    renderer.clearDepth();

    camera.layers.set(SKETCH_LAYER);
    renderer.render(scene, camera);

    isRendering = false;
  };

  const render = () => {
    if (isRendering) {
      return;
    }
    isRendering = true;
    requestAnimationFrame(doRender);
  };

  if (!canvas) {
    page.appendChild(displayCanvas);
  }

  ({ trackballControls } = buildTrackballControls({
    camera,
    render,
    view,
    viewerElement: displayCanvas,
  }));

  const { anchorControls } = buildAnchorControls({
    camera,
    endUpdating,
    render,
    scene,
    startUpdating,
    trackballControls,
    view,
    viewerElement: displayCanvas,
  });

  anchorControls.addEventListener('change', update);

  const { resize } = createResizer({
    camera,
    controls: [trackballControls],
    renderer,
    viewerElement: page,
  });

  new ResizeObserver(() => {
    resize();
    render();
  }).observe(page);

  let moveToFitDone = false;

  const updateGeometry = async (geometry, { fit = true } = {}) => {
    for (const object of [...scene.children]) {
      if (!object.userData.dressing) {
        scene.remove(object);
      }
    }

    view = { ...view, fit };

    await buildMeshes({
      geometry,
      scene,
      render,
      definitions,
    });

    if (!moveToFitDone) {
      moveToFitDone = true;
      moveToFit({
        view,
        camera,
        controls: [trackballControls],
        scene,
        withGrid,
        gridLayer,
      });
    }

    render();
  };

  if (geometry) {
    await updateGeometry(geometry);
  }

  trackballControls.addEventListener('start', startUpdating);
  trackballControls.addEventListener('end', endUpdating);

  return {
    camera,
    canvas: displayCanvas,
    anchorControls,
    render,
    renderer,
    scene,
    trackballControls,
    updateGeometry,
  };
};

export default orbitDisplay;
