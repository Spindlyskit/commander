'use strict';

module.exports = {
	version: require('../package.json').version,

	Client: require('./client'),
	Command: require('./structures/command'),
};
