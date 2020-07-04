import { toKeptGeometry } from '@jsxcad/geometry-tagged';
import { toThreejsGeometry } from './toThreejsGeometry.js';

export const toThreejsPage = async (
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
