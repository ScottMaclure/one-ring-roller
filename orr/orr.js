// ORR JS
(function ($, undefined) {

	// Bind to form submit event, override with dice rolling.
	$('form').on('submit', function (event) {

		// Stop form submission.
		event.preventDefault();

		var $form = $(this);

		var userData = $form.serializeObject();

		console.debug('userData:', userData);

	});

}(jQuery));