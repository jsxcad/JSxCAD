import {
  CONFLICT,
  CREATED,
  OK,
  eq,
  request as githubRequest,
} from './githubRequest.js';

import { read, write } from '@jsxcad/sys';

import { toByteArray as toByteArrayFromBase64 } from 'base64-js';

const FILE = '100644';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, {
    ...options,
    service: 'githubRepository',
  });

const get = async (isOk, path, options) =>
  request(isOk, path, 'GET', undefined, options);
const post = async (isOk, path, body, options) =>
  request(isOk, path, 'POST', body, options);
const patch = async (isOk, path, body, options) =>
  request(isOk, path, 'PATCH', body, options);

export const findRepository = async (repositoryName) => {
  const repositories = await get(eq(200), 'user/repos');
  if (repositories !== undefined) {
    for (const { name } of repositories) {
      console.log(`QQ/findRepository/name: ${name} vs ${repositoryName}`);
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
  if (!(await findRepository(repositoryName))) {
    await createRepository(repositoryName);
  }
};

const getState = async (
  owner,
  repository,
  branch,
  { replaceRepository = false }
) => {
  const headsRef = await get(
    eq(OK, CONFLICT),
    `repos/${owner}/${repository}/git/refs/heads`
  );
  const masterRef = headsRef.filter(
    (entry) => entry.ref === `refs/heads/master`
  );
  const branchRef = headsRef.filter(
    (entry) => entry.ref === `refs/heads/${branch}`
  );
  let commitSha;

  if (branchRef.length === 0) {
    commitSha = masterRef[0].object.sha;
    await post(eq(CREATED), `repos/${owner}/${repository}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: commitSha,
    });
  } else {
    commitSha = branchRef[0].object.sha;
  }

  const commit = await get(
    eq(OK),
    `repos/${owner}/${repository}/git/commits/${commitSha}`
  );

  const treeSha = commit.tree.sha;

  return { commitSha, treeSha };
};

export const getStateOld = async (
  owner,
  repository,
  { replaceRepository = false }
) => {
  // When the repository is empty, we'll get a CONFLICT.
  const commits = await get(
    eq(OK, CONFLICT),
    `repos/${owner}/${repository}/commits?per_page=1`
  );
  if (commits === undefined) return {};
  const [lastCommitSha, baseTree] =
    commits.length > 0 && !replaceRepository
      ? [commits[0].sha, commits[0].commit.tree.sha]
      : [undefined, undefined];
  const oldTree =
    baseTree === undefined
      ? { tree: [] }
      : await get(eq(OK), `repos/${owner}/${repository}/git/trees/${baseTree}`);
  if (oldTree === undefined) return {};
  return { lastCommitSha, baseTree, oldTree };
};

export const readFromGithub = async (
  owner,
  repository,
  branch,
  prefix,
  { replaceRepository = false } = {}
) => {
  const { oldTree } = await getState(owner, repository, branch, {
    replaceRepository,
  });
  const queue = [];
  for (const { path, sha, type } of oldTree.tree) {
    if (type === 'blob' && path.startsWith(prefix)) {
      const relativePath = path.substring(prefix.length);
      const entry = await get(
        eq(OK),
        `repos/${owner}/${repository}/git/blobs/${sha}`,
        'GET',
        { format: 'bytes' }
      );
      queue.push({ relativePath, entry });
    }
  }
  for (const { relativePath, entry } of queue) {
    const data = toByteArrayFromBase64(entry.content.replace(/\n/gm, ''));
    await write(relativePath, data, { as: 'bytes' });
  }
  return true;
};

export const writeToGithub = async (
  owner,
  repository,
  branch,
  paths,
  sourcePaths,
  { replaceRepository = false } = {}
) => {
  await ensureRepository(repository);
  const { commitSha, treeSha } = await getState(owner, repository, branch, {
    replaceRepository,
  });
  const contents = [];
  for (const path of sourcePaths) {
    contents.push(await read(`source/${path}`));
  }
  const updateTree = paths.map((path, nth) => ({
    path,
    mode: FILE,
    type: 'blob',
    content: new TextDecoder('utf8').decode(contents[nth]),
  }));
  const deleteTree = [];
  const commitTree = await post(
    eq(CREATED, CONFLICT),
    `repos/${owner}/${repository}/git/trees`,
    { base_tree: treeSha, tree: [...updateTree, ...deleteTree] }
  );
  if (commitTree === undefined) return;
  const parents = commitSha === undefined ? [] : [commitSha];
  const commit = await post(
    eq(CREATED, CONFLICT),
    `repos/${owner}/${repository}/git/commits`,
    { message: 'Test', tree: commitTree.sha, parents }
  );
  if (commit === undefined) return;
  await patch(
    eq(200),
    `repos/${owner}/${repository}/git/refs/heads/${branch}`,
    {
      sha: commit.sha,
      force: true,
    }
  );
  return true;
};
