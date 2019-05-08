import { getFile } from './files';
import { isNode } from './browserOrNode';

export const writeFile = async (options, path, data) => {
  const { ephemeral } = options;

  data = await data;
  const file = getFile(path);
  file.data = data;

  for (const watcher of file.watchers) {
    watcher(options, file);
  }

  if (!ephemeral) {
    if (isNode) {
      const fs = await import('fs');
      let result = await fs.promises.writeFile(path, data);
      return result;
    }
  }
};
