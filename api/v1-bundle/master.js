import { installConsole, installConsoleCSS } from './console';
import { installDisplay, installDisplayCSS } from './display';
import { installEditor, installEditorCSS } from './editor';
import { installEvaluator, installEvaluatorCSS } from './evaluator';
import { installReference, installReferenceCSS } from './reference';
import { readFile, watchFile, watchFileCreation } from '@jsxcad/sys';

const defaultScript = `assemble(circle(10), cube(10), triangle(15).outline())`;

window.bootstrapCSS = () => {
  installConsoleCSS(document);
  installEditorCSS(document);
  installDisplayCSS(document);
  installEvaluatorCSS(document);
  installReferenceCSS(document);
};

window.bootstrap = async () => {
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
