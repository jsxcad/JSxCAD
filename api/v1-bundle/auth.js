/* globals location */

import { writeFile } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

window.bootstrap = async () => {
  const { search } = location;
  if (search.startsWith('?gist=')) {
    const accessToken = search.substring(6);
    await writeFile({ project: '.system' }, 'auth/gist/accessToken', accessToken);
  }
  window.close();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
