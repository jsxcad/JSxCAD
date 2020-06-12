"use strict";

const conversation = ({ agent, say }) => {
  let id = 0;
  const openQuestions = {};
  const ask = (question) => {
    const promise = new Promise((resolve, reject) => {
      openQuestions[id] = { resolve, reject };
    });
    say({ id, question });
    id += 1;
    return promise;
  };
  const hear = async (message) => {
    const { id, question, answer, error } = message;
    if (answer) {
      const { resolve, reject } = openQuestions[id];
      if (error) {
        reject(error);
      } else {
        resolve(answer);
      }
      delete openQuestions[id];
    } else if (question) {
      const answer = await agent({ ask, question });
      say({ id, answer });
    } else {
      throw Error("die");
    }
  };
  return { ask, hear };
};

/* global postMessage, onmessage:writable */

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const { hear } = conversation({ agent, say });
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error("die");
