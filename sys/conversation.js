export const conversation = ({ agent, say }) => {
  let id = 0;
  const openQuestions = new Map();
  const ask = (question) => {
    const promise = new Promise((resolve, reject) => {
      openQuestions.set(id, { resolve, reject });
    });
    say({ id, question });
    id += 1;
    return promise;
  };
  const hear = async (message) => {
    const { id, question, answer, error } = message;
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
    } else {
      throw Error('die');
    }
  };
  return { ask, hear };
};
