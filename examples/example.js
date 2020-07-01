/* eslint-disable no-console */
'use strict';

const config = require('./config.json');
const commander = require('..');

const TestCommand = require('./commands/test');

const client = new commander.Client({ mentionable: true });

client.on('messageMatched', (msg, prefix) => {
	console.log(`Message "${msg.content}" (${msg.id}) matched with prefix "${prefix}"`);
});

client.addCommand(TestCommand);

client.login(config.token);
