import { getFilesystem, setupFilesystem } from "./filesystem";

import { getFile } from "./files";

export const touch = async (path, { workspace } = {}) => {
  let originalWorkspace = getFilesystem();
  if (workspace !== originalWorkspace) {
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: workspace });
  }
  const file = await getFile({}, path);
  if (file !== undefined) {
    file.data = undefined;

    for (const watcher of file.watchers) {
      await watcher({}, file);
    }
  }
  if (workspace !== originalWorkspace) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalWorkspace });
  }
};
