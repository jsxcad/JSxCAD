#pragma once

#include <CGAL/Random.h>

static void MakeDeterministic() {
  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);
}
