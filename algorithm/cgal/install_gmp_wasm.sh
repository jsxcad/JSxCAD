(wget -nc https://ftp.gnu.org/gnu/gmp/gmp-6.2.1.tar.xz &&
 mkdir -p wasm &&
 rm -rf gmp-6.2.1 &&
 tar xf gmp-6.2.1.tar.xz &&
 . emsdk_env.sh &&
 cd gmp-6.2.1 &&
 emconfigure ./configure --disable-assembly --host none --enable-cxx --prefix=${PWD}/../wasm &&
 make &&
 make install &&
 cd ..)
