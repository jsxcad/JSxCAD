import { flip, toPlane } from '@jsxcad/math-poly3';

import { makeConvex } from '@jsxcad/geometry-surface';
import { toPolygons } from '@jsxcad/geometry-solid';
import { toSegments } from '@jsxcad/geometry-path';
import { toTriangles } from '@jsxcad/geometry-polygons';

const pathsToThreejsSegments = (geometry) => {
  const segments = [];
  for (const path of geometry) {
    for (const [start, end] of toSegments({}, path)) {
      segments.push([start, end]);
    }
  }
  return segments;
};

const solidToThreejsSolid = (geometry) => {
  const normals = [];
  const positions = [];
  for (const triangle of toTriangles({}, toPolygons({}, geometry))) {
    for (const point of triangle) {
      const [x, y, z] = toPlane(triangle);
      normals.push(x, y, z);
      positions.push(...point);
    }
  }
  return { normals, positions };
};

const z0SurfaceToThreejsSurface = (geometry) => {
  const normals = [];
  const positions = [];
  const outputTriangle = (triangle) => {
    for (const point of triangle) {
      const [x, y, z] = toPlane(triangle);
      normals.push(x, y, z);
      positions.push(...point);
    }
  };
  for (const triangle of toTriangles({}, makeConvex({}, geometry))) {
    outputTriangle(triangle);
    outputTriangle(flip(triangle));
  }
  return { normals, positions };
};

export const toThreejsGeometry = (geometry) => {
  if (geometry.isThreejsGeometry) {
    return geometry;
  } else if (geometry.assembly) {
    return { assembly: geometry.assembly.map(toThreejsGeometry), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.paths) {
    return { threejsSegments: pathsToThreejsSegments(geometry.paths), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.solid) {
    return { threejsSolid: solidToThreejsSolid(geometry.solid), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.z0Surface) {
    return { threejsSurface: z0SurfaceToThreejsSurface(geometry.z0Surface), tags: geometry.tags, isThreejsGeometry: true };
  }
};

export const toThreejsPage = async ({ cameraPosition = [0, 0, 16], title = 'JSxCAD Viewer', includeEditor = false, includeEvaluator = false, initialScript = '', initialPage = 'editor', previewPage = 'default' }, geometry) => {
  const threejsGeometry = toThreejsGeometry(geometry);
  // FIX: Avoid injection issues.
  const head = [
    `<title>${title}</title>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`,
    `<style>`,
    `body { color: #cccccc; font-family: Monospace; font-size: 13px; text-align: left; background-color: #050505; margin: 0px; overflow: hidden; }`,
    `.dg { position: absolute; top: 2px; left: 2px }`,
    `.CodeMirror { border-top: 1px solid black; border-bottom: 1px solid black; font-family: Arial, monospace; font-size: 16px; }`,
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
    `import { api, sys, toThreejsGeometry } from 'https://unpkg.com/@jsxcad/api-v1-bundle@^0.0.66/dist/main?module';`,
    // `import { api, sys, toThreejsGeometry } from './bundle.js'`,
    `const { readFile, watchFile, watchFileCreation, writeFile } = sys;`,
    initialScript !== '' ? `const initialScript = ${JSON.stringify(initialScript)};` : '',
    `import { display } from 'https://unpkg.com/@jsxcad/convert-threejs@^0.0.66/display.js?module';`,
    // `import { display } from './display.js';`,
    `const jsFrame = new JSFrame();`,
    `const { addPage, nextPage, lastPage } = display({ Blob, THREE, dat, jsFrame, readFile, requestAnimationFrame, toThreejsGeometry, watchFile, watchFileCreation });`,
    includeEditor ? `import { editor } from 'https://unpkg.com/@jsxcad/convert-threejs@^0.0.66/editor.js?module'` : '',
    // includeEditor ? `import { editor } from './editor.js';` : '',
    includeEditor ? `editor({ CodeMirror, addPage, api, initialScript, nextPage, lastPage });` : '',
    `const runApp = () => {`,
    threejsGeometry ? `  writeFile({ geometry: ${JSON.stringify(threejsGeometry)} }, ${JSON.stringify(previewPage)}, '').then(_ => nextPage());` : '',
    `}`,
    `document.addEventListener("DOMContentLoaded", runApp);`,
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  return `<html><head>${head}</head><body id="body">${body}</body></html>`;
};
