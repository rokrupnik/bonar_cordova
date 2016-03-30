# Should be "sourced!"

# This is for me, because I lost a couple of hours on bug, that
# turned to be because of incompatibility of bash and fish

# If user == ozbolt => set environment variables
if [[ $USER == "ozbolt" ]]
then
  export ANDROID_HOME="$HOME/.android-sdk"
  PATH=$PATH:$ANDROID_HOME/tools
  PATH=$PATH:$ANDROID_HOME/platform-tools
  bash
fi
