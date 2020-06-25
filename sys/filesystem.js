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

export const getFilesystem = () => {
  if (base !== undefined) {
    const [filesystem] = base.split('/');
    return filesystem;
  }
};
