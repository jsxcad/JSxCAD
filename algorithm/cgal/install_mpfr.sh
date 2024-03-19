(# . emsdk/emsdk_env.sh &&
 mkdir -p wasm &&
 mkdir -p native &&
 wget https://ftp.gnu.org/gnu/mpfr/mpfr-4.2.1.tar.xz &&
 tar xf mpfr-4.2.1.tar.xz &&
 cd mpfr-4.2.1 &&
 # emconfigure ./configure --host none --prefix=${PWD}/../wasm --with-gmp=${PWD}/../wasm &&
 ./configure --host none --prefix=${PWD}/../native --with-gmp=${PWD}/../native &&
 make CFLAGS="-Wall -Wmissing-prototypes -Wpointer-arith -g -O3 -ffloat-store -fPIC" &&
 make install &&
 cd ..)
