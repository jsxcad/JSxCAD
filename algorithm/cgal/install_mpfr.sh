(# . emsdk/emsdk_env.sh &&
 wget https://ftp.gnu.org/gnu/mpfr/mpfr-4.2.1.tar.xz &&
 tar xf mpfr-4.2.1.tar.xz &&
 cd mpfr-4.2.1 &&
 # emconfigure ./configure --host none --prefix=${HOME}/opt --with-gmp=${HOME}/opt &&
 mkdir -p ${HOME}/opt &&
 ./configure --host none --prefix=${HOME}/opt --with-gmp=${HOME}/opt &&
 make &&
 make install &&
 cd ..)
