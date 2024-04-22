import { WebSocket } from 'ws';

class JotClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.isOpen = new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
    });
    this.queue = [];
    this.pending = null;
    this.ws.on('message', (message) => {
      this.queue.push(message);
      if (this.pending) this.pending();
    });
  }

  async getMessage() {
    if (this.queue.length > 0) {
      return this.queue.shift();
    } else {
      return new Promise((resolve, reject) => {
        this.pending = () => {
          this.pending = null;
          resolve(this.queue.shift());
        };
      });
    }
  }

  async getJsonMessage() {
    return JSON.parse(await this.getMessage());
  }

  sendMessage(message) {
    this.ws.send(JSON.stringify(message));
  }

  async run(module, script) {
    this.sendMessage({ op: 'run', module, script });
    return await this.getJsonMessage();
  }

  async read(pathname) {
    this.sendMessage({ op: 'read', pathname });
    return await this.getMessage();
  }

  async close() {
    this.ws.terminate();
  }
}

const run = async () => {
  const decoder = new TextDecoder();
  const c = new JotClient('ws://localhost:8080');
  await c.isOpen;
  const script = `Box(10).cut(Box(5)).svg('box')`;
  const notes = await c.run('$', script);
  console.log(`QQ/script=${script}`);
  const svg = await c.read('download/svg/$/$1/$1_box');
  console.log(`QQ/svg=${decoder.decode(svg)}`);
  await c.close();
};

run();
