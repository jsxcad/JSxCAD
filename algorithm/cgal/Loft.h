#if 0
class Weight_min_max_dihedral_and_area {
  template<class Weight_, class IsValid>
  friend struct Weight_calculator;

  template<class Weight_>
  friend class Weight_incomplete;

public:
  // these two should not be used (used in test code)
  std::pair<double,double> w;
  Weight_min_max_dihedral_and_area(double angle, double area) : w(angle, area) { }

// below required by Weight concept
private:
  template<class Point_3, class LookupTable>
  Weight_min_max_dihedral_and_area(const std::vector<Point_3>& P,
                                   const std::vector<Point_3>& Q,
                                   int i, int j, int k,
                                   const LookupTable& lambda)
  {
    CGAL_assertion(i < j);
    CGAL_assertion(j < k);
    int n = static_cast<int>(P.size()) -1; // because the first and last point are equal

    // The CGAL::dihedral angle is measured between the oriented triangles, that is it goes from [-pi, pi]
    // What we need is the angle between the normals of the triangles between [0, pi]
    double ang_max = 0;

    // Test each edge
    int vertices[] = {i, j, k};
    for(int e = 0; e < 3; ++e)
    {
      int v0      = vertices[e];
      int v1      = vertices[(e+1)%3];
      int v_other = vertices[(e+2)%3];
      double angle = 0;
      // check whether the edge is border
      if( (v0 + 1 == v1 || (v0 == n-1 && v1 == 0) ) && !Q.empty() ) {
        angle = 180 - CGAL::abs(
           to_double(CGAL::approximate_dihedral_angle(P[v0],P[v1],P[v_other],Q[v0])) );
      }
      else {
        if(e == 2) { continue; }
        if(lambda.get(v0, v1) != -1){
          const Point_3& p01 = P[lambda.get(v0, v1)];
          angle = 180 - CGAL::abs(
            to_double(CGAL::approximate_dihedral_angle(P[v0],P[v1],P[v_other],p01)) );
        }
      }
      ang_max = (std::max)(ang_max, angle);
    }

    w = std::make_pair(ang_max, to_double(CGAL::approximate_sqrt(CGAL::squared_area(P[i],P[j],P[k]))));
  }

public:
  Weight_min_max_dihedral_and_area operator+(const Weight_min_max_dihedral_and_area& w2) const
  {
    CGAL_assertion((*this) != NOT_VALID());
    CGAL_assertion(w2 != NOT_VALID());

    return Weight_min_max_dihedral_and_area((std::max)(w.first, w2.w.first), w.second + w2.w.second);
  }

  bool operator<(const Weight_min_max_dihedral_and_area& w2) const
  {
    CGAL_assertion((*this) != NOT_VALID());
    CGAL_assertion(w2 != NOT_VALID());

    if(w.first == w2.w.first)
    { return w.second < w2.w.second; }
    return w.first < w2.w.first;
  }

  bool operator==(const Weight_min_max_dihedral_and_area& w2) const
  { return w.first == w2.w.first && w.second == w2.w.second; }

  bool operator!=(const Weight_min_max_dihedral_and_area& w2) const
  { return !(*this == w2); }

  static const Weight_min_max_dihedral_and_area DEFAULT() // rule: x + DEFAULT() == x
  { return Weight_min_max_dihedral_and_area(0,0); }
  static const Weight_min_max_dihedral_and_area NOT_VALID()
  { return Weight_min_max_dihedral_and_area(-1,-1); }

  friend std::ostream& operator<<(std::ostream& out, const Weight_min_max_dihedral_and_area& w) {
    out << "Max dihedral: " << w.w.first << ", Total area: " << w.w.second;
    return out;
  }
};
#endif

// This weight calculator refuses weights for triangles within the same lofting
// span.
template <class Weight_>
struct Loft_weight_calculator {
  typedef Weight_ Weight;
  Loft_weight_calculator(int top_start, int top_end, int bottom_start,
                         int bottom_end)
      : top_start(top_start),
        top_end(top_end),
        bottom_start(bottom_start),
        bottom_end(bottom_end) {}

  bool in_top(int i) const { return top_start <= i && i < top_end; }

  bool in_bottom(int i) const { return bottom_start <= i && i < bottom_end; }

  template <class Point_3, class LookupTable>
  Weight operator()(const std::vector<Point_3>& P,
                    const std::vector<Point_3>& Q, int i, int j, int k,
                    const LookupTable& lambda) const {
    std::cout << "LWC/1" << std::endl;
    if (CGAL::collinear(P[i], P[j], P[k])) {
      return Weight::NOT_VALID();
    }
    std::cout << "LWC/2" << std::endl;
    int top_count = in_top(i) + in_top(j) + in_top(k);
    if (top_count >= 3) {
      return Weight::NOT_VALID();
    }
    std::cout << "LWC/3" << std::endl;
    int bottom_count = in_bottom(i) + in_bottom(j) + in_bottom(k);
    if (bottom_count >= 3) {
      return Weight::NOT_VALID();
    }
    std::cout << "LWC/4" << std::endl;
    auto result = Weight(P, Q, i, j, k, lambda);
    std::cout << "LWC/5" << std::endl;
    return result;
  }

  int top_start;
  int top_end;
  int bottom_start;
  int bottom_end;
};

static void loftBetweenPolylines(Polyline& lower, Polyline& upper,
                                 Points& points, Polygons& polygons) {
  alignPolylines3(lower, upper);
  Polyline joined;
  int bottom_start = joined.size();
  joined.push_back(lower.front());
  for (size_t nth = 1; nth < lower.size(); nth++) {
    joined.push_back(lower[nth]);
  }
  joined.push_back(lower.front());
  int bottom_end = joined.size();
  // Here's where we jump across.
  int top_start = joined.size();
  joined.push_back(upper.front());
  for (size_t nth = 0; nth < upper.size(); nth++) {
    joined.push_back(upper[upper.size() - 1 - nth]);
  }
  int top_end = joined.size();
  // Here's where we jump back.
  std::size_t start = points.size();
  points.insert(points.end(), joined.begin(), joined.end());
  std::vector<Triangle_int> triangles;

  typedef CGAL::internal::Weight_min_max_dihedral_and_area Weight;
  typedef Loft_weight_calculator<Weight> WC;

  std::cout << "LT/1" << std::endl;
  CGAL::Polygon_mesh_processing::triangulate_hole_polyline(
      joined, std::back_inserter(triangles),
      CGAL::parameters::use_2d_constrained_delaunay_triangulation(false)
          .weight_calculator(WC(top_start, top_end, bottom_start, bottom_end)));
  std::cout << "LT/2" << std::endl;
  if (triangles.empty()) {
    std::cout << "QQ/triangulate_hole_polyline/non-productive" << std::endl;
  }
  for (auto& triangle : triangles) {
    std::vector<size_t> polygon{start + triangle.get<0>(),
                                start + triangle.get<1>(),
                                start + triangle.get<2>()};
    polygons.push_back(polygon);
  }
}

static void buildMeshFromPolygons(Points& points, Polygons& polygons,
                                  bool close, Surface_mesh& mesh) {
  std::cout << "bMFP/1" << std::endl;
  CGAL::Polygon_mesh_processing::repair_polygon_soup(
      points, polygons, CGAL::parameters::all_default());
  std::cout << "bMFP/2" << std::endl;
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
  std::cout << "bMFP/3" << std::endl;
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons,
                                                              mesh);
  std::cout << "bMFP/4" << std::endl;
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  // Make an attempt to close holes.
  if (close) {
    std::cout << "bMFP/5" << std::endl;
    bool failed = false;
    while (!failed && !CGAL::is_closed(mesh)) {
      for (const Surface_mesh::Halfedge_index edge : mesh.halfedges()) {
        if (mesh.is_border(edge)) {
          std::vector<Face_index> faces;
          std::cout << "bMFP/6" << std::endl;
          CGAL::Polygon_mesh_processing::triangulate_hole(
              mesh, edge, std::back_inserter(faces),
              CGAL::parameters::use_2d_constrained_delaunay_triangulation(
                  false));
          std::cout << "bMFP/7" << std::endl;
          if (faces.empty()) {
            failed = true;
          }
          break;
        }
      }
    }
  }
  std::cout << "bMFP/8" << std::endl;
  if (CGAL::is_closed(mesh)) {
    std::cout << "bMFP/9" << std::endl;
    // Make sure it isn't inside out.
    // CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(mesh);
    std::cout << "bMFP/10" << std::endl;
  }
  std::cout << "bMFP/11" << std::endl;
  if (false && CGAL::Polygon_mesh_processing::does_self_intersect(
                   mesh, CGAL::parameters::all_default())) {
    std::cout << "Loft: self-intersection detected; attempting repair."
              << std::endl;
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(mesh);
    assert(!CGAL::Polygon_mesh_processing::does_self_intersect(
        mesh, CGAL::parameters::all_default()));
  }
}

static int Loft(Geometry* geometry, bool close) {
  std::cout << "Loft/0" << std::endl;
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  Points points;
  Polygons polygons;

  Points hole_points;
  Polygons hole_polygons;

  struct Polyline_with_holes {
   public:
    Polyline_with_holes() {}
    Polyline_with_holes(const Polyline& boundary) : boundary(boundary) {}
    Polyline_with_holes(const Polyline& boundary, const Polylines& holes)
        : boundary(boundary), holes(holes) {}
    Polyline boundary;
    Polylines holes;
  };

  typedef std::vector<Polyline_with_holes> Polylines_with_holes;

  std::vector<Polylines_with_holes> layers;

  for (int nth = 0; nth < size; nth++) {
    Polylines_with_holes layer;
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Polyline polyline;
        Surface_mesh& mesh = geometry->mesh(nth);
        for (const auto start : mesh.halfedges()) {
          if (mesh.is_border(start)) {
            Halfedge_index h = start;
            do {
              Point p = mesh.point(mesh.source(h));
              if (polyline.empty() || polyline.back() != p) {
                polyline.push_back(p);
              }
              h = mesh.next(h);
            } while (h != start);
            break;
          }
        }
        if (polyline.size() == 0) {
          continue;
        }
        layer.emplace_back(polyline);
        CGAL::Polygon_mesh_processing::polygon_mesh_to_polygon_soup(
            mesh, points, polygons);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        if (geometry->pwh(nth).size() == 0) {
          continue;
        }
        Polygons_with_holes_2& pwhs = geometry->pwh(nth);
        for (Polygon_with_holes_2& pwh : pwhs) {
          Polyline_with_holes polyline_with_holes;
          PolygonToPolyline(geometry->plane(nth), pwh.outer_boundary(),
                            polyline_with_holes.boundary);
          if (polyline_with_holes.boundary.size() == 0) {
            continue;
          }
          for (auto hole = pwh.holes_begin(); hole != pwh.holes_end(); ++hole) {
            Polyline polyline;
            PolygonToPolyline(geometry->plane(nth), *hole, polyline);
            polyline_with_holes.holes.push_back(polyline);
          }
          layer.push_back(polyline_with_holes);
        }
        break;
      }
      default: {
        break;
      }
    }
    layers.push_back(layer);
  }
  if (layers.size() < 2) {
    std::cout << "Need at least two layers." << std::endl;
    return STATUS_EMPTY;
  }
  for (size_t nth = 1; nth < layers.size(); nth++) {
    Polylines_with_holes lower_layer = layers[nth - 1];
    Polylines_with_holes upper_layer = layers[nth];
    // For each island in the lower layer, find the closest island in the upper
    // layer.
    while (!lower_layer.empty() && !upper_layer.empty()) {
      Polyline_with_holes lower = lower_layer.back();
      lower_layer.pop_back();
      std::sort(
          upper_layer.begin(), upper_layer.end(),
          [&](const Polyline_with_holes& a, const Polyline_with_holes& b) {
            size_t offset;
            FT best_a = computeBestDistanceBetweenPolylines(lower.boundary,
                                                            a.boundary, offset);
            FT best_b = computeBestDistanceBetweenPolylines(lower.boundary,
                                                            b.boundary, offset);
            return best_a <= best_b;
          });
      Polyline_with_holes upper = upper_layer.back();
      upper_layer.pop_back();
      // Just loft the first polyline with its first hole for now.
      loftBetweenPolylines(lower.boundary, upper.boundary, points, polygons);
      while (!lower.holes.empty() && !upper.holes.empty()) {
        Polyline lower_hole = lower.holes.back();
        lower.holes.pop_back();
        std::sort(upper.holes.begin(), upper.holes.end(),
                  [&](const Polyline& a, const Polyline& b) {
                    size_t offset;
                    FT best_a = computeBestDistanceBetweenPolylines(lower_hole,
                                                                    a, offset);
                    FT best_b = computeBestDistanceBetweenPolylines(lower_hole,
                                                                    b, offset);
                    return best_a <= best_b;
                  });
        Polyline upper_hole = upper.holes.back();
        upper.holes.pop_back();
        loftBetweenPolylines(lower_hole, upper_hole, hole_points,
                             hole_polygons);
      }
    }
  }

  std::unique_ptr<Surface_mesh> islands(new Surface_mesh);
  std::cout << "Loft/1" << std::endl;
  buildMeshFromPolygons(points, polygons, close, *islands);
  std::cout << "Loft/2" << std::endl;

  Surface_mesh holes;
  buildMeshFromPolygons(hole_points, hole_polygons, close, holes);

  if (close) {
    std::cout << "Loft/3" << std::endl;
    if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
            *islands, holes, *islands, CGAL::parameters::all_default(),
            CGAL::parameters::all_default(), CGAL::parameters::all_default())) {
      return STATUS_ZERO_THICKNESS;
    }
    std::cout << "Loft/4" << std::endl;
  } else {
    islands->join(holes);
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  geometry->setMesh(target, islands);
  // Clean up the mesh.
  std::cout << "Loft/5" << std::endl;
  demesh(geometry->mesh(target));
  std::cout << "Loft/6" << std::endl;
  return STATUS_OK;
}
