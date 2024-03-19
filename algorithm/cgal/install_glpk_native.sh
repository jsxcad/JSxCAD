(rm -rf glpk-5.0 &&
 mkdir -p native &&
 wget -nc http://ftp.gnu.org/gnu/glpk/glpk-5.0.tar.gz &&
 tar xzvf glpk-5.0.tar.gz &&
 cd glpk-5.0 &&
 ./configure --disable-assembly --host none --enable-cxx --prefix=${PWD}/../native;
 make CFLAGS="-fPIC -O2" &&
 make install &&
 cd ..)
