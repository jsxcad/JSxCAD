import { writeFile } from './writeFile';

export const log = (text) => writeFile({}, 'console/out', text);
