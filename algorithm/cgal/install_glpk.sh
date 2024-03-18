(rm -rf glpk-5.0 &&
 . emsdk/emsdk_env.sh &&
 wget http://ftp.gnu.org/gnu/glpk/glpk-5.0.tar.gz &&
 tar xzvf glpk-5.0.tar.gz &&
 cd glpk-5.0 &&
 emconfigure ./configure --disable-assembly --host none --enable-cxx --prefix=${HOME}/opt &&
 make &&
 make install &&
 cd ..)
