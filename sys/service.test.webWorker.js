/* global postMessage, onmessage:writable */

import { conversation } from './conversation';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const { hear } = conversation({ agent, say });
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
