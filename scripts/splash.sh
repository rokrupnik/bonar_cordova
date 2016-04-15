#!/bin/bash
cd "$(dirname "$0")/.."
image="https://imgs.xkcd.com/comics/trimester.png"

wget --quiet $image -O splash.png
convert src/img/loading.png splash.png -gravity Center -append www/img/splash.png
rm splash.png

