import { parentPort } from 'worker_threads';
import { conversation } from './conversation.js';

const say = (message) => parentPort.postMessage(message);
const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const { hear } = conversation({ agent, say });

parentPort.on('message', hear);
