# Update the modules.

cp ../dist/webworker.js .
(cd ../../../; . ./publish-es6.sh)
rm ./jsxcad-*.js
cp ../../../es6/jsxcad-*.js .
