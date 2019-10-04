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
    let start = new Date().getTime();
    let runClock = true;
    const clockElement = document.getElementById('evaluatorClock');
    const tick = () => {
      if (runClock) {
        setTimeout(tick, 100);
        const duration = new Date().getTime() - start;
        clockElement.textContent = `${(duration / 1000).toFixed(2)}`;
      }
    };
    tick();
    const geometry = await ask({ evaluate: script });
    if (geometry) {
      await writeFile({}, 'file/preview', 'preview');
      await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
    }
    runClock = false;
  };
  return { evaluator };
};
