/* global self */
// FIX: Refactor this once we figure it out.

import * as fs from 'fs';
import * as v8 from 'v8';

import { ensureQualifiedFile, getFile } from './files.js';
import { getFilesystem, qualifyPath } from './filesystem.js';
import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';
import { unwatchFile, watchFile } from './watchers.js';

import { ErrorWouldBlock } from './error.js';
import { addPending } from './pending.js';
import { db } from './db.js';
import { logInfo } from './log.js';
import nodeFetch from 'node-fetch';
import { write } from './write.js';

const { promises } = fs;
const { deserialize } = v8;

const getUrlFetcher = () => {
  if (isBrowser) {
    return window.fetch;
  }
  if (isWebWorker) {
    return self.fetch;
  }
  if (isNode) {
    return nodeFetch;
  }
  throw Error('Expected browser or web worker or node');
};

const urlFetcher = getUrlFetcher();

const getExternalFileFetcher = () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (qualifiedPath) => {
      try {
        let data = await promises.readFile(qualifiedPath);
        return data;
      } catch (e) {
        if (e.code && e.code === 'ENOENT') {
          return {};
        }
        logInfo('sys/getExternalFile/error', e.toString());
      }
    };
  } else if (isBrowser || isWebWorker) {
    return async (qualifiedPath) => {};
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

const externalFileFetcher = getExternalFileFetcher();

const getInternalFileFetcher = () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (qualifiedPath, doSerialize = true) => {
      try {
        let data = await promises.readFile(qualifiedPath);
        if (doSerialize) {
          data = deserialize(data);
        }
        // FIX: Use a proper version.
        return { data, version: 0 };
      } catch (e) {
        if (e.code && e.code === 'ENOENT') {
          return {};
        }
        logInfo('sys/getExternalFile/error', e.toString());
      }
    };
  } else if (isBrowser || isWebWorker) {
    return (qualifiedPath) =>
      db(qualifiedPath).getItemAndVersion(qualifiedPath);
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

const internalFileFetcher = getInternalFileFetcher();

const getInternalFileVersionFetcher = (qualify = qualifyPath) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return (qualifiedPath) => {
      // FIX: Use a proper version.
      return 0;
    };
  } else if (isBrowser || isWebWorker) {
    return (qualifiedPath) => db(qualifiedPath).getItemVersion(qualifiedPath);
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

const internalFileVersionFetcher = getInternalFileVersionFetcher();

// Fetch from internal store.
const fetchPersistent = (qualifiedPath, { workspace, doSerialize }) => {
  try {
    if (workspace) {
      return internalFileFetcher(qualifiedPath, doSerialize);
    } else {
      return {};
    }
  } catch (e) {
    if (e.code && e.code === 'ENOENT') {
      return {};
    }
    logInfo('sys/fetchPersistent/error', e.toString());
  }
};

const fetchPersistentVersion = (qualifiedPath, { workspace }) => {
  try {
    if (workspace) {
      return internalFileVersionFetcher(qualifiedPath);
    }
  } catch (e) {
    if (e.code && e.code === 'ENOENT') {
      return;
    }
    logInfo('sys/fetchPersistentVersion/error', e.toString());
  }
};

// Fetch from external sources.
const fetchSources = async (sources, { workspace }) => {
  // Try to load the data from a source.
  for (const source of sources) {
    if (typeof source === 'string') {
      try {
        if (source.startsWith('http:') || source.startsWith('https:')) {
          logInfo('sys/fetchSources/url', source);
          const response = await urlFetcher(source, { cache: 'reload' });
          if (response.ok) {
            return new Uint8Array(await response.arrayBuffer());
          }
        } else {
          logInfo('sys/fetchSources/file', source);
          // Assume a file path.
          const data = await externalFileFetcher(source);
          if (data !== undefined) {
            return data;
          }
        }
      } catch (e) {}
    } else {
      throw Error('Expected file source to be a string');
    }
  }
};

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
  } = options;
  const qualifiedPath = qualifyPath(path, workspace);
  const file = ensureQualifiedFile(path, qualifiedPath);

  if (file.data && workspace) {
    // Check that the version is still up to date.
    if (
      file.version !==
      (await fetchPersistentVersion(qualifiedPath, { workspace }))
    ) {
      file.data = undefined;
    }
  }

  if (file.data === undefined || useCache === false || forceNoCache) {
    const { value, version } = await fetchPersistent(qualifiedPath, {
      workspace,
      doSerialize: true,
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
      await write(path, data, { ...options, doSerialize: true }, path, data);
    }
    file.data = data;
  }
  if (file.data !== undefined) {
    if (file.data.then) {
      // Resolve any outstanding promises.
      file.data = await file.data;
    }
  }
  return file.data || otherwise;
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
