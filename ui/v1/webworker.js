/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as sys from '@jsxcad/sys';

const resolveNotebook = async (path) => {
  await sys.resolvePending();
  // Update the notebook.
  const notebook = sys.getEmitted();
  // Resolve any promises.
  for (const note of notebook) {
    if (note.download) {
      for (const entry of note.download.entries) {
        entry.data = await entry.data;
      }
    }
  }
};

const say = (message) => postMessage(message);

const reportError = (error) => {
  sys.emit({
    log: { text: error.stack ? error.stack : error, level: 'serious' },
  });
  sys.log({
    op: 'text',
    text: error.stack ? error.stack : error,
    level: 'serious',
  });
};

sys.setPendingErrorHandler(reportError);

const agent = async ({ ask, question }) => {
  await sys.log({ op: 'evaluate', status: 'run' });
  await sys.log({ op: 'text', text: 'Evaluation Started' });
  if (question.evaluate) {
    sys.setupFilesystem({ fileBase: question.workspace });
    sys.clearEmitted();
    try {
      const ecmascript = question.evaluate;
      console.log({ op: 'text', text: `QQ/script: ${question.evaluate}` });
      console.log({ op: 'text', text: `QQ/ecmascript: ${ecmascript}` });
      const builder = new Function(
        `{ ${Object.keys(api).join(', ')} }`,
        `return async () => { ${ecmascript} };`
      );
      const module = await builder(api);
      await module();
      await sys.log({
        op: 'text',
        text: 'Evaluation Succeeded',
        level: 'serious',
      });
      await sys.log({ op: 'evaluate', status: 'success' });
      // Wait for any pending operations.
    } catch (error) {
      reportError(error);
      await sys.log({
        op: 'text',
        text: 'Evaluation Failed',
        level: 'serious',
      });
      await sys.log({ op: 'evaluate', status: 'failure' });
    } finally {
      await resolveNotebook(question.path);
      await sys.resolvePending();
    }
    sys.setupFilesystem();
    return sys.getEmitted();
  }
};

// We need to start receiving messages immediately, but we're not ready to process them yet.
// Put them in a buffer.
const messageBootQueue = [];
onmessage = ({ data }) => messageBootQueue.push(data);

const bootstrap = async () => {
  await sys.boot();
  const { ask, hear } = sys.conversation({ agent, say });
  self.ask = ask;
  onmessage = ({ data }) => hear(data);
  // Now that we're ready, drain the buffer.
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
