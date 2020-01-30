import * as api from './jsxcad-api-v1.js';
import { boot, conversation, log } from './jsxcad-sys.js';
import { toEcmascript } from './jsxcad-compiler.js';

/* global postMessage, onmessage:writable, self */

const say = message => postMessage(message);

const agent = async ({
  ask,
  question
}) => {
  try {
    await log({
      op: 'clear'
    });
    await log({
      op: 'evaluate',
      status: 'run'
    });
    await log({
      op: 'text',
      text: 'Evaluation Started'
    });

    if (question.evaluate) {
      const ecmascript = toEcmascript({}, question.evaluate);
      console.log({
        op: 'text',
        text: `QQ/script: ${question.evaluate}`
      });
      console.log({
        op: 'text',
        text: `QQ/ecmascript: ${ecmascript}`
      });
      const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
      const constructor = await builder(api);
      const module = await constructor();
      const shape = await module.main();
      await log({
        op: 'text',
        text: 'Evaluation Succeeded',
        level: 'serious'
      });
      await log({
        op: 'evaluate',
        status: 'success'
      });

      if (shape !== undefined && shape.toKeptGeometry) {
        const keptGeometry = shape.toKeptGeometry();
        await log({
          op: 'text',
          text: 'Preview Rendered',
          level: 'serious'
        });
        return keptGeometry;
      }
    }
  } catch (error) {
    await log({
      op: 'text',
      text: error.stack,
      level: 'serious'
    });
    await log({
      op: 'text',
      text: 'Evaluation Failed',
      level: 'serious'
    });
    await log({
      op: 'evaluate',
      status: 'failure'
    });
  }
};

const bootstrap = async () => {
  await boot();
  const {
    ask,
    hear
  } = conversation({
    agent,
    say
  });
  self.ask = ask;

  onmessage = ({
    data
  }) => hear(data);

  if (onmessage === undefined) throw Error('die');
};

bootstrap();
