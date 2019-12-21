import { Shape } from './jsxcad-api-v1.js';
export * from './jsxcad-api-v1.js';
import './jsxcad-ui-threejs.js';
import './jsxcad-convert-threejs.js';

const bigViewMethod = function ({ width = 512, height = 256, view = { position: [100, -100, 100] } } = {}) { return view(this, { width, height, view }); };
const bigTopViewMethod = function ({ width = 512, height = 256, view = { position: [0, 0, 100] } } = {}) { return view(this, { width, height, view }); };
const viewMethod = function ({ width = 256, height = 128, view = { position: [100, -100, 100] } } = {}) { return view(this, { width, height, view }); };
const topViewMethod = function ({ width = 256, height = 128, view = { position: [0, 0, 100] } } = {}) { return view(this, { width, height, view }); };
const frontViewMethod = function ({ width = 256, height = 128, view = { position: [0, -100, 0] } } = {}) { return view(this, { width, height, view }); };

Shape.prototype.view = viewMethod;
Shape.prototype.bigView = bigViewMethod;
Shape.prototype.topView = topViewMethod;
Shape.prototype.bigTopView = bigTopViewMethod;
Shape.prototype.frontView = frontViewMethod;
