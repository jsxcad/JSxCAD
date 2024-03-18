(rm -rf gmp-6.2.1 &&
 # . emsdk/emsdk_env.sh &&
 # wget https://gmplib.org/download/gmp/gmp-6.2.1.tar.lz &&
 wget https://ftp.gnu.org/gnu/gmp/gmp-6.2.1.tar.gz &&
 tar xzf gmp-6.2.1.tar.gz &&
 cd gmp-6.2.1 &&
 # emconfigure ./configure --disable-assembly --host none --enable-cxx --prefix=${HOME}/opt &&
 ./configure --disable-assembly --host none --enable-cxx --prefix=${HOME}/opt &&
 make &&
 make install &&
 cd ..)
