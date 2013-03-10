#!/bin/bash
WORKING_DIR=`mktemp -d /tmp/update-website.XXXXXX`
WEBSITE=`pwd`/web
CDIR=`pwd`
REPO="git@github.com:mmarcon/jhere.git"
BRANCH="gh-pages"

if [ $# -ne 1 ]; then
    echo "Please specify a commit message for Git"
    exit 1
fi

cd $WORKING_DIR
git clone -b $BRANCH --single-branch $REPO jhere-website
cd jhere-website

rm -rf * > /dev/null

cp -r $WEBSITE/* .
rm -rf css/.sass-cache > /dev/null
rm -rf css/*.scss > /dev/null

git add . > /dev/null
git status

read -n 1 -p "Proceed (y/n): " PROCEED

if [ "$PROCEED" != "y" ]; then
    echo
    echo "Aborted."
    rm -rf $WORKING_DIR
    exit 0
fi

echo

git commit -m "${1}"
git push

rm -rf $WORKING_DIR

cd $CDIR
