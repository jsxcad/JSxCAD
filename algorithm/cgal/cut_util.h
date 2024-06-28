#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/clip.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>

#include "manifold_util.h"

bool cut_mesh_by_mesh(Surface_mesh& a, Surface_mesh& b) {
#ifdef JOT_MANIFOLD_ENABLED
  manifold::Manifold target_manifold;
  buildManifoldFromSurfaceMesh(a, target_manifold);
  manifold::Manifold nth_manifold;
  buildManifoldFromSurfaceMesh(b, nth_manifold);
  target_manifold -= nth_manifold;
  a.clear();
  buildSurfaceMeshFromManifold(target_manifold, a);
#else
  Surface_mesh cutMeshCopy(b);
  if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
          a, cutMeshCopy, a),
      CGAL::parameters::all_default(), CGAL::parameters::all_default(),
      CGAL::parameters::all_default())) {
    return false;
  }
#endif
  demesh(a);
  return true;
};
