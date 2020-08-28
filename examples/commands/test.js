/* eslint-disable no-console */
'use strict';

const { Command } = require('../..');

/**
 * Basic command that just echos a test message
 */
class TestCommand extends Command {
	constructor(client) {
		super(client, 'test', {
			aliases: ['t'],
			description: 'Echo a test message',
		});
	}

	run(msg) {
		msg.respond(`Hello, ${msg.author}`);
	}
}

module.exports = TestCommand;
