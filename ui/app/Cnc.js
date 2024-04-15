/* global WebSocket */

export class EspWebUiBridge {
  constructor(address) {
    this.address = address;
    this.queries = new Set();
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
    this.grbl = {
      stateName: '',
      message: '',
      wco: [0, 0, 0],
      mpos: [0, 0, 0],
      wpos: [0, 0, 0],
      feedrate: 0,
      spindle: undefined,
      spindleSpeed: 0,
      ovr: [0, 0, 0],
      lineNumber: 0,
      flood: undefined,
      mist: undefined,
      pins: undefined,
    };
    this.grblStatusListeners = new Set();
    this.runQueue = [];
    this.webSocketState = 'DISCONNECTED';
  }

  wait(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async ensureWebSocket() {
    if (this.webSocketState === 'DISCONNECTED') {
      this.webSocketState = 'CONNECTING';
      this.webSocket = new Promise((resolve, reject) => {
        const webSocket = new WebSocket(`ws://${this.address}:81/`);
        webSocket.binaryType = 'arraybuffer';
        webSocket.onmessage = ({ data }) => {
          let line;
          if (data instanceof ArrayBuffer) {
            line = this.decoder.decode(data);
          } else {
            line = data;
          }
          console.log(line);
          for (const query of [...this.queries]) {
            query(line);
          }
          if (line.startsWith('<')) {
            console.log(JSON.stringify(this.parseGrblStatus(line, this.grbl)));
            for (const listener of [...this.grblStatusListeners]) {
              listener(this.grbl);
            }
          }
        };
        webSocket.onclose = () => {
          this.webSocketState = 'DISCONNECTED';
          reject(Error('WebSocket closed'));
          // Attempt to re-open.
          this.ensureWebSocket();
        };
        webSocket.onopen = () => {
          this.webSocketState = 'CONNECTED';
          resolve();
        };
      });
    }
    return this.webSocket;
  }

  async start() {
    if (this.did_start) {
      return;
    }
    this.did_start = true;
    await this.ensureWebSocket();
  }

  parseGrblStatus(response, grbl) {
    let isMposDirty = false;
    let isWposDirty = false;
    response = response.replace('<', '').replace('>', '');
    for (const field of response.split('|')) {
      const [tag, value] = field.split(':');
      switch (tag) {
        case 'Door':
          grbl.stateName = tag;
          grbl.message = field;
          break;
        case 'Hold':
          grbl.stateName = tag;
          grbl.message = field;
          break;
        case 'Run':
        case 'Jog':
        case 'Idle':
        case 'Home':
        case 'Alarm':
        case 'Check':
        case 'Sleep':
          grbl.stateName = tag;
          break;
        case 'Ln':
          grbl.lineNumber = parseInt(value);
          break;
        case 'MPos':
          grbl.mpos = value.split(',').map(function (v) {
            return parseFloat(v);
          });
          isMposDirty = true;
          break;
        case 'WPos':
          grbl.wpos = value.split(',').map(function (v) {
            return parseFloat(v);
          });
          isWposDirty = true;
          break;
        case 'WCO':
          grbl.wco = value.split(',').map(function (v) {
            return parseFloat(v);
          });
          break;
        case 'FS': {
          const rates = value.split(',');
          grbl.feedrate = parseFloat(rates[0]);
          grbl.spindleSpeed = parseInt(rates[1]);
          break;
        }
        case 'Ov': {
          const rates = value.split(',');
          grbl.ovr = {
            feed: parseInt(rates[0]),
            rapid: parseInt(rates[1]),
            spindle: parseInt(rates[2]),
          };
          break;
        }
        case 'A':
          grbl.spindleDirection = 'M5';
          for (const v of value) {
            switch (v) {
              case 'S':
                grbl.spindleDirection = 'M3';
                break;
              case 'C':
                grbl.spindleDirection = 'M4';
                break;
              case 'F':
                grbl.flood = true;
                break;
              case 'M':
                grbl.mist = true;
                break;
            }
          }
          break;
        case 'SD': {
          const sdinfo = value.split(',');
          grbl.sdPercent = parseFloat(sdinfo[0]);
          grbl.sdName = sdinfo[1];
          break;
        }
        case 'Pn':
          // pin status
          grbl.pins = value;
          break;
        default:
          // ignore other fields that might happen to be present
          break;
      }
    }
    if (isMposDirty) {
      const [mx, my, mz] = grbl.mpos;
      const [ox, oy, oz] = grbl.wco;
      grbl.wpos = [mx - ox, my - oy, mz - oz];
    }
    if (isWposDirty) {
      const [wx, wy, wz] = grbl.wpos;
      const [ox, oy, oz] = grbl.wco;
      grbl.mpos = [wx + ox, wy + oy, wz + oz];
    }
    return grbl;
  }

  pauseGrblStatusUpdates() {
    this.setReportInterval(0);
  }

  resumeGrblStatusUpdates() {
    this.setReportInterval(500);
  }

  addGrblStatusListener(listener) {
    if (this.grblStatusListeners.size === 0) {
      this.resumeGrblStatusUpdates();
    }
    this.grblStatusListeners.add(listener);
  }

  removeGrblStatusListener(listener) {
    this.grblStatusListeners.delete(listener);
    if (this.grblStatusListeners.size === 0) {
      this.pauseGrblStatusUpdates();
    }
  }

  async runAcquire() {
    return new Promise((resolve, reject) => {
      this.runQueue.push(resolve);
      if (this.runQueue.length === 1) {
        resolve();
      }
    });
  }

  runRelease() {
    this.runQueue.shift();
    if (this.runQueue.length > 0) {
      // Resolve the next runAcquire promise to let the next one through.
      const resolve = this.runQueue[0];
      resolve();
    }
  }

  async runStatus() {
    await this.runAcquire();
    return new Promise((resolve, reject) => {
      const op = (data) => {
        const lines = data.split('\r\n');
        const line = lines[0];
        console.log(`QQ/status: line=[${line}]`);
        if (line === 'ok') {
          resolve(line);
          this.queries.delete(op);
          this.runRelease();
          return true;
        } else if (line.startsWith('error:')) {
          reject(line);
          this.queries.delete(op);
          this.runRelease();
          return true;
        } else {
          return false;
        }
      };
      this.queries.add(op);
    });
  }

  async uploadStatus() {
    return new Promise((resolve, reject) => {
      const op = (data) => {
        const lines = data.split('\r\n');
        const line = lines[0];
        console.log(`QQ/status: line=[${line}]`);
        if (line === '[MSG:Files changed]') {
          resolve(line);
          this.queries.delete(op);
          return true;
        } else if (line.startsWith('[MSG:ERR')) {
          reject(line);
          this.queries.delete(op);
          return true;
        } else {
          return false;
        }
      };
      this.queries.add(op);
    });
  }

  async upload(filename, data) {
    try {
      await this.start();
      await this.pauseGrblStatusUpdates();
      // Give time for the status update buffers to drain?
      await this.wait(1000);
      const formData = new FormData();
      formData.append('path', `/${filename}`);
      formData.append(`/${filename}S`, data.length);
      formData.append(
        'myfile[]',
        new Blob([data], { type: 'text/plain' }),
        `/${filename}`
      );
      const status = this.uploadStatus();
      await fetch(`http://${this.address}/upload`, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      await status;
      // Give time for the upload buffers to drain?
      await this.wait(1000);
      await this.resumeGrblStatusUpdates();
    } catch (error) {
      throw error;
    }
  }

  async run(commandText) {
    try {
      await this.start();
      const status = this.runStatus();
      console.log(`QQ/run: commandText=${commandText}`);
      await fetch(
        `http://${this.address}/command?${new URLSearchParams({
          commandText,
        })}`,
        { method: 'POST', body: '', mode: 'no-cors' }
      );
      return status;
    } catch (error) {
      throw error;
    }
  }

  async uploadAndRun(data) {
    await this.upload('tmp.gcode', data);
    await this.run(`G54`); // Use the first coordinate system.
    await this.run(`$SD/Run=tmp.gcode`);
    console.log(`QQ/runCode/run/done`);
  }

  async realtime(commandText) {
    try {
      await this.start();
      await fetch(
        `http://${this.address}/command?${new URLSearchParams({
          commandText,
        })}`,
        { method: 'POST', body: '', mode: 'no-cors' }
      );
    } catch (error) {
      throw error;
    }
  }

  async home() {
    await this.run('$H');
  }

  async pause() {
    await this.realtime('!');
  }

  async reboot() {
    await this.realtime('$Bye');
  }

  async resume() {
    await this.realtime('~');
  }

  async reset() {
    await this.realtime('\x18');
  }

  async setReportInterval(ms) {
    await this.run(`$Report/Interval=${ms}`);
  }
}

const espWebUiBridges = new Map();

export const getCnc = (config) => {
  switch (config.type) {
    case 'EspWebUi': {
      const { ip } = config;
      if (!espWebUiBridges.has(ip)) {
        espWebUiBridges.set(ip, new EspWebUiBridge(ip));
      }
      return espWebUiBridges.get(ip);
    }
  }
};
