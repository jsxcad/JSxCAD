import { acquire, release } from './evaluateLock.js';
import {
  isWebWorker,
  logInfo,
  restoreEmitGroup,
  saveEmitGroup,
} from '@jsxcad/sys';

import { getApi } from './api.js';
import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  const where = isWebWorker ? 'worker' : 'browser';
  let emitGroup;
  try {
    await acquire();
    emitGroup = saveEmitGroup();
    logInfo(
      'api/core/evaluate/script',
      `${where}: ${ecmascript.replace(/\n/g, '\n|   ')}`
    );
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    // Add import to make import.meta.url available.
    const op = await builder({ ...api, import: { meta: { url: path } } });
    // Retry until none of the operations block.
    // Note: This retry mechanism should be obsolete now.
    for (;;) {
      return await op();
    }
  } catch (error) {
    throw error;
  } finally {
    if (emitGroup) {
      restoreEmitGroup(emitGroup);
    }
    await release();
  }
};

export const execute = async (
  script,
  {
    evaluate,
    replay,
    path,
    topLevel = new Map(),
    parallelUpdateLimit = Infinity,
    clearUpdateEmits = false,
    workspace,
  }
) => {
  try {
    let replaysDone = false;
    let importsDone = false;
    const scheduled = new Set();
    const completed = new Set();
    for (;;) {
      const updates = {};
      const replays = {};
      const exports = [];
      await toEcmascript(script, {
        path,
        topLevel,
        updates,
        replays,
        exports,
        workspace,
      });
      // Make sure modules are prepared.
      if (!importsDone) {
        const { importModule } = getApi();
        // The imports we'll need to run these updates.
        const imports = new Set();
        for (const id of Object.keys(updates)) {
          const update = updates[id];
          if (update.imports) {
            for (const entry of update.imports) {
              imports.add(entry);
            }
          }
        }
        // We could run these in parallel, but let's keep it simple for now.
        for (const path of imports) {
          await importModule(path, {
            evaluate,
            replay,
            doRelease: false,
            workspace,
          });
        }
        // At this point the modules should build with a simple replay.
      }
      // Replay anything we can.
      if (!replaysDone) {
        replaysDone = true;
        for (const id of Object.keys(replays)) {
          await replay(replays[id].program, { path });
          completed.add(id);
        }
      }
      // Update what we can.
      const unprocessedUpdates = new Set(Object.keys(updates));
      while (unprocessedUpdates.size > 0) {
        const updatePromises = [];
        // Determine the updates we can process.
        for (const id of unprocessedUpdates) {
          if (scheduled.has(id)) {
            continue;
          }
          const entry = updates[id];
          const outstandingDependencies = entry.dependencies.filter(
            (dependency) =>
              !completed.has(dependency) &&
              updates[dependency] &&
              dependency !== id
          );
          if (
            updatePromises.length <= 1 &&
            outstandingDependencies.length === 0
          ) {
            // For now, only do one thing at a time, and block the remaining updates.
            const task = async () => {
              try {
                await evaluate(updates[id].program, { path });
                completed.add(id);
                console.log(`Completed ${id}`);
              } catch (error) {
                // This should be reported via a note.
                // throw error;
              }
            };
            updatePromises.push(task());
            unprocessedUpdates.delete(id);
            scheduled.add(id);
          }
        }
        // FIX: We could instead use Promise.race() and then see what new updates could be queued.
        while (updatePromises.length > 0) {
          await updatePromises.pop();
        }
      }
      // Finally compute the exports.
      for (const entry of exports) {
        return await evaluate(entry, { path });
      }
      return;
    }
  } catch (error) {
    console.log(`QQ/execute/error: ${error.stack}`);
    throw error;
  }
};
