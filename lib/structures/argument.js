'use strict';

/**
 * Defines rules for validating and parsing arguments
 */
class ArgumentType {
	constructor(client, name) {
		this.client = client;
		this.name = name;
	}

	/**
	 * Validate a string for parsing
	 */
	validate(arg, str, msg) {
		if (arg.validate) return arg.validate(str, msg);
	}

	/**
	 * Parse a string into the necessary type
	 * Behavior is undefined on an invalid string
	 */
	// eslint-disable-next-line no-unused-vars
	parse(str, msg) {
		throw new Error(`missing parse function for ${this.name}`);
	}
}

module.exports = ArgumentType;
