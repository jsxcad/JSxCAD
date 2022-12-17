. emsdk/emsdk_env.sh

clang-format --style=google -i cgal.cc

# Compile with threads: Note this is unstable for now.
# emcc -s EXPORT_NAME=cgal -pthread -s PTHREAD_POOL_SIZE=128 -Wunused -Wunused-function -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB -DCGAL_HAS_THREADS cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs

# Without threads.
# emcc -Wunused -Wunused-function -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs

# emcc -Wunused -Wunused-function -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs

# No assertions
# emcc -Wunused -Wunused-function -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs

# No assertions + manifold
emcc -Wunused -Wunused-function -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt_node/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs
