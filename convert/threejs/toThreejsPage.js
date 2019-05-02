import { flip, toPlane } from '@jsxcad/math-poly3';

import { makeConvex } from '@jsxcad/geometry-surface';
import { readFileSync } from '@jsxcad/sys';
import { toPolygons } from '@jsxcad/geometry-solid';
import { toSegments } from '@jsxcad/geometry-path';
import { toTriangles } from '@jsxcad/geometry-polygons';

const loadResource = (pathname, condition = true) =>
  condition ? readFileSync(`${__dirname}/dist/${pathname}`, { encoding: 'utf8' }) : '';

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
    loadResource('page.css'),
    loadResource('three.css'),
    loadResource('codemirror.css', includeEditor),
    `</style>`,
    `<link href="https://codemirror.net/lib/codemirror.css" rel="stylesheet">`
  ].join('\n');

  const body = [
    `<!-- CodeMirror -->`,
    includeEditor ? `<script src="https://codemirror.net/lib/codemirror.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/addon/display/autorefresh.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/addon/display/fullscreen.js"><\\/script>`.replace('\\/', '/') : '',
    includeEditor ? `<script src="https://codemirror.net/mode/javascript/javascript.js"><\\/script>`.replace('\\/', '/') : '',
    `<!-- ThreeJS -->`,
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/stats.js/master/build/stats.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/controls/TrackballControls.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js"><\\/script>`.replace('\\/', '/'),
    `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ami.js//0.0.20/ami.min.js"><\\/script>`.replace('\\/', '/'),
    `<!-- FileSaver -->`,
    `<script>`,
    initialScript !== '' ? `const initialScript = ${JSON.stringify(initialScript)};` : '',
    loadResource('FileSaver.js'),
    loadResource('eval.js', includeEvaluator),
    loadResource('noeval.js', !includeEvaluator),
    `const { readFileSync, watchFile, watchFileCreation, writeFileSync } = api;`,
    loadResource('display.js'),
    loadResource('editor.js', includeEditor),
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  const app = [
    `<script>const runApp = () => {`,
    threejsGeometry ? `  writeFileSync(${JSON.stringify(previewPage)}, () => {}, ${JSON.stringify(threejsGeometry)});` : '',
    `  nextPage();`,
    `}`,
    `document.addEventListener("DOMContentLoaded", runApp);`,
    `<\\/script>`.replace('\\/', '/')
  ].join('\n');

  return `<html><head>${head}</head><body id="body">${body}${app}</body></html>`;
};
