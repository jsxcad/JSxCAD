(rm -rf cgal &&
 git clone https://github.com/pentacular/cgal &&
 CGAL_HOME=${PWD}/cgal &&
 cd cgal &&
 checkout isotropic_remesh_fix
 mkdir build &&
 cd build &&
 rm -f ../CMakeCache.txt &&
 cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${CGAL_HOME} &&
 make &&
 make install &&
 cd ../.. &&
 ln -s cgal/include/CGAL CGAL)

