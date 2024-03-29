'use strict';

window.Poll = {};

(function () {
	window.Poll.alertError = function (message) {
		require(['alerts'], function (alerts) {
			alerts.error(message);
		});
	};

	// eslint-disable-next-line
	require('poll/serializer')(window.utils);
	$(window).on('action:topic.loading', function () {
		if (ajaxify.data.posts.length > 0 && ajaxify.data.posts[0].hasOwnProperty('pollId')) {
			getPoll(ajaxify.data.posts[0].pollId);
		}
	});

	$(window).on('action:posts.edited', function (ev, data) {
		if (data.post.hasOwnProperty('pollId')) {
			getPoll(data.post.pollId);
		}
	});

	function getPoll(pollId) {
		pollId = parseInt(pollId, 10);

		if (!isNaN(pollId)) {
			// eslint-disable-next-line no-undef
			Poll.sockets.getPoll({ pollId }, function (err, pollData) {
				if (err) {
					// eslint-disable-next-line no-undef
					return Poll.alertError(err.message);
				}
				// eslint-disable-next-line no-undef
				Poll.view.load(pollData);
			});
		}
	}
}());
