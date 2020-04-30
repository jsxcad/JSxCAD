/* global Window, self */
// FIX: Refactor this once we figure it out.

import * as fs from 'fs';
import * as v8 from 'v8';

import { getBase, getFilesystem, qualifyPath, setupFilesystem } from './filesystem';
import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { db } from './db';
import { getFile } from './files';
import { log } from './log';
import nodeFetch from 'node-fetch';
import { writeFile } from './writeFile';

const { promises } = fs;
const { deserialize } = v8;

// Read decoders allow us to turn data back into objects based on structure.
const readDecoders = [];

export const addReadDecoder = (guard, decoder) => readDecoders.push({ guard, decoder });

// There should be a better way to do this.
const decode = (data) => {
  if (typeof data !== 'object') {
    return data;
  }
  for (const { guard, decoder } of readDecoders) {
    if (guard(data)) {
      return decoder(data);
    }
  }
  if (Array.isArray(data)) {
    // We may have arrays of things to decode.
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] === 'object') {
        data[i] = decode(data[i]);
      }
    }
  } else if (data.byteLength === undefined) {
    // We may have objects of things to decode, but not ArrayBuffers.
    for (let key of Object.keys(data)) {
      data[key] = decode(data[key]);
    }
  }
  return data;
};

const getUrlFetcher = async () => {
  if (isBrowser) {
    return Window.fetch;
  }
  if (isWebWorker) {
    return self.fetch;
  }
  if (isNode) {
    return nodeFetch;
  }
  throw Error('die');
};

const getFileFetcher = async (qualify = qualifyPath, doSerialize = true) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    return async (path) => {
      let data = await promises.readFile(qualify(path));
      if (doSerialize) {
        data = deserialize(data);
      }
      return data;
    };
  } else if (isBrowser || isWebWorker) {
    return async (path) => {
      const data = await db().getItem(qualify(path));
      if (data !== null) {
        return data;
      }
    };
  } else {
    throw Error('die');
  }
};

// Fetch from internal store.
const fetchPersistent = async (path, doSerialize) => {
  try {
    const base = getBase();
    if (base !== undefined) {
      const fetchFile = await getFileFetcher(qualifyPath, doSerialize);
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
  const fetchFile = await getFileFetcher(path => path, false);
  // Try to load the data from a source.
  for (const source of sources) {
    if (typeof source === 'string') {
      try {
        if (source.startsWith('http:') || source.startsWith('https:')) {
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

// Deprecated
export const readFile = async (options, path) => {
  const { allowFetch = true, ephemeral } = options;
  // if (false && isWebWorker) {
  //  return self.ask({ readFile: { options, path } });
  // }
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
    file.data = await fetchPersistent(path, true);
  }
  if (project !== originalProject) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalProject });
  }
  if (file.data === undefined && allowFetch && sources.length > 0) {
    file.data = await fetchSources({}, sources);
    if (!ephemeral && file.data !== undefined) {
      // Update persistent cache.
      await writeFile({ ...options, doSerialize: true }, path, file.data);
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

export const read = async (path, options = {}) => {
  const data = await readFile(options, path);
  return decode(data);
};
