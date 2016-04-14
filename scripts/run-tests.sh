#!/bin/bash
set -ev						
# flaga -e powoduje zakończenie wykonywania skryptu jak tylko któraś instrukcja zwróci niezerowy kod wyjściowy
# flaga -v powoduje wypisywanie lini skryptu przed jej wykonaniem, co pomaga w znajdowaniu miejsca błędu
bundle exec rake:units
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
	bundle exec rake test:integration
fi
