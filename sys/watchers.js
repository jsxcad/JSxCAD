const fileChangeWatchers = new Set();
const fileChangeWatchersByPath = new Map();
const fileCreationWatchers = new Set();
const fileDeletionWatchers = new Set();

export const runFileCreationWatchers = async (path, options) => {
  for (const watcher of fileCreationWatchers) {
    await watcher(path, options);
  }
};

export const runFileDeletionWatchers = async (path, options) => {
  for (const watcher of fileDeletionWatchers) {
    await watcher(path, options);
  }
};

export const runFileChangeWatchers = async (path, options) => {
  for (const watcher of fileChangeWatchers) {
    await watcher(path, options);
  }
  const watchers = fileChangeWatchersByPath.get(path);
  if (watchers === undefined) {
    return;
  }
  for (const watcher of watchers) {
    await watcher(path, options);
  }
};

export const watchFile = async (path, thunk, options) => {
  if (thunk) {
    let watchers = fileChangeWatchersByPath.get(path);
    if (watchers === undefined) {
      watchers = new Set();
      fileChangeWatchersByPath.set(path, watchers);
    }
    watchers.add(thunk);
    return thunk;
  }
};

export const unwatchFile = async (path, thunk, options) => {
  if (thunk) {
    const watchers = fileChangeWatchersByPath.get(path);
    if (watchers === undefined) {
      return;
    }
    watchers.delete(thunk);
  }
};

export const unwatchFileChange = async (thunk) => {
  fileChangeWatchers.delete(thunk);
  return thunk;
};

export const unwatchFileCreation = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const unwatchFileDeletion = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const watchFileChange = async (thunk) => {
  fileChangeWatchers.add(thunk);
  return thunk;
};

export const watchFileCreation = async (thunk) => {
  fileCreationWatchers.add(thunk);
  return thunk;
};

export const watchFileDeletion = async (thunk) => {
  fileDeletionWatchers.add(thunk);
  return thunk;
};
