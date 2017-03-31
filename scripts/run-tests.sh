#!/bin/bash
set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
	gradle clean test
else
	gradle clean test integrationTest
fi
