import { popModule, pushModule } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

export const evaluate = async (ecmascript, { api, path }) => {
  const builder = new Function(
    `{ ${Object.keys(api).join(', ')} }`,
    `return async () => { ${ecmascript} };`
  );
  const module = await builder(api);
  try {
    pushModule(path);
    return await module();
  } finally {
    popModule();
  }
};

const doNothing = () => {};

export const execute = async (
  script,
  { evaluate, path, topLevel = {}, onError = doNothing }
) => {
  console.log(`QQ/execute/0`);
  const updates = {};
  const ecmascript = await toEcmascript(script, {
    path,
    topLevel,
    updates,
  });
  const pending = new Set(Object.keys(updates));
  const unprocessed = new Set(Object.keys(updates));
  let somethingHappened;
  const schedule = () => {
    console.log(`Updates remaining ${[...pending].join(', ')}`);
    for (const id of [...pending]) {
      const entry = updates[id];
      const outstandingDependencies = entry.dependencies.filter(
        (dependency) => updates[dependency]
      );
      if (outstandingDependencies.length === 0) {
        console.log(`Scheduling: ${id}`);
        pending.delete(id);
        evaluate(updates[id].program)
          .then(() => {
            console.log(`Completed ${id}`);
            delete updates[id];
            unprocessed.delete(id);
          })
          .catch(onError) // FIX: Deadlock?
          .finally(() => somethingHappened());
      }
    }
  };
  while (unprocessed.size > 0) {
    const somethingHappens = new Promise((resolve, reject) => {
      somethingHappened = resolve;
    });
    schedule();
    if (unprocessed.size > 0) {
      // Wait for something to happen.
      await somethingHappens;
    }
  }
  return evaluate(ecmascript, { path });
};
