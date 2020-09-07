# ORR - One Ring Roller

https://scott.maclure.info/one-ring-roller/

## Requirements

* nodejs
* bower
* gulp

## To run locally

```
npm install
gulp
```

### Run a local webserver

```
./node_modules/http-server/bin/http-server
```

### Debugging with AngularJS

Finding a controller's data:

```
var scope = angular.element(
	document.querySelector('[ng-controller="OrrCtrl"]')
).scope();
```

Now, how about changing it?

```
scope.$apply(function () {
	scope.isEnemy = !scope.isEnemy;
});
```
