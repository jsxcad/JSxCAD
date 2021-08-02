/* global self */
import { getFilesystem, setupFilesystem } from './filesystem.js';

import { addPending } from './pending.js';
import { getFile } from './files.js';
import { isWebWorker } from './browserOrNode.js';
import { tellServices } from './servicePool.js';

export const touch = async (
  path,
  { workspace, clear = true, broadcast = true } = {}
) => {
  let originalWorkspace = getFilesystem();
  if (workspace !== originalWorkspace) {
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: workspace });
  }
  const file = await getFile({}, path);
  if (file !== undefined) {
    if (clear) {
      // This will force a reload of the data.
      file.data = undefined;
    }

    for (const watcher of file.watchers) {
      await watcher({}, file);
    }
  }

  if (isWebWorker) {
    console.log(`QQ/sys/touch/webworker: id ${self.id} path ${path}`);
    if (broadcast) {
      addPending(
        await self.ask({ op: 'sys/touch', path, workspace, id: self.id })
      );
    }
  } else {
    console.log(`QQ/sys/touch/browser: ${path}`);
    tellServices({ op: 'sys/touch', path, workspace });
  }

  if (workspace !== originalWorkspace) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalWorkspace });
  }
};
