import { askService, createService } from './service.js';

import { getServicePoolInfo } from './servicePool.js';
import test from 'ava';

test('Echo service', async (t) => {
  // Phase One
  {
    const agent = async ({ ask, question }) => `Secret ${question}`;
    const { ask, release } = await createService({
      nodeWorker: './service.test.nodeWorker.js',
      agent,
    });
    t.is(await ask('Hello'), 'Worker Secret Hello');
    t.deepEqual(await getServicePoolInfo(), {
      idleServiceCount: 0,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServiceCount: 1,
      serviceLimit: 5,
    });
    await release();
    t.deepEqual(await getServicePoolInfo(), {
      idleServiceCount: 1,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServiceCount: 0,
      serviceLimit: 5,
    });
  }

  // Phase Two
  {
    const agent = async ({ ask, question }) => `Secret ${question}`;
    const spec = { nodeWorker: './service.test.nodeWorker.js', agent };

    t.is(await askService(spec, 'A'), 'Worker Secret A');
    t.deepEqual(await getServicePoolInfo(), {
      idleServiceCount: 1,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServiceCount: 0,
      serviceLimit: 5,
    });
    t.is(await askService(spec, 'B'), 'Worker Secret B');
    t.deepEqual(await getServicePoolInfo(), {
      idleServiceCount: 1,
      idleServiceLimit: 5,
      pendingCount: 0,
      activeServiceCount: 0,
      serviceLimit: 5,
    });
  }
});
