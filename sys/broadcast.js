import {
  runFileChangeWatchers,
  runFileCreationWatchers,
  runFileDeletionWatchers,
  runFileReadWatchers,
} from './watchers.js';

import { BroadcastChannel } from './broadcast-channel.js';
import { logInfo } from './log.js';
import self from './self.js';

let broadcastChannel;

const receiveNotification = async ({ id, op, path, workspace }) => {
  logInfo(
    'sys/broadcast',
    `Received broadcast: ${JSON.stringify({ id, op, path, workspace })}`
  );
  switch (op) {
    case 'changePath':
      await runFileChangeWatchers(path, workspace);
      break;
    case 'createPath':
      await runFileCreationWatchers(path, workspace);
      break;
    case 'deletePath':
      await runFileDeletionWatchers(path, workspace);
      break;
    case 'readPath':
      await runFileReadWatchers(path, workspace);
      break;
    default:
      throw Error(
        `Unexpected broadcast ${JSON.stringify({ id, op, path, workspace })}`
      );
  }
};

const receiveBroadcast = ({ id, op, path, workspace }) => {
  if (id === (self && self.id)) {
    // We already received this via a local receiveNotification.
    return;
  }
  receiveNotification({ id, op, path, workspace });
};

export const sendBroadcast = async (message) => {
  // We send to ourself immediately, so that we can order effects like cache clears and updates.
  await receiveNotification(message);
  broadcastChannel.postMessage(message);
};

const initBroadcastChannel = async () => {
  broadcastChannel = new BroadcastChannel('sys/fs');
  broadcastChannel.onmessage = receiveBroadcast;
};

export const notifyFileChange = async (path, workspace) =>
  sendBroadcast({ id: self && self.id, op: 'changePath', path, workspace });

export const notifyFileCreation = async (path, workspace) =>
  sendBroadcast({ id: self && self.id, op: 'createPath', path, workspace });

export const notifyFileDeletion = async (path, workspace) =>
  sendBroadcast({ id: self && self.id, op: 'deletePath', path, workspace });

let notifyFileReadEnabled = false;

export const setNotifyFileReadEnabled = (state) => {
  notifyFileReadEnabled = state;
};

export const notifyFileRead = async (path, workspace) => {
  if (!notifyFileReadEnabled) {
    return;
  }
  return sendBroadcast({
    id: self && self.id,
    op: 'readPath',
    path,
    workspace,
  });
};

initBroadcastChannel();
