// When base is undefined the persistent filesystem is disabled.
let base;

export const getBase = () => base;

export const qualifyPath = (path, project) => `jsxcad/${project + '/' || getBase() || '/'}${path}`;

export const setupFilesystem = ({ fileBase }) => {
  // A prefix used to partition the persistent filesystem for multiple projects.
  if (fileBase !== undefined) {
    if (fileBase.endsWith('/')) {
      base = fileBase;
    } else {
      base = `${fileBase}/`;
    }
  }
};

export const getFilesystem = () => {
  if (base !== undefined) {
    const [filesystem] = base.split('/');
    return filesystem;
  }
};
