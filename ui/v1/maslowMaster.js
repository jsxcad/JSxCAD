import { createService } from "@jsxcad/sys";

window.bootstrap = async () => {
  const agent = async ({ ask, question }) => {
    // This just handles questions from the worker.
    console.log(`Was asked: ${JSON.stringify(question)}`);
  };

  const { ask } = await createService({
    webWorker: "./maslowWorker.js",
    agent,
  });

  const result = await ask({
    values: [10, 10],
    key: "rectangle",
  });

  console.log(JSON.stringify(result));
};

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    window.bootstrap();
  }
};
