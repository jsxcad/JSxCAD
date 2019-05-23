/* global self */

// FIX: Refactor this once we figure it out.

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { Buffer } from 'buffer';
import { getFile } from './files';
import { log } from './log';
import nodeFetch from 'node-fetch';
import { writeFile } from './writeFile';

const { promises } = fs;

const dataAs = (as, data) => {
  if (data !== undefined) {
    switch (as) {
      case 'utf8':
        if (typeof data === 'string') {
          return data;
        } else if (Buffer.isBuffer(data)) {
          const utf8 = data.toString('utf8');
          return utf8;
        }
        break;
      case 'bytes':
        if (Buffer.isBuffer(data)) {
          return data;
        } else if (data instanceof ArrayBuffer) {
          return new Uint8Array(data);
        }
        break;
    }
  }
};

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
    // This will always fail, but maybe it should use local storage.
    return () => {};
  } else {
    throw Error('die');
  }
};

// Fetch from internal store.
// FIX: Support browser local storage.
const fetchPersistent = async ({ as }, path) => {
  try {
    const fetchFile = await getFileFetcher();
    const data = await fetchFile(path);
    return dataAs(as, data);
  } catch (e) {
  }
};

// Fetch from external sources.
const fetchSources = async ({ as = 'utf8' }, sources) => {
  const fetchUrl = await getUrlFetcher();
  const fetchFile = await getFileFetcher();
  // Try to load the data from a source.
  for (const source of sources) {
    if (source.url !== undefined) {
      log(`# Fetching ${source.url}`);
      const response = await fetchUrl(source.url);
      if (response.ok) {
        switch (as) {
          case 'utf8':
            return dataAs(as, await response.text());
          case 'bytes':
            return dataAs(as, await response.arrayBuffer());
        }
      }
    } else if (source.file !== undefined) {
      try {
        const data = await fetchFile(source.file);
        if (data !== undefined) {
          return dataAs(as, data);
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
  if (file.data === undefined || file.as !== as) {
    file.data = await fetchPersistent({ as }, path);
    file.as = as;
  }
  if (file.data === undefined || file.as !== as) {
    file.data = await fetchSources({ as }, sources);
    file.as = as;
    if (!ephemeral) {
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
  return file.data;
};
