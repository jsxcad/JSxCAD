import * as PropTypes from 'prop-types';

import { orbitDisplay, raycast } from '@jsxcad/ui-threejs';
import { read, readOrWatch, unwatchFile, watchFile } from '@jsxcad/sys';

import React from 'react';

export class OrbitView extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      view: PropTypes.object,
      sourceLocation: PropTypes.object,
      workspace: PropTypes.string,
      onMove: PropTypes.function,
      onClick: PropTypes.function,
      onDrag: PropTypes.function,
      onDragEnd: PropTypes.function,
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
    const {
      camera,
      canvas,
      dragControls,
      draggableObjects,
      renderer,
      scene,
      trackballControls,
      updateGeometry,
    } = await orbitDisplay(
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
    this.trackballControls = trackballControls;
    if (state.target) {
      this.trackballControls.target0.copy(state.target);
    }
    if (state.position) {
      this.trackballControls.position0.copy(state.position);
    }
    if (state.up) {
      this.trackballControls.up0.copy(state.up);
    }
    if (state.zoom) {
      this.trackballControls.zoom0 = state.zoom;
    }
    this.trackballControls.reset();
    this.builtPath = path;
    this.builtContainer = container;
    if (this.watcher) {
      unwatchFile(this.builtPath, this.watcher, { workspace });
    }
    this.watcher = async () => {
      // FIX: Why isn't this done by updateGeometry?
      // Backup the control state.
      this.trackballControls.target0.copy(this.trackballControls.target);
      this.trackballControls.position0.copy(
        this.trackballControls.object.position
      );
      this.trackballControls.up0.copy(this.trackballControls.object.up);
      this.trackballControls.zoom0 = this.trackballControls.object.zoom;
      const geometry = await read(this.builtPath, { workspace });
      await updateGeometry(geometry);
      // Restore the control state.
      trackballControls.reset();
    };
    watchFile(path, this.watcher, { workspace });

    trackballControls.addEventListener('change', () => {
      const { onMove } = this.props;
      if (onMove) {
        const { target } = trackballControls;
        const { position, up, zoom } = trackballControls.object;
        onMove({ path, position, up, target, zoom });
      }
    });
    const handleDrag = ({ object }) => {
      const { onDrag } = this.props;
      if (onDrag) {
        onDrag({ object });
      }
    };
    const handleDragEnd = ({ object }) => {
      const { onDragEnd } = this.props;
      if (onDragEnd) {
        onDragEnd({ object });
      }
    };
    const handleClick = (type) => (event) => {
      const { onClick, view, sourceLocation } = this.props;
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.x) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.y) / rect.height) * 2 + 1;
      const { ray, object } = raycast(x, y, camera, [scene]);
      if (!object) {
        return;
      }
      if (object.userData.onClick) {
        return object.userData.onClick({ event });
      } else if (onClick) {
        const { editId, editType, viewId } = object.userData;
        return onClick({
          camera,
          draggableObjects,
          event,
          editId,
          editType,
          path,
          position: camera.position,
          object,
          scene,
          sourceLocation,
          trackballControls,
          ray,
          renderer,
          target: trackballControls.target,
          threejsMesh: object,
          type,
          view,
          viewId,
        });
      }
    };
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      handleClick('right')(event);
    });
    canvas.addEventListener('click', handleClick('left'));
    dragControls.addEventListener('drag', handleDrag);
    dragControls.addEventListener('dragend', handleDragEnd);
  }

  componentWillUnmount() {
    const { workspace } = this.props;
    if (this.watcher) {
      unwatchFile(this.path, this.watcher, { workspace });
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

export default OrbitView;
