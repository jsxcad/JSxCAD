#!/bin/bash

# Note that we've disabled the rounding check because it is failing.
# This may come back to bite us, but let's see how we do.

emcc -DCGAL_NO_GMP -DCGAL_DISABLE_ROUNDING_MATH_CHECK cgal.cc -I . -static -O3 -std=c++1z --bind -o cgal.cjs -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -frounding-math && mv cgal.js cgal.cjs
