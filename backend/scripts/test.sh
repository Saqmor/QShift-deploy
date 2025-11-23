#!/usr/bin/env bash

# Runs all tests

pushd "$(dirname "$0")/.."

echo "[test] Running pytest..."
pytest -v --disable-warnings

popd
