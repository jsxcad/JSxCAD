/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { Buffer } from 'buffer';
import { getFile } from './files';
import { log } from './log';
import nodeFetch from 'node-fetch';
import { writeFile } from './writeFile';

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
    return fs.promises.readFile;
  } else if (isBrowser) {
    // This will always fail, but maybe it should use local storage.
    return () => {};
  } else {
    throw Error('die');
  }
};

// Fetch from internal store.
// FIX: Support browser local storage.
const fetchPersistent = async (path) => {
  try {
    const fetchFile = await getFileFetcher();
    const data = await fetchFile(path);
    return data;
  } catch (e) {
  }
};

// Fetch from external sources.
const fetchSources = async (sources) => {
  const fetchUrl = await getUrlFetcher();
  const fetchFile = await getFileFetcher();
  // Try to load the data from a source.
  for (const source of sources) {
    if (source.url !== undefined) {
      log(`# Fetching ${source.url}`);
      const response = await fetchUrl(source.url);
      if (response.ok) {
        const data = await response.text();
        return data;
      }
    } else if (source.file !== undefined) {
      try {
        const data = await fetchFile(source.file);
        return data;
      } catch (e) {}
    } else {
      throw Error('die');
    }
  }
};

export const readFile = async (options, path) => {
  const { ephemeral, decode } = options;
  if (isWebWorker) {
    return self.ask({ readFile: { options, path } });
  }
  const { sources = [] } = options;
  const file = getFile(options, path);
  if (file.data === undefined) {
    file.data = await fetchPersistent(path);
    if (file.data !== undefined) {
      if (decode !== undefined && Buffer.isBuffer(file.data)) {
        file.data = file.data.toString(decode);
      }
    }
  }
  if (file.data === undefined) {
    file.data = await fetchSources(sources);
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
