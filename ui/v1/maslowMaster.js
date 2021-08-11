import { createService, sleep } from '@jsxcad/sys';

window.bootstrap = async () => {
  const agent = async ({ ask, question }) => {
    // This just handles questions from the worker.
    console.log(`Was asked: ${JSON.stringify(question)}`);
  };

  const serviceSpec = {
    webWorker: `./maslowWorker.js`,
    agent,
    workerType: 'module',
  };

  const question = {
    key: 'create'

  const a = askService(serviceSpec, question, transfer);
  const b = askService(serviceSpec, question, transfer);
  const c = askService(serviceSpec, question, transfer);
  const d = askService(serviceSpec, question, transfer);

  const { ask } = await createService({
    webWorker: './maslowWorker.js',
    agent,
  });

  const result = await ask({
    values: [10, 10],
    key: 'rectangle',
  });

  console.log(JSON.stringify(result));
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
