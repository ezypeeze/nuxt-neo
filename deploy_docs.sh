#!/usr/bin/env sh

# abort on errors
set -e

GIT_NAME=$(git config --get user.name)
GIT_EMAIL=$(git config --get user.email)
GIT_SSH_COMMAND=$(git config --get core.sshCommand)

# build
yarn docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

git config core.sshCommand "$GIT_SSH_COMMAND"

git add -A
git commit -m 'Updated documentation'
git push -f git@github.com:ezypeeze/nuxt-neo.git master:gh-pages

cd -
