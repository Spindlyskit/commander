'use strict';

/**
 * Represents the string of arguments (after the command name in a message)
 */
class ArgumentString {
	constructor(source, commandArgs) {
		/**
		 * The argument specifier we are parsing for
		 *	{
		 *		type: 'string',
		 *		label: 'name_in_code',
		 *		name: 'Display name', // Optional: Fallback to label
		 *		default: 'Default value', // Optional
		 *		validate: () => true, // Optional
		 *	}
		 */
		this.commandArgs = commandArgs;

		/**
		 * The parsed arguments
		 * In the form { label: parsed value }
		 */
		this.data = null;

		// Parse the raw args
		const parseRe = /\s*(?:(["'])([^]*?)\1|(\S+))\s*/g;
		let remainingArgs = this.commandArgs.length;
		let match;
		this.args = [];

		while (--remainingArgs && (match = parseRe.exec(source))) {
			this.args.push(match[2] || match[3]);
		}

		if (match && parseRe.lastIndex < source.length) {
			// Remove surrounding quotes and push
			this.args.push(source.substr(parseRe.lastIndex).replace(/^(["'])([^]*)\1$/, ''));
		}
	}

	/**
	 * Parse arguments with their types
	 */
	parse() {
		this.data = {};

		// TODO: Actually parse them
		this.commandArgs.forEach((e, i) => {
			this.data[e] = this.args[i];
		});
	}
}

module.exports = ArgumentString;
