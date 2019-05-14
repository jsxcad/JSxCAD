import { createService } from '@jsxcad/sys';

const agent = async ({ ask, question }) => {};

export const installEvaluatorCSS = () => {};

export const installEvaluator = async () => {
  const { ask } = await createService({ webWorker: './webworker.js', agent });
  const evaluator = async (script) => ask({ evaluate: script });
  return { evaluator };
};
