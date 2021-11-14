import * as PropTypes from 'prop-types';

import { read, readOrWatch, unwatchFile, watchFile } from '@jsxcad/sys';

import React from 'react';
import { orbitDisplay } from '@jsxcad/ui-threejs';

export class OrbitView extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      view: PropTypes.object,
      workspace: PropTypes.string,
      onMove: PropTypes.function,
      trackballState: PropTypes.object,
    };
  }

  constructor(props) {
    super(props);
    const { path, view } = props;
    this.state = { path, view };
  }

  async buildElement(container) {
    const { path, view, workspace, trackballState } = this.props;
    if (!path) {
      return;
    }
    if (container === this.builtContainer && path === this.builtPath) {
      return;
    }
    const data = await readOrWatch(path, { workspace });
    const definitions = {};
    const { target, up, position, withAxes, withGrid } = view;
    const { updateGeometry, trackball } = await orbitDisplay(
      {
        view: { target, up, position },
        geometry: data,
        withAxes,
        withGrid,
        definitions,
      },
      container
    );
    while (container.firstChild !== container.lastChild) {
      container.removeChild(container.firstChild);
    }
    const state = await trackballState;
    this.trackball = trackball;
    if (state.target) {
      this.trackball.target0.copy(state.target);
    }
    if (state.position) {
      this.trackball.position0.copy(state.position);
    }
    if (state.up) {
      this.trackball.up0.copy(state.up);
    }
    if (state.zoom) {
      this.trackball.zoom0 = state.zoom;
    }
    this.trackball.reset();
    this.builtPath = path;
    this.builtContainer = container;
    if (this.watcher) {
      unwatchFile(this.builtPath, this.watcher, { workspace });
    }
    this.watcher = async () => {
      // Backup the control state.
      this.trackball.target0.copy(this.trackball.target);
      this.trackball.position0.copy(this.trackball.object.position);
      this.trackball.up0.copy(this.trackball.object.up);
      this.trackball.zoom0 = this.trackball.object.zoom;
      const geometry = await read(this.builtPath, { workspace });
      await updateGeometry(geometry);
      // Restore the control state.
      trackball.reset();
    };
    watchFile(path, this.watcher, { workspace });

    trackball.addEventListener('change', () => {
      const { onMove } = this.props;
      if (onMove) {
        const { target } = trackball;
        const { position, up, zoom } = trackball.object;
        onMove({ path, position, up, target, zoom });
      }
    });
  }

  componentWillUnmount() {
    const { workspace } = this.props;
    if (this.watcher) {
      unwatchFile(this.path, this.watcher, { workspace });
    }
  }

  render() {
    // return <div classList="note orbitView" onClick={e => e.stopPropagation()} ref={async (container) => {
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

export default OrbitView;
