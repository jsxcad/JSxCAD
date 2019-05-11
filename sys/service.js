import { isBrowser, isNode } from './browserOrNode';

// Sets up a worker with conversational interface.
export const createService = async ({ nodeWorker, webWorker, agent }) => {
  if (isNode) {
    const { Worker } = await import('worker_threads');
    const worker = new Worker(nodeWorker, []);
    let id = 0;
    const openQuestions = {};
    const ask = (question) => {
      const promise = new Promise((resolve, reject) => { openQuestions[id] = { resolve, reject }; });
      worker.postMessage({ id, question });
      id += 1;
      return promise;
    };
    const stop = async () => {
      return new Promise((resolve, reject) => {
        worker.terminate((err, exitCode) => {
          if (err) {
            reject(err);
          } else {
            resolve(exitCode);
          }
        });
      });
    };
    worker.on('message', async ({ id, question, answer, error }) => {
      if (answer) {
        const { resolve, reject } = openQuestions[id];
        if (error) {
          reject(error);
        } else {
          resolve(answer);
        }
        delete openQuestions[id];
      } else if (question) {
        const answer = await agent({ ask, question });
        worker.postMessage({ id, answer });
      } else {
        throw Error('die');
      }
    });
    return { ask, stop };
  } else if (isBrowser) {
  } else {
    throw Error('die');
  }
};
