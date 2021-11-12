/* global self */
import { addPending } from './pending.js';
import { getFile } from './files.js';
import { isWebWorker } from './browserOrNode.js';
import { tellServices } from './servicePool.js';

export const touch = async (
  path,
  { workspace, clear = true, broadcast = true } = {}
) => {
  const file = await getFile({ workspace }, path);
  if (file !== undefined) {
    if (clear) {
      // This will force a reload of the data.
      file.data = undefined;
    }

    for (const watcher of file.watchers) {
      await watcher({ workspace }, file);
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
};
