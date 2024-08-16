#!/usr/bin/env bash

set -exo pipefail

corepack use pnpm@latest

# Upgrade all prod dependencies
pnpm upgrade -rL
pnpm dedupe

git add '**/package.json' package.json pnpm-lock.yaml
git commit -m "chore: Upgrade dependencies"
