import Base64ArrayBuffer from 'base64-arraybuffer';

const encodeNotebook = (notebook) => {
  const encoded = [];
  for (const entry of notebook) {
    if (entry.download) {
      encoded.push({
        ...entry,
        data: undefined,
        base64Data: Base64ArrayBuffer.encode(entry.data),
      });
    } else {
      encoded.push(entry);
    }
  }
  return encoded;
};

export const toHtml = async (
  notebook,
  {
    view,
    title = 'JSxCAD Viewer',
    modulePath = 'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/es6',
  } = {}
) => {
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
    .note.log { font-family: "Arial Black", Gadget, sans-serif; color: red }
    .note.view { border: 1px dashed #1C6EA4; }
    .note.orbitView { position: absolute; top: 0; width: 100%; height: 100%; zIndex: 100; }
  </style>
 </head>
 <body>
  <script type='module'>
    import { toDomElement } from '${modulePath}/jsxcad-ui-notebook.js';

    const notebook = ${JSON.stringify(encodeNotebook(notebook))};

    const run = async () => {
      const body = document.getElementsByTagName('body')[0];
      const notebookElement = await toDomElement(notebook);
      notebookElement.classList.add('notebook', 'loaded');
      body.appendChild(notebookElement);
    };

    if (document.readyState === 'complete') {
      run();
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          run();
        }
      };
    }
  </script>
 </body>
</html>
`;
  return new TextEncoder('utf8').encode(html);
};
