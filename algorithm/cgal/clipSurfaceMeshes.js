import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';
import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const clipSurfaceMeshes = (targetMeshes, targetSegments, sources) => {
  try {
    const clippedMeshes = [];
    const clippedSegments = [];
    let nthSegments;
    const status = getCgal().ClipSurfaceMeshes(
      targetMeshes.length,
      (nth) => targetMeshes[nth].mesh,
      (nth) => toCgalTransformFromJsTransform(targetMeshes[nth].matrix),
      targetSegments.length,
      (nth, segmentProcessor) => {
        nthSegments = nth;
        const { segments, tags } = targetSegments[nth];
        clippedSegments[nth] = { tags, segments: [] };
        for (const [source, target] of segments) {
          const [sourceX, sourceY, sourceZ] = source;
          const [targetX, targetY, targetZ] = target;
          segmentProcessor.clip(
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
        mesh.provenance = 'clip';
        const { matrix, tags } = targetMeshes[nth];
        clippedMeshes[nth] = { matrix, mesh, tags };
      },
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) => {
        const source = [sourceX, sourceY, sourceZ];
        const target = [targetX, targetY, targetZ];
        clippedSegments[nthSegments].segments.push([source, target]);
      }
    );
    if (status === STATUS_ZERO_THICKNESS) {
      throw new ErrorZeroThickness('Zero thickness produced by clip');
    }
    if (status !== STATUS_OK) {
      throw new Error(`Unexpected status ${status}`);
    }
    return { clippedMeshes, clippedSegments };
  } catch (error) {
    throw Error(error);
  }
};
