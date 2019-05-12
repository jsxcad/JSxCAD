/* global postMessage, onmessage:writable */

import * as api from '@jsxcad/api-v1';
import * as sys from '@jsxcad/sys';

const say = (message) => postMessage(message);
// const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const agent = async ({ ask, question }) => api.cube().toGeometry();
const { hear } = sys.conversation({ agent, say });
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
