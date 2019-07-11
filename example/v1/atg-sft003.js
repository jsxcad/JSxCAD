source('atg-sft003.dst', './atg-sft003.dst');

const paths = await readDst('atg-sft003.dst');
await paths.writePdf('pdf/atg-sft003.pdf');
