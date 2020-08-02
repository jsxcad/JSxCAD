export const toHtml = async (
  notebook,
  { view, title = 'JSxCAD Viewer' } = {}
) => {
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
 </head>
 <body>
  <script type='module'>
    import { toDomElement } from 'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/es6/jsxcad-ui-notebook.js';

    const notebook = ${JSON.stringify(notebook)};

    const run = async () => {
      const { width = 1024, height = 1024, position = [0, 0, 100] } = {};
      const body = document.getElementsByTagName('body')[0];
      const notebookElement = toDomElement(notebook);
      body.appendChild(notebookElement);
    };

    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        run();
      }
    };
  </script>
 </body>
</html>
`;
  return new TextEncoder('utf8').encode(html);
};
