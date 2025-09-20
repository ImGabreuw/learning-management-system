#!/bin/bash

docker run --rm -v "$(pwd)":/data -u $(id -u):$(id -g) pandoc/latex --output=README.pdf README.md