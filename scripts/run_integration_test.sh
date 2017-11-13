#!/bin/bash
set -e


ret=($(node ./scripts/stf_connect.js $DEVICE_SERIAL))
connectUrl=${ret[0]}

if [ "$DEVICE_SERIAL" == "" ]; then
  DEVICE_SERIAL=${ret[1]}
fi

echo $connectUrl
echo $DEVICE_SERIAL

if [ "$connectUrl" == "" ]; then
  echo "Cannot connect to device"
  exit
else
  adb connect $connectUrl
fi

function disconnetDevice {
  if [ "$DEVICE_SERIAL" != "" ]; then
    echo "Releasing device"
    node ./scripts/stf_disconnect.js $DEVICE_SERIAL
  fi
}

# Always disconnect devic before exit
trap disconnetDevice EXIT


# Run tests, replace this with actual test invoker
# Run appium server
## (./node_modules/.bin/appium &)
sleep 15
## export UDID=$connectUrl
## npm run android-complex


disconnetDevice
