#pragma once

#include <CGAL/Bounded_kernel.h>
#include <CGAL/Cartesian.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Exact_rational.h>
#include <CGAL/Simple_cartesian.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel Epeck_kernel;
typedef CGAL::Exact_predicates_inexact_constructions_kernel Epick_kernel;
typedef CGAL::Cartesian<CGAL::Exact_rational> Exact_rational_kernel;
typedef Epeck_kernel Kernel;
typedef Kernel::FT FT;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef Kernel::Segment_3 Segment;
