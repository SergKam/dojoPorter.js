#!/bin/sh
find ./app/ -name "*.js" -exec node ./dojoPorter.js '{}' \;