import { Worker } from 'worker_threads';
import { test } from 'ava';

test('Echo', async t => {
  const worker = new Worker('./worker.test.worker.js');
  let answer = new Promise((resolve, reject) => { worker.on('message', (message) => resolve(message)); });
  worker.postMessage('hello');
  t.is(await answer, 'worker hello');
});
