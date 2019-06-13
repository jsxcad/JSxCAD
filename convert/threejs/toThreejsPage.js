import { toThreejsGeometry } from './toThreejsGeometry';

export const toThreejsPage = async ({ cameraPosition = [0, 0, 16], title = 'JSxCAD Viewer' }, geometry) => {
  const threejsGeometry = toThreejsGeometry(geometry);
  const html = `
<html>
 <head>
  <title>JSxCAD Viewer</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
 </head>
 <body>
  <script type="text/javascript" src="https://unpkg.com/@jsxcad/convert-threejs/dist/display.js"></script>
  <script type="text/javascript">JSxCAD = ${JSON.stringify({ threejsGeometry })};</script>
 </body>
</html>`;
  return html;
};
