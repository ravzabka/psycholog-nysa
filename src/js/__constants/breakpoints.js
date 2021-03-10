/**
 * --------------------------------------------------------------------------
 * Breakpoints
 * --------------------------------------------------------------------------
 */

APP.utilities.breakpoints = (function() {

	// --------------------------------------------------------------------------
	// Get HTML body::before pseudoelement content.
	// It should be include-media variable, eg. '(sm: 576px, md: 768px, lg: 992px, xl: 1200px)'

	var data = window.getComputedStyle(document.body, '::before').getPropertyValue('content').replace(/[\"\'\s]/g, '');

	// Cut the (brackets)
	data = data.slice(1, -1);

	// Split data by comma
	var dataArr = data.split(',');
	dataArr.unshift('zero:0px');

	// --------------------------------------------------------------------------

	function checkBreakpoint() {

		dataArr.forEach(function(val, i) {

			var breakpoint = val.split(':');
			var breakpointName = breakpoint[0];
			var currValue = breakpoint[1].slice(0, -2);

			if (i !== dataArr.length - 1) { var nextValue = dataArr[i+1].split(':')[1].slice(0, -2) - 1; }

			if (i === 0) { var query = window.matchMedia('screen and (max-width: '+ nextValue +'px)'); }
			else if (i === dataArr.length - 1) { var query = window.matchMedia('screen and (min-width: '+ currValue +'px)'); }
			else { var query = window.matchMedia('screen and (min-width: '+ currValue +'px) and (max-width: '+ nextValue +'px)'); }

			query.addListener(change);
			function change() { query.matches ? APP.utilities.pubsub.publish('breakpoint', [breakpointName, currValue]) : null; }
			change();

		});
	}

	// --------------------------------------------------------------------------
	// Return

	return {
		check: checkBreakpoint
	}

})();
