/* global FileReader, self */

import * as fs from 'fs';
import * as v8 from 'v8';

import { isBrowser, isNode, isWebWorker } from './browserOrNode.js';
import { logError, logInfo } from './log.js';
import nodeFetch, { AbortError as nodeAbortError } from 'node-fetch';

import { db } from './db.js';

const { deserialize } = v8;
const { promises } = fs;

// When base is undefined the persistent filesystem is disabled.
let base;

export const getBase = () => base;

export const qualifyPath = (path = '', workspace) => {
  if (workspace !== undefined) {
    return `jsxcad/${workspace}/${path}`;
  } else if (base !== undefined) {
    return `jsxcad/${base}${path}`;
  } else {
    return `jsxcad//${path}`;
  }
};

export const setupFilesystem = ({ fileBase } = {}) => {
  // A prefix used to partition the persistent filesystem for multiple workspaces.
  if (fileBase !== undefined) {
    if (fileBase.endsWith('/')) {
      base = fileBase;
    } else {
      base = `${fileBase}/`;
    }
  } else {
    base = undefined;
  }
};

export const setupWorkspace = (workspace) =>
  setupFilesystem({ fileBase: workspace });

export const getFilesystem = () => {
  if (base !== undefined) {
    const [filesystem] = base.split('/');
    return filesystem;
  }
};

export const getWorkspace = () => getFilesystem();

// This is keyed by prefix url and valued as FileSystemDirectoryHandle on browser and worker, or base path string on node.
const localFilesystems = new Map();

export const setLocalFilesystem = (prefix, value) => {
  localFilesystems.set(prefix, value);
};

export const getLocalFilesystems = () => localFilesystems.entries();

export const fetchWithTimeout =
  (fetch, AbortError) =>
  async (resource, options = {}) => {
    if (isBrowser || isWebWorker) {
      // Bypass for local files.
      for (const [prefix, handle] of localFilesystems) {
        if (resource.startsWith(prefix)) {
          try {
            const fileSystemFileHandle = await handle.getFileHandle(
              resource.substring(prefix.length)
            );
            const file = await fileSystemFileHandle.getFile();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) =>
                resolve({ ok: true, arrayBuffer: () => e.target.result });
              reader.readAsArrayBuffer(file);
            });
          } catch (e) {
            // FIX: Check the error.
          }
        }
      }
    } else if (isNode) {
      for (const [prefix, basePath] of localFilesystems) {
        if (resource.startsWith(prefix)) {
          const path = `${basePath}/${resource.substring(prefix.length)}`;
          return { ok: true, arrayBuffer: () => externalFileFetcher(path) };
        }
      }
    }
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort();
    }, timeout);
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

export const getUrlFetcher = () => {
  if (isBrowser) {
    return fetchWithTimeout(window.fetch, window.AbortError);
  }
  if (isWebWorker) {
    return fetchWithTimeout(self.fetch, self.AbortError);
  }
  if (isNode) {
    return fetchWithTimeout(nodeFetch, nodeAbortError);
  }
  throw Error('Expected browser or web worker or node');
};

export const urlFetcher = getUrlFetcher();

export const getExternalFileFetcher = () => {
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
        logError(
          'sys/getExternalFile/error',
          `qualifiedPath=${qualifiedPath} error=${e.toString()}`
        );
      }
    };
  } else if (isBrowser || isWebWorker) {
    return async (qualifiedPath) => {};
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

export const externalFileFetcher = getExternalFileFetcher();

export const getInternalFileFetcher = () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (qualifiedPath) => {
      try {
        let data = await promises.readFile(qualifiedPath);
        // FIX: Use a proper version.
        return { data: deserialize(data), version: 0 };
      } catch (e) {
        if (e.code && e.code === 'ENOENT') {
          return {};
        }
        logError(
          'sys/getInternalFile/error',
          `qualifiedPath=${qualifiedPath} error=${e.toString()}`
        );
        return {};
      }
    };
  } else if (isBrowser || isWebWorker) {
    return (qualifiedPath) =>
      db(qualifiedPath).getItemAndVersion(qualifiedPath);
  } else {
    throw Error('Expected node or browser or web worker');
  }
};

export const internalFileFetcher = getInternalFileFetcher();

export const getInternalFileVersionFetcher = (qualify = qualifyPath) => {
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

export const internalFileVersionFetcher = getInternalFileVersionFetcher();

// Fetch from internal store.
export const fetchPersistent = (qualifiedPath, { workspace }) => {
  try {
    if (workspace) {
      return internalFileFetcher(qualifiedPath);
    } else {
      return {};
    }
  } catch (e) {
    if (e.code && e.code === 'ENOENT') {
      return {};
    }
    logError(
      'sys/fetchPersistent/error',
      `qualifiedPath=${qualifiedPath} error=${e.toString()}`
    );
    console.log(
      `sys/fetchPersistent/error: qualifiedPath=${qualifiedPath} error=${e.toString()}`
    );
  }
};

export const fetchPersistentVersion = (qualifiedPath, { workspace }) => {
  try {
    if (workspace) {
      return internalFileVersionFetcher(qualifiedPath);
    }
  } catch (e) {
    if (e.code && e.code === 'ENOENT') {
      return;
    }
    logError(
      'sys/fetchPersistentVersion/error',
      `qualifiedPath=${qualifiedPath} error=${e.toString()}`
    );
  }
};

// Fetch from external sources.
export const fetchSources = async (sources, { workspace }) => {
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
            return new Uint8Array(data);
          }
        }
      } catch (e) {}
    } else {
      throw Error('Expected file source to be a string');
    }
  }
};
