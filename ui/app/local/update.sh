# Update the modules.

cp ../dist/webworker.js .
cp ../dist/style.css style.css
(cd ../../../; . ./publish-es6.sh; . ./publish-wasm.sh)
rm -f ./jsxcad-*.js
cp ../../../es6/jsxcad-*.js .
cp ../../../es6/cgal_browser.wasm .
