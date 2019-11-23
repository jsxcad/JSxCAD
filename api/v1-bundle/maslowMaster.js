import { createService } from '@jsxcad/sys';

window.bootstrap = async () => {
  const agent = async ({ ask, question }) => {
    if (question.ask) {
      const { identifier, options } = question.ask;
      return askSys(identifier, options);
    } else if (question.readFile) {
      const { options, path } = question.readFile;
      return readFile(options, path);
    } else if (question.writeFile) {
      const { options, path, data } = question.writeFile;
      return writeFile(options, path, data);
    } else if (question.deleteFile) {
      const { options, path } = question.deleteFile;
      return deleteFile(options, path);
    } else if (question.log) {
      const { entry } = question.log;
      return log(entry);
    }
  };

  const { ask } = await createService({ webWorker: './maslowWorker.js', agent });

  const result = await ask({
                              values: [10,10],
                              key: "rectangle"
                           });
  console.log(JSON.stringify(result));
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
