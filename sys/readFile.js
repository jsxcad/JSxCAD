import { isBrowser, isNode } from './browserOrNode';
import { getFile } from './files';

const getUrlFetcher = async () => {
  if (typeof window !== 'undefined') {
    return window.fetch;
  } else {
    const module = await import('node-fetch');
    return module.default;
  }
};

const getFileFetcher = async () => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    const fs = await import('fs');
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
      const response = await fetchUrl(new Request(source.url,
                                                  { method: 'GET', headers: new Headers(), mode: 'cors' }));
      if (response.ok) {
        const data = await response.text();
        return data;
      }
    } else if (source.file !== undefined) {
      return fetchFile(source.file);
    } else {
      throw Error('die');
    }
  }
};

export const readFile = async (options, path) => {
  const { sources = [] } = options;
  const file = getFile(path);
  if (file.data === undefined) {
    file.data = await fetchPersistent(path);
  }
  if (file.data === undefined) {
    file.data = await fetchSources(sources);
  }
  if (file.data !== undefined) {
    if (file.data.then) {
      // Resolve any outstanding promises.
      file.data = await file.data;
    }
  }
  return file.data;
};
