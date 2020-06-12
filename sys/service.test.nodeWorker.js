const { parentPort } = require("worker_threads");
const { conversation } = require("./conversationRequireable");

const say = (message) => parentPort.postMessage(message);
const agent = async ({ ask, question }) => `Worker ${await ask(question)}`;
const { hear } = conversation({ agent, say });

parentPort.on("message", hear);
