(rm -rf cgal &&
 git clone https://github.com/CGAL/cgal &&
 CGAL_HOME=${PWD}/cgal &&
 cd cgal &&
 mkdir build &&
 cd build &&
 rm -f ../CMakeCache.txt &&
 cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${CGAL_HOME} &&
 make &&
 make install &&
 cd ../.. &&
 ln -s cgal/include/CGAL CGAL)

