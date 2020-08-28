'use strict';

const { Permissions, Structures } = require('discord.js');
const { COMMAND_STATUS } = require('../util/enum');

module.exports = Structures.extend('Message', Message => {
	class CommandMessage extends Message {
		constructor(client, data, channel) {
			super(client, data, channel);

			/**
			 * Whether the message matches the prefix
			 */
			this.isCommand = false;

			/**
			 * Command that the message runs
			 * If null and isCommand is true, the command is unknown
			 */
			this.command = null;

			/**
			 * "Exit" status of the command
			 */
			this.status = COMMAND_STATUS.NoCommand;
		}

		/**
		 * Respond to a command message without updating status
		 */
		async respond(...args) {
			if (this.guild && this.guild.available) {
				const me = await this.guild.members.fetch(this.client.user.id);

				if (me.permissionsIn(this.channel).has(Permissions.FLAGS.SEND_MESSAGES)) {
					return this.channel.send(...args);
				}
			}

			const dm = await this.author.createDM();

			if (dm) {
				return dm.send(...args);
			}

			return null;
		}
	}

	return CommandMessage;
});
