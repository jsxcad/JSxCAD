import { isWebWorker } from './browserOrNode.js';

export const conversation = ({ agent, say }) => {
  let id = 0;
  const openQuestions = new Map();
  const waiters = [];
  const waitToFinish = () =>
    new Promise((resolve, reject) => waiters.push(resolve));
  const ask = (question, transfer) => {
    const promise = new Promise((resolve, reject) => {
      openQuestions.set(id, { resolve, reject });
    });
    say({ id, question }, transfer);
    id += 1;
    return promise;
  };
  const tell = (statement, transfer) => say({ statement }, transfer);
  const hear = async (message) => {
    console.log(
      `QQ/hear: ${isWebWorker ? 'worker' : 'browser'} open: ${
        openQuestions.size
      } ${JSON.stringify(message)}`
    );
    const { id, question, answer, error, statement } = message;
    // Check hasOwnProperty to detect undefined values.
    if (message.hasOwnProperty('answer')) {
      const question = openQuestions.get(id);
      if (!question) {
        console.log(`QQ/Hear/answer/unexpected: ${JSON.stringify(message)}`);
      }
      const { resolve, reject } = question;
      if (error) {
        reject(error);
      } else {
        resolve(answer);
      }
      openQuestions.delete(id);
      if (openQuestions.size === 0) {
        while (waiters.length > 0) {
          waiters.pop()();
        }
      }
    } else if (message.hasOwnProperty('question')) {
      const answer = await agent({ ask, question, tell });
      try {
        say({ id, answer });
      } catch (e) {
        console.log(`QQ/say/error: ${e.stack}`);
        throw e;
      }
    } else if (message.hasOwnProperty('statement')) {
      await agent({ ask, statement, tell });
    } else {
      throw Error(
        `Expected { answer } or { question } but received ${JSON.stringify(
          message
        )}`
      );
    }
  };
  return { ask, hear, tell, waitToFinish };
};
