/* global postMessage, onmessage:writable, self */

import {
  boot,
  createConversation,
  read,
  setupFilesystem,
  touch,
  write,
} from '../../es6/jsxcad-sys.js';

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
        return await read(path);
      case 'write':
        return await write(path, value);
      default:
        throw Error(`worker/unhandled: ${JSON.stringify(message)}`);
    }
  } catch (error) {
    throw error;
  }
};

const bootstrap = async () => {
  await boot();
  const { ask, hear, tell } = createConversation({ agent, say });
  self.ask = ask;
  self.tell = tell;
  onmessage = ({ data }) => hear(data);
  if (onmessage === undefined) throw Error('die');
};

bootstrap();
