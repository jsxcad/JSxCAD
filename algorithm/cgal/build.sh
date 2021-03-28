#!/bin/bash

# lazy needs interval
# emcc -DCGAL_DISABLE_ROUNDING_MATH_CHECK -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_DONT_USE_LAZY_KERNEL -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# pure exact
# emcc -DCGAL_HAS_NO_INTERVAL_SUPPORT -DCGAL_DISABLE_ROUNDING_MATH_CHECK -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_DONT_USE_LAZY_KERNEL -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -g -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_DONT_USE_LAZY_KERNEL -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -g -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_DONT_USE_LAZY_KERNEL -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_DONT_USE_LAZY_KERNEL -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP -DCGAL_NO_STATIC_FILTERS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_EIGEN3_ENABLED -DCGAL_DO_NOT_USE_BOOST_MP cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DBOOST_ALL_NO_LIB -DCGAL_USE_GMPXX=1 cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_WITH_GMPXX -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_WITH_GMPXX -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -DCGAL_CHECK_EXPENSIVE -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -g -DONLY_BUILD_TEST -DCGAL_CHECK_EXPENSIVE -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# emcc -g -DONLY_BUILD_TEST -DCGAL_CHECK_EXPENSIVE -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 && mv cgal.js cgal.cjs

# Note: static filters depend on exceptions.

# Debug
# emcc -g -DONLY_BUILD_TEST -DCGAL_CHECK_EXPENSIVE -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 && mv cgal.js cgal.cjs

# emcc -DCGAL_CHECK_EXPENSIVE -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 && mv cgal.js cgal.cjs

# emcc -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 && mv cgal.js cgal.cjs

# emcc -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -g -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=2 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -g -DTEST_ONLY -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -DTEST_ONLY -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=1 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -DTEST_ONLY -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -g -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

# emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs

emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal.cjs -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal.js cgal.cjs
