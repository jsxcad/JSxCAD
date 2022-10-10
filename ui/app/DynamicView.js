import * as PropTypes from 'prop-types';

import { read, readOrWatch, unwatchFile, watchFile } from '@jsxcad/sys';

import React from 'react';
import { orbitDisplay } from '@jsxcad/ui-threejs';

export class DynamicView extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      view: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  async buildElement(container) {
    const { path, view, workspace } = this.props;
    if (!path) {
      return;
    }
    const geometry = await readOrWatch(path, { workspace });
    const { updateGeometry } = await orbitDisplay(
      {
        path,
        geometry,
        view,
      },
      container
    );
    this.watcher = async () => {
      updateGeometry(await read(path, { workspace }));
    };
    watchFile(path, workspace, this.watcher);
  }

  componentWillUnmount() {
    const { workspace } = this.props;
    if (this.watcher) {
      unwatchFile(this.path, workspace, this.watcher);
    }
    while (this.container.firstChild !== this.container.lastChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  render() {
    return (
      <div
        classList="note orbitView"
        ref={async (container) => {
          if (container) {
            await this.buildElement(container);
          }
        }}
      />
    );
  }
}

export default DynamicView;
