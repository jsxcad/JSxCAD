/* global postMessage, onmessage:writable, self */

import { boot, createConversation, setupFilesystem, touch } from '@jsxcad/sys';

import api from '@jsxcad/api';

const say = (message) => postMessage(message);

const agent = async ({ ask, message }) => {
  try {
    console.log(`worker/message: ${JSON.stringify(message)}`);
    const { id, op, path, value, workspace } = message;
    if (workspace) {
      setupFilesystem({ fileBase: workspace });
    }
    switch (op) {
      case 'sys/attach':
        self.id = id;
        return;
      case 'sys/touch':
        if (id === undefined || id !== self.id) {
          // Don't respond to touches from ourself.
          await touch(path, { workspace, clear: true, broadcast: false });
        }
        return;
      case 'read':
        const readShape = await api.loadGeometry(path);
        return readShape.size().length;
      case 'write':
        const aBox = api.Box(value, value);
        return await api.saveGeometry(path, aBox);
      default:
        throw Error(`worker/unhandled: ${JSON.stringify(message)}`);
    }
  } catch (error) {
    throw error;
  }
};

const messageBootQueue = [];
onmessage = ({ data }) => messageBootQueue.push(data);

const bootstrap = async () => {
  await boot();
  const { ask, hear, tell } = createConversation({ agent, say });
  self.ask = ask;
  self.tell = tell;

  // Handle any messages that came in while we were booting up.
  if (messageBootQueue.length > 0) {
    do {
      hear(messageBootQueue.shift());
    } while (messageBootQueue.length > 0);
  }

  // The boot queue must be empty at this point.
  onmessage = ({ data }) => hear(data);

  if (onmessage === undefined) throw Error('die');
};

bootstrap();
