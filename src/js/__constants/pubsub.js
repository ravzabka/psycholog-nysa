/**
 * --------------------------------------------------------------------------
 * PubSub - Publish Subscibe (Mediator)
 * --------------------------------------------------------------------------
 */

APP.utilities.pubsub = {
	pubsub: {},
	subscribe: function (pubName, fn) {
		this.pubsub[pubName] = this.pubsub[pubName] || [];
		this.pubsub[pubName].push(fn);
	},
	unsubscribe: function(pubName, fn) {
		if (this.pubsub[pubName]) {
			for (var i = 0; i < this.pubsub[pubName].length; i++) {
				if (this.pubsub[pubName][i] === fn) {
					this.pubsub[pubName].splice(i, 1);
					break;
				}
			};
		}
	},
	publish: function (pubName, data) {
		if (this.pubsub[pubName]) {
			this.pubsub[pubName].forEach(function(fn) {
				fn(data);
			});
		}
	}
};
