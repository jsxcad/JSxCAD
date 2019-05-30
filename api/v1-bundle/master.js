/* global location */

import { installConsole, installConsoleCSS } from './console';
import { installDisplay, installDisplayCSS } from './display';
import { installEditor, installEditorCSS } from './editor';
import { installEvaluator, installEvaluatorCSS } from './evaluator';
import { installReference, installReferenceCSS } from './reference';
import { readFile, setupFilesystem, watchFile, watchFileCreation } from '@jsxcad/sys';

const defaultScript =
`
hull(point(0, 0, 10), circle(10))
  .writeStl({ path: 'cone.stl' })
`;

const installProject = async () => {
  const hash = location.hash.substring(1);
  const [project, gist] = hash.split('@');
  // Use the project identifier to select the filesystem.
  setupFilesystem({ fileBase: project });
  if (gist !== undefined) {
    // We expect a url like:
    // https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589
    // FIX: Initialize the whole filesystem.
    const response = await window.fetch(gist);
    if (response.ok) {
      const text = await response.text();
      const data = JSON.parse(text);
      if (data.files && data.files.script && data.files.script.content) {
        return { initialScript: data.files.script.content };
      }
    }
  }
  return {};
};

window.bootstrapCSS = () => {
  installConsoleCSS(document);
  installEditorCSS(document);
  installDisplayCSS(document);
  installEvaluatorCSS(document);
  installReferenceCSS(document);
};

window.bootstrap = async () => {
  let { initialScript } = await installProject();
  if (initialScript === undefined) {
    initialScript = await readFile({}, 'script');
  }
  if (initialScript === undefined) {
    initialScript = defaultScript;
  }
  const { addPage, nextPage, lastPage } = await installDisplay({ document, readFile, watchFile, watchFileCreation, window });
  const { evaluator } = await installEvaluator({});
  await installEditor({ addPage, document, evaluator, initialScript, nextPage, lastPage });
  await installConsole({ addPage, document, watchFile });
  await installReference({ addPage, document });
};

window.bootstrapCSS();

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
