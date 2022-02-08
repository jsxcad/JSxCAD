import { deserializeSurfaceMesh } from './deserializeSurfaceMesh.js';
import { generateUpperEnvelopeForSurfaceMesh } from './generateUpperEnvelopeForSurfaceMesh.js';
import { identity } from './transform.js';
import { initCgal } from './getCgal.js';
import { serializeSurfaceMesh } from './serializeSurfaceMesh.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('triangle', (t) => {
  const surfaceMesh = deserializeSurfaceMesh(
    `3
-1/2 1/2 1/2
-1/2 -1/2 1/2
1/2 -1/2 1/2

1
3 2 0 1
`
  );
  const envelope = generateUpperEnvelopeForSurfaceMesh(surfaceMesh, identity());
  const data = serializeSurfaceMesh(envelope);
  t.deepEqual(
    data,
    `3
-1/2 -1/2 1/2
1/2 -1/2 1/2
-1/2 1/2 1/2

1
3 2 0 1
`
  );
});
