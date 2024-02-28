. emsdk/emsdk_env.sh

clang-format --style=google -i *.h *.cc

# glpk -sSTACK_SIZE=10485760 -O3
emcc -O3 -sSTACK_SIZE=10485760 -fwasm-exceptions -fexceptions -o cgal_browser.js -DCGAL_USE_GLPK -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB emscripten.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib -L occt/ -I ~/github/OCCT/b1/include/opencascade -static -flto -DIGNORE_NO_ATOMICS=1 -DOCCT_NO_PLUGINS -frtti -std=c++1z --bind -lglpk -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs
