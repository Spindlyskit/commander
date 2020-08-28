'use strict';

module.exports = {
	version: require('../package.json').version,

	ArgumentString: require('./structures/argstring'),
	ArgumentType: require('./structures/argument'),
	Client: require('./client'),
	Command: require('./structures/command'),
	CommandMessage: require('./structures/message'),

	// Merge utility functions with other library exports
	...require('./util/util'),
	...require('./util/enum'),
};
