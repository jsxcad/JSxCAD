import localForage from 'localforage';

export const listProjects = async () => {
  const keys = await localForage.keys();
  return keys;
};
