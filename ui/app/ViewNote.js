import * as PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import DownloadNote from './DownloadNote.js';
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
    const { name, download } = view;
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
      return <div></div>;
    }
    let downloadNote;
    if (download) {
      downloadNote = (
        <DownloadNote
          key={note.hash}
          download={download}
          workspace={workspace}
          style={{ float: 'right' }}
        />
      );
    }
    return (
      <Card onClick={onClick}>
        <Card.Text>
          {name}
          {downloadNote}
        </Card.Text>
        <Card.Img src={note.url} variant="top" />
      </Card>
    );
  }
}

export default ViewNote;
