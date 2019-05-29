/* global location */

import { installConsole, installConsoleCSS } from './console';
import { installDisplay, installDisplayCSS } from './display';
import { installEditor, installEditorCSS } from './editor';
import { installEvaluator, installEvaluatorCSS } from './evaluator';
import { installReference, installReferenceCSS } from './reference';
import { readFile, setupFilesystem, watchFile, watchFileCreation } from '@jsxcad/sys';

const defaultScript =
`
const model = assemble(cube(10).as('cube'),
                       cylinder(4, 10).as('cylinder'));

model.keep('cube').writeStl({ path: 'cube.stl' });
model.keep('cube').crossSection().outline().writePdf({ path: 'cut.pdf' });

return model;
`;

window.bootstrapCSS = () => {
  installConsoleCSS(document);
  installEditorCSS(document);
  installDisplayCSS(document);
  installEvaluatorCSS(document);
  installReferenceCSS(document);
};

window.bootstrap = async () => {
  // The file prefix partitions projects.
  setupFilesystem({ fileBase: location.hash.substring(1) });
  let initialScript = await readFile({}, 'script');
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
