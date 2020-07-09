'use strict';

/**
 * Handles incoming messages and parsing them into commands
 */
class Commander {
	constructor(client) {
		this.client = client;

		this.client.on('message', msg => {
			if (this.shouldIgnoreMessage(msg)) {
				return;
			}

			const matchedPrefix = this.client.matchPrefix(msg.content);

			if (!matchedPrefix) {
				return;
			}

			this._handleCommand(msg, matchedPrefix[0]);
		});
	}

	/**
	 * Check if a message should be ignored
	 */
	shouldIgnoreMessage(message) {
		return message.author.bot;
	}


	/**
	 * Parse and run a command from a message
	 * Assumes the prefix has already matched
	 */
	_handleCommand(msg, matchedPrefix) {
		// Get the command name from the content
		const content = msg.content.substr(matchedPrefix.length);
		const commandName = content.split(/\s/, 1)[0];
		const command = this.client.commands.get(commandName) ||
			this.client.commands.find(c => c.aliases.includes(commandName));

		if (!command) {
			/**
			 * Emitted when a message matches the prefix but no command is found
			 */
			this.client.emit('commandInvalid', msg, commandName);
			return;
		}

		if ((msg.guild && !command.allowInGuild) || (!msg.guild && !command.allowInDMs)) {
			/**
			 * Emitted when a command is disallowed in a channel
			 */
			this.client.emit('commandDisallowed', msg, command);
			return;
		}

		command.run(msg, {});
	}
}

module.exports = Commander;
