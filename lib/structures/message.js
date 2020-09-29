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
			 * If this is null and isCommand is true, the command is unknown
			 */
			this.command = null;

			/**
			 * "Exit" status of the command
			 */
			this.status = null;
		}

		/**
		 * Respond to a command message without updating status
		 */
		async respond(...response) {
			if (this.guild && this.guild.available) {
				const me = await this.guild.members.fetch(this.client.user.id);

				if (me.permissionsIn(this.channel).has(Permissions.FLAGS.SEND_MESSAGES)) {
					return this.channel.send(...response);
				}
			}

			const dm = await this.author.createDM();

			if (dm) {
				return dm.send(...response);
			}

			return null;
		}

		/**
		 * Update the command status
		 */
		setStatus(newStatus) {
			// Don't update status if it's already set
			if (this.status !== null) {
				throw new Error('Command status updated multiple times');
			}

			this.status = newStatus;

			/**
			 * Emitted when a message's exit status is set
			 */
			this.client.emit('commandMessageFinsihed', this);
		}

		/*
		 * Shorthands
		 */

		/** Respond and set success status */
		async resolve(...response) {
			if (response.length > 0) {
				this.respond(...response);
			}
			this.setStatus(COMMAND_STATUS.Success);
		}

		/** Respond and set fail status */
		async reject(...response) {
			if (response.length > 0) {
				this.respond(...response);
			}
			this.setStatus(COMMAND_STATUS.Failed);
		}
	}

	return CommandMessage;
});
