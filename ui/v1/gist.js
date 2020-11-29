import { CREATED, OK, eq, request as githubRequest } from './githubRequest';
import { read, write } from '@jsxcad/sys';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, { ...options, service: 'gist' });

const get = async (isOk, path, options) =>
  request(isOk, path, 'GET', undefined, options);

const post = async (isOk, path, body, options) =>
  request(isOk, path, 'POST', body, options);

export const readGist = async (gistId, { workspace }) => {
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

export const writeGist = async ({
  title = '',
  workspace,
  paths = [],
  isPublic = true,
}) => {
  const files = {};
  for (const path of paths) {
    const data = await read(`source/${path}`, { workspace });
    const content = new TextDecoder('utf8').decode(data);
    files[path] = { content };
  }
  const gist = await post(eq(CREATED), `gists`, {
    description: `${title} #jsxcad`,
    public: isPublic,
    files,
  });
  if (gist === undefined) return;
  return gist.html_url;
};
