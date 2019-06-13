/* global ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from './controls';
import { buildScene, createResizer } from './scene';

import { buildMeshes } from './mesh';

export const display = ({ view = {}, threejsGeometry } = {}, page) => {
  let datasets = [];

  const { camera, renderer, scene, viewerElement } = buildScene({ width: page.offsetWidth, height: page.offsetHeight, view });
  const { gui } = buildGui({ viewerElement });
  const render = () => renderer.render(scene, camera);

  const container = document.body;
  container.appendChild(viewerElement);

  const { trackball } = buildTrackballControls({ camera, render, viewerElement });
  const { resize } = createResizer({ camera, trackball, renderer, viewerElement });

  resize();
  new ResizeObserver(resize).observe(container);

  buildMeshes({ datasets, threejsGeometry, scene });
  buildGuiControls({ datasets, gui });

  const animate = () => {
    window.requestAnimationFrame(animate);
    render();
    trackball.update();
  };

  animate();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    display(window.JSxCAD, document.body);
  }
};
