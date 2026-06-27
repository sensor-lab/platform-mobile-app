#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Running Expo prebuild..."
npx expo prebuild --platform ios --non-interactive

echo "Installing CocoaPods..."
cd ios
pod install
