'use strict';

class Command {
	constructor(client, name, options) {
		this.client = client;
		this.name = name;

		// Alternative names for this command
		this.aliases = options.aliases || [];
		// Text displayed in help command
		this.description = options.description || name;
		this.shortDesc = options.shortDesc || this.description;
		// Where the command can be used
		this.allowInGuild = options.allowInGuild !== false;
		this.allowInDMs = options.allowInDMs !== false;
	}

	/**
	 * Run the command assuming arguments have already been parsed
	 */
	// eslint-disable-next-line no-unused-vars
	run(msg, args) {
		throw new Error(`Command "${this.name}" missing run function`);
	}
}

module.exports = Command;
