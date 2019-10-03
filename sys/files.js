import { getBase } from './filesystem';

const files = new Map();
const fileCreationWatchers = [];

export const getFile = (options, unqualifiedPath) => {
  const path = `${getBase()}/${unqualifiedPath}`;
  let file = files.get(path);
  if (file === undefined) {
    file = { path: unqualifiedPath, watchers: [] };
    files.set(path, file);
    for (const watcher of fileCreationWatchers) {
      watcher(options, file);
    }
  }
  return file;
};

export const watchFileCreation = (thunk) => {
  return fileCreationWatchers.push(thunk);
};
