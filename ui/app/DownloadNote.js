import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { cnc } from './Cnc.js';
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

const runGcode = async ({ filename, path, data, type, workspace }) => {
  if (path && !data) {
    data = await readOrWatch(path, { workspace });
  }
  console.log(`QQ/runCode/upload`);
  await cnc.upload('tmp.gcode', data);
  console.log(`QQ/runCode/run`);
  await cnc.run(`G54`); // Use the first coordinate system.
  await cnc.run(`$SD/Run=tmp.gcode`);
  console.log(`QQ/runCode/run/done`);
};

export class DownloadNote extends React.PureComponent {
  static get propTypes() {
    return {
      download: PropTypes.object,
      selected: PropTypes.boolean,
      style: PropTypes.object,
      workspace: PropTypes.string,
    };
  }

  render() {
    const { download, selected, style = {}, workspace } = this.props;
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
            onClick={(event) =>
              runGcode({ event, filename, path, data, type, workspace })
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
        buttons.push(
          <Button onClick={(event) => cnc.home()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-house"
              viewBox="0 0 16 16"
            >
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
            </svg>
          </Button>
        );
        buttons.push(
          <Button onClick={(event) => cnc.pause()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pause"
              viewBox="0 0 16 16"
            >
              <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
            </svg>
          </Button>
        );
        buttons.push(
          <Button onClick={(event) => cnc.resume()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-right"
              viewBox="0 0 16 16"
            >
              <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
            </svg>
          </Button>
        );
        buttons.push(
          <Button onClick={(event) => cnc.reset()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-bootstrap-reboot"
              viewBox="0 0 16 16"
            >
              <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z" />
              <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z" />
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
