### cc test.cc -static -I include/opencascade -L lin64/gcc/lib -lTKTopAlgo -lTKBRep -lTKGeomAlgo -lTKGeomBase -lTKG3d -lTKG2d -lTKernel -lTKMath -lstdc++ -lm -lpthread -O3

# emcc test.cc -static -I include/opencascade -L lin64/gcc/lib -lTKTopAlgo -lTKBRep -lTKGeomAlgo -lTKGeomBase -lTKG3d -lTKG2d -lTKernel -lTKMath -lm -lpthread -O3 -std=c++1z

# ./lin32/clang/lib/libTKSTEP209.a


# Works
# emcc module.cc json11.cc -static -I include/opencascade -L lin32/clang/lib -lTKTopAlgo -lTKBRep -lTKGeomAlgo -lTKGeomBase -lTKG3d -lTKG2d -lTKernel -lTKMath -lm -lpthread -O3 -std=c++1z --bind

emcc module.cc json11.cc -static -I include/opencascade -L lin32/clang/lib -lTKTopAlgo -lTKOffset -lTKBool -lTKBRep -lTKGeomAlgo -lTKGeomBase -lTKG3d -lTKG2d -lTKernel -lTKMath -lm -lpthread -O3 -std=c++1z --bind -o occt.mjs -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0
