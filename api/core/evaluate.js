import { popModule, pushModule } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  const builder = new Function(
    `{ ${Object.keys(api).join(', ')} }`,
    `return async () => { ${ecmascript} };`
  );
  try {
    const module = await builder(api);
    pushModule(path);
    const result = await module();
    return result;
  } catch (error) {
    throw error;
  } finally {
    popModule();
  }
};

export const execute = async (
  script,
  { evaluate, replay, path, topLevel = {} }
) => {
  try {
    console.log(`QQ/execute/0`);
    const updates = {};
    await toEcmascript(script, {
      path,
      updates,
    });
    const pending = new Set(Object.keys(updates));
    const unprocessed = new Set(Object.keys(updates));
    const processed = new Set();
    let somethingHappened;
    let somethingFailed;
    const schedule = () => {
      console.log(`Updates remaining ${[...pending].join(', ')}`);
      for (const id of [...pending]) {
        const entry = updates[id];
        const outstandingDependencies = entry.dependencies.filter(
          (dependency) => updates[dependency] && !processed.has(dependency)
        );
        if (outstandingDependencies.length === 0) {
          console.log(`Scheduling: ${id}`);
          pending.delete(id);
          const task = async () => {
            try {
              await evaluate(updates[id].program);
              console.log(`Completed ${id}`);
              delete updates[id];
              unprocessed.delete(id);
              processed.add(id);
            } catch (error) {
              somethingFailed(error); // FIX: Deadlock?
            } finally {
              somethingHappened();
            }
          };
          task();
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
    // Execute the script in the context of the resolved updates.
    const ecmascript = await toEcmascript(script, {
      path,
      topLevel,
      updates,
    });
    // These should all be resolved already.
    if (Object.keys(updates).length !== 0) {
      throw Error('Unresolved updates');
    }
    try {
      const result = await replay(ecmascript, { path });
      return result;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
