import { getFile } from './files';

export const watchFile = (path, thunk) => getFile({}, path).watchers.add(thunk);

export const unwatchFile = (path, thunk) => getFile({}, path).watchers.delete(thunk);
