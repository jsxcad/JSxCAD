/* global postMessage, onmessage:writable, self */

import * as api from 'https://gitcdn.xyz/cdn/jsxcad/JSxCAD/master/es6/jsxcad-api-v1.js';
import * as sys from 'https://gitcdn.xyz/cdn/jsxcad/JSxCAD/master/es6/jsxcad-sys.js';
import { toEcmascript } from 'https://gitcdn.xyz/cdn/jsxcad/JSxCAD/master/es6/jsxcad-compiler.js';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    await sys.log({ op: 'clear' });
    await sys.log({ op: 'evaluate', status: 'run' });
    await sys.log({ op: 'text', text: 'Evaluation Started' });
    if (question.evaluate) {
      const ecmascript = toEcmascript({}, question.evaluate);
      console.log({ op: 'text', text: `QQ/script: ${question.evaluate}` });
      console.log({ op: 'text', text: `QQ/ecmascript: ${ecmascript}` });
      const builder = new Function(
        `{ ${Object.keys(api).join(', ')} }`,
        ecmascript
      );
      const constructor = await builder(api);
      const module = await constructor();
      const shape = await module.main();
      await sys.log({
        op: 'text',
        text: 'Evaluation Succeeded',
        level: 'serious',
      });
      await sys.log({ op: 'evaluate', status: 'success' });
      if (shape !== undefined && shape.toKeptGeometry) {
        const keptGeometry = shape.toKeptGeometry();
        await sys.log({
          op: 'text',
          text: 'Preview Rendered',
          level: 'serious',
        });
        return keptGeometry;
      }
    }
  } catch (error) {
    await sys.log({ op: 'text', text: error.stack, level: 'serious' });
    await sys.log({ op: 'text', text: 'Evaluation Failed', level: 'serious' });
    await sys.log({ op: 'evaluate', status: 'failure' });
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
