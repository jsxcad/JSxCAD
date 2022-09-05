/* global location */

import { installUi } from './jsxcad-ui-app.js';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const bootstrap = async () => {
      const hash = location.hash.substring(1);
      let [workspace, path] = hash.split('@');
      if (path === undefined) {
        path = workspace;
        workspace = 'JSxCAD';
      }
      await installUi({ document, workspace, sha: 'master', path });
    };
    bootstrap();
  }
};
