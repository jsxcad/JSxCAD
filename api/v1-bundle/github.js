/* global window, setTimeout */

import { log, readFile, writeFile } from '@jsxcad/sys';

const FILE = '100644';

const OK = 200;
const CREATED = 201;
const CONFLICT = 409;

const eq = (...values) => (match) => values.includes(match);

const sleep = (duration) => new Promise((resolve, reject) => setTimeout(resolve, duration));

const getAccessToken = async (service) =>
  readFile({ project: '.system', useCache: false }, `auth/${service}/accessToken`);

const getNewAccessToken = async (service, oldToken = undefined, attempts = 10) => {
  await log({ op: 'text', text: `Re-Authenticating ${service}`, level: 'serious' });
  window.open(`http://167.99.163.104:3000/auth/${service}?${service}Callback=${window.location.href}`);
  while (--attempts > 0) {
    const token = await readFile({ project: '.system', useCache: false }, `auth/${service}/accessToken`);
    if (token === undefined || token === oldToken) {
      await sleep(1000);
    }
    if (token !== oldToken) {
      return token;
    }
  }
};

export const get = async (isOk, path, options) => request(isOk, path, 'GET', undefined, options);
export const post = async (isOk, path, body, options) => request(isOk, path, 'POST', body, options);
export const patch = async (isOk, path, body, options) => request(isOk, path, 'PATCH', body, options);

export const request = async (isOk, path, method, body, { attempts = 2, format = 'json' } = {}) => {
  let token = await getAccessToken('githubRepository');
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'JSxCAD v0.0.79',
    'Authorization': `token ${token}`
  };
  if (body !== undefined) {
    body = JSON.stringify(body);
  }
  const request = { method, headers, body };
  while (--attempts > 0) {
    if (token === undefined) {
      token = await getNewAccessToken('githubRepository', token);
      if (token === undefined) {
        return;
      }
    }
    const response = await window.fetch(`https://api.github.com/${path}`, request);
    console.log(`QQ/request/path: ${path}`);
    console.log(`QQ/request/status: ${response.status}`);
    console.log(`QQ/request/req: ${JSON.stringify(body)}`);
    if (isOk(response.status)) {
      switch (format) {
        case 'json': {
          const body = await response.json();
          console.log(`QQ/request/body: ${JSON.stringify(body)}`);
          return body;
        }
        case 'bytes': {
          const body = await response.arrayBuffer();
          return body;
        }
        default: {
          return;
        }
      }
    }
    token = undefined;
  }
};

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
  const [lastCommitSha, baseTree] = (commits.length > 0 && !overwrite) ? [commits[0].sha, commits[0].commit.tree.sha] : [undefined, undefined];
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
      const data = await get(eq(OK), `repos/${owner}/${repository}/git/blobs/${sha}`, 'GET', { format: 'bytes' });
      queue.push({ relativePath, data });
    }
  }
  for (const { relativePath, data } of queue) {
    await writeFile({ as: 'bytes' }, relativePath, data);
  }
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
  const tree = await post(eq(CREATED, CONFLICT), `repos/${owner}/${repository}/git/trees`, { base_tree: baseTree, tree: [...updateTree, ...deleteTree] });
  if (tree === undefined) return;
  const parents = lastCommitSha === undefined ? [] : [lastCommitSha];
  const commit = await post(eq(CREATED, CONFLICT), `repos/${owner}/${repository}/git/commits`, { message: 'Test', tree: tree.sha, parents });
  if (commit === undefined) return;
  await patch(eq(200), `repos/${owner}/${repository}/git/refs/heads/master`, { sha: commit.sha, force: true });
};
