#!/bin/bash

. emsdk/emsdk_env.sh

clang-format --style=google -i cgal.cc

emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O2 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs
