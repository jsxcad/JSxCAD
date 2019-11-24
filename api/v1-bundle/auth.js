/* globals location */

import { writeFile } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

window.bootstrap = async () => {
  const { search } = location;
  // We expect something like: '?github=xxx'
  if (search.startsWith('?github=')) {
    const accessToken = search.substring(8);
    await writeFile({ project: '.system' }, 'auth/github/accessToken', accessToken);
  }
  window.close();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
