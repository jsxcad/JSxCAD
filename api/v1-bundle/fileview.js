import { listFiles } from '@jsxcad/sys';

import { jsPanel } from 'jspanel4';

export const installFileview = async (options = {}) => {
  const fileview = jsPanel.create({
    headerTitle: 'Files',
    position: { my: 'right-top', at: 'right-top' },
    contentOverflow: 'scroll',
    panelSize: { width: 512, height: 512 },
    border: '2px solid',
    borderRadius: 6,
    headerControls: { close: 'remove' }
  });

  for (const file of await listFiles()) {
    jsPanel.create({
      container: fileview.content,
      panelSize: { width: 512, height: '3em' },
      position: { my: 'left-top', at: 'left-top', autoposition: 'down' },
      headerTitle: file,
      border: '2px solid',
      borderRadius: 6,
    });
  }
}
