[[ -d glm ]] || (
  git clone https://github.com/g-truc/glm &&
  cd glm &&
  cmake -DGLM_BUILD_TESTS=OFF -DBUILD_SHARED_LIBS=OFF -B build . &&
  cmake --build build -- all
)
