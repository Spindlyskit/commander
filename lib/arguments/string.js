'use strict';

const ArgumentType = require('../structures/argument');

class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	// A string is always a valid string
	validate() {
		return true;
	}

	// Nothing to do here either
	parse(str) {
		return str;
	}
}

module.exports = StringArgumentType;
