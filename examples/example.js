/* eslint-disable no-console */
'use strict';

const path = require('path');
const commander = require('..');
const { requireDirectory } = commander;
const config = require('./config.json');

const client = new commander.Client({ mentionable: true });

client.on('commanderDebug', s => console.log('Debug:', s));

// In a real bot, this feature would be incredibly annoying but it's a useful test here
client.on('commandInvalid', (msg, cmd) => {
	console.log(`invalid command "${cmd}" in message "${msg.content}" (${msg.id})`);
	msg.respond('Failed to find a command with that name');
});

client.on('commandDisallowed', (msg, cmd) => {
	console.log(`disallowed command "${cmd.name}" in channel "${msg.channel.id}"`);
	msg.respond(`You cannot run that here`);
});

client.registerDefaults();
requireDirectory(path.join(__dirname, './commands'), c => client.addCommand(c));

client.login(config.token);
