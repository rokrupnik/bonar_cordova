# bonar_cordova
Bonar: port aplikacije na spletni strani http://bonar.si v cross-platform mobilno aplikacijo.

## Development
Poženi `cordova requirements`, da preveriš, kaj potrebuješ za razvoj Cordova aplikacije.

### Emulate app
Poženi `cordova emulate android`

Ob napaki:
```
Error: No emulator images (avds) found.
1. Download desired System Image by running: /bin/android-sdk-linux/tools/android sdk
2. Create an AVD by running: /bin/android-sdk-linux/tools/android avd
HINT: For a faster emulator, use an Intel System Image and install the HAXM device driver
```
sledi navodilom :)
1. namesti ustrezni "System image" z orodjem "Android SDK Manager" -> `android sdk`
2. Ustvari ustrezen "Android Virtual Device"z orodjem "Android Virtual Device Manager" -> `android avd`