import { CREATED, OK, eq, request as githubRequest } from './githubRequest';
import { listFiles, read, write } from '@jsxcad/sys';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, { ...options, service: 'gist' });

export const get = async (isOk, path, options) => request(isOk, path, 'GET', undefined, options);
export const post = async (isOk, path, body, options) => request(isOk, path, 'POST', body, options);
export const patch = async (isOk, path, body, options) => request(isOk, path, 'PATCH', body, options);

export const readWorkspace = async (gistId, { workspace }) => {
  const gist = await get(eq(OK), `gists/${gistId}`);
  if (gist === undefined) return;
  const { files } = gist;
  if (files === undefined) return;
  for (const path of Object.keys(files)) {
    const file = files[path];
    // FIX: An oversize file will have file.content === '' and be silently ignored.
    if (file && file.content) {
      await write(`source/${path}`, file.content, { workspace });
    }
  }
  return true;
};

export const writeWorkspace = async ({ workspace, isPublic = true }) => {
  const files = {};
  const prefix = `source/`;
  for (const path of await listFiles({ workspace })) {
    if (path.startsWith(prefix)) {
      const name = path.substring(prefix.length);
      files[name] = { content: await read(path, { workspace }) };
    }
  }
  const gist = await post(eq(CREATED),
                          `gists`,
                          {
                            description: `${workspace} #jsxcad`,
                            public: isPublic,
                            files
                          });
  if (gist === undefined) return;
  return gist.html_url;
};
