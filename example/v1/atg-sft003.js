import { readDst } from '@jsxcad/api-v1-dst';
import '@jsxcad/api-v1-pdf';

source('atg-sft003.dst', './atg-sft003.dst');

const paths = await readDst('atg-sft003.dst');
await paths.Page().writePdf('atg-sft003');
