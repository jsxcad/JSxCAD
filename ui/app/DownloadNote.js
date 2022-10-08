/* global Blob */

import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { decode } from 'base64-arraybuffer';
import { readOrWatch } from '@jsxcad/sys';
import saveAs from 'file-saver';
import { useEffect } from 'preact/hooks';

const downloadFile = async ({ filename, path, data, type, workspace }) => {
  if (path && !data) {
    data = await readOrWatch(path, { workspace });
  }
  const blob = new Blob([data], { type });
  saveAs(blob, filename);
};

export class DownloadNote extends React.PureComponent {
  static get propTypes() {
    return {
      note: PropTypes.object,
      selected: PropTypes.boolean,
      workspace: PropTypes.string,
    };
  }

  render() {
    const { note, selected, workspace } = this.props;
    const buttons = [];
    for (let { path, base64Data, data, filename, type } of note.download
      .entries) {
      if (base64Data) {
        data = decode(base64Data);
      }
      buttons.push(
        <Button
          onClick={(event) =>
            downloadFile({ event, filename, path, data, type, workspace })
          }
        >
          Download {filename}
        </Button>
      );
    }
    const ref = selected && createRef();
    if (selected) {
      useEffect(() => ref.current.scrollIntoView(true));
    }
    const border = selected ? '1px dashed dodgerblue' : '0px';
    return (
      <ButtonGroup ref={ref} style={{ border }}>
        {buttons}
      </ButtonGroup>
    );
  }
}

export default DownloadNote;
