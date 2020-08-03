import { argv } from 'process';
import fs from 'fs';
import path from 'path';
import { updateNotebook } from './updateNotebook.js';

const build = async (baseDirectory) => {
  const notebooks = [];
  const walk = async (directory) => {
    for (const entry of await fs.promises.readdir(directory, { withFileTypes: true })) {
      if (['node_modules'].includes(entry.name)) {
        continue;
      }
      const filepath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(filepath);
      } else if (entry.isFile()) {
        if (filepath.endsWith('.nb')) {
          notebooks.push(filepath.substring(0, filepath.length - 3));
        }
      }
    }
  };
  await walk(baseDirectory);
  for (const notebook of notebooks) {
    await updateNotebook(notebook);
  }
};

build(argv[2]).catch(error => console.log(error.toString()));
