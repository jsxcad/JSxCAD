/* global location */

import { installUi } from './jsxcad-ui-app.js';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const bootstrap = async () => {
      await installUi({ document, workspace: 'JSxCAD', sha: 'master' });
    };
    bootstrap();
  }
};
