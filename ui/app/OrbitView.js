import * as PropTypes from 'prop-types';

import React from 'react';
import { orbitDisplay } from '@jsxcad/ui-threejs';
import { readOrWatch } from '@jsxcad/sys';

export class OrbitView extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      view: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async buildElement(container) {
    const { path, view, workspace } = this.props;
    if (!path) {
      return;
    }
    if (container === this.builtContainer && path === this.builtPath) {
      return;
    }
    const data = await readOrWatch(path, { workspace });
    const definitions = {};
    const { target, up, position, withAxes, withGrid } = view;
    // const element = document.createElement('div');
    // element.classList.add('note', 'orbitView');
    await orbitDisplay(
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
    this.builtPath = path;
    this.builtContainer = container;
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
