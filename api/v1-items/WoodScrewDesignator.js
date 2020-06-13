import { alt, regexp, seq, string } from './parser';

const whitespace = regexp(/\s*/m);
const token = (parser) => parser.skip(whitespace);
const skipWhitespace = (parser) => parser.skip(whitespace);
const letter = (text) => string(text).thru(skipWhitespace);
const word = (text) => string(text).thru(skipWhitespace);
const number = () =>
  token(regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
    .map(Number)
    .desc('number');

const nominalSize = seq(word('#'), number()).map(([, inchDiameter]) => ({
  inchDiameter,
}));
const length = seq(number()).map(([feetLength]) => ({ feetLength }));

// FIX: Should be 'M'
const metricSize = seq(letter('m'), number()).map(([, mmDiameter]) => ({
  mmDiameter,
}));
const metricLength = alt(
  number().skip(word('mm')),
  number()
).map((mmLength) => ({ mmLength }));

const nominalSizeAndLength = seq(
  nominalSize.skip(word('x')),
  length
).map(([nominalSize, length]) => ({ ...nominalSize, ...length }));
const metricSizeAndLength = seq(
  metricSize.skip(word('x')),
  metricLength
).map(([nominalSize, length]) => ({ ...nominalSize, ...length }));

const size = alt(nominalSizeAndLength, metricSizeAndLength);

const driveStyle = alt(
  word('slotted'),
  word('phillips'), // Phillips
  word('square')
).map((driveStyle) => ({ driveStyle }));

const headType = alt(
  word('flat head'),
  word('oval countersunk head'),
  word('round head')
).map((headType) => ({ headType }));

const fastenerName = alt(word('wood screw')).map((fastenerName) => ({
  fastenerName: fastenerName,
}));

const material = alt(
  word('steel'),
  word('stainless steel'),
  word('brass'),
  word('silicon bronze')
).map((material) => ({ material }));

const protectiveFinish = alt(word('zinc plated')).map((protectiveFinish) => ({
  protectiveFinish,
}));

const WoodScrewDesignator = alt(
  seq(
    size,
    driveStyle,
    headType,
    fastenerName.skip(word(',')),
    material,
    protectiveFinish
  ),
  seq(size, driveStyle, headType, fastenerName.skip(word(',')), material),
  seq(
    size,
    driveStyle,
    headType,
    fastenerName.skip(word(',')),
    protectiveFinish
  ),
  seq(size, driveStyle, headType, fastenerName)
);

export default WoodScrewDesignator;
