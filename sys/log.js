import { writeFile } from './writeFile';

export const log = (text) => writeFile({ ephemeral: true }, 'console/out', text);
