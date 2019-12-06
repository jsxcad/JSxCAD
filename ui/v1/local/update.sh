# Update the modules.

(cd ../../../; npm run build:es6; . ./publish-es6.sh)
rm ./jsxcad-*.js
cp ../../../es6/jsxcad-*.js .
