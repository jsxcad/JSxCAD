(wget -nc https://ftp.gnu.org/gnu/gmp/gmp-6.2.1.tar.xz &&
 mkdir -p native &&
 rm -rf gmp-6.2.1 &&
 tar xf gmp-6.2.1.tar.xz &&
 cd gmp-6.2.1 &&
 ./configure --disable-assembly --host none --enable-cxx --prefix=${PWD}/../native &&
 make CFLAGS="-fPIC -O3 -pedantic" &&
 make install &&
 cd ..)
