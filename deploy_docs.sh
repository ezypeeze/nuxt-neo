#!/usr/bin/env sh

# abort on errors
#set -e

GIT_NAME=$(git config --get user.name)
GIT_EMAIL=$(git config --get user.email)
GIT_REMOTE_URL=$(git config --get remote.origin.url)

# build
cd docs || exit
yarn build
cd - || exit

# navigate into the build output directory
cd docs/content/.vuepress/dist || exit

git init
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

git add -A
git commit -m 'Updated documentation'
git push -f $GIT_REMOTE_URL master:gh-pages

cd -
