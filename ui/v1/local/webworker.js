import * as api from './jsxcad-api-v1.js';
import { boot, conversation, log, setupFilesystem, clearEmitted, emit, resolvePending, getEmitted, write } from './jsxcad-sys.js';
import { toEcmascript } from './jsxcad-compiler.js';

/* global postMessage, onmessage:writable, self */

const writeNotebook = async path => {
  resolvePending(); // Update the notebook.

  const notebook = getEmitted(); // Resolve any promises.

  for (const note of notebook) {
    if (note.download) {
      for (const entry of note.download.entries) {
        entry.data = await entry.data;
      }
    }
  }

  await write(`notebook/${path}`, notebook);
};

const say = message => postMessage(message);

const agent = async ({
  ask,
  question
}) => {
  await log({
    op: 'clear'
  });
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
      const ecmascript = await toEcmascript(question.evaluate);
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
      await writeNotebook(question.path);
      setupFilesystem();
    }
  }
};

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
  }) => hear(data);

  if (onmessage === undefined) throw Error('die');
};

bootstrap();
