import { createConversation } from './conversation.js';
import { parentPort } from 'worker_threads';

const say = (message) => parentPort.postMessage(message);
const agent = async ({ ask, message }) => `Worker ${await ask(message)}`;
const { hear } = createConversation({ agent, say });

parentPort.on('message', hear);
