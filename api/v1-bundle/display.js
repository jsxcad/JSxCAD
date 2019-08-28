/* global Blob, ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { installCSS, installCSSLink } from './css';

import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

export const installDisplayCSS = (document) => {
  installCSSLink(document, 'https://unpkg.com/jspanel4@4.6.0/es6module/jspanel.css');
  installCSS(document, `
               .dg { position: absolute; top: 2px; left: 2px; background: #ffffff; color: #000000 }
               .dg.main.taller-than-window .close-button { border-top: 1px solid #ddd; }
               .dg.main .close-button { background-color: #ccc; } 
               .dg.main .close-button:hover { background-color: #ddd; }
               .dg { color: #555; text-shadow: none !important; } 
               .dg.main::-webkit-scrollbar { background: #fafafa; } 
               .dg.main::-webkit-scrollbar-thumb { background: #bbb; } 
               .dg li:not(.folder) { background: #fafafa; border-bottom: 1px solid #ddd; } 
               .dg li.save-row .button { text-shadow: none !important; } 
               .dg li.title { background: #e8e8e8 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat; }
               .dg .cr.function:hover,.dg .cr.boolean:hover { background: #fff; } 
               .dg .c input[type=text] { background: #e9e9e9; } 
               .dg .c input[type=text]:hover { background: #eee; } 
               .dg .c input[type=text]:focus { background: #eee; color: #555; } 
               .dg .c .slider { background: #e9e9e9; } 
               .dg .c .slider:hover { background: #eee; }
             `);
};

export const installDisplay = async ({ document, readFile, watchFile, watchFileCreation, window }) => {
  jsPanel.autopositionSpacing = 20;

  let pages = [];

  const addPage = ({ title = 'Window', content = '', contentOverflow = 'scroll', position = 'left-top', autoposition = 'down', size = '600 600', footerToolbar, callback }) => {
    const panel = jsPanel.create({
      autoposition,
      headerTitle: title,
      contentSize: size,
      content,
      contentOverflow,
      'position': { my: position, at: position },
      footerToolbar,
      callback,
      headerControls: { close: 'remove' }
    });
    pages.push(panel);
    return panel;
  };

  const nextPage = () => {
    pages.push(pages.shift());
    pages[0].front();
  };

  const lastPage = () => {
    pages.unshift(pages.pop());
    pages[0].front();
  };

  const addDisplay = ({ view = {} } = {}, path) => {
    const page = addPage({
      title: path,
      content: `<div id="${path}"></div>`,
      contentOverflow: 'hidden',
      position: 'right-top',
      footerToolbar: `</span><button class="jsPanel-ftr-btn" id="download/${path}" style="padding: 5px; margin: 3 px; display: inline-block;">Download ${path}</button>`,
      callback: (panel) => {
        document.getElementById(`download/${path}`)
            .addEventListener('click',
                              async () => {
                                const data = await readFile({ as: 'bytes' }, path);
                                const blob = new Blob([data.buffer],
                                                      { type: 'application/octet-stream' });
                                saveAs(blob, path);
                              });
      }
    });

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

    const container = document.getElementById(path);
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

    watchFile(path,
              ({ geometry, view }, file) => {
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
              });
  };

  if (typeof watchFileCreation !== 'undefined') {
    watchFileCreation(({ preview }, { path }) => {
      if (preview === true) {
        addDisplay({}, path);
      }
    });
  }

  return { addPage, nextPage, lastPage };
};
