([[ -d manifold ]] || git clone https://github.com/pentacular/manifold &&
  cd manifold &&
  git checkout jot
  mkdir -p native &&
  cd native &&
  rm -f ../CMakeCache.txt &&
  cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${PWD}/../../native &&
  make &&
  make install)
