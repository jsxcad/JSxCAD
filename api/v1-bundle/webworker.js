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
      const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
      const constructor = await builder(api);
      const module = await constructor();
      const shape = await module.main();
      if (shape !== undefined && shape.toKeptGeometry) {
        const keptGeometry = shape.toKeptGeometry();
        return keptGeometry;
      }
    }
  } catch (error) {
    // await ask({ writeFile: { options: { ephemeral: true }, path: 'console/out', data: `${error.toString()}\n${error.stack}` } });
    await sys.log(`${error.toString()}\n${error.stack}`);
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
