import * as Lego from './Lego';
import readLDraw from './readLDraw';

const api = { ...Lego, readLDraw };

export * from './Lego';
export { readLDraw };

export default api;
