/* global postMessage, onmessage:writable */

import { conversation } from './conversation.js';

const say = (message) => postMessage(message);
const agent = async ({ ask, message }) => `Worker ${await ask(message)}`;
const { hear } = conversation({ agent, say });
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
