import * as PropTypes from 'prop-types';

import { read, readOrWatch, unwatchFile, watchFile } from '@jsxcad/sys';

import React from 'react';
import { orbitDisplay } from '@jsxcad/ui-threejs';

export class DynamicView extends React.PureComponent {
  static get propTypes() {
    return {
      onIndicatePoint: PropTypes.func,
      path: PropTypes.string,
      view: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  async buildElement(container) {
    const { onIndicatePoint, path, view, workspace } = this.props;
    if (!path) {
      return;
    }
    const geometry = await readOrWatch(path, { workspace });
    const { anchorControls, updateGeometry } = await orbitDisplay(
      {
        path,
        geometry,
        view,
      },
      container
    );
    anchorControls.addEventListener('indicatePoint', ({ point }) => {
      if (onIndicatePoint) onIndicatePoint(point);
    });
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

  shouldComponentUpdate(nextProps) {
    if (this.props.path !== nextProps.path) {
      return true;
    }
    return false;
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
