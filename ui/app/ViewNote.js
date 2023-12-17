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
    const { sourceLocation, view } = note;
    const { download, name = '', width } = view;
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
        />
      );
    }
    return (
      <Card border="primary" onClick={onClick} style={{ maxWidth: width }}>
        <Card.Header>{name}</Card.Header>
        <Card.Body>
          <Card.Img src={note.url} variant="top" />
          <Card.Text>{downloadNote}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default ViewNote;
