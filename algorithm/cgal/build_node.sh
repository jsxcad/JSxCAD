. emsdk/emsdk_env.sh

clang-format --style=google -i cgal.cc

emcc -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs
