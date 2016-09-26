#!/bin/sh

echo "\nSyncing chrome directory...\n===========================\n"
mkdir -p build/chrome
rsync -a --exclude-from=./exclude-chrome.txt . build/chrome/.

echo "\nZipping chrome extension...\n===========================\n"
mv build/chrome.zip build/chrome-old.zip
zip -r build/chrome.zip build/chrome

echo "\n========\n > Extension located in ./build/chrome.zip\n"
