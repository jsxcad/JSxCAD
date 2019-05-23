import { createService, readFile, writeFile } from '@jsxcad/sys';

const agent = async ({ ask, question }) => {
  if (question.readFile) {
    const { options, path } = question.readFile;
    return readFile(options, path);
  } else if (question.writeFile) {
    const { options, path, data } = question.writeFile;
    return writeFile(options, path, data);
  }
};

export const installEvaluatorCSS = () => {};

export const installEvaluator = async () => {
  const { ask } = await createService({ webWorker: './webworker.js', agent });
  const evaluator = async (script) => {
    const geometry = await ask({ evaluate: script });
    if (geometry) {
      await writeFile({ preview: true, geometry }, 'preview', 'preview');
    }
  }
  return { evaluator };
};
