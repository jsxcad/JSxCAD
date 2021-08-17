# Update the modules.

(cd ..; npx rollup -c rollup.testMaster.js; npx rollup -c rollup.testWorker.js)

cp ../dist/testMaster.js .
cp ../dist/testWorker.js .
(cd ../../../; . ./publish-es6.sh; . ./publish-wasm.sh)
rm -f ./jsxcad-*.js
cp ../../../es6/jsxcad-*.js .
cp ../../../es6/cgal_browser.wasm .

npx asdf
