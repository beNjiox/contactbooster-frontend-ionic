## Contactbooster frontend using ionic

### Stack:

* [ionic framework](http://ionicframework.com/)
* [AngularJS](angularjs.org)
* [Restangular](https://github.com/mgonto/restangular)
* The API used is the contactbooster/ror one.

### Quick getting started

```
$> git clone http://github.com/beNjiox/contactbooster-backend-ionic
$> cd contactbooster-backend-ionic && cd www && bower update && npm install
```

### Dev mode

just use run ``` gulp ``` in the root directory, it will watch for coffees and scss updates.

### Run in browser

In order to run the app in a browser, simply run ``` python -m SimpleHTTPServer ``` in the ``` www ``` directory

### Run in emulator and/or device

You need to setup plugins and platforms (iOS tested only, but should work the same way on Android)

```
$> cordova platform add ios
$> cordova plugin add org.apache.cordova.device
$> cordova plugin add com.ionic.keyboard
$> cordova plugin add org.apache.cordova.console
$> cordova build ios
$> cordova emulate ios
```

### What is contactbooster?

Contactbooster is a little web app to manage contact lists.
My goal was to release the app using different testing,frontend and backend framework/librairies.

**Clients available**:
* ionic/AngularJS
* [BackboneJS](https://github.com/beNjiox/contactbooster-frontend-backboneJS)
* Ember incoming

**Backend available**: RoR (Laravel4, SailsJS incoming)