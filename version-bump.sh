#!/usr/bin/sh
set -e

BUMP="${1:-patch}"

cd apps/lachesis
npm version "$BUMP" --no-git-tag-version
cd ../..

VERSION=$(node -p "require('./apps/lachesis/package.json').version")
git add apps/lachesis/package.json
git commit -m "v$VERSION"
git tag -a "v$VERSION" -m "v$VERSION"
git push --follow-tags
