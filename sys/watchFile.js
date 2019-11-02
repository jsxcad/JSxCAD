import { getFile } from './files';

export const watchFile = async (path, thunk) => (await getFile({}, path)).watchers.add(thunk);

export const unwatchFile = async (path, thunk) => (await getFile({}, path)).watchers.delete(thunk);
