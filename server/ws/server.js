import { WebSocketServer } from 'ws';
import { Worker } from 'worker_threads';

var server = new WebSocketServer({
  port: 8080,
});

const start = async () => {
  let nextSessionId = 0;
  server.on('connection', async (ws) => {
    const sessionId = ++nextSessionId;
    const worker = new Worker('./worker.js');
    worker.on('message', (message) => {
      ws.send(message);
    });
    worker.postMessage(JSON.stringify({ op: 'hello', sessionId }));
    ws.onmessage = ({ data }) => worker.postMessage(data);
    ws.onclose = () => worker.postMessage(JSON.stringify({ op: 'bye' }));
  });
};

start();
