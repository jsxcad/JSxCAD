. emsdk/emsdk_env.sh

clang-format --style=google -i cgal.cc

# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s INITIAL_MEMORY=64MB -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# fast
# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O2 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# opt
# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# no assertions
# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I . -I ~/opt/include -L ~/opt/lib -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# manifold
# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib                                                             -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite                                                                                                                                                               -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# occt
#  emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib -L occt/ -I ~/github/OCCT/b1/include/opencascade -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -lTKTopAlgo -lTKBO -lTKBRep -lTKRWMesh -lTKMesh -lTKShHealing -lTKPrim -lTKXCAF -lTKLCAF -lTKCAF -lTKG3d -lTKG2d -lTKMath -lTKGeomBase -lTKGeomAlgo -lTKernel -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib -L occt/ -I ~/github/OCCT/b1/include/opencascade -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -lTKTopAlgo -lTKBO -lTKBRep -lTKRWMesh -lTKMesh -lTKShHealing -lTKPrim -lTKXCAF -lTKLCAF -lTKCAF -lTKG3d -lTKG2d -lTKMath -lTKGeomBase -lTKGeomAlgo -lTKernel -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# no wasm-exceptions
# emcc -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt_node/lib -L occt_node/ -I ~/github/OCCT/b1/include/opencascade -static -g -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -lTKTopAlgo -lTKBO -lTKBRep -lTKRWMesh -lTKMesh -lTKShHealing -lTKPrim -lTKXCAF -lTKLCAF -lTKCAF -lTKG3d -lTKG2d -lTKMath -lTKGeomBase -lTKGeomAlgo -lTKernel -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -s DISABLE_EXCEPTION_CATCHING=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# -g
# emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib -L occt/ -I ~/github/OCCT/b1/include/opencascade -static -g -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -lTKTopAlgo -lTKBO -lTKBRep -lTKRWMesh -lTKMesh -lTKShHealing -lTKPrim -lTKXCAF -lTKLCAF -lTKCAF -lTKG3d -lTKG2d -lTKMath -lTKGeomBase -lTKGeomAlgo -lTKernel -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs

# -O3
emcc -fwasm-exceptions -o cgal_browser.js -DCGAL_ALWAYS_ROUND_TO_NEAREST -DCGAL_WITH_GMPXX -DCGAL_USE_GMPXX=1 -DCGAL_DO_NOT_USE_BOOST_MP -DBOOST_ALL_NO_LIB cgal.cc -I .  -I ./glm -I ~/opt/include -I ~/opt/include/manifold -L ~/opt/lib -L occt/ -I ~/github/OCCT/b1/include/opencascade -static -O3 -std=c++1z --bind -lgmpxx -lmpfr -lgmp -lmanifold -lcollider -lpolygon -lutilities -lgraphlite -lTKTopAlgo -lTKBO -lTKBRep -lTKRWMesh -lTKMesh -lTKShHealing -lTKPrim -lTKXCAF -lTKLCAF -lTKCAF -lTKG3d -lTKG2d -lTKMath -lTKGeomBase -lTKGeomAlgo -lTKernel -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s USE_BOOST_HEADERS=1 -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=0 -ferror-limit=10000 && mv cgal_browser.js cgal_browser.cjs
