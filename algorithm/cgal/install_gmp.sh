(rm -rf gmp-6.2.1 &&
 # . emsdk/emsdk_env.sh &&
 mkdir -p wasm &&
 mkdir -p native &&
 wget https://ftp.gnu.org/gnu/gmp/gmp-6.2.1.tar.xz &&
 tar xf gmp-6.2.1.tar.xz &&
 cd gmp-6.2.1 &&
 # emconfigure ./configure --disable-assembly --host none --enable-cxx --prefix=${PWD}/../wasm &&
 ./configure --disable-assembly --host none --enable-cxx --prefix=${PWD}/../native &&
 make CFLAGS="-fPIC -O3 -pedantic" &&
 make install &&
 cd ..)
