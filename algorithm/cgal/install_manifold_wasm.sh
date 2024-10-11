([[ -d manifold ]] || git clone https://github.com/pentacular/manifold &&
  . emsdk_env.sh &&
  cd manifold &&
  # git checkout jot
  mkdir -p wasm &&
  cd wasm &&
  rm -f ../CMakeCache.txt &&
  emcmake cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${PWD}/../../wasm &&
  make &&
  make install)
