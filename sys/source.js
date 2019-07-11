const sources = new Map();

// Note: later additions will be used in preference to earlier additions.
// This will allow overriding defective or unavailable sources.
export const addSource = (path, source) => {
  if (sources.has(path)) {
    sources.get(path).unshift(source);
  } else {
    sources.set(path, [source]);
  }
};

export const getSources = (path) => {
  console.log(`QQ/getSources/path: ${path}`);
  if (sources.has(path)) {
    return sources.get(path);
  } else {
    return [];
  }
};
