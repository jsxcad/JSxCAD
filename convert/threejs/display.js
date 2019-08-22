/* global ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from './controls';
import { buildScene, createResizer } from './scene';

import { buildMeshes } from './mesh';

export const display = ({ view = {}, threejsGeometry } = {}, page) => {
  const datasets = [];
  const width = page.offsetWidth;
  const height = page.offsetHeight;
  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
  const { gui } = buildGui({ viewerElement });
  const render = () => renderer.render(scene, camera);
  const updateHud = () => {
                      const ctx = hudCanvas.getContext('2d');
                      ctx.clearRect(0, 0, width, height);
                      ctx.fillStyle = '#FF0000';
                      ctx.fillText("HUD", 50, 50);
                    };

  const container = document.body;
  container.appendChild(viewerElement);

  const { trackball } = buildTrackballControls({ camera, render, view, viewerElement });
  const { resize } = createResizer({ camera, trackball, renderer, viewerElement });

  resize();
  new ResizeObserver(resize).observe(container);

  buildMeshes({ datasets, threejsGeometry, scene });
  buildGuiControls({ datasets, gui });

  const animate = () => {
    updateHud();
    render();
    trackball.update();
    window.requestAnimationFrame(animate);
  };

  animate();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    display(window.JSxCAD, document.body);
  }
};
