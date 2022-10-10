(./update.sh &&
 cp -R . ../../../../jsxcad.github.io/alpha/ &&
 cp ../dist/standalone.css ../../../../jsxcad.github.io/css/ &&
 cp ../dist/style.css ../../../../jsxcad.github.io/css/ &&
 (cd ../../../../jsxcad.github.io/alpha;
  git commit -a -m "Update"; git push))
