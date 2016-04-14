#!/bin/bash

# if not sourcing...
if [[ $0 != "bash" ]]; then  cd "$(dirname "$0")/.."; fi
  

# This is for me, because I lost a couple of hours on bug, that
# turned to be because of incompatibility of bash and fish
# If user == ozbolt => set environment variables

if [[ $USER == "ozbolt" && $ANDROID_HOME == "" ]]
then
  if [[ $0 != "bash" ]]
  then
    echo "Source this file first!"
    exit 1
  fi
  
  export ANDROID_HOME="$HOME/.android-sdk"
  export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
  echo "PATH and ANDROID_HOME exported."
fi  

# Check if plugins (couldalso check for platforms) folder exists
# if not, install plugins and add platforms
if ! [[ -d plugins || $0 == "bash" ]]
then
  echo "Installing plugins and platforms..."
  cordova plugin add cordova-plugin-splashscreen
  cordova platform add browser
  cordova platform add android
fi

