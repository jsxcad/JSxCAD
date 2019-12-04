/* global location */

import { installFilesystemview } from './filesystemview';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const bootstrap = async () => {
      const hash = location.hash.substring(1);
      const [project, source] = hash.split('@');
      await installFilesystemview({ document, project, source });
    };
    bootstrap();
  }
};
