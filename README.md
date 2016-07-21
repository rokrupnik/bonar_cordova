# bonar_cordova
Bonar: port aplikacije na spletni strani http://bonar.si v cross-platform mobilno aplikacijo.

## Development

    git clone https://github.com/rokrupnik/bonar_cordova.git # clones the repo
    cd bonar_cordova
    npm install # installs all packages needed for development
    gulp browser # test the app in the browser
    gulp android # run the app on android device

Za več informacij glej gulpfile.js in package.json.

## Troubleshooting
Poženi `cordova requirements`, da preveriš, kaj potrebuješ za razvoj Cordova aplikacije.

Ob napaki:

    Error: No emulator images (avds) found.
    1. Download desired System Image by running: /bin/android-sdk-linux/tools/android sdk
    2. Create an AVD by running: /bin/android-sdk-linux/tools/android avd
    HINT: For a faster emulator, use an Intel System Image and install the HAXM device driver

sledi navodilom:  
1. namesti ustrezni "System image" z orodjem "Android SDK Manager" -> `android sdk`  
2. Ustvari ustrezen "Android Virtual Device"z orodjem "Android Virtual Device Manager" -> `android avd`

Če ne najde tvojega telefona:  
1. Namesti `adb` -> `sudo apt-get install android-tools-adb`  
2. Omogoči USB debugging na svojem telefonu