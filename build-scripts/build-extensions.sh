#!/bin/bash

mkdir -p dist/extensions

for js in `ls src/extensions/*.js`; do
    file=`basename $js`
    file="${file%.*}"
    ./node_modules/.bin/uglifyjs -nc -o dist/extensions/${file}.min.js ${js}
done