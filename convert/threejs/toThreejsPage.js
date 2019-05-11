import { toThreejsGeometry } from './toThreejsGeometry';

export const toThreejsPage = async ({ cameraPosition = [0, 0, 16], title = 'JSxCAD Viewer', includeEditor = false, includeEvaluator = false, initialScript = '', initialPage = 'editor', previewPage = 'default' }, geometry) => {
  const threejsGeometry = toThreejsGeometry(geometry);
  // FIX: Avoid injection issues.
  const head = [
    `<title>${title}</title>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`,
    `<style>`,
    `body { color: #cccccc; font-family: Monospace; font-size: 13px; text-align: left; background-color: #0.73505; margin: 0px; overflow: hidden; }`,
    `.dg { position: absolute; top: 2px; left: 2px }`,
    `.CodeMirror { border-top: 1px solid black; border-bottom: 1px solid black; font-family: Arial, monospace; font-size: 16px; }`,
    `.Console { border-top: 1px solid black; border-bottom: 1px solid black; font-family: Arial, monospace; font-size: 16px; color: black; }`,
    `</style>`,
    `<link href="https://codemirror.net/lib/codemirror.css" rel="stylesheet">`
  ].join('\n');

  const body = [
    `<!-- CodeMirror -->`,
    includeEditor ? `<script src="https://codemirror.net/lib/codemirror.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/addon/display/autorefresh.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/addon/display/fullscreen.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/mode/javascript/javascript.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://riversun.github.io/jsframe/jsframe.js"><\\/script>`.replace('\\/', '/') : '',
    `<!-- ThreeJS -->`,
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/stats.js/master/build/stats.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/TrackballControls.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ami.js//0.0.20/ami.min.js"><\\/script>`.replace('\\/', '/'),
    `<!-- FileSaver -->`,
    `<script type="module">`,
    // `import { api, sys, toThreejsGeometry } from 'https://unpkg.com/@jsxcad/api-v1-bundle@^0.0.74/dist/bundle?module';`,
    `import { api, sys, toThreejsGeometry } from './bundle.js'`,
    `const { readFile, watchFile, watchFileCreation, writeFile } = sys;`,
    initialScript !== '' ? `const initialScript = ${JSON.stringify(initialScript)};` : '',
    // `import { display } from 'https://unpkg.com/@jsxcad/convert-threejs@^0.0.74/display.js?module';`,
    `import { display } from './display.js';`,
    `const jsFrame = new JSFrame();`,
    `const { addPage, nextPage, lastPage } = display({ Blob, THREE, dat, jsFrame, readFile, requestAnimationFrame, toThreejsGeometry, watchFile, watchFileCreation });`,
    // includeEditor ? `import { editor } from 'https://unpkg.com/@jsxcad/convert-threejs@^0.0.74/editor.js?module'` : '',
    includeEditor ? `import { editor } from './editor.js';` : '',
    includeEditor ? `editor({ CodeMirror, addPage, api, initialScript, nextPage, lastPage });` : '',
    includeEditor ? `import { console } from './console.js';` : '',
    includeEditor ? `console({ addPage, watchFile });` : '',
    `const runApp = () => {`,
    threejsGeometry ? `  writeFile({ geometry: ${JSON.stringify(threejsGeometry)} }, ${JSON.stringify(previewPage)}, '').then(_ => nextPage());` : '',
    `}`,
    `document.addEventListener("DOMContentLoaded", runApp);`,
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  return `<html><head>${head}</head><body id="body">${body}</body></html>`;
};
