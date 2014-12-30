var orrApp = angular.module('orrApp', []);

orrApp.service('diceService', function () {

	// Private helper function.

	function rollDie(dieType) {
		return Math.floor(Math.random() * (dieType)) + 1;
	}

	function isAutomaticSuccess(dieValue, isEnemy) {
		return isEnemy ? dieValue === 11 : dieValue === 12;
	}

	/**
	 * Set "bad" rune value to 0.
	 */
	function getFeatDieValue(featDieValue, isEnemy) {
		// Set "bad" rune value to 0.
		featDieValue = isEnemy && featDieValue === 12 ? 0 : featDieValue;
		featDieValue = !isEnemy && featDieValue === 11 ? 0 : featDieValue;
		return featDieValue;
	}

	/**
	 * Given 2 feat dice, determine the final value.
	 * Assumes getFeatDieValue has been used to update rune values.
	 */
	function getFeatDiceValue(featDieValue1, featDieValue2, featDice) {

		var highestResult = featDieValue1 > featDieValue2 ? featDieValue1 : featDieValue2;
		var lowestResult = featDieValue1 < featDieValue2 ? featDieValue1 : featDieValue2;

		var takeHighest = featDice === 2;

		return takeHighest ? highestResult : lowestResult;
	}

	// Public API
	return {

		successTypes: {
			normal: 'normal',
			great: 'great',
			extraordinary: 'extraordinary'
		},

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
		},

		getFeatResultData: function (d12s, featDice, isEnemy) {

			var data = {
				automaticSuccess: false,
				value: 0
			};

			if (featDice === 0) {
				return data;
			}

			// TODO Use reduce from lodash?
			if (featDice === 1) {

				data.value = getFeatDieValue(d12s[0].value, isEnemy);

			} else {

				// Will set the "bad" rune's value to 0.
				var featDieValue1 = getFeatDieValue(d12s[0].value, isEnemy);
				var featDieValue2 = getFeatDieValue(d12s[1].value, isEnemy);

				data.value = getFeatDiceValue(featDieValue1, featDieValue2, featDice);

			}

			data.automaticSuccess = isAutomaticSuccess(data.value, isEnemy);

			// Set "good" rune value to 10, after we've calculated automatic success.
			data.value = data.value > 10 ? 10 : data.value;

			return data;
		},

		getSuccessResultData: function (d6s, isWeary) {

			var data = {
				value: 0,
				type: this.successTypes.normal
			}

			var successCount = 0;

			for (var i = 0; i < d6s.length; i++) {

				var dieValue = d6s[i].value;

				if (!isWeary || dieValue > 3) {
					data.value += dieValue;
				}

				if (6 === dieValue) {
					successCount += 1;
				}

			}

			if (successCount === 1) {
				data.type = this.successTypes.great;
			} else if (successCount > 1) {
				data.type = this.successTypes.extraordinary;
			}

			return data;
		}

	};

});

orrApp.controller('OrrCtrl', function ($scope, diceService) {

	// Define initial data setup.
	$scope.featDice = 1;
	$scope.successDice = 3;
	$scope.isWeary = false;
	$scope.isEnemy = false;
	// Store all results, not just the current one.
	$scope.results = [];

	// Event handling.
	$scope.doRoll = function () {

		// Roll Feat dice.
		var featDice = parseInt($scope.featDice, 10);
		var d12s = diceService.rollFeatDice(featDice);

		// Roll Success dice.
		var successDice = parseInt($scope.successDice, 10);
		var d6s = diceService.rollSuccessDice(successDice);

		// Calculate final result.
		var featData = diceService.getFeatResultData(d12s, featDice, $scope.isEnemy);
		var successData = diceService.getSuccessResultData(d6s, $scope.isWeary);

		// Add a result to the front of the array, for rendering convenience.
		$scope.results.unshift({
			// This tells the UI that the dice have been rolled.
			dateStamp: new Date(),
			d12s: d12s,
			d6s: d6s,
			automaticSuccess: featData.automaticSuccess,
			type: successData.type,
			value: featData.value + successData.value
		});

	}

});