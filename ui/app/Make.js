import './Notebook.css';

import * as PropTypes from 'prop-types';

import React, { createRef } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { getCnc } from './Cnc.js';

export class MakeEspWebUi extends React.PureComponent {
  static get propTypes() {
    return {
      ip: PropTypes.string,
      path: PropTypes.string,
      workspace: PropTypes.string,
    };
  }

  constructor(props) {
    super();
    this.cpos = [0, 0, undefined];
    this.cposRef = createRef();
    this.cursorRef = createRef();
    this.mposRef = createRef();
    this.statusRef = createRef();
    this.toolRef = createRef();
    this.wposRef = createRef();
    this.cnc = getCnc({ type: 'EspWebUi', ip: props.ip });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.cnc.removeGrblStatusListener(this.listener);
    }
  }

  componentDidMount() {
    this.listener = (grbl) => this.updateStatus(grbl);
    this.cnc.addGrblStatusListener(this.listener);
  }

  updateStatus(grbl) {
    if (this.statusRef.current) {
      this.statusRef.current.innerText = JSON.stringify(grbl);
    }
    if (this.toolRef.current) {
      const [mx, my] = this.cnc.grbl.mpos;
      this.toolRef.current.setAttribute('cx', mx);
      this.toolRef.current.setAttribute('cy', my);
      if (this.cnc.grbl.spindleSpeed === 0) {
        this.toolRef.current.setAttribute('fill', 'black');
      } else {
        this.toolRef.current.setAttribute('fill', 'red');
      }
    }
    if (this.mposRef.current) {
      const [mx, my, mz] = this.cnc.grbl.mpos;
      this.mposRef.current.innerText = `${mx} ${my} ${mz}`;
    }
    if (this.wposRef.current) {
      const [wx, wy, wz] = this.cnc.grbl.mpos;
      this.wposRef.current.innerText = `${wx} ${wy} ${wz}`;
    }
  }

  setCpos(x, y, z = this.cpos[2]) {
    this.cpos = [x, y, z];
    if (this.cposRef.current) {
      this.cposRef.current.innerText = JSON.stringify(this.cpos);
    }
    if (this.cursorRef.current) {
      this.cursorRef.current.setAttribute('transform', `translate(${x},${y})`);
    }
  }

  getCposCode() {
    const [x = 0, y = 0, z] = this.cpos;
    if (z === undefined) {
      return `X${x}Y${y}`;
    } else {
      return `X${x}Y${y}Z${z}`;
    }
  }

  async zeroWorkCoordinatesAtCursor() {
    // Zero the first coordinate system at this offset.
    await this.cnc.run('G10L20P1X0Y0Z0');
  }

  async jogToCursor() {
    // Jog in machine coordinates.
    await this.cnc.run(`$Jog=G53G91${this.getCposCode()}F5000`);
  }

  render() {
    const { ip } = this.props;

    const setCpos = (e) => {
      if (e.key !== 'enter' && e.key !== 'j' && e.key !== 'w') {
        return;
      }
      const value = document.getElementById('make/cpos/set').value;
      const [x, y, z] = value.split(',');
      if (z === undefined) {
        this.setCpos(Number(x), Number(y));
      } else {
        this.setCpos(Number(x), Number(y), Number(z));
      }
      switch (e.key) {
        case 'j':
          this.jogToCursor();
          e.preventDefault();
          e.stopPropagation();
          break;
        case 'w':
          this.zeroWorkCoordinatesAtCursor();
          e.preventDefault();
          e.stopPropagation();
          break;
        case 'enter':
          break;
      }
    };

    const result = (
      <div>
        IP Address
        <div>{ip}</div>
        Machine position
        <div id="make/mpos" ref={this.mposRef}>
          0 0 0
        </div>
        Work position
        <div id="make/wpos" ref={this.wposRef}>
          0 0 0
        </div>
        Cursor position
        <div>
          <span id="make/cpos" ref={this.cposRef}>
            {JSON.stringify(this.cpos)}
          </span>
          <span>
            <input id="make/cpos/set" onKeyDown={setCpos}></input>
          </span>
        </div>
        <svg
          id="make/svg"
          width="300"
          height="300"
          style="border: solid black 1px"
          onClick={({ offsetX, offsetY }) =>
            this.setCpos(offsetX, 300 - offsetY)
          }
        >
          <g transform="translate(0,300)">
            <g transform="scale(1,-1)">
              <circle
                id="make/svg/tool"
                cx="0"
                cy="0"
                r="6"
                ref={this.toolRef}
              />
              <g ref={this.cursorRef}>
                <path
                  stroke="green"
                  id="make/svg/cursor"
                  d="M -5 0 L 5 0 M 0 -5 L 0 5"
                />
              </g>
            </g>
          </g>
        </svg>
        <br />
        <ButtonGroup>
          <Button onClick={(event) => this.cnc.home()}>
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
          <Button onClick={(event) => this.cnc.pause()}>
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
          <Button onClick={(event) => this.cnc.resume()}>
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
          <Button onClick={(event) => this.cnc.reset()}>
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
          <Button onClick={() => this.jogToCursor()}>jog</Button>
          <Button onClick={() => this.cnc.run('$Jog=G91X-10F5000')}>l</Button>
          <Button onClick={() => this.cnc.run('$Jog=G91X10F5000')}>r</Button>
        </ButtonGroup>
        <div ref={this.statusRef}></div>
      </div>
    );
    return result;
  }
}
