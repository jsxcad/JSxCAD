import WoodScrewDesignator from './WoodScrewDesignator';
import test from 'ava';

const decode = (designator) =>
  WoodScrewDesignator.tryParse(designator.toLowerCase()).reduce(
    (value, object) => ({ ...object, ...value }),
    {}
  );

test('Wood Screw', (t) => {
  const designator = decode('#10 x 1 Slotted Round Head Wood Screw');
  t.deepEqual(designator, {
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    inchDiameter: 10,
    feetLength: 1,
  });
});

test('Wood Screw with Material', (t) => {
  const designator = decode('#10 x 1 Slotted Round Head Wood Screw, Brass');
  t.deepEqual(designator, {
    material: 'brass',
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    inchDiameter: 10,
    feetLength: 1,
  });
});

test('Wood Screw with Finish', (t) => {
  const designator = decode(
    '#10 x 1 Slotted Round Head Wood Screw, Zinc Plated'
  );
  t.deepEqual(designator, {
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    inchDiameter: 10,
    feetLength: 1,
    protectiveFinish: 'zinc plated',
  });
});

test('Wood Screw with Material and Finish', (t) => {
  const designator = decode(
    '#10 x 1 Slotted Round Head Wood Screw, Brass Zinc Plated'
  );
  t.deepEqual(designator, {
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    inchDiameter: 10,
    feetLength: 1,
    material: 'brass',
    protectiveFinish: 'zinc plated',
  });
});

test('Metric Wood Screw', (t) => {
  const designator = decode('M10 x 1 Slotted Round Head Wood Screw');
  t.deepEqual(designator, {
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    mmDiameter: 10,
    mmLength: 1,
  });
});

test('Metric Wood Screw with Unit', (t) => {
  const designator = decode('M10 x 1 mm Slotted Round Head Wood Screw');
  t.deepEqual(designator, {
    fastenerName: 'wood screw',
    headType: 'round head',
    driveStyle: 'slotted',
    mmDiameter: 10,
    mmLength: 1,
  });
});
