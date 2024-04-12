import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { decode } from 'base64-arraybuffer';
import { readOrWatch } from '@jsxcad/sys';
import saveAs from 'file-saver';

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
      download: PropTypes.object,
      runGcode: PropTypes.func,
      selected: PropTypes.boolean,
      style: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  render() {
    const { download, runGcode, selected, style = {}, workspace } = this.props;
    const buttons = [];
    for (let { path, base64Data, data, filename, type } of download.entries) {
      if (base64Data) {
        data = decode(base64Data);
      }
      buttons.push(
        <Button
          onClick={(event) =>
            downloadFile({ event, filename, path, data, type, workspace })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-download"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>{' '}
          {filename}
        </Button>
      );
      if (filename.endsWith('.gcode')) {
        buttons.push(
          <Button
            onClick={(e) =>
              runGcode({ e, path, data, filename, type, workspace })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-upload"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
            </svg>
          </Button>
        );
      }
    }
    const ref = selected && createRef();
    return (
      <ButtonGroup ref={ref} style={style}>
        {buttons}
      </ButtonGroup>
    );
  }
}

export default DownloadNote;
