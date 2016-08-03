#!/bin/bash

repo="https://github.com/rokrupnik/bonar_cordova.git"
export repodir="bonar"
python_script="$repodir/scripts/minifier.py"
now=`date`

dir=`mktemp -d` && cd $dir

function exit_updater {
    logger "BONARUPDATER: $1. Exit with $2";
    exit $2
}

git clone --depth=1 $repo $repodir
if [[ $? -ne 0 ]]; then exit_updater "Cannot clone" 1; fi;

python $python_script "restaurants.json" False
if [[ $? -ne 0 ]]; then exit_updater "Cannot run python script" 1; fi;

lines=`diff $repodir/scripts/restaurants.json restaurants.json | wc -l`
if [[ $lines -eq 0 ]]; then exit_updater "Nothing new" 0; fi;

mv restaurants.json $repodir/scripts/restaurants.json
cd $repodir
git add scripts/restaurants.json
if [[ $? -ne 0 ]]; then exit_updater "Cannot add" 1; fi;

git commit -m "Automatic update of restaurant.json: $now"
if [[ $? -ne 0 ]]; then exit_updater "Cannot commit" 1; fi;

git push
if [[ $? -ne 0 ]]; then exit_updater "Cannot push" 1; fi;


exit_updater "Updated restaurants.json" 0
