# cordovaUpdater
A script to make sure your cordova app is running the latest version.

Build your cordova app then upload it to s3 using the grunt script provided. 

You index.html file should have a window.version = 1.0.x; variable and must load the bootloader.js file. I use a package.json file to compare the versions. If the version is the same in both files it will not update.

Know issues
===========
- If you update the app store versions, say to 1.0.1 then you should release a 1.0.2 via this script because it does not yet clear the localstorage from the update script when a new "hard" version gets released, thus redirecting you to a 404. Perhaps when this happens I could make it clear localstorage or smth like that. 


Use at your own risk!

E
