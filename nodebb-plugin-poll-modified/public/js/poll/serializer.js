'use strict';

module.exports = function (utils) {
	const Serializer = {};

	const pollRegex =
		/(?:(?:\[poll(?<settings>.*?)\])(?:\\n|\n|<br \/>)(?<content>(?:-.+?(?:\\n|\n|<br \/>))+)(?:\[\/poll\]))/g;
	const settingsRegex =
		/(?<key>.+?)=(?:"|&quot;|&#92;)(?<value>.+?)(?:"|&quot;|&#92;)/g;
	const settingsValidators = {
		title: {
			test: function (value) {
				return value.length > 0;
			},
			parse: function (value) {
				return utils.stripHTMLTags(value).trim();
			},
		},
		maxvotes: {
			test: function (value) {
				return !isNaN(value);
			},
			parse: function (value) {
				return parseInt(value, 10);
			},
		},
		disallowVoteUpdate: {
			test: function (value) {
				return /true|false/.test(value);
			},
			parse: function (value) {
				return value === 'true' || value === true;
			},
		},
		end: {
			test: function (value) {
				return !isNaN(value) && parseInt(value, 10) > Date.now();
			},
			parse: function (value) {
				return parseInt(value, 10);
			},
		},
		horizontal: {
			test: function (value) {
				return /true|false/.test(value);
			},
			parse: function (value) {
				return value === 'true' || value === true;
			},
		},
		color: {
			test: function (value) {
				return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
			},
			parse: function (value) {
				return value;
			},
		},
	};

	Serializer.canSerialize = function (post) {
		pollRegex.lastIndex = 0;
		return pollRegex.test(post);
	};

	Serializer.removeMarkup = function (content, replace) {
		return content.replace(pollRegex, replace || '');
	};

	Serializer.hasMarkup = function (content) {
		pollRegex.lastIndex = 0;
		const has = pollRegex.test(content);
		return has;
	};

	Serializer.serialize = function (post, config) {
		pollRegex.lastIndex = 0;
		const match = pollRegex.exec(post);

		if (match === null) {
			return null;
		}

		return {
			options: serializeOptions(match.groups.content, config),
			settings: serializeSettings(match.groups.settings, config),
		};
	};

	Serializer.deserialize = function (poll, config) {
		const options = deserializeOptions(poll.options, config);
		const settings = deserializeSettings(poll.settings, config);

		return '[poll' + settings + ']\n' + options + '\n[/poll]';
	};

	function serializeOptions(raw, config) {
		// Depending on composer, the line breaks can either be \n or <br /> so handle both
		let pollOptions = [];
		const rawOptions = raw.split(/(?:\\n|\n|<br \/>)/);
		rawOptions.map(raw => utils.stripHTMLTags(raw));
		const maxOptions = parseInt(config.limits.maxOptions, 10);

		rawOptions.forEach(function (option) {
			if (option.length) {
				option = option.split('-').slice(1).join('-').trim();

				if (option.length) {
					pollOptions.push(option);
				}
			}
		});

		if (pollOptions.length > maxOptions) {
			pollOptions = pollOptions.slice(0, maxOptions - 1);
		}

		return pollOptions;
	}

	function deserializeOptions(options, config) {
		const maxOptions = config.limits.maxOptions;

		options = options
			.map(function (option) {
				return utils.stripHTMLTags(option).trim();
			})
			.filter(function (option) {
				return option.length;
			});

		if (options.length > maxOptions) {
			options = options.slice(0, maxOptions - 1);
		}

		return options.length ? '- ' + options.join('\n- ') : '';
	}

	function serializeSettings(raw, config) {
		const settings = {};

		Object.keys(config.defaults).forEach(function (key) {
			settings[key] = config.defaults[key];
		});

		const stripped = utils.stripHTMLTags(raw).replace(/\\/g, '&#92;');
		let match = settingsRegex.exec(stripped);
		while (match !== null) {
			const key = match.groups.key.trim();
			const value = match.groups.value.trim();

			if (
				key.length &&
				value.length &&
				settingsValidators.hasOwnProperty(key)
			) {
				if (settingsValidators[key].test(value)) {
					settings[key] = settingsValidators[key].parse(value);
				}
			}
			match = settingsRegex.exec(stripped);
		}
		return settings;
	}

	function deserializeSettings(settings, config) {
		let deserialized = '';

		for (const k in settings) {
			if (settings.hasOwnProperty(k) && config.defaults.hasOwnProperty(k)) {
				const key = utils.stripHTMLTags(k).trim();
				const value = utils.stripHTMLTags(settings[k]).trim();
				if (
					key.length &&
					value.length &&
					settingsValidators.hasOwnProperty(key)
				) {
					if (settingsValidators[key].test(value)) {
						deserialized += ' ' + key + '="' + value + '"';
					}
				}
			}
		}
		return deserialized;
	}

	if (typeof window !== 'undefined') {
		window.Poll.serializer = Serializer;
	}
	return Serializer;
};
