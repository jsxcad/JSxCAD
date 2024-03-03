// FIX
static int Deform(Geometry* geometry, size_t length, size_t iterations,
                  double tolerance, double alpha) {
  typedef CGAL::Cartesian_converter<Cartesian_kernel, Kernel> converter;
  typedef CGAL::Surface_mesh_deformation<Cartesian_surface_mesh, CGAL::Default,
                                         CGAL::Default, CGAL::SRE_ARAP>
      Surface_mesh_deformation;

  converter from_cartesian;

  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  geometry->computeBounds();

  for (size_t target = 0; target < length; target++) {
    Surface_mesh& working_input = geometry->mesh(target);

    // Corefine the target with the selections.
    // This will allow deformations to occur along clear boundaries.
    for (size_t nth = length; nth < size; nth++) {
      Surface_mesh& working_selection = geometry->mesh(nth);
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      {
        Surface_mesh working_selection_copy(working_selection);
        // Corefine with the local frame position of the selection.
        CGAL::Polygon_mesh_processing::transform(
            geometry->transform(nth).inverse(), working_selection_copy,
            CGAL::parameters::all_default());
        CGAL::Polygon_mesh_processing::corefine(
            working_input, working_selection_copy,
            CGAL::parameters::all_default(), CGAL::parameters::all_default());
      }
    }

    Cartesian_surface_mesh cartesian_mesh;
    copy_face_graph(working_input, cartesian_mesh);

    // FIX: Need a pass to remove zero length edges.

    Surface_mesh_deformation deformation(cartesian_mesh);
    deformation.set_sre_arap_alpha(alpha);

    // All vertices are in the region of interest.
    for (Vertex_index vertex : vertices(cartesian_mesh)) {
      deformation.insert_roi_vertex(vertex);
    }

    for (size_t nth = length; nth < size; nth++) {
      Surface_mesh working_selection(geometry->mesh(nth));
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      // Select with the local frame position of the selection.
      CGAL::Polygon_mesh_processing::transform(
          geometry->transform(nth).inverse(), working_selection,
          CGAL::parameters::all_default());
      CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(
          working_selection);
      // Deform with the local-to-absolute transform of the selection.
      const Transformation& deform_transform = geometry->transform(nth);
      Cartesian_kernel::Aff_transformation_3 cartesian_deform_transform(
          CGAL::to_double(deform_transform.m(0, 0)),
          CGAL::to_double(deform_transform.m(0, 1)),
          CGAL::to_double(deform_transform.m(0, 2)),
          CGAL::to_double(deform_transform.m(0, 3)),
          CGAL::to_double(deform_transform.m(1, 0)),
          CGAL::to_double(deform_transform.m(1, 1)),
          CGAL::to_double(deform_transform.m(1, 2)),
          CGAL::to_double(deform_transform.m(1, 3)),
          CGAL::to_double(deform_transform.m(2, 0)),
          CGAL::to_double(deform_transform.m(2, 1)),
          CGAL::to_double(deform_transform.m(2, 2)),
          CGAL::to_double(deform_transform.m(2, 3)),
          CGAL::to_double(deform_transform.m(3, 3)));
      for (const Vertex_index vertex : vertices(cartesian_mesh)) {
        const auto& p = cartesian_mesh.point(vertex);
        if (inside(from_cartesian(p)) != CGAL::ON_UNBOUNDED_SIDE) {
          deformation.insert_control_vertex(vertex);
          deformation.set_target_position(
              vertex, p.transform(cartesian_deform_transform));
        }
      }
    }

    if (!deformation.preprocess()) {
      std::cout << "Deformation preprocessing failed" << std::endl;
      return STATUS_INVALID_INPUT;
    }

    deformation.deform(iterations, tolerance);
    geometry->mesh(target).clear();
    copy_face_graph(cartesian_mesh, geometry->mesh(target));
  }

  geometry->transformToLocalFrame();
  return STATUS_OK;
}
