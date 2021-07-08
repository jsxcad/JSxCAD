export const conversation = ({ agent, say }) => {
  let id = 0;
  const openQuestions = new Map();
  const ask = (question, transfer) => {
    const promise = new Promise((resolve, reject) => {
      openQuestions.set(id, { resolve, reject });
    });
    say({ id, question }, transfer);
    id += 1;
    return promise;
  };
  const hear = async (message) => {
    const { id, question, answer, error, statement } = message;
    // Check hasOwnProperty to detect undefined values.
    if (message.hasOwnProperty('answer')) {
      const { resolve, reject } = openQuestions.get(id);
      if (error) {
        reject(error);
      } else {
        resolve(answer);
      }
      openQuestions.delete(id);
    } else if (message.hasOwnProperty('question')) {
      const answer = await agent({ ask, question });
      say({ id, answer });
    } else if (message.hasOwnProperty('statement')) {
      await agent({ ask, statement });
    } else {
      throw Error(
        `Expected { answer } or { question } but received ${JSON.stringify(
          message
        )}`
      );
    }
  };
  return { ask, hear };
};
