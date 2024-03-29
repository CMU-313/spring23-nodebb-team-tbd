'use strict';

(function (Poll) {
	const Creator = {};

	function init() {
		$(window).on('action:composer.enhanced', initComposer);

		$(window).on('action:redactor.load', initRedactor);

		$(window).on('action:composer.loaded', function (ev, data) {
			if ($.Redactor) {
				if (data.composerData.isMain && $.Redactor.opts.plugins.indexOf('poll') === -1) {
					$.Redactor.opts.plugins.push('poll');
				} else if (!data.composerData.isMain && $.Redactor.opts.plugins.indexOf('poll') !== -1) {
					$.Redactor.opts.plugins.splice($.Redactor.opts.plugins.indexOf('poll'), 1);
				}
			}
		});
	}

	function initComposer() {
		require(['composer', 'composer/formatting', 'composer/controls'], function (composer, formatting, controls) {
			if (formatting && controls) {
				formatting.addButtonDispatch('poll', function (textarea) {
					composerBtnHandle(composer, textarea);
				});
			}
		});
	}

	function initRedactor() {
		$.Redactor.prototype.poll = function () {
			return {
				init: function () {
					const self = this;

					// require translator as such because it was undefined without it
					require(['translator'], function (translator) {
						translator.translate('[[poll:creator_title]]', function (translated) {
							const button = self.button.add('poll', translated);
							self.button.setIcon(button, '<i class="fa fa-bar-chart-o"></i>');
							self.button.addCallback(button, self.poll.onClick);
						});
					});
				},
				onClick: function () {
					const self = this;
					const code = this.code.get();
					require(['composer'], function (composer) {
						composerBtnHandle(composer, {
							value: code,
							redactor: function (code) {
								self.code.set(code);
							},
						});
					});
				},
			};
		};
	}

	function composerBtnHandle(composer, textarea) {
		require(['composer/controls', 'alerts'], function (controls, alerts) {
			const post = composer.posts[composer.active];
			if (!post || !post.isMain || (isNaN(parseInt(post.cid, 10)) && isNaN(parseInt(post.pid, 10)))) {
				return alerts.error('[[poll:error.not_main]]');
			}
			if (parseInt(post.cid, 10) === 0) {
				return alerts.error('[[error:category-not-selected]]');
			}

			Poll.sockets.canCreate({ cid: post.cid, pid: post.pid }, function (err, canCreate) {
				if (err) {
					return alerts.error(err.message);
				}
				if (!canCreate) {
					return alerts.error('[[error:no-privileges]]');
				}

				Poll.sockets.getConfig(null, function (err, config) {
					if (err) {
						console.error(err);
					}

					let poll = {};

					// If there's already a poll in the post, serialize it for editing
					if (Poll.serializer.canSerialize(textarea.value)) {
						poll = Poll.serializer.serialize(textarea.value, config);

						if (poll.settings.end === 0) {
							delete poll.settings.end;
						} else {
							poll.settings.end = parseInt(poll.settings.end, 10);
						}
					}

					Creator.show(poll, config, function (data) {
						// Anything invalid will be discarded by the serializer
						let markup = Poll.serializer.deserialize(data, config);

						// Remove any existing poll markup
						textarea.value = Poll.serializer.removeMarkup(textarea.value);

						// Insert the poll markup at the bottom
						if (textarea.value.charAt(textarea.value.length - 1) !== '\n') {
							markup = '\n' + markup;
						}

						if ($.Redactor) {
							textarea.redactor(textarea.value + '<p>' + markup + '</p>');
						} else {
							controls.insertIntoTextarea(textarea, markup);
						}
					});
				});
			});
		});
	}

	Creator.show = function (poll, config, callback) {
		if (poll.hasOwnProperty('info')) {
			return Poll.alertError('Editing not implemented');
		}

		require(['flatpickr', 'flatpickr.i10n', 'bootbox', 'dayjs', 'translator'], function (flatpickr, flatpickrI10N, bootbox, dayjs, Translator) {
			app.parseAndTranslate('poll/creator', { poll, config, isRedactor: !!$.Redactor }, function (html) {
				// Initialise modal
				const modal = bootbox.dialog({
					title: '[[poll:creator_title]]',
					message: html,
					className: 'poll-creator',
					buttons: {
						cancel: {
							label: '[[modules:bootbox.cancel]]',
							className: 'btn-default',
							callback: function () {
								return true;
							},
						},
						save: {
							label: '[[modules:bootbox.confirm]]',
							className: 'btn-primary',
							callback: function (e) {
								clearErrors();
								const form = $(e.currentTarget).parents('.bootbox').find('#pollCreator');
								const obj = serializeObjectFromForm(form);

								// Let's be nice and at least show an error if there are no options
								obj.options.filter(function (obj) {
									return obj.length;
								});

								if (obj.options.length === 0) {
									return error('[[poll:error.no_options]]');
								}

								if (obj.settings.end && !dayjs(new Date(obj.settings.end)).isValid()) {
									return error('[[poll:error.valid_date]]');
								} else if (obj.settings.end) {
									obj.settings.end = dayjs(new Date(obj.settings.end)).valueOf();
								}

								callback(obj);
								return true;
							},
						},
					},
				});

				// Add option adder
				modal
					.find('#pollAddOption')
					.off('click')
					.on('click', function (e) {
						const el = $(e.currentTarget);
						const prevOption = el.prev();

						if (config.limits.maxOptions <= el.prevAll('input').length) {
							clearErrors();
							require(['translator'], function (translator) {
								translator.translate('[[poll:error.max_options]]', function (text) {
									error(text.replace('%d', config.limits.maxOptions));
								});
							});
							return false;
						}

						if (prevOption.val().length !== 0) {
							prevOption.clone().val('').insertBefore(el).focus();
						}
					});

				// Add option remover
				modal
					.find('#pollRemoveOption')
					.off('click')
					.on('click', function (e) {
						const el = $(e.currentTarget);
						const AddOption = el.prev();
						const prevOption = AddOption.prev();

						if (el.prevAll('input').length <= 1) {
							clearErrors();
							require(['translator'], function (translator) {
								translator.translate('[[poll:error.max_options]]', function (text) {
									error(text.replace('%d', 1));
								});
							});
							return false;
						}
						if (prevOption.prevAll('input').length !== 0) {
							prevOption.remove();
						}
					});

				const currentLocale = Translator.getLanguage();
				const flatpickrInstance = flatpickr('.flatpickr', {
					enableTime: true,
					altFormat: 'F j, Y h:i K',
					time_24hr: false,
					wrap: true,
					locale: getFlatpickrLocale(currentLocale, flatpickrI10N.default),
					onOpen: function () {
						modal.removeAttr('tabindex');
					},
					onClose: function () {
						modal.attr('tabindex', -1);
					},
				});

				if (poll.settings && poll.settings.end) {
					flatpickrInstance.setDate(poll.settings.end);
				}
			});
		});
	};

	function error(message) {
		const errorBox = $('#pollErrorBox');

		errorBox.removeClass('hidden');
		errorBox.append(message + '<br>');

		return false;
	}

	function clearErrors() {
		$('#pollErrorBox').addClass('hidden').html('');
	}

	function serializeObjectFromForm(form) {
		const obj = form.serializeObject();
		console.log('Parsed form: ', obj);
		const result = {
			options: obj.options,
			settings: {
				title: obj['settings.title'],
				maxvotes: obj['settings.maxvotes'],
				disallowVoteUpdate: obj['settings.disallowVoteUpdate'] === 'on' ? 'true' : 'false',
				end: obj['settings.end'],
				horizontal: obj.pollInputViewType === 'horizontal',
				color: obj['poll.color'],
			},
		};

		return result;
	}

	function getFlatpickrLocale(nodebbLocale, flatpickrLocales = {}) {
		if (Object.keys(flatpickrLocales).includes(nodebbLocale.toLowerCase())) {
			return flatpickrLocales[nodebbLocale];
		}
		return flatpickrLocales.default;
	}

	Poll.creator = Creator;

	init();
}(window.Poll));
