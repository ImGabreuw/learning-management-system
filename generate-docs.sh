#!/bin/bash

# Clean up any existing HTML file
rm -f README.html

# Convert Markdown to HTML using Pandoc
docker run --rm -v "$(pwd)":/data -u $(id -u):$(id -g) pandoc/core README.md -o README.html

# Convert HTML to PDF using WeasyPrint
docker run --rm -v "$(pwd)":/data -w /data -u $(id -u):$(id -g) minidocks/weasyprint weasyprint README.html README.pdf

# Clean up HTML file
rm -f README.html