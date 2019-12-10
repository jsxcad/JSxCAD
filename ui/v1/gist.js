import { CREATED, OK, eq, request as githubRequest } from './githubRequest';
import { listFiles, readFile, writeFile } from '@jsxcad/sys';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, { ...options, service: 'gist' });

export const get = async (isOk, path, options) => request(isOk, path, 'GET', undefined, options);
export const post = async (isOk, path, body, options) => request(isOk, path, 'POST', body, options);
export const patch = async (isOk, path, body, options) => request(isOk, path, 'PATCH', body, options);

export const readProject = async (gistId, { project }) => {
  const gist = await get(eq(OK), `gists/${gistId}`);
  if (gist === undefined) return;
  const { files } = gist;
  if (files === undefined) return;
  for (const path of Object.keys(files)) {
    const file = files[path];
    if (file && file.content) {
      await writeFile({ project }, `source/${path}`, file.content);
    }
  }
  return true;
};

export const writeProject = async ({ project, isPublic = true }) => {
  const files = {};
  const prefix = `${project}/source/`;
  for (const path of await listFiles({ project })) {
    if (path.startsWith(prefix)) {
      const name = path.substring(7);
      files[name] = { content: await readFile({ project }, path) };
    }
  }
  const gist = await post(eq(CREATED),
                          `gists`,
                          {
                            description: `${project} #jsxcad`,
                            public: isPublic,
                            files
                          });
  if (gist === undefined) return;
  return gist.html_url;
};
