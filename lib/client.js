'use strict';

const path = require('path');
const { Client, Collection } = require('discord.js');
const ArgumentType = require('./structures/argument');
const Command = require('./structures/command');
const Commander = require('./structures/commander');
const { requireDirectory } = require('./util/util');

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
		this._prefix = new RegExp(`^${options.prefix}(?=\\S)`);

		/**
		 * A collection containing all argument types known to the client
		 * Use of client.argumentTypes.set should be avoided in favor of client.addArgumentType
		 */
		this.argumentTypes = new Collection();

		/**
		 * A collection containing all commands known to the client
		 * Use of client.commands.set should be avoided in favor of client.addCommand
		 */
		this.commands = new Collection();

		/**
		 * Parses and runs commands
		 * Adds a 'message' listener to the client
		 */
		this.commander = new Commander(this);

		this.on('ready', () => {
			// Rebuild the prefix to allow mentioning
			if (options.mentionable) {
				this._prefix = new RegExp(`^${options.prefix}(?=\\S)|^<@!?${this.user.id}>\\s*`);
			}
		});
	}

	/**
	 * Initialize and register an argument type
	 */
	addArgumentType(argumentConstructor) {
		if (!(argumentConstructor.prototype instanceof ArgumentType)) {
			throw new Error('argument types must extend ArgumentType');
		}

		const argumentType = new argumentConstructor(this);

		if (!argumentType.name) {
			throw new Error('argument types must have a name');
		}

		this.argumentTypes.set(argumentType.name, argumentType);

		this.emit('commanderDebug', `argument type "${argumentType.name}" registered`);
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

		this.emit('commanderDebug', `command "${command.name}" registered`);
	}

	/**
	 * Register the default argument types and commands
	 */
	registerDefaults(registerCommands = true) {
		if (registerCommands) {
			requireDirectory(path.join(__dirname, './commands'), c => this.addCommand(c));
		}
	}

	/**
	 * Match a string against the command prefix
	 */
	matchPrefix(str) {
		return str.match(this._prefix);
	}
}

module.exports = CommanderClient;
