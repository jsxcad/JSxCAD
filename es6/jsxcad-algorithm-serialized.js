const eachApproximateTriangleOfSerializedMesh = (serializedSurfaceMesh, emit) => {
      const tokens = serializedSurfaceMesh
        .split(/\s+/g)
        .map((token) => parseInt(token));
      let p = 0;
      let vertexCount = tokens[p++];
      const vertices = [];
      while (vertexCount-- > 0) {
        // The first three are precise values that we don't use.
        p += 3;
        // These three are approximate values in 100th of mm that we will use.
        vertices.push([
          tokens[p++] / 100,
          tokens[p++] / 100,
          tokens[p++] / 100,
        ]);
      }
      let faceCount = tokens[p++];
      while (faceCount-- > 0) {
        let vertexCount = tokens[p++];
        if (vertexCount !== 3) {
          throw Error(
            `Faces must be triangles: vertexCount=${vertexCount} p=${p} ps=${tokens.slice(p, p + 10).join(' ')} serial=${serializedSurfaceMesh}`
          );
        }
        const triangle = [];
        while (vertexCount-- > 0) {
          const vertex = vertices[tokens[p++]];
          if (!vertex.every(isFinite)) {
            throw Error(`Non-finite vertex: ${vertex}`);
          }
          triangle.push(vertex);
        }
        emit(triangle);
      }
};

export { eachApproximateTriangleOfSerializedMesh };
