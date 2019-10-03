/* global Blob, ResizeObserver */

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { createService, getFilesystem, listFiles, listFilesystems, readFile, setupFilesystem, watchFile, writeFile } from '@jsxcad/sys';

import CodeMirror from 'codemirror/src/codemirror.js';
import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

let panels = new Set();

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

    const paths = new Set(await listFiles());
    for (const path of paths) {
      if (!path.startsWith('file/')) {
        continue;
      }
      const file = path.substring(5);
      entries.push(file);
      if (paths.has(`geometry/${file}`)) {
        entries.push(`<button style='${buttonStyle}' onclick="viewGeometry('${file}')">View</button>`);
      }
      if (path.endsWith('.jsx')) {
        entries.push(`<button style='${buttonStyle}' onclick="editFile('${file}')">Edit</button>`);
      }
      entries.push(`<br>`);
    }
    entries.push(`<hr>`);
  }

  for (const filesystem of await listFilesystems()) {
    entries.push(`<button style='${buttonStyle}' onclick="switchFilesystemview('${filesystem}')">${filesystem}</button>`);
  }

  return entries.join('\n');
};

const displayGeometry = async (path) => {
  const panel = jsPanel.create({
    headerTitle: path,
    content: `<div id="${path}"></div>`,
    contentOverflow: 'hidden',
    position: { my: 'right-top', at: 'right-top' },
    panelSize: { width: '66%', height: '100%' },
    footerToolbar: `</span><button class="jsPanel-ftr-btn" id="download/${path}" style="padding: 5px; margin: 3 px; display: inline-block;">Download ${path}</button>`,
    headerControls: { size: 'xs' },
    onclosed: (panel) => panels.delete(panel),
    callback: (panel) => {
                           document.getElementById(`download/${path}`)
                                   .addEventListener('click',
                                                     async () => {
                                                       const data = await readFile({ as: 'bytes' }, `file/${path}`);
                                                       const blob = new Blob([data.buffer],
                                                                             { type: 'application/octet-stream' });
                                                       saveAs(blob, path);
                                                     });
                         }
  });

  panels.add(panel);

  const view = {};
  let datasets = [];
  let threejsGeometry;
  let width = panel.offsetWidth;
  let height = panel.offsetHeight;
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

  const geometryPath = `geometry/${path}`;

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

  updateGeometry(JSON.parse(await readFile({}, geometryPath)));

  watchFile(geometryPath,
            async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));
}

const displayEditor = async (path) => {

  const agent = async ({ ask, question }) => {
    if (question.readFile) {
      const { options, path } = question.readFile;
      return readFile(options, path);
    } else if (question.writeFile) {
      const { options, path, data } = question.writeFile;
      return writeFile(options, path, data);
    }
  };

  const { ask } = await createService({ webWorker: './webworker.js', agent });

  const evaluator = async (script) => {
    let start = new Date().getTime();
    let runClock = true;
    const clockElement = document.getElementById(`evaluatorClock/${path}`);
    const tick = () => {
      if (runClock) {
        setTimeout(tick, 100);
        const duration = new Date().getTime() - start;
        clockElement.textContent = `${(duration / 1000).toFixed(2)}`;
      }
    };
    tick();
    const geometry = await ask({ evaluate: script });
    if (geometry) {
      await writeFile({}, 'file/preview', 'preview');
      await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
    }
    runClock = false;
  };

  let editor;

  // FIX: Need some visual indicator that the script is running.
  const runScript = async () => {
    const script = editor.getDoc().getValue('\n');
    // Save any changes.
    await writeFile({}, `file/${path}`, script);
    return evaluator(script);
  };

  const editId = `${getFilesystem()}/edit/${path}`;

  const content = await readFile({}, `file/${path}`);

  const panel = jsPanel.create({
    headerTitle: path,
    content: `<textarea id="${editId}">${content}</textarea>`,
    contentOverflow: 'hidden',
    panelSize: { width: '66%', height: '100%' },
    position: { my: 'left-top', at: 'left-top' },
    headerControls: { size: 'xs' },
    footerToolbar: `<span id="evaluatorClock/${path}"></span><button class="jsPanel-ftr-btn" id="runScript/${path}" style="padding: 5px; margin: 3 px;">Run</button>`,
    onclosed: (panel) => { editor.toTextArea(); panels.delete(panel); },
    callback: (panel) => document.getElementById(`runScript/${path}`).addEventListener('click', runScript)
  });
  panels.add(panel);

  const textarea = document.getElementById(editId);

  editor = CodeMirror.fromTextArea(textarea,
                                   {
                                     autoRefresh: true,
                                     mode: 'javascript',
                                     theme: 'default',
                                     fullScreen: true,
                                     lineNumbers: true,
                                     gutter: true,
                                     lineWrapping: true,
                                     extraKeys: { 'Shift-Enter': runScript },
                                   });
}

const viewGeometry = (file) => {
  displayGeometry(file).then(_ => _).catch(_ => _);
}

const editFile = (file) => {
  displayEditor(file).then(_ => _).catch(_ => _);
}

const closePanels = async () => {
  for (const panel of panels) {
    await new Promise((resolve, reject) => { panel.close(resolve); });
  }
}

const switchFilesystemview = (filesystem) => {
  closePanels()
    .then(_ => setupFilesystem({ fileBase: filesystem }))
    .then(_ => updateFilesystemview())
    .then(_ => _)
    .catch(_ => _);
}

const updateFilesystemview = async () => {
  const panel = jsPanel.create({
    id: 'filesystemview',
    headerTitle: `Project: ${getFilesystem()}`,
    position: { my: 'right-bottom', at: 'right-bottom' },
    contentOverflow: 'scroll',
    panelSize: { width: 512, height: '100%' },
    border: '2px solid',
    borderRadius: 12,
    headerControls: { close: 'remove', size: 'xs' },
    content: await updateFilesystemviewHTML(),
    onclosed: (panel) => panels.delete(panel),
  });
  panels.add(panel);
}

export const installFilesystemview = async ({ document }) => {
  document.editFile = editFile;
  document.viewGeometry = viewGeometry;
  document.switchFilesystemview = switchFilesystemview;
  await updateFilesystemview();
}
