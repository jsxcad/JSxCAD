import { addPending, clearEmitted } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  try {
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    const module = await builder(api);
    const result = await module();
    return result;
  } catch (error) {
    throw error;
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
  try {
    const updates = {};
    const replays = [];
    const exports = [];
    await toEcmascript(script, {
      path,
      topLevel,
      updates,
      replays,
      exports,
    });
    const replayPromises = replays.map((entry) => replay(entry, { path }));
    const pending = new Set(Object.keys(updates));
    const unprocessed = new Set(Object.keys(updates));
    const processed = new Set();
    let somethingHappened;
    let somethingFailed;
    let parallelUpdates = 0;
    const schedule = () => {
      console.log(`Updates remaining ${[...pending].join(', ')}`);
      for (const id of [...pending]) {
        if (parallelUpdates >= parallelUpdateLimit) {
          break;
        }
        const entry = updates[id];
        const outstandingDependencies = entry.dependencies.filter(
          (dependency) =>
            updates[dependency] &&
            !processed.has(dependency) &&
            dependency !== id
        );
        if (outstandingDependencies.length === 0) {
          parallelUpdates++;
          console.log(`Scheduling: ${id}`);
          pending.delete(id);
          const task = async () => {
            try {
              await evaluate(updates[id].program);
              console.log(`Completed ${id}`);
              delete updates[id];
              unprocessed.delete(id);
              processed.add(id);
              parallelUpdates--;
            } catch (error) {
              somethingFailed(error); // FIX: Deadlock?
            } finally {
              somethingHappened();
            }
          };
          addPending(task());
        }
      }
    };
    while (unprocessed.size > 0) {
      const somethingHappens = new Promise((resolve, reject) => {
        somethingHappened = resolve;
        somethingFailed = reject;
      });
      schedule();
      if (unprocessed.size > 0) {
        // Wait for something to happen.
        await somethingHappens;
      }
    }
    if (clearUpdateEmits) {
      clearEmitted();
    }
    // Check these are all resolved.
    if (Object.keys(updates).length !== 0) {
      throw Error('Unresolved updates');
    }
    // Make sure the replay has finished.
    for (const replayPromise of replayPromises) {
      await replayPromise;
    }
    // Compute and return the export, if any.
    for (const entry of exports) {
      return evaluate(entry, { path });
    }
  } catch (error) {
    throw error;
  }
};
