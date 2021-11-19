/* global ResizeObserver, requestAnimationFrame */

import { GEOMETRY_LAYER, SKETCH_LAYER } from './layers.js';
import { buildScene, createResizer } from './scene.js';

import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
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

const buildDragControls = ({
  camera,
  endUpdating,
  startUpdating,
  tangibleObjects,
  trackballControls,
  viewerElement,
}) => {
  const dragControls = new DragControls(tangibleObjects, camera, viewerElement);
  dragControls.addEventListener('dragstart', () => {
    trackballControls.enabled = false;
    startUpdating();
  });
  dragControls.addEventListener('dragend', () => {
    endUpdating();
    trackballControls.enabled = true;
  });
  return { dragControls };
};

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

  const tangibleObjects = scene.children.filter(
    (item) => !item.userData.intangible
  );

  const { dragControls } = buildDragControls({
    camera,
    endUpdating,
    render,
    startUpdating,
    tangibleObjects,
    trackballControls,
    view,
    viewerElement: displayCanvas,
  });

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

  const updateGeometry = async (
    geometry,
    { withGrid = true, fit = true } = {}
  ) => {
    // Delete any previous dataset in the window.
    for (const { mesh } of datasets) {
      scene.remove(mesh);
    }

    for (const object of [...scene.children]) {
      if (object.userData.ephemeral) {
        scene.remove(object);
      }
    }

    view = { ...view, fit };

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
      controls: [trackballControls],
      scene,
      withGrid,
      gridLayer,
    });

    // Update the tangible objects in place, so that dragControls notices.
    tangibleObjects.splice(
      0,
      tangibleObjects.length,
      ...scene.children.filter((item) => !item.userData.intangible)
    );

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
    dragControls,
    render,
    scene,
    tangibleObjects,
    trackballControls,
    updateGeometry,
  };
};

export default orbitDisplay;
