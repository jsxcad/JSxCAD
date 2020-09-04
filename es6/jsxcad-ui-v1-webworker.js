import * as api from './jsxcad-api-v1.js';
import { boot, conversation, log, setupFilesystem, clearEmitted, emit, resolvePending, getEmitted } from './jsxcad-sys.js';

/* global postMessage, onmessage:writable, self */

const resolveNotebook = async path => {
  await resolvePending(); // Update the notebook.

  const notebook = getEmitted(); // Resolve any promises.

  for (const note of notebook) {
    if (note.download) {
      for (const entry of note.download.entries) {
        entry.data = await entry.data;
      }
    }
  }
};

const say = message => postMessage(message);

const agent = async ({
  ask,
  question
}) => {
  await log({
    op: 'evaluate',
    status: 'run'
  });
  await log({
    op: 'text',
    text: 'Evaluation Started'
  });

  if (question.evaluate) {
    setupFilesystem({
      fileBase: question.workspace
    });
    clearEmitted();

    try {
      const ecmascript = question.evaluate;
      console.log({
        op: 'text',
        text: `QQ/script: ${question.evaluate}`
      });
      console.log({
        op: 'text',
        text: `QQ/ecmascript: ${ecmascript}`
      });
      const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, `return async () => { ${ecmascript} };`);
      const module = await builder(api);
      await module();
      await log({
        op: 'text',
        text: 'Evaluation Succeeded',
        level: 'serious'
      });
      await log({
        op: 'evaluate',
        status: 'success'
      }); // Wait for any pending operations.
    } catch (error) {
      emit({
        log: {
          text: error.stack,
          level: 'serious'
        }
      });
      await log({
        op: 'text',
        text: error.stack,
        level: 'serious'
      });
      await log({
        op: 'text',
        text: 'Evaluation Failed',
        level: 'serious'
      });
      await log({
        op: 'evaluate',
        status: 'failure'
      });
    } finally {
      await resolveNotebook(question.path);
      await resolvePending();
    }

    setupFilesystem();
    return getEmitted();
  }
}; // We need to start receiving messages immediately, but we're not ready to process them yet.
// Put them in a buffer.


const messageBootQueue = [];

onmessage = ({
  data
}) => messageBootQueue.push(data);

const bootstrap = async () => {
  await boot();
  const {
    ask,
    hear
  } = conversation({
    agent,
    say
  });
  self.ask = ask;

  onmessage = ({
    data
  }) => hear(data); // Now that we're ready, drain the buffer.


  if (self.messageBootQueue !== undefined) {
    while (self.messageBootQueue.length > 0) {
      hear(self.messageBootQueue.shift());
    }
  }

  while (messageBootQueue.length > 0) {
    hear(messageBootQueue.shift());
  }

  if (onmessage === undefined) throw Error('die');
};

bootstrap();
