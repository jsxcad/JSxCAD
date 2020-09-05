function main() {
  return extractAndInspect();
}

function extractAndInspect() {
  return myExtractTag(completeModel(), 'Plate');
}

function completeModel() {
  return myAssemble([template(), allMotors()]);
}

function allMotors() {
  const motor1 = myRotate(myTranslate(motor(), 0, 72, 10), 0, 0, 90);
  const motor4 = myTranslate(motorWithShaft(), 0, 72, 10);
  const motor2 = myRotate(motor4, 0, 0, 180);
  const motor3 = myRotate(motor4, 0, 0, 270);

  return myAssemble([motor1, motor2, motor3, motor4]);
}

function motorWithShaft() {
  return myAssemble([motor(), eightmmShaft()]);
}

function motor() {
  const block = myTranslate(myExtrude(myRectangle(58.1, 40.1), 27), 8.85, 0, 2);
  const barrel = myColor(
    myTranslate(
      myRotate(myExtrude(myCircle(37.8), 75), 0, 90, 0),
      37.9,
      0,
      18.5
    ),
    'silver'
  );
  const shaft = myTranslate(myExtrude(myCircle(8), 17.5), 0, 0, -17.5);
  const lowerBump = myTranslate(myExtrude(myCircle(21), 4), 0, 0, -2);
  const upperBump = myTranslate(myExtrude(myCircle(21), 2), 0, 0, 29);
  const bumps = myAssemble([lowerBump, upperBump]);
  const boltHole = myDifference(myCircle(8), myCircle(4));
  const lowerBoltHoles = myExtrude(
    myAssemble([
      myTranslate(boltHole, -11.5, 14, 0),
      myTranslate(boltHole, -11.5, -14, 0),
      myTranslate(boltHole, 28.85, 14, 0),
      myTranslate(boltHole, 28.85, -14, 0),
    ]),
    2
  );
  const upperBoltHoles = myTranslate(
    myExtrude(
      myAssemble([
        myTranslate(boltHole, -11.5, 14, 0),
        myTranslate(boltHole, -11.5, -14, 0),
        myTranslate(boltHole, 28.85, 14, 0),
        myTranslate(boltHole, 28.85, -14, 0),
      ]),
      2
    ),
    0,
    0,
    29
  );
  const boltHoles = myAssemble([lowerBoltHoles, upperBoltHoles]);
  const motor = myBOMTag(
    myAssemble([boltHoles, block, barrel, bumps, shaft]),
    '{"BOMitemName":"ET-WGM58AE","numberNeeded":1,"costUSD":11,"source":"http://www.etonm.com/","totalNeeded":0}'
  );

  const bolt1 = myTranslate(myRotate(bolt(), 0, 180, 0), 28.5, 14, -10);
  const bolt2 = myTranslate(bolt1, 0, -28, 0);
  const bolt3 = myTranslate(bolt1, -40, 0, 0);
  const bolt4 = myTranslate(bolt3, 0, -28, 0);
  const bolts = myAssemble([bolt1, bolt3, bolt4, bolt2, motor]);

  return bolts;
}

function eightmmShaft() {
  const shaft = myBOMTag(
    myColor(myExtrude(myCircle(8), 85), 'silver'),
    '{"BOMitemName":"8mm Shaft","numberNeeded":1,"costUSD":10.23,"source":"https://www.mcmaster.com/1265k64","totalNeeded":0}'
  );

  const couplerBlank = myExtrude(myDifference(myCircle(19), myCircle(8)), 25);
  const cupler = myBOMTag(
    myColor(couplerBlank, 'powder blue'),
    '{"BOMitemName":"8mm Shaft Coupler","numberNeeded":1,"costUSD":2.7,"source":"https://www.amazon.com/WEIJ-Coupling-Diameter-Aluminum-Connector/dp/B07MBGP5BP","totalNeeded":0}'
  );

  const together = myAssemble([
    myTranslate(shaft, 0, 0, -100),
    myTranslate(cupler, 0, 0, -30),
  ]);
  return together;
}

function cutAways() {
  const shape1 = myTranslate(myCircle(60), 60 / 2, 60 / 2, 0);
  const shape2 = myTranslate(myRectangle(10, 10), 300, 5, 0);
  const shape3 = myTranslate(myRectangle(10, 10), 5, 300, 0);

  const oneWing = shrinkWrap([shape1, shape2, shape3]);
  const wing1 = myRotate(myTranslate(oneWing, 40, 40, 0), 0, 0, 90);
  const wing2 = myRotate(myTranslate(oneWing, 40, 40, 0), 0, 0, 180);
  const wing3 = myRotate(myTranslate(oneWing, 40, 40, 0), 0, 0, 270);
  const centerCircle = myCircle(69.5);
  const slice = myRotate(myTranslate(myRectangle(500, 4), 250, 0, 0), 0, 0, 45);

  return myAssemble([wing1, wing2, wing3, centerCircle, slice]);
}

function blank() {
  return myTag(myExtrude(myDifference(myCircle(285), cutAways()), 10), 'Plate');
}

function template() {
  return myAssemble([blank(), fullLatch()]);
}

function bolt() {
  const shaft = myTranslate(myExtrude(myCircle(4), 20), 0, 0, -20);
  const head = myExtrude(myCircle(7.6), 2.2);
  return myColor(myAssemble([shaft, head]), 'black');
}

function bolts() {
  const bolt1 = myTranslate(bolt(), -22, -3.968, 2);
  const bolt2 = myTranslate(bolt(), -22, 3.968, 2);
  const bolt3 = myTranslate(bolt(), 22, 7.14, 2);
  const bolt4 = myTranslate(bolt(), 22, -7.14, 2);
  return myAssemble([bolt1, bolt2, bolt4, bolt3]);
}

function latchBlock() {
  const block = myColor(myExtrude(myRectangle(69.85, 30.16), 11.11), 'silver');
  const withBOM = myBOMTag(
    block,
    '{"BOMitemName":"Tight Hold Latch","numberNeeded":1,"costUSD":3.81,"source":"https://www.mcmaster.com/1794A41","totalNeeded":1}'
  );
  return withBOM;
}

function fullLatch() {
  return myTranslate(
    myRotate(myAssemble([bolts(), latchBlock()]), 0, 0, -45),
    80,
    80,
    10
  );
}

function myCircle(diameter) {
  const circumference = 3.14 * diameter;
  const numberOfSegments = Math.min(
    Math.max(parseInt(circumference / 4.6), 5),
    100
  );

  return Circle.ofDiameter(diameter, { sides: numberOfSegments });
}

function myRectangle(x, y) {
  return Square(x, y);
}

function myTranslate(inputShape, x, y, z) {
  return inputShape.move(x, y, z);
}

function myExtrude(shape, distance) {
  return shape.extrude(distance);
}

function shrinkWrap(values) {
  return Hull(...values);
}

function myRotate(shape, x, y, z) {
  return shape.rotateX(x).rotateY(y).rotateZ(z);
}

function myAssemble(shapes) {
  return Assembly(...shapes);
}

function myDifference(shape1, shape2) {
  return shape1.cut(shape2).kept();
}

function myTag(shape, tag) {
  return shape.as(tag);
}

function myExtractTag(shape, tag) {
  return Shape.fromGeometry(shape.keep(tag).toKeptGeometry());
}

function myColor(shape, tag) {
  return shape.color(tag);
}

function myBOMTag(shape, tag) {
  return shape.item(tag);
}

console.log(`QQ/begin`);
const mount = main();
console.log(`QQ/end`);

mount.cloud().view().writeShape('mount');
mount.item().Page().view().writeStl('mount');
