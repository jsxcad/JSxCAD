import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const cutSurfaceMeshes = (targetMeshes, targetSegments, sources) => {
  const cutMeshes = [];
  const cutSegments = [];
  let nthSegments;
  const status = getCgal().CutSurfaceMeshes(
    targetMeshes.length,
    (nth) => targetMeshes[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(targetMeshes[nth].matrix),
    targetSegments.length,
    (nth, segmentProcessor) => {
      nthSegments = nth;
      const { segments, tags } = targetSegments[nth];
      cutSegments[nth] = { tags, segments: [] };
      for (const [source, target] of segments) {
        const [sourceX, sourceY, sourceZ] = source;
        const [targetX, targetY, targetZ] = target;
        segmentProcessor.cut(
          sourceX,
          sourceY,
          sourceZ,
          targetX,
          targetY,
          targetZ
        );
      }
    },
    sources.length,
    (nth) => sources[nth].mesh,
    (nth) => toCgalTransformFromJsTransform(sources[nth].matrix),
    (nth, mesh) => {
      const { matrix, tags } = targetMeshes[nth];
      cutMeshes[nth] = { matrix, mesh, tags };
    },
    (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) => {
      const source = [sourceX, sourceY, sourceZ];
      const target = [targetX, targetY, targetZ];
      cutSegments[nthSegments].segments.push([source, target]);
    }
  );

  if (status === STATUS_ZERO_THICKNESS) {
    throw new ErrorZeroThickness('Zero thickness produced by join');
  }
  if (status !== STATUS_OK) {
    throw new Error(`Unexpected status ${status}`);
  }
  return { cutMeshes, cutSegments };
};
