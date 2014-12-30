var orrApp = angular.module('orrApp', []);

orrApp.service('diceService', function () {

	/**
	 * Private helper function.
	 */
	function rollDie(dieType) {
		return Math.floor(Math.random() * (dieType)) + 1;
	}

	// Public API
	return {

		rollFeatDice: function (featDice) {
			var d12s = [];
			switch (featDice) {
			case 1:
				d12s.push({ value: rollDie(12) });
				break;
			case 2:
			case 3:
				d12s.push({ value: rollDie(12) });
				d12s.push({ value: rollDie(12) });
				break;
			}
			return d12s;
		},

		rollSuccessDice: function (successDice) {
			var d6s = [];
			for (var i = 0; i < successDice; i++) {
				d6s.push({ value: rollDie(6) });
			}
			return d6s;
		}

	};
});

orrApp.controller('OrrCtrl', function ($scope, diceService) {

	// Define initial data setup.
	$scope.featDice = 1;
	$scope.successDice = 3;
	$scope.isWeary = false;
	$scope.isEnemy = false;
	$scope.result = {};

	// Event handling.
	$scope.doRoll = function () {

		// Roll Feat dice.
		var featDice = parseInt($scope.featDice, 10);
		var d12s = diceService.rollFeatDice(featDice);

		// Roll Success dice.
		var successDice = parseInt($scope.successDice, 10);
		var d6s = diceService.rollSuccessDice(successDice);

		// Calculate final result.

		// Store values into $scope, and update DOM.
		$scope.result = {
			// This tells the UI that the dice have been rolled.
			dateStamp: new Date(),
			d12s: d12s,
			d6s: d6s
		};

	}

});