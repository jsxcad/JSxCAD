import argv from 'argv';

const run = async () => {
  const targets = [process.argv[2]];
  for (const target of targets) {
    const { main, getParameterDefinitions } = await import(`./${target}`);

    let mainOptions = {};

    if (getParameterDefinitions !== undefined) {
      const definitions = getParameterDefinitions();
      const { options } = argv.option(definitions).run();
      for (const { name, initial } of definitions) {
        if (options[name] === undefined) {
          options[name] = initial;
        }
      }
      mainOptions = options;
    }
    if (main !== undefined) {
      await main(mainOptions);
      // await Promise.resolve(main(mainOptions));
    }
  }
};

run().catch(e => {
  console.log(e.toString());
  console.log(e.stack);
});
