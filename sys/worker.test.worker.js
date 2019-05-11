const { workerData, parentPort } = require('worker_threads')

parentPort.on('message', (message) => parentPort.postMessage(`worker ${message}`));
