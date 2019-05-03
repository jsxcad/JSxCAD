import { getFile } from './files';

export const watchFile = (path, thunk) => getFile(path).watchers.push(thunk);
