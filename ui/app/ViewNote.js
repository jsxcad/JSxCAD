import * as PropTypes from 'prop-types';

import React from 'react';

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

  render() {
    const { notebookPath, note, onClickView, workspace } = this.props;
    const { view, sourceLocation } = note;
    const { height, width, viewId } = view;
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
    const viewIdClass = viewId ? `viewId_${viewId}` : '';
    if (!note.url) {
      return <div></div>;
    }
    return (
      <img
        class={viewIdClass}
        style={{ width, height }}
        variant="top"
        src={note.url}
        onClick={onClick}
      />
    );
  }
}

export default ViewNote;
