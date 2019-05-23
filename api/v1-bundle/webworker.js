/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as sys from '@jsxcad/sys';
import { toEcmascript } from '@jsxcad/compiler';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    if (question.evaluate) {
      const ecmascript = toEcmascript({}, question.evaluate);
      console.log(`QQ/script: ${question.evaluate}`);
      console.log(`QQ/ecmascript: ${ecmascript}`);
      const code = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
      const shape = await code(api).main();
      if (shape !== undefined) {
        return shape.toDisjointGeometry();
      }
    }
  } catch (error) {
    await ask({ writeFile: { options: { ephemeral: true }, path: 'console/out', data: error.toString() } });
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
