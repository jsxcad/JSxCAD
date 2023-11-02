// FIX: Refactor this once we figure it out.

import { ensureQualifiedFile, getFile } from './files.js';
import {
  fetchPersistent,
  fetchPersistentVersion,
  fetchSources,
  getFilesystem,
  qualifyPath,
} from './filesystem.js';
import { unwatchFile, watchFile } from './watchers.js';

import { ErrorWouldBlock } from './error.js';
import { addPending } from './pending.js';
import { notifyFileRead } from './broadcast.js';
import { write } from './write.js';

export const readNonblocking = (path, options = {}) => {
  const { workspace = getFilesystem(), errorOnMissing = true } = options;
  const file = getFile(path, workspace);
  if (file) {
    return file.data;
  }
  addPending(read(path, options));
  if (errorOnMissing) {
    throw new ErrorWouldBlock(`Would have blocked on read ${path}`);
  }
};

export const read = async (path, options = {}) => {
  const {
    allowFetch = true,
    ephemeral,
    sources = [],
    workspace = getFilesystem(),
    useCache = true,
    forceNoCache = false,
    decode,
    otherwise,
    notifyFileReadEnabled = true,
  } = options;
  const qualifiedPath = qualifyPath(path, workspace);
  const file = ensureQualifiedFile(path, qualifiedPath);

  if (file.data && workspace && !ephemeral) {
    // Check that the version is still up to date.
    const persistentVersion = await fetchPersistentVersion(qualifiedPath, {
      workspace,
    });
    if (file.version !== persistentVersion) {
      file.data = undefined;
    }
  }

  if (file.data === undefined || useCache === false || forceNoCache) {
    const { value, version } = await fetchPersistent(qualifiedPath, {
      workspace,
    });
    file.data = value;
    file.version = version;
  }

  if (file.data === undefined && allowFetch && sources.length > 0) {
    let data = await fetchSources(sources, { workspace });
    if (decode) {
      data = new TextDecoder(decode).decode(data);
    }
    if (!ephemeral && file.data !== undefined) {
      // Update persistent cache.
      await write(path, data, options, path, data);
    }
    file.data = data;
  }
  if (file.data !== undefined) {
    while (file.data.then) {
      // Resolve any outstanding promises.
      file.data = await file.data;
    }
  }
  if (notifyFileReadEnabled) {
    await notifyFileRead(path, workspace);
  }
  if (file.data === undefined) {
    return otherwise;
  }
  return file.data;
};

export const readOrWatch = async (path, options = {}) => {
  const data = await read(path, options);
  if (data !== undefined) {
    return data;
  }
  let resolveWatch;
  const watch = new Promise((resolve) => {
    resolveWatch = resolve;
  });
  const watcher = await watchFile(path, options.workspace, (file) =>
    resolveWatch(path)
  );
  await watch;
  await unwatchFile(path, options.workspace, watcher);
  return read(path, options);
};
