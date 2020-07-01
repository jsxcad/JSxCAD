import './back.js';
import './bottom.js';
import './chop.js';
import './flat.js';
import './front.js';
import './left.js';
import './on.js';
import './right.js';
import './top.js';
import './unfold.js';

import { faceConnector, toConnector } from './faceConnector.js';

import Connector from './Connector.js';
import X from './X.js';
import Y from './Y.js';
import Z from './Z.js';
import connect from './connect.js';

const api = {
  Connector,
  X,
  Y,
  Z,
  connect,
  faceConnector,
  toConnector,
};

export { Connector, X, Y, Z, connect, faceConnector, toConnector };

export default api;
