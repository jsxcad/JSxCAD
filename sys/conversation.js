export const createConversation = ({ agent, say }) => {
  const conversation = {
    agent,
    history: [],
    id: 0,
    openQuestions: new Map(),
    waiters: [],
    say,
  };

  conversation.waitToFinish = () =>
    new Promise((resolve, reject) => conversation.waiters.push(resolve));

  conversation.ask = (question, transfer) => {
    const { id, openQuestions, say } = conversation;
    conversation.id += 1;
    const promise = new Promise((resolve, reject) => {
      openQuestions.set(id, { question, resolve, reject });
    });
    say({ id, question }, transfer);
    return promise;
  };

  conversation.tell = (statement, transfer) => say({ statement }, transfer);

  conversation.hear = async (message) => {
    const { ask, history, openQuestions, tell, waiters } = conversation;

    history.unshift(message);
    while (history.length > 3) {
      history.pop();
    }

    const { id, question, answer, error, statement } = message;
    // Check hasOwnProperty to detect undefined values.
    if (message.hasOwnProperty('answer')) {
      const openQuestion = openQuestions.get(id);
      if (!openQuestion) {
        throw Error(`Unexpected answer: ${JSON.stringify(message)}`);
      }
      const { resolve, reject } = openQuestion;
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
      const answer = await agent({
        ask,
        message: question,
        type: 'question',
        tell,
      });
      try {
        say({ id, answer });
      } catch (e) {
        console.log(`QQ/say/error: ${e.stack}`);
        throw e;
      }
    } else if (message.hasOwnProperty('statement')) {
      await agent({ ask, message: statement, type: 'statement', tell });
    } else {
      throw Error(
        `Expected { answer } or { question } but received ${JSON.stringify(
          message
        )}`
      );
    }
  };

  return conversation;
};
