// ORR JS
(function ($, undefined) {

	/**
	 * Basic die rolling function.
	 */
	function rollDie(dieType) {
		return Math.floor(Math.random() * (dieType)) + 1;
	}

	/**
	 * Text based success type based on number of d6's rolled.
	 */
	function getSuccessTypeText(sixCount, automaticSuccess) {
		var result = automaticSuccess ? 'automatic' : '';
		if (sixCount === 0) {
			return result + ' narrow';
		}
		if (sixCount === 1) {
			return result + ' great';
		}
		return result + ' extraordinary';
	}

	/**
	 * Helper function.
	 */
	function getDisplayDate() {

		var d = new Date();

		return d.getHours() + ':' +
		d.getMinutes() + ':' +
		d.getSeconds();

	}

	/**
	 * Helper function.
	 */
	function updateFeatDie(featDieElem, result, dieEnabled) {
		if (dieEnabled === void 0) {
			dieEnabled = true;
		}
		var deCss = !dieEnabled ? ' disabledDie' : '';
		$(featDieElem).removeClass().addClass('d12 dice dice-d12-' + result + deCss);
	}

	/**
	 * Roll a d6, update DOM, return totals and flags.
	 */
	function rollD6(elem, isWeary) {

		var data = {
			result: rollDie(6),
			sixCount: 0,
			rollTotal: 0
		};

		if (data.result === 6) {
			data.sixCount = 1;
		}

		$(elem).removeClass().addClass('d6 dice dice-d6-' + data.result);

		if (!isWeary || data.result > 3) {
			data.rollTotal = data.result;
		}

		return data;
	}

	function checkUseResult2(keepHighest, isEnemy, result1, result2) {

		// Set the "fail" rune to 0, for this test.
		// Leave the "success" rune's value alone.
		if (isEnemy) {
			// Gandalf rune
			result1 = result1 === 12 ? 0 : result1;
			result2 = result2 === 12 ? 0 : result2;
			// Eye rune

		} else {
			// Eye rune
			result1 = result1 === 11 ? 0 : result1;
			result2 = result2 === 11 ? 0 : result2;
		}

		if (keepHighest) {
			return result2 > result1;
		}

		// Keep lowest.
		return result2 < result1;

	}

	function getFeatResultData(featResult, isEnemy) {

		var data = {
			rollTotal: 0,
			automaticSuccess: false
		};

		if (featResult <= 10) {

			data.rollTotal = featResult;

		} else if (featResult === 11 && isEnemy) {
			// Eye rune
			data.rollTotal = 10;
			data.automaticSuccess = true;
		} else if (featResult === 12 && isEnemy) {
			// Gandalf rune
			data.rollTotal = 0;

		} else if (featResult === 11 && !isEnemy) {
			// Eye rune
			data.rollTotal = 0;
		} else if (featResult === 12 && !isEnemy) {
			// Gandalf rune
			data.automaticSuccess = true;
			data.rollTotal = 10;
		}

		return data;

	}

	// Cache semantic elements.
	var $noRoll = $('#noRoll');
	var $d6es = $('.d6');
	var $d12es = $('.d12');
	var $resultText = $('#resultText');
	var $rollTotal = $('#rollTotal');
	var $successType = $('.successType');
	var $successResult = $('.successResult');
	var $rollCount = $('#rollCount');

	var rollCount = 0;

	// Bind to form submit event, override with dice rolling.
	$('form').on('submit', function (event) {

		rollCount += 1;

		// Stop form submission.
		event.preventDefault();

		// Reset hidden values.
		$d6es.addClass('hide');
		$d12es.addClass('hide');

		var $form = $(this);
		var userData = $form.serializeObject();
		console.debug('userData:', userData);

		// String to Number.
		var successDice = parseInt(userData.successDice, 10);
		var featDice = parseInt(userData.featDice, 10);
		var isWeary = userData.isWeary === '1';
		var isEnemy = userData.isEnemy === '1';

		// Track dice total.
		var rollTotal = 0;
		var sixCount = 0;
		var automaticSuccess = false;

		// User wants to roll some success dice.
		if (successDice) {
			for (var i = 0; i < successDice; i++) {
				var data = rollD6($d6es[i], isWeary);
				sixCount += data.sixCount;
				rollTotal += data.rollTotal;
			}
		}

		// Resolve feat dice.
		if (featDice) {

			var useResult2 = false;

			if (featDice > 0) {
				var featResult1 = rollDie(12);
				updateFeatDie($d12es[0], featResult1);
			}

			// Roll 2, keep highest.
			if (featDice === 2) {
				var keepHighest = true;
				var featResult2 = rollDie(12);
				useResult2 = checkUseResult2(keepHighest, isEnemy, featResult1, featResult2);
				updateFeatDie($d12es[1], featResult2, useResult2);
			}

			// Roll 2, keep lowest.
			if (featDice === 3) {
				var keepHighest = false;
				var featResult2 = rollDie(12);
				useResult2 = checkUseResult2(keepHighest, isEnemy, featResult1, featResult2);
				updateFeatDie($d12es[1], featResult2, useResult2);
			}

			// Disable featDie1
			if (useResult2) {
				updateFeatDie($d12es[0], featResult1, false);
			}

			// Handle the runes to update the total result
			var data = !useResult2 ? getFeatResultData(featResult1, isEnemy) : getFeatResultData(featResult2, isEnemy)
			rollTotal += data.rollTotal;
			automaticSuccess = data.automaticSuccess;

		}

		// Update and display totals
		$noRoll.addClass('hide');
		$rollCount.text(getDisplayDate());
		$successType.text(getSuccessTypeText(sixCount, automaticSuccess));
		$rollTotal.text(rollTotal);
		// Only matters for first foll.
		$resultText.removeClass('hide');

	});

}(jQuery));