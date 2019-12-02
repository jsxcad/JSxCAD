import Hershey from './Hershey';
import readFont from './readFont';

const ofSize = (size) => Hershey.ofSize(size);

export const Font = (size) => ofSize(size);

Font.Hershey = Hershey;
Font.ofSize = ofSize;
Font.read = async (path, { flip = false } = {}) => readFont(path, { flip });

export default Font;
