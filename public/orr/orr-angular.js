var orrApp = angular.module('orrApp', []);

orrApp.service('diceService', function () {
	return {

		rollDie: function (dieType) {
			return Math.floor(Math.random() * (dieType)) + 1;
		}

	};
});

orrApp.controller('OrrCtrl', function ($scope, diceService) {

	// Define initial data setup.
	$scope.isWeary = false;
	$scope.isEnemy = false;
	$scope.result = {};

	// Event handling.
	$scope.doRoll = function () {

		$scope.result = {
			// This tells the UI that the dice have been rolled.
			dateStamp: new Date(),
			d12s: [
				{ value: diceService.rollDie(12) },
				{ value: diceService.rollDie(12) }
			],
			d6s: [
				{ value: diceService.rollDie(6) },
				{ value: diceService.rollDie(6) },
				{ value: diceService.rollDie(6) }
			]
		};

	}

});