const { parentPort } = require('worker_threads');

// FIX: Have it ask the asker a question and include the answer in the answer.
parentPort.on('message', ({ id, question }) => parentPort.postMessage({ id, answer: question }));
