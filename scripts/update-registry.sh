#!/bin/bash

set -e

curl -s https://www.utcp.io/providers.json | jq  &> docs/data/providers.json
