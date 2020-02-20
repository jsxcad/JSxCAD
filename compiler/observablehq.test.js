import { readFileSync } from 'fs';
import test from 'ava';
import { toEcmascript } from './observablehq';

Error.stackTraceLimit = Infinity;

test('Simple case', t => {
  const es = '\n' + toEcmascript(
    `
      // https://observablehq.com/@pentacular/es6-module-generation-test@16
      export default function define(runtime, observer) {
        const main = runtime.module();
        main.variable(observer("times")).define("times", function(){return(
      (a, b) => a * b
      )});
        main.variable(observer("square")).define("square", ["times"], function(times){return(
      (x) => times(x, x)
      )});
        return main;
      }
    `);
  t.is(es, `
export var times = (a, b) => a * b;
export var square = x => times(x, x);
`);
});

test('Threads notebook', t => {
  const es = '\n' + toEcmascript(readFileSync('jsxcad-threads.observablehq'));
  t.is(es, `
export var toHeightFromPitch = pitch => pitch * 0.866;
export var Tooth = (pitch = 1) => {
  const height = toHeightFromPitch(pitch);
  const baseLeft = [pitch / -2, 0];
  const peak = [0, height];
  const baseRight = [pitch / 2, 0];
  const leftEdge = Line2.ofPoints([pitch / -2, 0], [pitch / -2, height]);
  const rightEdge = Line2.ofPoints([pitch / 2, 0], [pitch / 2, height]);
  const leftSlope = Line2.ofPoints(baseLeft, peak);
  const rightSlope = Line2.ofPoints(baseRight, peak);
  const topEdge = Line2.ofPoints([-pitch, height * 7 / 8], [pitch, height * 7 / 8]);
  const bottomEdge = Line2.ofPoints([-pitch, height * 2 / 8], [pitch, height * 2 / 8]);
  const baseEdge = Line2.ofPoints([-pitch, 0], [pitch, 0]);
  const profile = [Line2.meet(rightEdge, baseEdge), Line2.meet(rightEdge, bottomEdge), Line2.meet(bottomEdge, rightSlope), Line2.meet(topEdge, rightSlope), Line2.meet(topEdge, leftSlope), Line2.meet(bottomEdge, leftSlope), Line2.meet(leftEdge, bottomEdge), Line2.meet(leftEdge, baseEdge)];
  return Path(...profile).close().interior();
};
export var Thread = (diameter, length, pitch) => Loop(Tooth(pitch).moveY(diameter / 2 - toHeightFromPitch(pitch) * 2 / 8), 360 * length / pitch, {
  pitch
}).moveX(length / -2).rotateY(-90);
export var ThreadedRod = (diameter, height, pitch) => Thread(diameter, height, pitch).add(Cylinder.ofDiameter(diameter - toHeightFromPitch(pitch) * 5 / 8 * 2, height)).with(Connector('top').moveZ(height / 2), Connector('bottom').moveZ(height / -2).flip()).Item(\`\${diameter}x\${height} Threaded Rod\`);
export var Example = Cylinder.ofDiameter(6, 3).on(ThreadedRod(6, 20, examplePitch)).on(Cylinder.ofDiameter(6, 3));
`);
});
