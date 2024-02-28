. emsdk/emsdk_env.sh

clang-format --style=google -i cgal.cc

# No assertions + manifold + glpk -sSTACK_SIZE=10485760
emcc -Wunused -Wunused-function -DCGAL_USE_GLPK -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB emscripten.cc -I . -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt_node/lib -static -O3 -std=c++1z --bind -o cgal_node.js -lglpk -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -s STACK_SIZE=10485760 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_node.js cgal_node.cjs
