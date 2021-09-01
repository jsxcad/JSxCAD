import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  try {
    console.log(`QQ/evaluate: ${ecmascript.replace(/\n/g, '\n|   ')}`);
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    const op = await builder(api);
    const result = await op();
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
    let replaysDone = false;
    console.log(`QQ/Evaluate`);
    const scheduled = new Set();
    for (;;) {
      console.log(`QQ/Compile`);
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
      // Replay anything we can.
      if (!replaysDone) {
        console.log(`QQ/Replay`);
        replaysDone = true;
        for (const entry of replays) {
          await replay(entry, { path });
        }
      }
      // Update what we can.
      console.log(`QQ/Update`);
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
            updates[dependency] &&
            dependency !== id
        );
        if (updatePromises.length === 0 && outstandingDependencies.length === 0) {
          // For now, only do one thing at a time, and block the remaining updates.
          const task = async () => {
            try {
              await evaluate(updates[id].program, { path });
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
      };
      // FIX: We could instead use Promise.race() and then see what new updates could be queued.
      while (updatePromises.length > 0) {
        await updatePromises.pop();
      }
      // Finally compute the exports.
      if (blockedUpdates.length === 0) {
        console.log(`QQ/Exports`);
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
