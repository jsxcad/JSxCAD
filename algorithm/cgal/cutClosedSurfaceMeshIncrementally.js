// import * as fs from 'fs';
// import { serializeSurfaceMesh } from './serializeSurfaceMesh.js';

import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { endTime, logInfo, startTime } from '@jsxcad/sys';

import { ErrorZeroThickness } from './error.js';
import { describeSurfaceMesh } from './describeSurfaceMesh.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

let cycle = 0;

export const cutClosedSurfaceMeshIncrementally = (
  mesh,
  transform,
  check,
  cuts
) => {
  console.log(`memory size: ${(getCgal().HEAP8.length / 1000000).toFixed(2)}M`);
  console.log(
    `Mesh: ${JSON.stringify(describeSurfaceMesh(mesh))} matrix ${JSON.stringify(
      transform
    )}`
  );
  cuts.forEach(({ mesh, matrix }, index) => {
    console.log(
      `Cut ${index}: ${JSON.stringify(
        describeSurfaceMesh(mesh)
      )} matrix ${JSON.stringify(matrix)}`
    );
  });
  /*
  if (JSON.stringify(describeSurfaceMesh(mesh)), '{"vertices":636,"faces":1272}') {
    console.log(`Dumping cut`);
    fs.writeFileSync('/tmp/mesh.txt', serializeSurfaceMesh(mesh));
    fs.writeFileSync('/tmp/cut1.txt', serializeSurfaceMesh(cuts[0].mesh));
  }
*/
  const timer = startTime('algorithm/cgal/cutClosedSurfaceMeshIncrementally');
  let result;
  const status = getCgal().CutClosedSurfaceMeshIncrementally(
    mesh,
    toCgalTransformFromJsTransform(transform),
    cuts.length,
    check,
    (nth) => cuts[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(cuts[nth].matrix),
    (output) => {
      result = output;
    }
  );
  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by cut');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  const { average, last, sum } = endTime(timer);
  logInfo(
    'algorithm/cgal/cutClosedSurfaceMeshIncrementally',
    `${cuts.length} cuts, ${last} (${sum}) [${average}]`
  );
  if (last > 100) {
    console.log(`mesh ${cycle} transform ${JSON.stringify(transform)}`);
    cuts.forEach(({ mesh, matrix }, index) => {
      console.log(`cut ${cycle} ${index} matrix ${JSON.stringify(matrix)}`);
    });
    cycle += 1;
  }
  return result;
};
