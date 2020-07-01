import { Page, ensurePages } from './Page.js';

import Apothem from './Apothem.js';
import Diameter from './Diameter.js';
import Label from './Label.js';
import Length from './Length.js';
import Radius from './Radius.js';
import Sketch from './Sketch.js';

const api = {
  Apothem,
  Diameter,
  Label,
  Length,
  Page,
  Radius,
  Sketch,
};

export { Apothem, Diameter, Label, Length, Page, Radius, Sketch, ensurePages };

export default api;
