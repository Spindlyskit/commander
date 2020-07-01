'use strict';

const { Client } = require('discord.js');

// We add some additional options to the discord.js client
const defaultOptions = {
	// The global command prefix
	prefix: '-',
	// Whether @ mentioning the bot can be used in place of the prefix
	mentionable: false,
};

/**
 * Discord.js client with added command functionality
 */
class CommanderClient extends Client {
	constructor(options) {
		options = { ...defaultOptions, ...options };
		super(options);

		/**
		 * The global prefix
		 */
		// We build a simple prefix here and add the mention prefix later once we know our id
		this.prefix = new RegExp(`^${options.prefix}(?=\\S)`);

		this.on('ready', () => {
			// Rebuild the prefix to allow mentioning
			if (options.mentionable) {
				this.prefix = new RegExp(`^${options.prefix}(?=\\S)|^<@!?${this.user.id}>\\s*`);
			}
		});

		this.on('message', msg => {
			if (this.shouldIgnoreMessage(msg)) {
				return;
			}

			const matchedPrefix = msg.content.match(this.prefix);

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
		return message.author.bot || message.author.id === this.user.id;
	}


	/**
	 * Parse and run a command from a message
	 */
	_handleCommand(msg, matchedPrefix) {
		/**
		 * Emitted when a message matches the prefix
		 */
		this.emit('messageMatched', msg, matchedPrefix);
	}
}

module.exports = CommanderClient;
