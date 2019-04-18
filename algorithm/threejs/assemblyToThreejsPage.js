import { readFileSync } from '@jsxcad/sys';

export const assemblyToThreejsPage = async ({ cameraPosition = [0, 0, 16], title = 'JSxCAD Viewer' }, { paths = [], solids = [], surfaces = [] }) => {
  // FIX: Avoid injection issues.
  const head = [
    `<title>${title}</title>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`,
    `<style>`,
    readFileSync('resource/page.css', { encoding: 'utf8' }),
    readFileSync('resource/three.css', { encoding: 'utf8' }),
    readFileSync('resource/codemirror.css', { encoding: 'utf8' }),
    `</style>`,
    `<link href="https://codemirror.net/lib/codemirror.css" rel="stylesheet">`
  ].join('\n');

  const body = [
    `<!-- CodeMirror -->`,
    `<script src="https://codemirror.net/lib/codemirror.js"><\\/script>`.replace('\\/', '/'),
    `<script src="https://codemirror.net/addon/display/autorefresh.js"><\\/script>`.replace('\\/', '/'),
    `<script src="https://codemirror.net/addon/display/fullscreen.js"><\\/script>`.replace('\\/', '/'),
    `<script src="https://codemirror.net/mode/javascript/javascript.js"><\\/script>`.replace('\\/', '/'),
    `<!-- ThreeJS -->`,
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/stats.js/master/build/stats.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/TrackballControls.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ami.js//0.0.20/ami.min.js"><\\/script>`.replace('\\/', '/'),
    `<!-- FileSaver -->`,
    `<script>`,
    readFileSync('resource/FileSaver.js', { encoding: 'utf8' }),
    readFileSync('resource/JSxCAD.js', { encoding: 'utf8' }),
    `const { api, flipPolygon, makeConvexSurface, polygonsToTriangles, readFileSync, solidToPolygons, toPlane, toSegments, watchFile, watchFileCreation, writeFileSync } = JSxCAD;`,
    readFileSync('resource/display.js', { encoding: 'utf8' }),
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  const app = [
    `<script>console.log('QQ/Hello');<\\/script>`.replace('\\/', '/'),
    `<script>const runApp = () => {`,
    `  console.log('QQ/runApp');`,
    `  addDisplay('main', ${JSON.stringify({ paths, solids, surfaces })});`,
    `  nextPage();`,
    `}`,
    `document.addEventListener("DOMContentLoaded", runApp);`,
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  return `<html><head>${head}</head><body id="body">${body}${app}</body></html>`;
};
