import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import { SpinnerCircularSplit } from 'spinners-react';
import { useEffect } from 'preact/hooks';

export class ViewNote extends React.PureComponent {
  static get propTypes() {
    return {
      note: PropTypes.object,
      notebookPath: PropTypes.string,
      onClickView: PropTypes.func,
      selected: PropTypes.boolean,
      workspace: PropTypes.string,
    };
  }

  showOrbitView() {}

  render() {
    const { notebookPath, note, onClickView, selected, workspace } = this.props;
    const { view, sourceLocation } = note;
    const { height, width } = view;
    const onClick = (event) => {
      if (onClickView) {
        onClickView({
          event,
          notebookPath,
          note,
          path: note.path,
          view: note.view,
          workspace,
          sourceLocation,
        });
      }
    };
    if (!note.url) {
      return (
        <SpinnerCircularSplit
          color="#36d7b7"
          size={Math.min(width, height) * 0.8}
        />
      );
    }
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    return (
      <img
        ref={ref}
        class="note view"
        style={{
          display: 'block',
          height: `${height}px`,
          width: `${width}px`,
          border,
        }}
        src={note.url}
        onClick={onClick}
      />
    );
  }
}

export default ViewNote;
