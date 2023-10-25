/* global postMessage, self */

import * as sys from '@jsxcad/sys';

import baseApi, { evaluate as evaluateScript } from '@jsxcad/api';

import { dataUrl } from '@jsxcad/ui-threejs';
import hashSum from 'hash-sum';

// Compatibility with threejs.
self.window = {};

const say = (message) => {
  // console.log(`QQ/webworker/say: ${JSON.stringify(message)}`);
  postMessage(message);
};

const reportError = (error) => {
  const entry = {
    text: error.stack ? error.stack : '' + error,
    level: 'serious',
  };
  const hash = hashSum(entry);
  sys.emit({ error: entry, hash });
  sys.log({
    op: 'text',
    text: error.stack ? error.stack : '' + error,
    level: 'serious',
  });
  sys.flushEmitGroup();
};

sys.setPendingErrorHandler(reportError);

const agent = async ({ ask, message, type, tell }) => {
  const { op } = message;
  const {
    config,
    id,
    path,
    workspace,
    script,
    sha = 'master',
    version,
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
        for (;;) {
          const geometry = await sys.readOrWatch(path, { workspace });
          return await dataUrl(baseApi.Shape.fromGeometry(geometry), view);
        }
      case 'app/evaluate':
        sys.clearEmitted();
        sys.clearTimes();
        // Note we assume a consistent version is used for a given session (i.e., for a given id there is one version).
        self.version = version;
        const section = {
          controls: [],
          downloads: [],
          errors: [],
          mds: [],
          views: [],
        };
        const sectionBuilder = (notes) => {
          for (const note of notes) {
            if (note.control) {
              section.controls.push(note);
            } else if (note.download) {
              section.downloads.push(note);
            } else if (note.error) {
              section.errors.push(note);
            } else if (note.md) {
              section.mds.push(note);
            } else if (note.view) {
              section.views.push(note);
            }
          }
        };
        try {
          sys.addOnEmitHandler(sectionBuilder);
          // console.log({ op: 'text', text: `QQ/script: ${script}` });
          const api = { ...baseApi, sha };
          await evaluateScript(script, { api, path, workspace });
          await sys.log({ op: 'evaluate', status: 'success' });
          // Wait for any pending operations.
          // Finally answer the top level question.
          section.profile = sys.getTimes();
        } catch (error) {
          reportError(error);
          await sys.log({ op: 'evaluate', status: 'failure' });
          throw error;
        } finally {
          await sys.resolvePending();
          sys.removeOnEmitHandler(sectionBuilder);
        }
        return section;
      default:
        throw Error(`Unknown operation ${op}`);
    }
  } catch (error) {
    console.log(error.stack);
    // throw error;
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
  console.log(`QQ/webworker/bootstrap/pre`);
  await sys.boot();
  console.log(`QQ/webworker/bootstrap/post`);

  sys.addOnEmitHandler(async (notes) => {
    if (notes.length === 0) {
      return;
    }
    for (const note of notes) {
      note.version = self.version;
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
