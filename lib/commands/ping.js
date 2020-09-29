'use strict';

const { oneLine } = require('common-tags');
const Command = require('../structures/command');

class PingCommand extends Command {
	constructor(client) {
		super(client, 'ping', {
			description: 'Check the bots ping to the discord api',
		});
	}

	async run(msg) {
		const pingMsg = await msg.respond('Pinging...');
		pingMsg.edit(oneLine`Pong! The latency is ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
		API latency is ${msg.client.ws.ping}ms`);
		msg.resolve();
	}
}

module.exports = PingCommand;
