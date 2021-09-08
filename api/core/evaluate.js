import { acquire, release } from './evaluateLock.js';

import { getApi } from './api.js';
import { isWebWorker } from '@jsxcad/sys';
import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  const where = isWebWorker ? 'worker' : 'browser';
  try {
    await acquire();
    console.log(`QQ/evaluate ${where}: ${ecmascript.replace(/\n/g, '\n|   ')}`);
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    const op = await builder(api);
    const result = await op();
    return result;
  } catch (error) {
    throw error;
  } finally {
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
  }
) => {
  const where = isWebWorker ? 'worker' : 'browser';
  try {
    let replaysDone = false;
    let importsDone = false;
    console.log(`QQ/Evaluate`);
    const scheduled = new Set();
    const completed = new Set();
    for (;;) {
      console.log(`QQ/Compile`);
      const updates = {};
      const replays = {};
      const exports = [];
      await toEcmascript(script, {
        path,
        topLevel,
        updates,
        replays,
        exports,
      });
      // Make sure modules are prepared.
      if (!importsDone) {
        console.log(`QQ/Imports ${where}`);
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
          console.log(`QQ/Imports ${where}: ${path}`);
          await importModule(path, { evaluate, replay, doRelease: false });
        }
        // At this point the modules should build with a simple replay.
      }
      // Replay anything we can.
      if (!replaysDone) {
        console.log(`QQ/Replay ${where}`);
        replaysDone = true;
        for (const id of Object.keys(replays)) {
          await replay(replays[id].program, { path });
          completed.add(id);
        }
      }
      // Update what we can.
      console.log(`QQ/Update ${where}`);
      const blockedUpdates = [];
      const updatePromises = [];
      // Determine the updates we can process.
      for (const id of Object.keys(updates)) {
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
          // if (isWebWorker) {
          //   throw Error('Updates should not happen in worker');
          // }
          // For now, only do one thing at a time, and block the remaining updates.
          const task = async () => {
            try {
              await evaluate(updates[id].program, { path });
              completed.add(id);
              console.log(`Completed ${id}`);
            } catch (error) {
              throw error;
            }
          };
          updatePromises.push(task());
          scheduled.add(id);
        } else {
          blockedUpdates.push(id);
        }
      }
      // FIX: We could instead use Promise.race() and then see what new updates could be queued.
      while (updatePromises.length > 0) {
        await updatePromises.pop();
      }
      // Finally compute the exports.
      if (blockedUpdates.length === 0) {
        console.log(`QQ/Exports ${where}`);
        for (const entry of exports) {
          return await evaluate(entry, { path });
        }
        return;
      }
      // Otherwise recompute the updates and repeat.
    }
  } catch (error) {
    throw error;
  }
};
