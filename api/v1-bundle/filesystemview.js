/* global Blob, ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { getFilesystem, listFiles, listFilesystems, readFile, setupFilesystem, watchFile } from '@jsxcad/sys';

import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

let filesystemview;

const buttonStyle = [
  `box-shadow:inset 0px 1px 0px 0px #ffffff;`,
  `background-color:#f9f9f9;`,
  `-moz-border-radius:6px;`,
  `-webkit-border-radius:6px;`,
  `border-radius:6px;`,
  `border:1px solid #dcdcdc;`,
  `display:inline-block;`,
  `cursor:pointer;`,
  `color:black;`,
  `font-family:Arial;`,
  `font-size:15px;`,
  `font-weight:bold;`,
  `padding:6px 24px;`,
  `margin:4px;`,
  `text-decoration:none;`,
  `text-shadow:0px 1px 0px #ffffff;`,
].join(' ');

const updateFilesystemviewHTML = async () => {
  const entries = [];
  
  const filesystem = getFilesystem();
  if (filesystem) {
    entries.push(`<hr>`);
    entries.push(`<br>`);

    for (const path of await listFiles()) {
      if (!path.startsWith('file/')) {
        continue;
      }
      const file = path.substring(5);
      entries.push(`<button style='${buttonStyle}' onclick="openFilesystemviewFile('${file}')">${file}</button>`);
    }
    entries.push(`<br>`);
    entries.push(`<hr>`);
  }

  for (const filesystem of await listFilesystems()) {
    entries.push(`<button style='${buttonStyle}' onclick="switchFilesystemview('${filesystem}')">${filesystem}</button>`);
  }

  return entries.join('\n');
};

const displayFilesystemviewFile = async (file) => {
  const page = jsPanel.create({
    headerTitle: file,
    content: `<div id="${file}"></div>`,
    contentOverflow: 'hidden',
    position: { my: 'right-top', at: 'right-top' },
    footerToolbar: `</span><button class="jsPanel-ftr-btn" id="download/${file}" style="padding: 5px; margin: 3 px; display: inline-block;">Download ${file}</button>`,
    // iconfont: 'material-icons',
    headerControls: { size: 'xs' },
    callback: (panel) => {
                           document.getElementById(`download/${file}`)
                                   .addEventListener('click',
                                                     async () => {
                                                       const data = await readFile({ as: 'bytes' }, file);
                                                       const blob = new Blob([data.buffer],
                                                                             { type: 'application/octet-stream' });
                                                       saveAs(blob, file);
                                                     });
                         }
  });

  const view = {};
  let datasets = [];
  let threejsGeometry;
  let width = page.offsetWidth;
  let height = page.offsetHeight;
  const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
  const { gui } = buildGui({ viewerElement });
  const hudContext = hudCanvas.getContext('2d');
  const render = () => renderer.render(scene, camera);
  const updateHud = () => {
    hudContext.clearRect(0, 0, width, height);
    drawHud({ camera, datasets, threejsGeometry, hudCanvas });
    hudContext.fillStyle = '#FF0000';
  };

  const container = document.getElementById(file);
  container.appendChild(viewerElement);

  const animate = () => {
    updateHud();
    render();
  };

  const { trackball } = buildTrackballControls({ camera, render: animate, view, viewerElement });

  const { resize } = createResizer({ camera, trackball, renderer, viewerElement });

  resize();
  new ResizeObserver(() => {
    ({ width, height } = resize());
    hudCanvas.width = width;
    hudCanvas.height = height;
  })
      .observe(container);

  const track = () => {
    animate();
    trackball.update();
    window.requestAnimationFrame(track);
  };

  track();

  // const geometryFile = `geometry/${file}`;
  const geometryFile = file;

  const updateGeometry = (geometry) => {
    if (geometry !== undefined) {
      // Delete any previous dataset in the window.
      const controllers = new Set();
      for (const { controller, mesh } of datasets) {
        if (controller) {
          controllers.add(controller);
        }
        scene.remove(mesh);
      }
      for (const controller of controllers) {
        gui.remove(controller.ui);
      }

      threejsGeometry = toThreejsGeometry(geometry);

      // Build new datasets from the written data, and display them.
      datasets = [];

      buildMeshes({ datasets, threejsGeometry, scene });
      buildGuiControls({ datasets, gui });
    }
  }

  updateGeometry(JSON.parse(await readFile({}, geometryFile)));

  watchFile(geometryFile,
            async () => updateGeometry(JSON.parse(await readFile({}, geometryFile))));
}

const openFilesystemviewFile = (file) => {
  if (file.endsWith('.stl')) {
    displayFilesystemviewFile(file).then(_ => _).catch(_ => _);
  }
}

const switchFilesystemview = (filesystem) => {
  // FIX: Save any open windows.
  setupFilesystem({ fileBase: filesystem });
  filesystemview.close(id => id);
  updateFilesystemview().then(_ => _).catch(_ => _);
}

const updateFilesystemview = async () => {
  filesystemview = jsPanel.create({
    id: 'filesystemview',
    headerTitle: `Project: ${getFilesystem()}`,
    position: { my: 'right-bottom', at: 'right-bottom' },
    contentOverflow: 'scroll',
    panelSize: { width: 512, height: '100%' },
    border: '2px solid',
    borderRadius: 12,
    // iconfont: 'material-icons',
    headerControls: { close: 'remove', size: 'xs' },
    content: await updateFilesystemviewHTML(),
  });
}

export const installFilesystemview = async ({ document }) => {
  document.openFilesystemviewFile = openFilesystemviewFile;
  document.switchFilesystemview = switchFilesystemview;
  await updateFilesystemview();
}
