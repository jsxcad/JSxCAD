/* global self */

// FIX: Refactor this once we figure it out.

import * as fs from 'fs';

import { getBase, getFilesystem, qualifyPath, setupFilesystem } from './filesystem';
import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { getFile } from './files';
import isUrlHttp from 'is-url-http';
import localForage from 'localforage';
import { log } from './log';
import nodeFetch from 'node-fetch';
import { toByteArray } from 'base64-js';
import { writeFile } from './writeFile';

const { promises } = fs;

const getUrlFetcher = async () => {
  if (typeof window !== 'undefined') {
    return window.fetch;
  } else {
    return nodeFetch;
  }
};

const getFileFetcher = async (qualify = qualifyPath) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (path) => {
      return promises.readFile(qualify(path));
    };
  } else if (isBrowser) {
    return async (path) => {
      const data = await localForage.getItem(qualify(path));
      if (data !== null) {
        return new Uint8Array(toByteArray(data));
      }
    };
  } else {
    throw Error('die');
  }
};

// Fetch from internal store.
const fetchPersistent = async (path) => {
  try {
    const base = getBase();
    if (base !== undefined) {
      const fetchFile = await getFileFetcher();
      const data = await fetchFile(path);
      return data;
    }
  } catch (e) {
    if (e.code && e.code === 'ENOENT') {
      return;
    }
    console.log(e);
  }
};

// Fetch from external sources.
const fetchSources = async (options = {}, sources) => {
  const fetchUrl = await getUrlFetcher();
  const fetchFile = await getFileFetcher(path => path);
  // Try to load the data from a source.
  for (const source of sources) {
    if (typeof source === 'string') {
      try {
        if (isUrlHttp(source)) {
          log({ op: 'text', text: `# Fetching ${source}` });
          const response = await fetchUrl(source);
          if (response.ok) {
            return new Uint8Array(await response.arrayBuffer());
          }
        } else {
          // Assume a file path.
          const data = await fetchFile(source);
          if (data !== undefined) {
            return data;
          }
        }
      } catch (e) {
      }
    } else {
      throw Error('die');
    }
  }
};

export const readFile = async (options, path) => {
  const { allowFetch = true, ephemeral, as = 'utf8' } = options;
  if (isWebWorker) {
    return self.ask({ readFile: { options, path } });
  }
  const { sources = [], project = getFilesystem(), useCache = true } = options;
  let originalProject = getFilesystem();
  if (project !== originalProject) {
    log({ op: 'text', text: `Read ${path} of ${project}` });
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: project });
  } else {
    log({ op: 'text', text: `Read ${path}` });
  }
  const file = await getFile(options, path);
  if (file.data === undefined || useCache === false) {
    file.data = await fetchPersistent(path);
  }
  if (project !== originalProject) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalProject });
  }
  if (file.data === undefined && allowFetch) {
    file.data = await fetchSources({}, sources);
    if (!ephemeral && file.data !== undefined) {
      // Update persistent storage.
      await writeFile(options, path, file.data);
    }
  }
  if (file.data !== undefined) {
    if (file.data.then) {
      // Resolve any outstanding promises.
      file.data = await file.data;
    }
  }
  if (file.data !== undefined) {
    if (as === 'bytes') {
      return file.data;
    } else {
      return new TextDecoder('utf8').decode(file.data);
    }
  }
};
