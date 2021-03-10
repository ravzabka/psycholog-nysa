/**
 * --------------------------------------------------------------------------
 * View
 * --------------------------------------------------------------------------
 */

APP.utilities.view = (function() {

	// --------------------------------------------------------------------------
	// Cache DOM

	var $document = $(document),
		$code = $('#breakpoint');

	// --------------------------------------------------------------------------
	// Bind events

	$document.ready(showLog);
	APP.utilities.pubsub.subscribe('breakpoint', setDeviceInfo);

	// --------------------------------------------------------------------------
	// Functions

	function setDeviceInfo(value) {
		$code.text(value[0]+', min-width: '+ value[1] +'px');
	}

	function showLog() {

		console.log('Show log function');

		if(APP.utilities.device.isPhone()) {
			console.log('You are using a phone');
		} else {
			console.log('You are not using a phone');
		}

		if(APP.utilities.device.isTablet()) {
			console.log('You are using a tablet');
		} else {
			console.log('You are not using a tablet');
		}

	}

})();
