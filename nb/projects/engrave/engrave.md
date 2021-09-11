import { Text, readFont } from '@jsxcad/api-v1-font';
const tool = { grbl: { type: 'spindle', spindleRpm: 7000, feedRate: 650 } };
const text = await control('Engraving', '輝');
const unYetGul = await readFont('https://jsxcad.js.org/ttf/UnYetgul.ttf?a=1');
const model = Text(unYetGul, text, 25)
  .align('xy')
  .cutFrom(Box(30, 26))
  .view()
  .md('Model');
![Image](engrave.md.0.png)

Model

const inset = model.inset(0.5, 0.5).gridView().md('Section Inset');
![Image](engrave.md.1.png)

Section Inset
