'use strict';

module.exports = {
	version: require('../package.json').version,

	ArgumentType: require('./structures/argument'),
	Client: require('./client'),
	Command: require('./structures/command'),

	// Merge utility functions with other library exports
	...require('./util/util'),
};
