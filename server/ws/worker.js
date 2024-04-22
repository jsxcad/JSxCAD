import {
  addOnEmitHandler,
  boot,
  clearFileCache,
  read,
  removeOnEmitHandler,
  resolvePending,
  setupWorkspace,
} from '@jsxcad/sys';
import api, { importScript } from '@jsxcad/api';
import { parentPort } from 'worker_threads';

const run = async () => {
  let pending = null;
  const queue = [];

  parentPort.on('message', (message) => {
    queue.push(message);
    if (pending) {
      pending();
    }
  });

  const getMessage = () => {
    if (queue.length > 0) {
      return queue.shift();
    } else {
      return new Promise((resolve, reject) => {
        pending = () => {
          pending = null;
          resolve(queue.shift());
        };
      });
    }
  };

  for (;;) {
    const message = await getMessage();
    const { op, sessionId, module, script, pathname } = JSON.parse(message);
    switch (op) {
      case 'hello':
        setupWorkspace(`session${sessionId}`);
        break;
      case 'run':
        try {
          const collectedNotes = [];
          const addNotes = async (notes) => {
            collectedNotes.push(...notes);
          };
          const onEmitHandler = addOnEmitHandler(addNotes);
          const topLevel = new Map();
          // This is a problem for asynchronous requests.
          await importScript(api, module, script, {
            clearUpdateEmits: true,
            topLevel,
            updateCache: false,
          });
          await resolvePending();
          removeOnEmitHandler(onEmitHandler);
          parentPort.postMessage(JSON.stringify(collectedNotes));
        } catch (error) {
          console.log(error.stack);
          parentPort.postMessage(
            JSON.stringify([{ error: { text: error.stack } }])
          );
        }
        break;
      case 'read':
        parentPort.postMessage(await read(pathname));
        break;
      case 'bye':
        clearFileCache();
        setupWorkspace();
        break;
      default:
        throw Error(`Unknown op ${op}`);
        break;
    }
  }
};

run();
