import { writeFile } from 'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/es6/jsxcad-sys.js';

/* globals location */

window.bootstrap = async () => {
  const {
    search
  } = location;

  if (search.startsWith('?gist=')) {
    const accessToken = search.substring(6);
    await writeFile({
      project: '.system'
    }, 'auth/gist/accessToken', accessToken);
  } else if (search.startsWith('?githubRepository=')) {
    const accessToken = search.substring(18);
    console.log(`QQ/accessToken: ${accessToken}`);
    await writeFile({
      project: '.system'
    }, 'auth/githubRepository/accessToken', accessToken);
  }

  window.close();
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
