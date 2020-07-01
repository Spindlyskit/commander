'use strict';

const { Client, Collection } = require('discord.js');
const Command = require('./structures/command');

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

		/**
		 * A collection containing all commands known to the client
		 * Use of client.commands.set should be avoided in favor of client.addCommand
		 */
		this.commands = new Collection();

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
	 * Initialize and register a command
	 * The argument must be a constructor for a class which extends command
	 * It must take only the client as an argument
	 */
	addCommand(commandConstructor) {
		if (!(commandConstructor.prototype instanceof Command)) {
			throw new Error('commands must extend Command');
		}

		const command = new commandConstructor(this);

		if (!command.name) {
			throw new Error('commands must have a name');
		}

		this.commands.set(command.name, command);
	}

	/**
	 * Check if a message should be ignored
	 */
	shouldIgnoreMessage(message) {
		return message.author.bot || message.author.id === this.user.id;
	}


	/**
	 * Parse and run a command from a message
	 * Assumes the prefix has already matched
	 */
	_handleCommand(msg, matchedPrefix) {
		// Get the command name from the content
		const content = msg.content.substr(matchedPrefix.length);
		const commandName = content.split(/\s/, 1)[0];
		const command = this.commands.get(commandName);

		if (!command) {
			/**
			 * Emitted when a message matches the prefix but no command is found
			 */
			this.emit('commandInvalid', msg, commandName);
			return;
		}

		if ((msg.guild && !command.allowInGuild) || (!msg.guild && !command.allowInDMs)) {
			/**
			 * Emitted when a command is disallowed in a channel
			 */
			this.emit('commandDisallowed', msg, command);
			return;
		}

		command.run(msg, {});
	}
}

module.exports = CommanderClient;
