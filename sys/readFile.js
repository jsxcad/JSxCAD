/* global self */

// FIX: Refactor this once we figure it out.

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { getBase } from './filesystem';
import { getFile } from './files';
import { isBase64 } from 'is-base64';
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

const getFileFetcher = async () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return promises.readFile;
  } else if (isBrowser) {
    return async (path) => {
      const data = await localForage.getItem(`file/${path}`);
      if (data !== null) {
        if (isBase64(data)) {
          return toByteArray(data);
        } else {
          return new TextEncoder('utf8').encode(data);
        }
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
      return await fetchFile(`${base}${path}`);
    }
  } catch (e) {
  }
};

// Fetch from external sources.
const fetchSources = async (options = {}, sources) => {
  const fetchUrl = await getUrlFetcher();
  const fetchFile = await getFileFetcher();
  // Try to load the data from a source.
  for (const source of sources) {
    if (typeof source === 'string') {
      try {
        if (isUrlHttp(source)) {
          log(`# Fetching ${source}`);
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
    } else if (source.url !== undefined) {
      // DEPRECATE
      log(`# Fetching ${source.url}`);
      const response = await fetchUrl(source.url);
      if (response.ok) {
        return new Uint8Array(await response.arrayBuffer());
      }
    } else if (source.file !== undefined) {
      // DEPRECATE
      try {
        const data = await fetchFile(source.file);
        if (data !== undefined) {
          return data;
        }
      } catch (e) {}
    } else {
      throw Error('die');
    }
  }
};

export const readFile = async (options, path) => {
  const { ephemeral, as = 'utf8' } = options;
  if (isWebWorker) {
    return self.ask({ readFile: { options, path } });
  }
  const { sources = [] } = options;
  const file = getFile(options, path);
  if (file.data === undefined) {
    file.data = await fetchPersistent(path);
  }
  if (file.data === undefined) {
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
