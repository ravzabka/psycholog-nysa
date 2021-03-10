/**
 * --------------------------------------------------------------------------
 * SCRIPTS
 * --------------------------------------------------------------------------
 *
 * Here we define config of APP
 */

'use strict';

var APP = {
	utilities: {},
	config: {}
};

/**
 * --------------------------------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------------------------------
 *
 * Load tested earlier, universal modules
 */

//=require __constants/pubsub.js
//=require __constants/breakpoints.js
//=require __constants/device.js

/**
 * --------------------------------------------------------------------------
 * MODULES
 * --------------------------------------------------------------------------
 *
 * Load specific to the project modules
 */

//=require __modules/view.js
//=require __modules/navigation.js
//=require __modules/slick-slider.js

APP.utilities.breakpoints.check();
