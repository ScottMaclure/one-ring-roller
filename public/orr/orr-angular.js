var orrApp = angular.module('orrApp', []);

orrApp.service('diceService', function () {
	return {

		rollDie: function (dieType) {
			return Math.floor(Math.random() * (dieType)) + 1;
		},

		rollFeatDice: function (featDice) {
			var d12s = [];
			switch (featDice) {
			case 1:
				d12s.push({ value: this.rollDie(12) });
				break;
			case 2:
			case 3:
				d12s.push({ value: this.rollDie(12) });
				d12s.push({ value: this.rollDie(12) });
				break;
			}
			return d12s;
		}

	};
});

orrApp.controller('OrrCtrl', function ($scope, diceService) {

	// Define initial data setup.
	$scope.featDice = 1;
	$scope.isWeary = false;
	$scope.isEnemy = false;
	$scope.result = {};

	// Event handling.
	$scope.doRoll = function () {

		// Roll Feat dice.
		var featDice = parseInt($scope.featDice, 10);
		var d12s = diceService.rollFeatDice(featDice);

		// Roll Success dice.

		// Calculate final result.

		// Store values into $scope, and update DOM.
		$scope.result = {
			// This tells the UI that the dice have been rolled.
			dateStamp: new Date(),
			d12s: d12s,
			d6s: [
				{ value: diceService.rollDie(6) },
				{ value: diceService.rollDie(6) },
				{ value: diceService.rollDie(6) }
			]
		};

	}

});