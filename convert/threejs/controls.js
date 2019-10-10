import * as dat from 'dat.gui';

import TrackballControls from 'three-trackballcontrols';

export const buildTrackballControls = ({ camera, render, viewerElement, view = {} }) => {
  const { target = [0, 0, 0] } = view;
  const trackball = new TrackballControls(camera, viewerElement);
  trackball.rotateSpeed = 4.0;
  trackball.zoomSpeed = 4.0;
  trackball.panSpeed = 2.0;
  trackball.noZoom = false;
  trackball.noPan = false;
  trackball.staticMoving = true;
  trackball.dynamicDampingFactor = 0.1;
  trackball.keys = [65, 83, 68];
  trackball.addEventListener('change', render);
  trackball.target.set(...target);
  return { trackball };
};

export const buildGui = ({ viewerElement }) => {
  const gui = new dat.GUI({ autoPlace: false, closed: true });
  gui.domElement.style = 'padding: 5px; z-index: 3';
  viewerElement.appendChild(gui.domElement);

  return { gui };
};

export const buildGuiControls = ({ datasets, gui }) => {
  let count = 0;
  const controllers = {};
  for (const dataset of datasets) {
    if (dataset.name === undefined) { continue; }
    let controller = controllers[dataset.name];
    if (controller === undefined) {
      const ui = gui.add({ visible: true }, 'visible').name(`${dataset.name}`);
      count += 1;
      controller = { ui, datasets: [] };
      controllers[dataset.name] = controller;
      controller.ui.listen()
          .onChange((value) =>
            controller.datasets.forEach(dataset => {
              dataset.mesh.visible = value;
            }));
    }
    controller.datasets.push(dataset);
    dataset.controller = controller;
  }

  return count;
};
