import { CONFLICT, CREATED, OK, eq, request as githubRequest } from './githubRequest';

import { toByteArray as toByteArrayFromBase64 } from 'base64-js';
import { writeFile } from '@jsxcad/sys';

const FILE = '100644';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, { ...options, service: 'githubRepository' });

const get = async (isOk, path, options) => request(isOk, path, 'GET', undefined, options);
const post = async (isOk, path, body, options) => request(isOk, path, 'POST', body, options);
const patch = async (isOk, path, body, options) => request(isOk, path, 'PATCH', body, options);

export const findRepository = async (repositoryName) => {
  const repositories = await get(eq(200), 'user/repos');
  if (repositories !== undefined) {
    for (const { name } of repositories) {
      if (name === repositoryName) {
        return true;
      }
    }
  }
  return false;
};

export const createRepository = async (repositoryName) =>
  post(eq(201), 'user/repos', { name: repositoryName, auto_init: true });

export const ensureRepository = async (repositoryName) => {
  if (!await findRepository(repositoryName)) {
    await createRepository(repositoryName);
  }
};

const getState = async (owner, repository, { overwrite = false }) => {
  // When the repository is empty, we'll get a CONFLICT.
  const commits = await get(eq(OK, CONFLICT), `repos/${owner}/${repository}/commits?per_page=1`);
  if (commits === undefined) return {};
  const [lastCommitSha, baseTree] = (commits.length > 0 && !overwrite)
    ? [commits[0].sha, commits[0].commit.tree.sha]
    : [undefined, undefined];
  const oldTree = baseTree === undefined
    ? { tree: [] }
    : await get(eq(OK), `repos/${owner}/${repository}/git/trees/${baseTree}?recursive=1`);
  if (oldTree === undefined) return {};
  return { lastCommitSha, baseTree, oldTree };
};

export const readProject = async (owner, repository, prefix, { overwrite = false }) => {
  const { oldTree } = await getState(owner, repository, { overwrite });
  const queue = [];
  for (const { path, sha, type } of oldTree.tree) {
    if (type === 'blob' && path.startsWith(prefix)) {
      const relativePath = path.substring(prefix.length);
      const entry = await get(eq(OK), `repos/${owner}/${repository}/git/blobs/${sha}`, 'GET', { format: 'bytes' });
      queue.push({ relativePath, entry });
    }
  }
  for (const { relativePath, entry } of queue) {
    const data = toByteArrayFromBase64(entry.content.replace(/\n/gm, ''));
    await writeFile({ as: 'bytes' }, relativePath, data);
  }
  return true;
};

export const writeProject = async (owner, repository, prefix, files, { overwrite = false }) => {
  await ensureRepository(repository);
  const { lastCommitSha, baseTree, oldTree } = await getState(owner, repository, { overwrite });
  if (oldTree === undefined) return;
  const updateTree = files.map(([path, content]) => ({ path: `${prefix}${path}`, mode: FILE, type: 'blob', content }));
  const updatePaths = new Set(files.map(([path]) => `${prefix}${path}`));
  const deleteTree = oldTree.tree
      .filter(({ path, type }) => type === 'blob' && path.startsWith(prefix) && !updatePaths.has(path))
      .map(entry => ({ ...entry, sha: null }));
  const tree = await post(eq(CREATED, CONFLICT),
                          `repos/${owner}/${repository}/git/trees`,
                          { base_tree: baseTree, tree: [...updateTree, ...deleteTree] });
  if (tree === undefined) return;
  const parents = lastCommitSha === undefined ? [] : [lastCommitSha];
  const commit = await post(eq(CREATED, CONFLICT),
                            `repos/${owner}/${repository}/git/commits`,
                            { message: 'Test', tree: tree.sha, parents });
  if (commit === undefined) return;
  await patch(eq(200), `repos/${owner}/${repository}/git/refs/heads/master`, { sha: commit.sha, force: true });
  return true;
};
