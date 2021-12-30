/* global FileReaderSync, postMessage, self */

import * as sys from '@jsxcad/sys';

import baseApi, { evaluate as evaluateScript } from '@jsxcad/api';

import hashSum from 'hash-sum';

// Compatibility with threejs.
self.window = {};

const say = (message) => {
  // console.log(`QQ/webworker/say: ${JSON.stringify(message)}`);
  postMessage(message);
};

const reportError = (error) => {
  const entry = { text: error.stack ? error.stack : error, level: 'serious' };
  const hash = hashSum(entry);
  sys.emit({ error: entry, hash });
  sys.log({
    op: 'text',
    text: error.stack ? error.stack : error,
    level: 'serious',
  });
};

sys.setPendingErrorHandler(reportError);

const agent = async ({ ask, message, type, tell }) => {
  const { op } = message;
  const {
    config,
    offscreenCanvas,
    id,
    path,
    workspace,
    script,
    sha = 'master',
    view,
  } = message;

  if (workspace) {
    sys.setupFilesystem({ fileBase: workspace });
  }

  try {
    switch (op) {
      case 'sys/attach':
        self.id = id;
        sys.setConfig(config);
        return;
      case 'app/staticView':
        const geometry = await sys.readOrWatch(path, { workspace });
        const { staticView } = await import('@jsxcad/ui-threejs');
        await staticView(baseApi.Shape.fromGeometry(geometry), {
          ...view,
          canvas: offscreenCanvas,
        });
        const blob = await offscreenCanvas.convertToBlob({ type: 'image/png' });
        const dataURL = new FileReaderSync().readAsDataURL(blob);
        return dataURL;
      case 'app/evaluate':
        await sys.log({ op: 'text', text: 'Evaluation Started' });
        sys.clearEmitted();
        try {
          // console.log({ op: 'text', text: `QQ/script: ${script}` });
          const api = { ...baseApi, sha };
          await evaluateScript(script, { api, path });
          await sys.log({
            op: 'text',
            text: 'Evaluation Succeeded',
            level: 'serious',
          });
          await sys.log({ op: 'evaluate', status: 'success' });
          // Wait for any pending operations.
          // Finally answer the top level question.
          return true;
        } catch (error) {
          reportError(error);
          await sys.log({
            op: 'text',
            text: 'Evaluation Failed',
            level: 'serious',
          });
          await sys.log({ op: 'evaluate', status: 'failure' });
          throw error;
        } finally {
          await sys.resolvePending();
        }
      default:
        throw Error(`Unknown operation ${op}`);
    }
  } catch (error) {
    console.log(error.stack);
    throw error;
  }
};

// We need to start receiving messages immediately, but we're not ready to process them yet.
// Put them in a buffer.
if (!self.messageBootQueue) {
  // The buffer wasn't set up in advance (e.g., we aren't being loaded via import())
  self.messageBootQueue = [];
  self.onmessage = ({ data }) => self.messageBootQueue.push(data);
}

const bootstrap = async () => {
  const { ask, hear, tell } = sys.createConversation({ agent, say });

  self.ask = ask;
  self.tell = tell;
  // sys/log depends on ask, so set that up before we boot.
  await sys.boot();

  sys.addOnEmitHandler(async (notes) => {
    if (notes.length === 0) {
      return;
    }
    for (const note of notes) {
      if (note.download) {
        for (const entry of note.download.entries) {
          entry.data = await entry.data;
        }
      }
    }
    self.tell({ op: 'notes', notes, sourceLocation: notes[0].sourceLocation });
  });

  // Handle any messages that came in while we were booting up.
  if (self.messageBootQueue.length > 0) {
    do {
      hear(self.messageBootQueue.shift());
    } while (self.messageBootQueue.length > 0);
  }

  // The boot queue must be empty at this point.
  self.onmessage = ({ data }) => hear(data);

  if (self.onmessage === undefined) throw Error('die');
};

bootstrap();
