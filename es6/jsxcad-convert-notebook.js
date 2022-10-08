import { encodeFiles, read, encode } from './jsxcad-sys.js';

const encodeNotebook = async (notebook, { root, workspace, module } = {}) => {
  const encoded = [];
  const seen = new Set();
  for (const note of notebook) {
    if (module && note.sourceLocation && note.sourceLocation.path !== module) {
      // Skip notes for other modules.
      continue;
    }
    if (seen.has(note.hash)) {
      // Deduplicate the notes.
      continue;
    }
    seen.add(note.hash);
    if (note.view) {
      // Make sure we have the view data loaded.
      const { path, data } = note;
      if (path && !data) {
        note.data = await read(path, { workspace });
      }
    }
    if (note.download) {
      const encodedEntries = [];
      for (const entry of note.download.entries) {
        entry.data = await entry.data;
        if (entry.path && !entry.data) {
          entry.data = await read(entry.path, { workspace });
        }
        if (entry.data) {
          const encodedEntry = {
            ...entry,
            base64Data: encode(entry.data),
          };
          delete encodedEntry.data;
          encodedEntries.push(encodedEntry);
        }
      }
      encoded.push({ download: { entries: encodedEntries } });
    } else {
      encoded.push(note);
    }
  }
  return encoded;
};

const toHtmlFromNotebook = async (
  notebook,
  {
    view,
    title = 'JSxCAD Viewer',
    modulePath = 'https://jsxcad.js.org/alpha',
    module,
    useControls = false,
    useMermaid = false,
    useEvaluator = false,
  } = {}
) => {
  const encodedNotebook = await encodeNotebook(notebook, { module });
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
    div.book {
      height: 100%;
      overflow: scroll;
      margin-left: 20px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    div.note.card {
      border: 1px dashed crimson;
      margin: 4px 4px;
      padding: 4px 4px;
      display: inline-block;
      width: fit-content;
      height: fit-content;
    }

    .note.log {
      font-family: "Arial Black", Gadget, sans-serif;
      color: red
    }

    .note.view {
      border: 1px dashed dodgerblue;
      margin: 4px 4px;
      padding: 4px 4px;
    }

    .note.orbitView {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
    }

    button.note.download {
      border: 2px solid black;
      border-radius: 5px;
      background-color: white;
      margin: 4px 4px;
      padding: 10px 24px;
      font-size: 16px;
      cursor: pointer;
      border-color: #2196F3;
      color: dodgerblue
    }

    button.note.download:hover {
      background: #2196F3;
      color: white;
    }

    .note th,td {
      border: 1px solid dodgerblue;
      padding: 5px;
    }
  </style>
  ${
    useMermaid
      ? '<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>'
      : ''
  }
 </head>
 <body>
  <script type='module'>
    import { Shape } from '${modulePath}/jsxcad-api-shape.js';
    import { dataUrl } from '${modulePath}/jsxcad-ui-threejs.js';
    import { toDomElement } from '${modulePath}/jsxcad-ui-notebook.js';

    const notebook = ${JSON.stringify(encodedNotebook, null, 2)};

    const prepareViews = async (notebook) => {
      // Prepare the view urls in the browser.
      for (const note of notebook) {
        if (note.view && !note.url) {
          note.url = await dataUrl(Shape.fromGeometry(note.data), note.view);
        }
      }
      return notebook;
    }

    const run = async () => {
      const body = document.getElementsByTagName('body')[0];
      const bookElement = document.createElement('div');
      const notebookElement = await toDomElement(await prepareViews(notebook), { useControls: ${
        useControls ? 'true' : 'false'
      } });
      bookElement.appendChild(notebookElement);
      body.appendChild(bookElement);
      bookElement.classList.add('book', 'notebook', 'loaded');
    };

    if (document.readyState === 'complete') {
      run();
      ${useMermaid ? 'mermaid.init();' : ''}
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
  return { html: new TextEncoder('utf8').encode(html), encodedNotebook };
};

const toHtmlFromScript = async ({
  view,
  title = 'JSxCAD Viewer',
  modulePath = 'https://jsxcad.js.org/alpha',
  baseUrl = 'https://jsxcad.js.org',
  module,
  files = {},
  useControls = false,
  useMermaid = false,
  useEvaluator = false,
} = {}) => {
  const encodedFiles = encodeURIComponent(JSON.stringify(files));
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
    div.book {
      height: 100%;
      overflow: scroll;
      margin-left: 20px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    div.note.card {
      border: 1px dashed crimson;
      margin: 4px 4px;
      padding: 4px 4px;
      display: inline-block;
      width: fit-content;
      height: fit-content;
    }

    .note.log {
      font-family: "Arial Black", Gadget, sans-serif;
      color: red
    }

    .note.view {
      border: 1px dashed dodgerblue;
      margin: 4px 4px;
      padding: 4px 4px;
    }

    .note.orbitView {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
    }

    button.note.download {
      border: 2px solid black;
      border-radius: 5px;
      background-color: white;
      margin: 4px 4px;
      padding: 10px 24px;
      font-size: 16px;
      cursor: pointer;
      border-color: #2196F3;
      color: dodgerblue
    }

    button.note.download:hover {
      background: #2196F3;
      color: white;
    }

    .note th,td {
      border: 1px solid dodgerblue;
      padding: 5px;
    }
  </style>
  ${
    useMermaid
      ? '<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>'
      : ''
  }
 </head>
 <body>
  <script type='module'>
    import api from '${modulePath}/jsxcad-api.js';
    import { Shape } from '${modulePath}/jsxcad-api-shape.js';
    import { dataUrl } from '${modulePath}/jsxcad-ui-threejs.js';
    import { addOnEmitHandler, boot, decodeFiles, read, removeOnEmitHandler, resolvePending, setupWorkspace, write } from '${modulePath}/jsxcad-sys.js';
    import { getNotebookControlData, toDomElement } from '${modulePath}/jsxcad-ui-notebook.js';

    const pendingData = Symbol('pendingData');
    const pendingUrl = Symbol('pendingUrl');
    const pendingRender = Symbol('pendingRender');

    const baseUrl = "${baseUrl}";
    const module = "${module}";
    const workspace = 'JSxCAD';

    const body = document.getElementsByTagName('body')[0];
    const bookElement = document.createElement('div');
    body.appendChild(bookElement);

    const seenHashes = new Set();
    const notebooks = new Map();

    // Isn't this problem handled by preact?

    const run = async ({ isRerun = false } = {}) => {
      const addNotes = async (notes) => {
        for (const note of notes) {
          if (note.beginSourceLocation) {
            if (notebooks.has(note.beginSourceLocation.line)) {
              const { notes, domElement } = notebooks.get(line);

            }
          }
          if (seenHashes.has(note.hash)) {
            continue;
          }
          seenHashes.add(note.hash);
          const { path, data, hash, line } = note;
          let domElement;
          if (!notebooks.has(line)) {
            domElement = document.createElement('div');
            bookElement.appendChild(domElement);
            notebooks.set(line, { domElement, notes: [] });
          } else {
            domElement = notebooks.get(line).domElement;
          }
          notebooks.get(line).notes.push(note);
          if (note.md) {
            note.md = note
              .md
              .replace(/#https:\\/\\/raw.githubusercontent.com\\/jsxcad\\/JSxCAD\\/master\\/(.*?).nb/g, (_, modulePath) => baseUrl + '/' + modulePath + '.html');
          }
          if (path && !data) {
             note[pendingData] = read(path);
          }
          if (note.view && !note.url) {
            const schedulePreviewGeneration = async () => {
              note.data = note.data || await note[pendingData];
              return dataUrl(Shape.fromGeometry(note.data), note.view);
            }
            note[pendingUrl] = schedulePreviewGeneration();
          }
        }
        const scheduleRender = async () => {
          for (const note of notes) {
            note.data = note.data || await note[pendingData];
            note.url = note.url || await note[pendingUrl];
          }
          const notebookElement = await toDomElement(notes, { useControls: ${useControls} ? 'true' : 'false' });
          bookElement.appendChild(notebookElement);
        };
        notes[pendingRender] = scheduleRender();
      }

      const onEmitHandler = addOnEmitHandler(addNotes);

      if (isRerun) {
        const notebookControlData = await getNotebookControlData();
        await write('control/' + module, notebookControlData, {
          workspace,
        });
      }

      const topLevel = new Map();
      await api.importModule(module, {
        clearUpdateEmits: true,
        topLevel,
        readCache: false,
        workspace,
      });

      await resolvePending();

      removeOnEmitHandler(onEmitHandler);
    };

    const onKeyDown = (e) => {
      const CONTROL = 17;
      const E = 69;
      const ENTER = 13;
      const S = 83;
      const SHIFT = 16;

      const key = e.which || e.keyCode || 0;

      switch (key) {
        case CONTROL:
        case SHIFT:
          return true;
      }

      const { ctrlKey, shiftKey } = e;
      switch (key) {
        case ENTER: {
          if (shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            run({ isRerun: true });
            return false;
          }
          break;
        }
      }
    };

    const start = async () => {
      setupWorkspace(workspace);
      await boot();

      // Construct a local ephemeral filesystem.
      const files = decodeFiles("${encodedFiles}");
      for (const path of Object.keys(files)) {
        await write(path, files[path], { ephemeral: true });
      }

      await run();
      window.addEventListener('keydown', onKeyDown);
    }

    if (document.readyState === 'complete') {
      start();
      ${useMermaid ? 'mermaid.init();' : ''}
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          start();
        }
      };
    }
  </script>
 </body>
</html>
`;
  return { html: new TextEncoder('utf8').encode(html) };
};

const toStandaloneFromScript = async ({
  view,
  title = 'Jot',
  modulePath = 'https://jsxcad.js.org/alpha',
  baseUrl = 'https://jsxcad.js.org',
  module,
  files = {},
} = {}) => {
  const encodedFiles = encodeFiles(files);
  const html = `
<html>
 <head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous" />
  <style>
    div.book {
      height: 100%;
      overflow: scroll;
      margin-left: 20px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    div.note.card {
      border: 1px dashed crimson;
      margin: 4px 4px;
      padding: 4px 4px;
      display: inline-block;
      width: fit-content;
      height: fit-content;
    }

    .note.log {
      font-family: "Arial Black", Gadget, sans-serif;
      color: red
    }

    .note.view {
      border: 1px dashed dodgerblue;
      margin: 4px 4px;
      padding: 4px 4px;
    }

    .note.orbitView {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
    }

    button.note.download {
      border: 2px solid black;
      border-radius: 5px;
      background-color: white;
      margin: 4px 4px;
      padding: 10px 24px;
      font-size: 16px;
      cursor: pointer;
      border-color: #2196F3;
      color: dodgerblue
    }

    button.note.download:hover {
      background: #2196F3;
      color: white;
    }

    .note th,td {
      border: 1px solid dodgerblue;
      padding: 5px;
    }
  </style>
 </head>
 <body>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script type='module'>
    import { run } from '${modulePath}/jsxcad-ui-app-standalone.js';
    run({ encodedFiles: "${encodedFiles}", module: "${module}", workspace: 'JSxCAD', container: document.getElementById('notebook') });
  </script>
  <div id="notebook" class="notebook"></div>
 </body>
</html>
`;
  return { html: new TextEncoder('utf8').encode(html) };
};

export { toHtmlFromNotebook, toHtmlFromScript, toStandaloneFromScript };
