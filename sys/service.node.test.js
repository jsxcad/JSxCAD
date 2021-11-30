import { askService, getServicePoolInfo } from './servicePool.js';

import { createService } from './service.js';
import { initNodeWorker } from './nodeWorker.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initNodeWorker();
});

test('Echo service', async (t) => {
  // Phase One
  {
    const agent = async ({ message }) => {
      return `Secret ${message}`;
    };
    const { ask, release } = await createService({
      nodeWorker: './service.test.nodeWorker.js',
      agent,
    });
    t.is(await ask('Hello'), 'Worker Secret Hello');
    t.deepEqual(await getServicePoolInfo(), {
      idleServices: [],
      idleServiceCount: 0,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServices: [],
      activeServiceCount: 0,
      activeServiceLimit: 5,
    });
    await release();
    t.deepEqual(await getServicePoolInfo(), {
      idleServices: [],
      idleServiceCount: 0,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServices: [],
      activeServiceCount: 0,
      activeServiceLimit: 5,
    });
  }

  // Phase Two
  {
    const agent = async ({ message }) => `Secret ${message}`;
    const spec = { nodeWorker: './service.test.nodeWorker.js', agent };

    t.is(await askService(spec, 'A').answer, 'Worker Secret A');
    t.deepEqual(
      { ...(await getServicePoolInfo()), activeServices: [], idleServices: [] },
      {
        idleServices: [],
        idleServiceCount: 1,
        idleServiceLimit: 5,
        pendingCount: 0,
        activeServices: [],
        activeServiceCount: 0,
        activeServiceLimit: 5,
      }
    );
    t.is(await askService(spec, 'B').answer, 'Worker Secret B');
    t.deepEqual(
      { ...(await getServicePoolInfo()), idleServices: [] },
      {
        idleServices: [],
        idleServiceCount: 1,
        idleServiceLimit: 5,
        pendingCount: 0,
        activeServices: [],
        activeServiceCount: 0,
        activeServiceLimit: 5,
      }
    );
  }
});
