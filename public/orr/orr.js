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
				var $d6 = $($d6es[i]);
				var result = rollDie(6);
				if (result === 6) {
					sixCount += 1;
				}
				$d6.removeClass().addClass('d6 dice dice-d6-' + result);
				if (!isWeary || result > 3) {
					rollTotal += result;
				}
			}
		}

		// Resolve feat dice.
		if (featDice) {
			if (featDice === 1) {
				var $die = $($d12es[0]);
				var result = rollDie(12);
				$die.removeClass().addClass('d12 dice dice-d12-' + result);
				if (result <= 10) {
					rollTotal += result;
				} else if (result === 11 && isEnemy) {
					// Eye rune
					automaticSuccess = true;
				} else if (result === 12 && !isEnemy) {
					// Gandalf rune
					automaticSuccess = true;
				}
			}
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