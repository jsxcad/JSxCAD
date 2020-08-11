import { argv } from 'process';
import fs from 'fs';
import path from 'path';
import { typecheckModule } from './typecheckModule.js';

const run = async (baseDirectory) => {
  const modules = [];
  const walk = async (directory) => {
    for (const entry of await fs.promises.readdir(directory, {
      withFileTypes: true,
    })) {
      if (['node_modules'].includes(entry.name)) {
        continue;
      }
      const filepath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(filepath);
      } else if (entry.isFile()) {
        if (filepath.endsWith('.js')) {
          modules.push(filepath);
        }
      }
    }
  };
  await walk(baseDirectory);
  for (const module of modules) {
    await typecheckModule(module);
  }
};

run(argv[2])
  .then((_) => console.log('QQ/done'))
  .catch((error) => console.log(`QQ/run: ${error.stack}`));
