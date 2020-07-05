import { makeConvex } from './jsxcad-geometry-surface.js';
import { toPlane } from './jsxcad-math-poly3.js';
import { toTriangles } from './jsxcad-geometry-polygons.js';
import { toKeptGeometry } from './jsxcad-geometry-tagged.js';

const pointsToThreejsPoints = (points) => points;

const solidToThreejsSolid = (solid) => {
  const normals = [];
  const positions = [];
  for (const surface of solid) {
    // for (const convex of makeConvex(surface)) {
    for (const triangle of toTriangles({}, surface)) {
      const plane = toPlane(triangle);
      if (plane === undefined) {
        continue;
      }
      const [px, py, pz] = toPlane(triangle);
      for (const [x = 0, y = 0, z = 0] of triangle) {
        normals.push(px, py, pz);
        positions.push(x, y, z);
      }
    }
  }
  return { normals, positions };
};

const surfaceToThreejsSurface = (surface) => {
  const normals = [];
  const positions = [];
  for (const convex of makeConvex(surface)) {
    const plane = toPlane(convex);
    if (plane === undefined) {
      continue;
    }
    const [x, y, z] = toPlane(convex);
    for (const point of convex) {
      normals.push(x, y, z);
      positions.push(...point);
    }
  }
  return { normals, positions };
};

const toThreejsGeometry = (geometry, supertags) => {
  const tags = [...(supertags || []), ...(geometry.tags || [])];
  if (tags.includes('compose/non-positive')) {
    return;
  }
  if (geometry.isThreejsGeometry) {
    return geometry;
  }
  switch (geometry.type) {
    case 'layout':
    case 'assembly':
    case 'disjointAssembly':
    case 'layers':
      return {
        type: 'assembly',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'sketch':
      return {
        type: 'sketch',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'item':
      return {
        type: 'item',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'paths':
      return {
        type: 'paths',
        threejsPaths: geometry.paths,
        tags,
        isThreejsGeometry: true,
      };
    case 'plan':
      return {
        type: 'plan',
        threejsPlan: geometry.plan,
        threejsMarks: geometry.marks,
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'points':
      return {
        type: 'points',
        threejsPoints: pointsToThreejsPoints(geometry.points),
        tags,
        isThreejsGeometry: true,
      };
    case 'solid':
      return {
        type: 'solid',
        threejsSolid: solidToThreejsSolid(geometry.solid),
        tags,
        isThreejsGeometry: true,
      };
    case 'surface':
      return {
        type: 'surface',
        threejsSurface: surfaceToThreejsSurface(geometry.surface),
        tags,
        isThreejsGeometry: true,
      };
    case 'z0Surface':
      return {
        type: 'surface',
        threejsSurface: surfaceToThreejsSurface(geometry.z0Surface),
        tags,
        isThreejsGeometry: true,
      };
    default:
      throw Error(`Unexpected geometry: ${geometry.type}`);
  }
};

const toThreejsPage = async (
  geometry,
  { view, title = 'JSxCAD Viewer' } = {}
) => {
  const keptGeometry = toKeptGeometry(geometry);
  const threejsGeometry = toThreejsGeometry(keptGeometry);
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
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
  </style>
 </head>
 <body>
  <script type="text/javascript" src="https://unpkg.com/@jsxcad/convert-threejs/dist/display.js"></script>
  <script type="text/javascript">JSxCAD = ${JSON.stringify({
    threejsGeometry,
    view,
  })};</script>
  <script>
   document.onreadystatechange = () => {
     if (document.readyState === 'complete') {
       display(window.JSxCAD, document.body);
     }
   };
  </script>
 </body>
</html>`;
  return new TextEncoder('utf8').encode(html);
};

export { toThreejsGeometry, toThreejsPage };
