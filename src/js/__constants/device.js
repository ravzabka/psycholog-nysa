/**
 * --------------------------------------------------------------------------
 * Device
 * --------------------------------------------------------------------------
 */

APP.utilities.device = (function() {
	
	function isPhone() {
		if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}

	function isTablet() {
		if (/iPad/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}

	return {
		isPhone: isPhone,
		isTablet: isTablet
	}

}());
