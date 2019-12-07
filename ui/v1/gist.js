import { CREATED, eq, request as githubRequest } from './githubRequest';

import { readFile } from '@jsxcad/sys';

const request = (isOk, path, method, body, options) =>
  githubRequest(isOk, path, method, body, { ...options, service: 'gist' });

export const get = async (isOk, path, options) => request(isOk, path, 'GET', undefined, options);
export const post = async (isOk, path, body, options) => request(isOk, path, 'POST', body, options);
export const patch = async (isOk, path, body, options) => request(isOk, path, 'PATCH', body, options);

export const writeProject = async (project, { gistIsPublic = true }) => {
  const scriptJsx = await readFile({ project }, 'source/script.jsx');
  const scriptJsxcad = await readFile({ project }, 'source/script.jsxcad');
  const gist = await post(eq(CREATED),
                          `gists`,
                          {
                            description: `${project} #jsxcad`,
                            public: gistIsPublic,
                            files: {
                              'script.jsxcad': {
                                content: scriptJsxcad || scriptJsx
                              }
                            }
                          });
  if (gist === undefined) return;
  return gist.url;
};
