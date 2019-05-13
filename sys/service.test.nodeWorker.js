const { parentPort, isMainThread } = require('worker_threads');
const { conversation } = require('./conversationRequireable');

const say = (message) => parentPort.postMessage(message);
const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const { hear } = conversation({ agent, say });

console.log(`QQ/isMainThread: ${isMainThread}`);
console.log(`QQ/parentPort: ${parentPort}`);

parentPort.on('message', hear);
