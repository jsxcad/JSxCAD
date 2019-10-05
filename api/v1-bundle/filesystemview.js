/* global Blob, FileReader, ResizeObserver */

import './codemirror-global';
import 'codemirror/mode/javascript/javascript.js';

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { createService, getFilesystem, listFiles, listFilesystems, readFile, setupFilesystem, unwatchFileCreation, watchFile, watchFileCreation, writeFile } from '@jsxcad/sys';
import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';

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
  `align-self: flex-end;`
].join(' ');

const updateFilesystemviewHTML = async () => {
  const entries = [];

  const filesystem = getFilesystem();
  if (filesystem) {
    entries.push(`<hr>`);
    entries.push(`<br>`);

    const paths = new Set(await listFiles());

    if (!paths.has('file/script.jsx') && paths.has('script')) {
      // Copy scripts from preAlpha to preAlpha2.
      // FIX: Remove this hack.
      await writeFile({}, 'file/script.jsx', await readFile({}, 'script'));
    }

    for (const path of paths) {
      if (!path.startsWith('file/')) {
        continue;
      }
      const file = path.substring(5);
      entries.push(`<div style="display: inline-block; width: 33%">${file}</div>`);
      if (paths.has(`geometry/${file}`)) {
        entries.push(`<button style='${buttonStyle}' onclick="viewGeometry('${file}')">View</button>`);
      }
      if (path.endsWith('.jsx')) {
        entries.push(`<button style='${buttonStyle}' onclick="editFile('${file}')">Edit</button>`);
      }
      entries.push(`</span>`);
      entries.push(`<br>`);
    }

    entries.push(`<div style="display: inline-block; width: 33%">`);
    entries.push(`<input type="text" id="fs/file/add">`);
    entries.push(`</div>`);
    entries.push(`<button style="${buttonStyle}" onclick="addFile()">Add File</button>`);
    entries.push(`<br>`);
    entries.push(`<button style="${buttonStyle}" onclick="exportFilesystem()">Export</button>`);
    entries.push(`Import <input type="file" multiple="false" accept="application/zip" id="fs/filesystem/import" onchange="importFilesystem()">`);
    entries.push(`<hr>`);
  }

  entries.push(`<div style="display: inline-block; width: 33%">`);
  entries.push(`<input type="text" id="fs/filesystem/add"></input>`);
  entries.push(`</div>`);
  entries.push(`<button style='${buttonStyle}' onclick="addFilesystem()">Add Project</button>`);

  for (const filesystem of await listFilesystems()) {
    entries.push(`<div style="display: inline-block; width: 33%">${filesystem}</div>`);
    entries.push(`<button style='${buttonStyle}' onclick="switchFilesystemview('${filesystem}')">View</button>`);
    entries.push(`<br>`);
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
    border: '2px solid',
    borderRadius: 12,
    headerControls: { maximize: 'remove', normalize: 'remove', minimize: 'remove', smallify: 'remove', size: 'lg' },
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

  const view = { target: [0, 0, 0], position: [0, 0, 100], up: [0, 1, 0] };
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
  };

  updateGeometry(JSON.parse(await readFile({}, geometryPath)));

  watchFile(geometryPath,
            async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));
};

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

  const saveScript = async () => {
    const script = editor.getDoc().getValue('\n');
    // Save any changes.
    await writeFile({}, `file/${path}`, script);
    return script;
  };

  const runScript = async () => {
    const script = await saveScript();
    return evaluator(script);
  };

  const editId = `${getFilesystem()}/edit/${path}`;

  const content = await readFile({}, `file/${path}`);

  let log = null;

  const panel = jsPanel.create({
    headerTitle: path,
    content: `<textarea id="${editId}">${content}</textarea>`,
    contentOverflow: 'hidden',
    panelSize: { width: '66%', height: '66%' },
    position: { my: 'left-top', at: 'left-top' },
    border: '2px solid',
    borderRadius: 12,
    headerControls: { maximize: 'remove', normalize: 'remove', minimize: 'remove', smallify: 'remove', size: 'lg' },
    footerToolbar: `<span id="evaluatorClock/${path}"></span><button class="jsPanel-ftr-btn" id="runScript/${path}" style="padding: 5px; margin: 3 px;">Run</button>`,
    onclosed: (panel) => { editor.toTextArea(); panels.delete(panel); if (log !== null) log.close(); },
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
                                     extraKeys: { 'Shift-Enter': runScript, 'Control-S': saveScript }
                                   });

  log = jsPanel.create({
    headerTitle: 'Log',
    content: `<div id="log"></div>`,
    contentOverflow: 'scroll',
    panelSize: { width: '66%', height: '33%' },
    position: { my: 'left-bottom', at: 'left-bottom' },
    border: '2px solid',
    borderRadius: 12,
    headerControls: { maximize: 'remove', normalize: 'remove', minimize: 'remove', smallify: 'remove', size: 'lg' },
    onclosed: (panel) => { panels.delete(panel); log = null; },
    callback: (panel) => {
      const viewerElement = document.getElementById('log');
      const decoder = new TextDecoder('utf8');
      watchFile('console/out',
                (options, file) => {
                  viewerElement.appendChild(document.createTextNode(decoder.decode(file.data)));
                  viewerElement.appendChild(document.createElement('hr'));
                  viewerElement.parentNode.scrollTop = viewerElement.parentNode.scrollHeight;
                });
    }
  });
  panels.add(log);
};

const addFile = () => {
  const file = document.getElementById('fs/file/add').value;
  if (file.length > 0) {
    // FIX: Prevent this from overwriting existing files.
    writeFile({}, `file/${file}`, '').then(_ => _).catch(_ => _);
  }
};

const exportFilesystem = () => {
  toZipFromFilesystem()
      .then(data => new Blob([data.buffer], { type: 'application/zip' }))
      .then(blob => saveAs(blob, getFilesystem()));
};

const importFilesystem = (e) => {
  const file = document.getElementById('fs/filesystem/import').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const zip = e.target.result;
    fromZipToFilesystem({}, zip).then(_ => _);
  };
  reader.readAsArrayBuffer(file);
};

const defaultScript = `// Circle(10);`;

const addFilesystem = () => {
  const filesystem = document.getElementById('fs/filesystem/add').value;
  if (filesystem.length > 0) {
    // FIX: Prevent this from overwriting existing filesystems.
    setupFilesystem({ fileBase: filesystem });
    writeFile({}, 'file/script.jsx', defaultScript)
        .then(_ => switchFilesystemview(filesystem))
        .catch(_ => _);
  }
};

const viewGeometry = (file) => {
  displayGeometry(file).then(_ => _).catch(_ => _);
};

const editFile = (file) => {
  displayEditor(file).then(_ => _).catch(_ => _);
};

const closePanels = async () => {
  for (const panel of panels) {
    await new Promise((resolve, reject) => { panel.close(resolve); });
  }
};

const switchFilesystemview = (filesystem) => {
  return closePanels()
      .then(_ => setupFilesystem({ fileBase: filesystem }))
      .then(_ => updateFilesystemview())
      .then(_ => _)
      .catch(_ => _);
};

const updateFilesystemview = async () => {
  let watcher;
  const panel = jsPanel.create({
    id: 'filesystemview',
    headerTitle: `Project: ${getFilesystem()}`,
    position: { my: 'right-bottom', at: 'right-bottom' },
    contentOverflow: 'scroll',
    panelSize: { width: 512, height: '100%' },
    border: '2px solid',
    borderRadius: 12,
    headerControls: { close: 'remove', maximize: 'remove', normalize: 'remove', minimize: 'remove', smallify: 'remove', size: 'lg' },
    content: await updateFilesystemviewHTML(),
    onclosed: (panel) => { panels.delete(panel); unwatchFileCreation(watcher); }
  });
  panels.add(panel);
  watcher = watchFileCreation(() => updateFilesystemviewHTML().then(innerHTML => { panel.content.innerHTML = innerHTML; }).catch(_ => _));
};

export const installFilesystemview = async ({ document }) => {
  document.addFile = addFile;
  document.addFilesystem = addFilesystem;
  document.editFile = editFile;
  document.exportFilesystem = exportFilesystem;
  document.importFilesystem = importFilesystem;
  document.viewGeometry = viewGeometry;
  document.switchFilesystemview = switchFilesystemview;
  await updateFilesystemview();
};
