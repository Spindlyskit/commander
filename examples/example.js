/* eslint-disable no-console */
'use strict';

const config = require('./config.json');
const commander = require('..');

const TestCommand = require('./commands/test');

const client = new commander.Client({ mentionable: true });

// In a real bot, this feature would be incredibly annoying but it's a useful test here
client.on('commandInvalid', (msg, cmd) => {
	console.log(`invalid command "${cmd}" in message "${msg.content}" (${msg.id})`);
	msg.channel.send('Failed to find a command with that name');
});

client.on('commandDisallowed', (msg, cmd) => {
	console.log(`disallowed command "${cmd.name}" in channel "${msg.channel.id}"`);
	msg.channel.send(`You cannot run that here`);
});

client.addCommand(TestCommand);

client.login(config.token);
