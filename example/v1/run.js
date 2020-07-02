import { argv } from 'process';
import { run } from './runner.js';

run(argv[2]).catch((e) => {
  console.log(e.toString());
  console.log(e.stack);
});
