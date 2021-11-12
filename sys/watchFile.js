import { getFile } from './files.js';

export const watchFile = async (path, thunk, options) => {
  if (thunk) {
    (await getFile(options, path)).watchers.add(thunk);
    return thunk;
  }
};

export const unwatchFile = async (path, thunk, options) => {
  if (thunk) {
    return (await getFile(options, path)).watchers.delete(thunk);
  }
};
