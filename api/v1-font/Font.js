import Hershey from './Hershey.js';
import readFont from './readFont.js';

const ofSize = (size) => Hershey.ofSize(size);

export const Font = (size) => ofSize(size);

Font.Hershey = Hershey;
Font.ofSize = ofSize;
Font.read = async (...args) => readFont(...args);

export { Hershey };

export default Font;
