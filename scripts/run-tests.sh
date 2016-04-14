#!/bin/bash
set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "true" ]; then
	gradle clean integrationTest
fi

if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
	gradle clean test
fi
