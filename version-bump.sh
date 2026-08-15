#!/usr/bin/sh
set -e

BUMP="${1:-patch}"

npm version "$BUMP" --workspace=apps/lachesis --no-git-tag-version
VERSION=$(node -p "require('./apps/lachesis/package.json').version")

git add apps/lachesis/package.json
git add package-lock.json
git commit -m "v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
git push --follow-tags
