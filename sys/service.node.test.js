import { createService } from './service';
import test from 'ava';

test('Echo service', async (t) => {
  const agent = async ({ ask, question }) => `Secret ${question}`;
  const { ask } = await createService({
    nodeWorker: './service.test.nodeWorker.js',
    agent,
  });
  t.is(await ask('Hello'), 'Worker Secret Hello');
});
