/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as sys from '@jsxcad/sys';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    if (question.evaluate) {
      const code = new Function(`{ ${Object.keys(api).join(', ')} }`,
                                `${question.evaluate}; return main;`);
      return code(api)();
    }
  } catch (error) {
    await ask({ writeFile: { options: { ephemeral: true }, path: 'console/out', data: error.toString() } });
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
