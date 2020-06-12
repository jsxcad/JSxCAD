import "./back";
import "./bottom";
import "./chop";
import "./flat";
import "./front";
import "./left";
import "./on";
import "./right";
import "./top";
import "./unfold";

import { faceConnector, toConnector } from "./faceConnector";

import Connector from "./Connector";
import X from "./X";
import Y from "./Y";
import Z from "./Z";
import connect from "./connect";

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
