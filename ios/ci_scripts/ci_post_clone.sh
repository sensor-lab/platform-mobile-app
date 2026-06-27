#!/bin/sh
set -xe

cd "$CI_PRIMARY_REPOSITORY_PATH"

brew install node

echo "Installing dependencies..."
npm install

echo "Running Expo prebuild..."
CI=1 npx expo prebuild --platform ios

echo "Installing CocoaPods..."
cd ios
pod install --repo-update --clean-install
