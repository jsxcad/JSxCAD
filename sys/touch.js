import { getFilesystem, setupFilesystem } from './filesystem.js';

import { getFile } from './files.js';

export const touch = async (path, { workspace, doClear = true } = {}) => {
  let originalWorkspace = getFilesystem();
  if (workspace !== originalWorkspace) {
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: workspace });
  }
  const file = await getFile({}, path);
  if (file !== undefined) {
    if (doClear) {
      file.data = undefined;
    }

    for (const watcher of file.watchers) {
      await watcher({}, file);
    }
  }
  if (workspace !== originalWorkspace) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalWorkspace });
  }
};
