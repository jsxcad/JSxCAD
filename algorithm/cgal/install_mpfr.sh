(# . emsdk/emsdk_env.sh &&
 wget https://www.mpfr.org/mpfr-current/mpfr-4.1.0.tar.xz &&
 wget https://www.mpfr.org/mpfr-current/allpatches &&
 tar xf mpfr-4.1.0.tar.xz &&
 cd mpfr-4.1.0 &&
 patch -N -Z -p1 < ../allpatches  &&
 # emconfigure ./configure --host none --prefix=${HOME}/opt --with-gmp=${HOME}/opt &&
 ./configure --host none --prefix=${HOME}/opt --with-gmp=${HOME}/opt &&
 make &&
 make install &&
 cd ..)
