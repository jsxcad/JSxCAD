static int MakeUnitSphere(Geometry* geometry, double angular_bound,
                          double radius_bound, double distance_bound) {
  typedef CGAL::Surface_mesh_default_triangulation_3 Tr;
  typedef CGAL::Complex_2_in_triangulation_3<Tr> C2t3;
  typedef Tr::Geom_traits GT;
  typedef GT::Sphere_3 Sphere_3;
  typedef GT::Point_3 Point_3;
  typedef GT::FT FT;
  typedef FT (*Function)(Point_3);
  typedef CGAL::Implicit_surface_3<GT, Function> Surface_3;
  typedef CGAL::Surface_mesh<Point_3> Epick_Surface_mesh;
  Tr tr;          // 3D-Delaunay triangulation
  C2t3 c2t3(tr);  // 2D-complex in 3D-Delaunay triangulation

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);

  Surface_3 surface(unitSphereFunction<FT, Point_3>, Sphere_3(CGAL::ORIGIN, 2));
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(
      angular_bound, radius_bound, distance_bound);
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setMesh(target, new Surface_mesh);
  geometry->setIdentityTransform(target);
  copy_face_graph(epick_mesh, geometry->mesh(target));
  return STATUS_OK;
}
