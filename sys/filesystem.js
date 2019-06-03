export let base = '';

export const setupFilesystem = ({ fileBase }) => {
  // A prefix used to partition the filesystem for multiple projects.
  if (fileBase !== undefined) {
    if (base.endsWith('/')) {
      base = fileBase;
    } else {
      base = `${fileBase}/`;
    }
  }
};
