import { installConsole, installConsoleCSS } from './console';
import { installDisplay, installDisplayCSS } from './display';
import { installEditor, installEditorCSS } from './editor';
import { installEvaluator, installEvaluatorCSS } from './evaluator';
import { readFile, watchFile, watchFileCreation } from '@jsxcad/sys';

window.bootstrapCSS = () => {
  installConsoleCSS(document);
  installEditorCSS(document);
  installDisplayCSS(document);
  installEvaluatorCSS(document);
};

window.bootstrap = async () => {
  const initialScript = '';
  const { addPage, nextPage, lastPage } = await installDisplay({ document, readFile, watchFile, watchFileCreation });
  const { evaluator } = await installEvaluator({});
  await installEditor({ addPage, document, evaluator, initialScript, nextPage, lastPage });
  await installConsole({ addPage, document, watchFile });
};
