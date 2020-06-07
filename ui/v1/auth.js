/* globals location */

import { write } from '@jsxcad/sys';

window.bootstrap = async () => {
  const { search } = location;
  if (search.startsWith('?gist=')) {
    const accessToken = search.substring(6);
    await write('auth/gist/accessToken', accessToken, { workspace: '.system' });
  } else if (search.startsWith('?githubRepository=')) {
    const accessToken = search.substring(18);
    console.log(`QQ/accessToken: ${accessToken}`);
    await write('auth/githubRepository/accessToken', accessToken, { workspace: '.system' });
  }
  window.close();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
