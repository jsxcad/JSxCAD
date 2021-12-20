const watchersByPath = new Map();

export const runFileWatchers = async (path, options) => {
  const watchers = watchersByPath.get(path);
  if (watchers === undefined) {
    return;
  }
  for (const watcher of watchers) {
    await watcher(path, options);
  }
};

export const watchFile = async (path, thunk, options) => {
  if (thunk) {
    let watchers = watchersByPath.get(path);
    if (watchers === undefined) {
      watchers = new Set();
      watchersByPath.set(path, watchers);
    }
    watchers.add(thunk);
    return thunk;
  }
};

export const unwatchFile = async (path, thunk, options) => {
  if (thunk) {
    const watchers = watchersByPath.get(path);
    if (watchers === undefined) {
      return;
    }
    watchers.delete(thunk);
  }
};
