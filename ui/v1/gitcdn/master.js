import { installUi } from 'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/es6/jsxcad-ui-v1.js';

/* global location */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const bootstrap = async () => {
      const hash = location.hash.substring(1);
      const [project, source] = hash.split('@');
      await installUi({
        document,
        project,
        source
      });
    };

    bootstrap();
  }
};
