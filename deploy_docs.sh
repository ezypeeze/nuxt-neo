#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git config user.name "Pedro Pereira"
git config user.email "pedromdspereira.93@gmail.com"

git add -A
git commit -m 'Updated documentation'
git push -f git@github.com:ezypeeze/nuxt-neo.git master:gh-pages

cd -
